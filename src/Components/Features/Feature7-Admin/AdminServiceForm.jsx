import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiArrowRight, FiImage, FiInfo, FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';
import AdminPageHeader from './AdminPageHeader';
import CategoryDialog from './CategoryDialog';
import { inputClass, panelClass, primaryButtonClass, secondaryButtonClass } from './adminStyles';
import { Alert, ErrorState, PageLoader, Spinner } from '../../Common/Feedback';
import ConfirmDialog from '../../Common/ConfirmDialog';
import ToggleSwitch from '../../Common/ToggleSwitch';
import { useAsync } from '../../../hooks/useAsync';
import { admin } from '../../../services/api-client';
import { CLINIC, UPLOAD_LIMITS } from '../../../config/clinic';

const { image: IMAGE_RULES } = UPLOAD_LIMITS;
const MAX_PRICE = 999999.99;

// نفس قواعد StoreServiceRequest / UpdateServiceRequest في الباك إند
const schema = yup.object({
  name: yup.string().trim().required('اسم الخدمة مطلوب').max(255, 'اسم الخدمة يجب ألا يتجاوز 255 حرفاً'),
  categoryId: yup.string().required('اختر تصنيف الخدمة'),
  price: yup
    .number()
    .transform((value, original) => (original === '' || original === null ? undefined : value))
    .typeError('السعر يجب أن يكون رقماً')
    .required('السعر الإرشادي مطلوب')
    .min(0, 'السعر لا يمكن أن يكون سالباً')
    .max(MAX_PRICE, `السعر يجب ألا يتجاوز ${MAX_PRICE.toLocaleString('en-US')}`)
    .test('decimals', 'السعر يقبل رقمين عشريين كحد أقصى', (value) => value === undefined || /^\d+(\.\d{1,2})?$/.test(String(value))),
  description: yup.string().trim(),
  isActive: yup.boolean(),
});

const SERVER_FIELDS = { name: 'name', category_id: 'categoryId', price: 'price', description: 'description', is_active: 'isActive' };

const validateImage = (file) => {
  if (!IMAGE_RULES.types.includes(file.type)) return `صيغة الصورة غير مدعومة، الصيغ المسموحة: ${IMAGE_RULES.typesLabel}.`;
  if (file.size > IMAGE_RULES.maxBytes) return `حجم الصورة أكبر من ${IMAGE_RULES.maxLabel}.`;
  return '';
};

const Field = ({ id, label, hint, error, children, required }) => (
  <div className="flex flex-col gap-[6px]">
    <label htmlFor={id} className="text-[14px] font-[600] text-[#2B2527]">
      {label}
      {required && <span className="text-[#E53E3E]"> *</span>}
    </label>
    {children}
    {error ? (
      <span role="alert" className="text-[12.5px] text-[#E53E3E]">
        {error}
      </span>
    ) : (
      hint && <span className="text-[12.5px] text-[#8A7F80]">{hint}</span>
    )}
  </div>
);

/**
 * إضافة خدمة أو تعديلها (US-007).
 * عند الإنشاء تُرسل الصورة مع البيانات في طلب واحد، وعند التعديل للصورة أزرار مستقلة
 * تُحفظ فوراً، لأن الباك إند يستقبل الصورة على مسار منفصل.
 */
const AdminServiceForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formError, setFormError] = useState('');
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // الصورة: عند الإنشاء ملف ينتظر الحفظ، وعند التعديل صورة محفوظة على الخادم
  const [pendingImage, setPendingImage] = useState(null);
  const [pendingPreview, setPendingPreview] = useState(null);
  const [imageError, setImageError] = useState('');
  const [imageBusy, setImageBusy] = useState('');
  const [imageNotice, setImageNotice] = useState('');

  const categoriesQuery = useAsync((signal) => admin.categories.list({ perPage: 100, signal }), []);
  const serviceQuery = useAsync((signal) => (isEdit ? admin.services.get(id, { signal }) : Promise.resolve(null)), [id]);
  const service = serviceQuery.data;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: { name: '', categoryId: '', price: '', description: '', isActive: true },
  });

  const isActive = useWatch({ control, name: 'isActive' });

  useEffect(() => {
    if (!service) return;
    reset({
      name: service.name ?? '',
      categoryId: service.category?.id ? String(service.category.id) : '',
      price: service.price ?? '',
      description: service.description ?? '',
      isActive: Boolean(service.is_active),
    });
  }, [service, reset]);

  useEffect(() => {
    if (!pendingImage) return undefined;
    const url = URL.createObjectURL(pendingImage);
    setPendingPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingImage]);

  const categories = useMemo(() => categoriesQuery.data?.data ?? [], [categoriesQuery.data]);

  // التصنيف المضاف من النافذة يُختار بعد ظهور خياره في القائمة،
  // لأن تعيين قيمة select قبل وجود الخيار يُسقطها بصمت
  const [newCategoryId, setNewCategoryId] = useState(null);
  useEffect(() => {
    if (newCategoryId && categories.some((category) => category.id === newCategoryId)) {
      setValue('categoryId', String(newCategoryId), { shouldDirty: true, shouldValidate: true });
      setNewCategoryId(null);
    }
  }, [newCategoryId, categories, setValue]);

  const onSubmit = async (values) => {
    setFormError('');
    const payload = {
      categoryId: Number(values.categoryId),
      name: values.name,
      description: values.description,
      price: values.price,
      isActive: values.isActive,
    };

    try {
      const saved = isEdit
        ? await admin.services.update(id, payload)
        : await admin.services.create({ ...payload, image: pendingImage ?? undefined });

      navigate('/admin/services', {
        state: { notice: isEdit ? `تم حفظ تعديلات "${saved.name}".` : `تمت إضافة "${saved.name}" إلى الخدمات.` },
      });
    } catch (error) {
      if (error.status === 422) {
        let mapped = 0;
        Object.entries(SERVER_FIELDS).forEach(([serverField, formField]) => {
          const message = error.fieldError(serverField);
          if (message) {
            setError(formField, { type: 'server', message });
            mapped += 1;
          }
        });
        const imageMessage = error.fieldError('image');
        if (imageMessage) setImageError(imageMessage);
        setFormError(mapped || imageMessage ? 'يرجى مراجعة الحقول المظللة.' : error.message);
      } else {
        setFormError(error.message);
      }
    }
  };

  const pickImage = async (file) => {
    if (!file) return;
    const problem = validateImage(file);
    setImageError(problem);
    setImageNotice('');
    if (problem) return;

    if (!isEdit) {
      setPendingImage(file);
      return;
    }

    setImageBusy('upload');
    try {
      const updated = await admin.services.uploadImage(id, file);
      serviceQuery.setData((previous) => ({ ...previous, ...updated }));
      setImageNotice('تم تحديث صورة الخدمة.');
    } catch (error) {
      setImageError(error.fieldError?.('image') ?? error.message);
    } finally {
      setImageBusy('');
    }
  };

  const removeImage = async () => {
    setImageError('');
    setImageNotice('');
    if (!isEdit) {
      setPendingImage(null);
      setPendingPreview(null);
      return;
    }
    setImageBusy('remove');
    try {
      const updated = await admin.services.removeImage(id);
      serviceQuery.setData((previous) => ({ ...previous, ...updated }));
      setImageNotice('تم حذف صورة الخدمة. ستظهر صورة افتراضية في الكتالوج.');
    } catch (error) {
      setImageError(error.message);
    } finally {
      setImageBusy('');
    }
  };

  const deleteService = async () => {
    await admin.services.remove(id);
    navigate('/admin/services', { replace: true, state: { notice: `تم حذف "${service.name}".` } });
  };

  // ننتظر التصنيفات قبل عرض النموذج: قائمة الاختيار تحتاج خياراتها حتى تُظهر التصنيف المحفوظ
  if ((isEdit && serviceQuery.loading && !service) || (categoriesQuery.loading && !categoriesQuery.data)) {
    return <PageLoader label={isEdit ? 'جاري تحميل الخدمة...' : 'جاري التحضير...'} />;
  }
  if (categoriesQuery.error && !categoriesQuery.data) return <ErrorState error={categoriesQuery.error} onRetry={categoriesQuery.reload} />;
  if (isEdit && serviceQuery.error) {
    return (
      <ErrorState
        title={serviceQuery.error.status === 404 ? 'الخدمة غير موجودة أو محذوفة' : undefined}
        error={serviceQuery.error}
        onRetry={serviceQuery.error.status === 404 ? undefined : serviceQuery.reload}
      />
    );
  }

  const currentImage = isEdit ? service?.image_url : pendingPreview;

  return (
    <>
      <AdminPageHeader
        breadcrumb={
          <Link to="/admin/services" className="inline-flex items-center gap-[4px] hover:text-[#4C2325]">
            <FiArrowRight className="h-[14px] w-[14px]" aria-hidden="true" />
            الخدمات
          </Link>
        }
        title={isEdit ? `تعديل: ${service?.name ?? ''}` : 'خدمة جديدة'}
        description={isEdit ? undefined : 'أضف الخدمة إلى كتالوج المنصة. بعدها يسعّرها كل طبيب بسعره ومدته.'}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 items-start gap-[16px] xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-[16px]">
          <section className={`${panelClass} flex flex-col gap-[18px] p-[18px] sm:p-[24px]`} aria-labelledby="service-details-title">
            <h2 id="service-details-title" className="text-[16px] font-[800] text-[#2B2527]">
              بيانات الخدمة
            </h2>

            <Field id="service-name" label="اسم الخدمة" required error={errors.name?.message}>
              <input id="service-name" maxLength={255} placeholder="مثال: تقشير كيميائي طبي" {...register('name')} className={inputClass(errors.name)} />
            </Field>

            <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
              <Field
                id="service-category"
                label="التصنيف"
                required
                error={errors.categoryId?.message}
                hint={!categoriesQuery.loading && categories.length === 0 ? 'لا توجد تصنيفات بعد، أضف تصنيفاً أولاً.' : undefined}
              >
                <div className="flex gap-[8px]">
                  <select
                    id="service-category"
                    {...register('categoryId')}
                    disabled={categoriesQuery.loading}
                    className={`${inputClass(errors.categoryId)} min-w-0 flex-1 cursor-pointer`}
                  >
                    <option value="">{categoriesQuery.loading ? 'جاري تحميل التصنيفات...' : 'اختر التصنيف'}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setCategoryDialogOpen(true)}
                    className={`${secondaryButtonClass} !h-[44px] shrink-0 !px-[12px]`}
                    aria-label="إضافة تصنيف جديد"
                    title="تصنيف جديد"
                  >
                    <FiPlus className="h-[16px] w-[16px]" aria-hidden="true" />
                  </button>
                </div>
              </Field>

              <Field
                id="service-price"
                label="السعر الإرشادي"
                required
                error={errors.price?.message}
                hint="يظهر كـ «يبدأ من» فقط حين لا يسعّر أي طبيب الخدمة."
              >
                <div className="relative">
                  <input
                    id="service-price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max={MAX_PRICE}
                    step="0.01"
                    dir="ltr"
                    placeholder="0.00"
                    {...register('price')}
                    className={`${inputClass(errors.price)} pl-[40px] text-right tabular-nums`}
                  />
                  <span className="pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2 text-[15px] font-[600] text-[#8A7F80]">
                    {CLINIC.currency}
                  </span>
                </div>
              </Field>
            </div>

            <Field id="service-description" label="الوصف" hint="يظهر للمرضى في بطاقة الخدمة. جملتان أو ثلاث تكفي.">
              <textarea
                id="service-description"
                rows={4}
                placeholder="مثال: علاج فعّال للتصبغات وآثار الحبوب باستخدام أحماض طبية آمنة بإشراف طبي."
                {...register('description')}
                className="w-full resize-y rounded-[10px] border border-[#E2E8F0] bg-white p-[12px] text-[15px] leading-[24px] text-[#2B2527] placeholder-[#A0AEC0] focus:border-[#4C2325] focus:outline-none"
              />
            </Field>
          </section>

          {isEdit && (
            <section className="flex flex-col gap-[12px] rounded-[14px] border border-[#FECACA] bg-white p-[18px] sm:flex-row sm:items-center sm:justify-between sm:p-[20px]">
              <div>
                <h2 className="text-[15px] font-[800] text-[#B91C1C]">حذف الخدمة</h2>
                <p className="text-[13.5px] text-[#6B5E5F]">لا يمكن استرجاعها من اللوحة. المواعيد السابقة تبقى محفوظة.</p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="inline-flex h-[42px] cursor-pointer items-center justify-center gap-[8px] rounded-[10px] border border-[#FECACA] px-[16px] text-[14px] font-[600] text-[#B91C1C] hover:bg-[#FEF2F2]"
              >
                <FiTrash2 className="h-[15px] w-[15px]" aria-hidden="true" />
                حذف الخدمة
              </button>
            </section>
          )}
        </div>

        <aside className="flex flex-col gap-[16px] xl:sticky xl:top-[92px]">
          {/* النشر */}
          <section className={`${panelClass} flex flex-col gap-[14px] p-[18px]`} aria-labelledby="service-publish-title">
            <h2 id="service-publish-title" className="text-[15px] font-[800] text-[#2B2527]">
              الظهور في الكتالوج
            </h2>
            <div className="flex items-center justify-between gap-[12px]">
              <div>
                <p className="text-[14px] font-[600]">{isActive ? 'مفعّلة' : 'معطّلة'}</p>
                <p className="text-[12.5px] text-[#8A7F80]">{isActive ? 'تظهر للمرضى ويمكن حجزها.' : 'مخفية عن المرضى ولا تقبل حجوزات جديدة.'}</p>
              </div>
              <ToggleSwitch
                id="service-active"
                checked={Boolean(isActive)}
                onChange={(value) => setValue('isActive', value, { shouldDirty: true })}
                label="تفعيل الخدمة"
              />
            </div>

            <Alert>{formError}</Alert>

            <button type="submit" disabled={isSubmitting || (isEdit && !isDirty)} className={primaryButtonClass}>
              {isSubmitting && <Spinner className="h-[16px] w-[16px]" />}
              {isSubmitting ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة الخدمة'}
            </button>
            <Link to="/admin/services" className={secondaryButtonClass}>
              إلغاء
            </Link>
          </section>

          {/* الصورة */}
          <section className={`${panelClass} flex flex-col gap-[12px] p-[18px]`} aria-labelledby="service-image-title">
            <h2 id="service-image-title" className="text-[15px] font-[800] text-[#2B2527]">
              صورة الخدمة
            </h2>

            <div className="relative aspect-[4/3] w-full max-w-full overflow-hidden rounded-[12px] bg-[#F1ECE6]">
              {currentImage ? (
                <img src={currentImage} alt="صورة الخدمة" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-[6px] text-[#B3A69A]">
                  <FiImage className="h-[28px] w-[28px]" aria-hidden="true" />
                  <span className="text-[12.5px]">بدون صورة، ستظهر صورة افتراضية</span>
                </div>
              )}
              {imageBusy && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-[#4C2325]">
                  <Spinner className="h-[24px] w-[24px]" />
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              id="service-image"
              type="file"
              accept={IMAGE_RULES.accept}
              className="sr-only"
              onChange={(event) => {
                pickImage(event.target.files?.[0]);
                event.target.value = '';
              }}
            />

            <div className="flex gap-[8px]">
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={Boolean(imageBusy)} className={`${secondaryButtonClass} flex-1`}>
                <FiUpload className="h-[15px] w-[15px]" aria-hidden="true" />
                {currentImage ? 'تغيير الصورة' : 'رفع صورة'}
              </button>
              {currentImage && (
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={Boolean(imageBusy)}
                  className="inline-flex h-[42px] cursor-pointer items-center justify-center rounded-[10px] border border-[#FECACA] px-[12px] text-[#B91C1C] hover:bg-[#FEF2F2] disabled:opacity-50"
                  aria-label="حذف الصورة"
                  title="حذف الصورة"
                >
                  <FiTrash2 className="h-[15px] w-[15px]" />
                </button>
              )}
            </div>

            <p className="flex items-start gap-[6px] text-[12.5px] text-[#8A7F80]">
              <FiInfo className="mt-[3px] h-[13px] w-[13px] shrink-0" aria-hidden="true" />
              {IMAGE_RULES.typesLabel} حتى {IMAGE_RULES.maxLabel}.{' '}
              {isEdit ? 'تغيير الصورة يُحفظ فوراً.' : 'تُرفع مع حفظ الخدمة.'}
            </p>
            <Alert>{imageError}</Alert>
            <Alert type="success">{imageNotice}</Alert>
          </section>
        </aside>
      </form>

      <CategoryDialog
        key={categoryDialogOpen ? 'open' : 'closed'}
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        onSaved={(category) => {
          categoriesQuery.setData((previous) => ({
            ...previous,
            data: [...(previous?.data ?? []), category].sort((a, b) => a.name.localeCompare(b.name)),
          }));
          setNewCategoryId(category.id);
          setCategoryDialogOpen(false);
        }}
      />

      {isEdit && service && (
        <ConfirmDialog
          key={deleteOpen ? 'open' : 'closed'}
          open={deleteOpen}
          title="حذف الخدمة"
          confirmLabel="حذف الخدمة"
          onConfirm={deleteService}
          onClose={() => setDeleteOpen(false)}
        >
          <p>
            هل تريد حذف <strong>{service.name}</strong>؟ ستختفي من الكتالوج ولن يمكن حجزها.
          </p>
          <p className="text-[13px] text-[#6B5E5F]">إن كنت تريد إخفاءها مؤقتاً فقط، عطّلها بدل الحذف.</p>
        </ConfirmDialog>
      )}
    </>
  );
};

export default AdminServiceForm;
