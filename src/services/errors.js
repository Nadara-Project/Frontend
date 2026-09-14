/**
 * الباك إند يرجّع رسائله بالإنجليزية (APP_LOCALE=en)، والواجهة عربية بالكامل.
 * هذا الملف يترجم الرسائل المعروفة، ويحوّل رسائل التحقق القياسية في Laravel
 * إلى عربية مفهومة، حتى لا يرى المريض نصاً إنجليزياً تقنياً وسط الصفحة.
 */

/** أسماء الحقول كما تظهر للمستخدم. */
const FIELD_LABELS = {
  name: 'الاسم',
  email: 'البريد الإلكتروني',
  phone: 'رقم الهاتف',
  birth_date: 'تاريخ الميلاد',
  gender: 'الجنس',
  password: 'كلمة المرور',
  password_confirmation: 'تأكيد كلمة المرور',
  token: 'رابط إعادة التعيين',
  image: 'الصورة',
  receipt: 'الإيصال',
  method: 'طريقة الدفع',
  reference: 'رقم العملية',
  doctor_id: 'الطبيب',
  service_id: 'الخدمة',
  start_at: 'موعد الزيارة',
  date: 'التاريخ',
  symptoms: 'وصف الحالة',
  photos: 'الصور',
  message: 'الرسالة',
  reason: 'سبب الإلغاء',
  status: 'الحالة',
};

const fieldLabel = (field = '') => {
  const base = String(field).split('.')[0];
  return FIELD_LABELS[base] ?? 'هذا الحقل';
};

/** رسائل مخصّصة كتبها فريق الباك إند، مطابقة حرفياً. */
const EXACT = {
  'These credentials do not match our records.': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
  'If an account matches that email address, a password reset link has been sent.':
    'إذا كان البريد مسجّلاً لدينا، فقد أرسلنا إليه رابط إعادة تعيين كلمة المرور.',
  'Please wait before retrying.': 'طلبت رابطاً قبل قليل، انتظر دقيقة ثم أعد المحاولة.',
  'This password reset token is invalid.': 'رابط إعادة التعيين غير صالح أو انتهت صلاحيته.',
  'We can\'t find a user with that email address.': 'رابط إعادة التعيين غير صالح أو انتهت صلاحيته.',
  'Unauthenticated.': 'انتهت جلستك، يرجى تسجيل الدخول من جديد.',
  'This action is unauthorized.': 'لا تملك صلاحية تنفيذ هذا الإجراء.',
  'Forbidden. You do not have access to this resource.': 'لا تملك صلاحية الوصول إلى هذه الصفحة.',
  'Too Many Attempts.': 'محاولات كثيرة متتالية، انتظر قليلاً ثم أعد المحاولة.',
  'That time slot is no longer available. Please pick another one.':
    'هذا الموعد حُجز للتو من مريض آخر، اختر وقتاً آخر من القائمة المحدّثة.',
  'This doctor does not offer that service.': 'الطبيب المختار لا يقدّم هذه الخدمة.',
  'This doctor is not accepting patients right now.': 'الطبيب لا يستقبل مرضى حالياً، اختر طبيباً آخر.',
  'This doctor is not accepting appointments right now.': 'الطبيب لا يستقبل حجوزات حالياً، اختر طبيباً آخر.',
  'That appointment time has already passed.': 'هذا الوقت أصبح في الماضي، اختر وقتاً آخر.',
  'This appointment is not waiting for a payment receipt.': 'هذا الموعد لا ينتظر إيصال دفع.',
  'This appointment is already closed.': 'هذا الموعد مغلق ولا يمكن إلغاؤه.',
  'This doctor does not take online consultations.': 'الطبيب المختار لا يستقبل استشارات عن بُعد.',
  'This payment is not awaiting review.': 'هذه الدفعة ليست قيد المراجعة.',
  'The phone field must be a valid phone number.': 'رقم الهاتف غير صحيح.',
  'The given password has appeared in a data leak. Please choose a different password.':
    'كلمة المرور هذه ظهرت في تسريبات بيانات سابقة، اختر كلمة مرور مختلفة.',
};

