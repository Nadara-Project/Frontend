import { useState } from 'react';
import { FaClock, FaEnvelope, FaLocationDot, FaPhone, FaStarOfLife } from 'react-icons/fa6';
import Header from '../../../Layouts/Header';
import Footer from '../../../Layouts/Footer';
import { Alert } from '../../Common/Feedback';
import { CLINIC } from '../../../config/clinic';

const SUBJECTS = [
  { value: 'استفسار عام', label: 'استفسار عام' },
  { value: 'استفسار عن موعد', label: 'استفسار عن موعد' },
  { value: 'استفسار عن الدفع', label: 'استفسار عن الدفع' },
  { value: 'دعم فني', label: 'دعم فني' },
];

const inputClass =
  'w-full px-4 py-3.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4C2325]/20 focus:border-[#4C2325] text-[16px] bg-gray-50/30 text-[#4C2325]';

const telHref = (phone) => `tel:${phone.replace(/\s+/g, '')}`;

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [notice, setNotice] = useState('');

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  /**
   * لا يوجد endpoint لرسائل التواصل في الباك إند بعد، لذلك نجهّز الرسالة
   * في تطبيق البريد لدى المستخدم بدل نموذج لا يرسل شيئاً.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = form.subject || 'رسالة من موقع نضارة';
    const body = `${form.message}\n\n—\nالاسم: ${form.name}\nالبريد: ${form.email}`;
    window.location.href = `mailto:${CLINIC.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setNotice(`فتحنا تطبيق البريد لديك لإرسال رسالتك إلى ${CLINIC.email}. إن لم يُفتح، راسلنا مباشرة على العنوان نفسه أو اتصل بنا.`);
  };

  return (
    <>
      <Header />
      <main className="w-full bg-[#FAF9F6] px-[16px] pb-[64px] pt-[40px] font-['Tajawal'] sm:px-[24px]" dir="rtl">
        <div className="mx-auto max-w-[1232px]">
          <div className="mx-auto mb-[48px] flex w-full max-w-[672px] flex-col items-center justify-center text-center sm:mb-[64px]">
            <h1 className="mb-4 text-[36px] font-bold leading-[48px] tracking-[-0.96px] text-[#4C2325] sm:text-[48px] sm:leading-[56px]">
              تواصل معنا
            </h1>
            <p className="text-[17px] leading-[28px] text-[#4C2325] sm:text-[18px]">
              نحن هنا للإجابة على استفساراتكم وتقديم الدعم اللازم. لا تترددوا في التواصل معنا عبر النموذج أدناه أو
              باستخدام معلومات الاتصال المباشرة.
            </p>
          </div>

          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row-reverse">
            {/* النموذج */}
            <div className="w-full shrink-0 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 lg:w-[584px]">
              <h2 className="mb-6 text-[20px] font-bold leading-[28px] text-[#4C2325]">أرسل لنا رسالة</h2>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <Alert type="info">{notice}</Alert>

                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-[14px] font-medium leading-[20px] text-[#4C2325]">
                    الاسم الكامل
                  </label>
                  <input id="contact-name" type="text" required autoComplete="name" value={form.name} onChange={update('name')} placeholder="أدخل اسمك" className={inputClass} />
                </div>

                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-[14px] font-medium leading-[20px] text-[#4C2325]">
                    البريد الإلكتروني
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    dir="ltr"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="example@domain.com"
                    className={`${inputClass} text-left placeholder:text-left`}
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="mb-2 block text-[14px] font-medium leading-[20px] text-[#4C2325]">
                    الموضوع (اختياري)
                  </label>
                  <select id="contact-subject" value={form.subject} onChange={update('subject')} className={inputClass}>
                    <option value="">اختر موضوع الرسالة</option>
                    {SUBJECTS.map((subject) => (
                      <option key={subject.value} value={subject.value}>
                        {subject.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-[14px] font-medium leading-[20px] text-[#4C2325]">
                    نص الرسالة
                  </label>
                  <textarea
                    id="contact-message"
                    rows="6"
                    required
                    minLength={10}
                    value={form.message}
                    onChange={update('message')}
                    placeholder="تفضل بكتابة رسالتك هنا..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full cursor-pointer rounded-lg bg-[#4C2325] py-4 text-[16px] font-medium text-white shadow-sm transition duration-200 hover:bg-[#381a1b]"
                >
                  إرسال الرسالة
                </button>
              </form>
            </div>

            {/* معلومات التواصل */}
            <div className="w-full flex-1 space-y-6">
              <div className="flex min-h-[144px] w-full items-start justify-start gap-4 rounded-2xl border border-[#4C2325]/10 bg-white p-6">
                <div className="flex h-[48px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-[#E3D8D3]">
                  <FaStarOfLife className="h-[18px] w-[18px] text-[#4C2325]" aria-hidden="true" />
                </div>
                <div className="flex flex-col text-right">
                  <h3 className="text-[20px] font-medium leading-[32px] text-[#4C2325] sm:text-[24px]">الخط الساخن للطوارئ</h3>
                  <p className="mt-1 text-[14px] leading-[20px] text-gray-600">الحالات الطبية المستعجلة خارج أوقات العمل الرسمية.</p>
                  <a href={telHref(CLINIC.emergencyPhone)} dir="ltr" className="mt-2 text-right text-[20px] font-bold text-[#4C2325] hover:underline">
                    {CLINIC.emergencyPhone}
                  </a>
                </div>
              </div>

              <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="border-b border-gray-100 pb-3 text-[20px] font-bold text-[#4C2325]">معلومات التواصل</h3>

                <address className="space-y-5 not-italic">
                  <div className="flex items-start gap-3.5">
                    <FaLocationDot className="mt-1 shrink-0 text-lg text-[#4C2325]" aria-hidden="true" />
                    <div>
                      <h4 className="text-[16px] font-bold leading-[24px] text-[#4C2325]">العنوان الرئيسي</h4>
                      <p className="mt-1 text-[16px] leading-[24px] text-[#4C2325]">{CLINIC.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <FaPhone className="mt-1 shrink-0 text-base text-[#4C2325]" aria-hidden="true" />
                    <div>
                      <h4 className="text-[16px] font-bold leading-[24px] text-[#4C2325]">رقم الهاتف</h4>
                      <a href={telHref(CLINIC.phone)} dir="ltr" className="mt-1 block text-right text-[16px] leading-[24px] text-[#4C2325] hover:underline">
                        {CLINIC.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <FaEnvelope className="mt-1 shrink-0 text-base text-[#4C2325]" aria-hidden="true" />
                    <div>
                      <h4 className="text-[16px] font-bold leading-[24px] text-[#4C2325]">البريد الإلكتروني</h4>
                      <a href={`mailto:${CLINIC.email}`} dir="ltr" className="mt-1 block text-right text-[16px] leading-[24px] text-[#4C2325] hover:underline">
                        {CLINIC.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <FaClock className="mt-1 shrink-0 text-base text-[#4C2325]" aria-hidden="true" />
                    <div>
                      <h4 className="text-[16px] font-bold leading-[24px] text-[#4C2325]">ساعات العمل</h4>
                      {CLINIC.workingHours.map((item) => (
                        <p key={item.day} className={`mt-1 text-[15px] leading-[24px] ${item.closed ? 'text-gray-500' : 'text-[#4C2325]'}`}>
                          {item.day}: {item.time}
                        </p>
                      ))}
                    </div>
                  </div>
                </address>
              </div>

              <div className="h-[256px] w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
                <iframe
                  title="موقع العيادة على الخريطة"
                  src={CLINIC.mapEmbedUrl}
                  className="h-full w-full rounded-xl border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ContactUs;