/** قواعد التحقق القياسية في Laravel، تُطابق بالنمط وتُعاد صياغتها بالعربية. */
const PATTERNS = [
  [/^Too many login attempts\. Please try again in (\d+) seconds?\.$/, (s) => `محاولات دخول كثيرة، أعد المحاولة بعد ${s} ثانية.`],
  [/^Appointments can only be cancelled at least (\d+) hours in advance\.$/, (h) => `لا يمكن إلغاء الموعد قبل أقل من ${h} ساعة من وقته.`],
  [/^The (.+?) has already been taken\.$/, (f) => `${fieldLabel(f)} مستخدم مسبقاً في حساب آخر.`],
  [/^The (.+?) field is required\.$/, (f) => `${fieldLabel(f)} مطلوب.`],
  [/^The (.+?) field must be at least (\d+) characters\.$/, (f, n) => `${fieldLabel(f)} يجب أن يكون ${n} أحرف على الأقل.`],
  [/^The (.+?) field must not be greater than (\d+) characters\.$/, (f, n) => `${fieldLabel(f)} يجب ألا يتجاوز ${n} حرفاً.`],
  [/^The (.+?) field must not be greater than (\d+) kilobytes\.$/, (f, kb) => `حجم ${fieldLabel(f)} يجب ألا يتجاوز ${Math.round(kb / 1024)}MB.`],
  [/^The (.+?) field must not have more than (\d+) items\.$/, (f, n) => `لا يمكن إرفاق أكثر من ${n} ${fieldLabel(f)}.`],
  [/^The (.+?) field must be a file of type: (.+)\.$/, (f, types) => `صيغة ${fieldLabel(f)} غير مدعومة، الصيغ المسموحة: ${types}.`],
  [/^The (.+?) field must be an image\.$/, (f) => `${fieldLabel(f)} يجب أن تكون صورة.`],
  [/^The (.+?) failed to upload\.$/, (f) => `تعذّر رفع ${fieldLabel(f)}، حاول مرة أخرى.`],
  [/^The (.+?) field must be a valid email address\.$/, () => 'صيغة البريد الإلكتروني غير صحيحة.'],
  [/^The (.+?) field confirmation does not match\.$/, () => 'كلمتا المرور غير متطابقتين.'],
  [/^The (.+?) field must be a date before today\.$/, (f) => `${fieldLabel(f)} يجب أن يكون قبل تاريخ اليوم.`],
  [/^The (.+?) field must be a date after (.+)\.$/, (f) => `${fieldLabel(f)} غير منطقي، تأكد من السنة.`],
  [/^The (.+?) field must be a date before (.+)\.$/, (f) => `${fieldLabel(f)} أبعد من المسموح به.`],
  [/^The (.+?) field must be a date after or equal to today\.$/, (f) => `${fieldLabel(f)} يجب أن يكون اليوم أو بعده.`],
  [/^The (.+?) field must match the format (.+)\.$/, (f) => `صيغة ${fieldLabel(f)} غير صحيحة.`],
  [/^The selected (.+?) is invalid\.$/, (f) => `${fieldLabel(f)} المختار غير صالح.`],
  [/^The (.+?) field must contain at least one uppercase and one lowercase letter\.$/, () => 'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير.'],
  [/^The (.+?) field must contain at least one letter\.$/, () => 'كلمة المرور يجب أن تحتوي على حرف واحد على الأقل.'],
  [/^The (.+?) field must contain at least one number\.$/, () => 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل.'],
  [/^The (.+?) field must contain at least one symbol\.$/, () => 'كلمة المرور يجب أن تحتوي على رمز واحد على الأقل.'],
];

const ARABIC = /[؀-ۿ]/;

/** رسالة عامة بالعربية بحسب رمز الحالة، عند غياب ترجمة محددة. */
export const statusFallback = (status) => {
  switch (status) {
    case 0: return 'تعذّر الاتصال بالخادم، تحقق من اتصالك بالإنترنت.';
    case 401: return EXACT['Unauthenticated.'];
    case 403: return EXACT['This action is unauthorized.'];
    case 404: return 'العنصر المطلوب غير موجود أو لم يعد متاحاً.';
    case 409: return 'تعارض في البيانات، حدّث الصفحة وأعد المحاولة.';
    case 413: return 'حجم الملف أكبر من المسموح به.';
    case 422: return 'يرجى مراجعة البيانات المدخلة.';
    case 429: return EXACT['Too Many Attempts.'];
    default:
      return status >= 500
        ? 'حدث خطأ في الخادم، حاول مرة أخرى بعد قليل.'
        : 'حدث خطأ غير متوقع، حاول مرة أخرى.';
  }
};

/**
 * يترجم رسالة واحدة. `field` يُستخدم لصياغة رسالة عامة للحقل
 * إذا لم تُعرف الرسالة، بدل عرض النص الإنجليزي كما هو.
 */
export const translateMessage = (message, { status, field } = {}) => {
  if (!message || typeof message !== 'string') {
    return field ? `قيمة ${fieldLabel(field)} غير صالحة.` : statusFallback(status);
  }

  const text = message.trim();
  if (ARABIC.test(text)) return text;
  if (EXACT[text]) return EXACT[text];

  for (const [pattern, build] of PATTERNS) {
    const match = text.match(pattern);
    if (match) return build(...match.slice(1));
  }

  // رسالة Laravel المختصرة: "The x field is required. (and 2 more errors)"
  const summary = text.match(/^(.*?)\s*\(and \d+ more errors?\)$/);
  if (summary) return translateMessage(summary[1], { status, field });

  return field ? `قيمة ${fieldLabel(field)} غير صالحة.` : statusFallback(status);
};

/** يترجم كائن errors القادم من 422 كاملاً مع الحفاظ على مفاتيحه. */
export const translateErrors = (errors = {}, status) =>
  Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [
      field,
      (Array.isArray(messages) ? messages : [messages]).map((msg) =>
        translateMessage(msg, { status, field })
      ),
    ])
  );
