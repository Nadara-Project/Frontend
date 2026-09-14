/**
 * مصدر واحد لبيانات العيادة الثابتة التي لا يوفّرها الباك إند بعد.
 * كانت هذه القيم مكررة ومتضاربة بين الفوتر وصفحة التواصل وصفحة الدفع.
 *
 * ⚠️ أرقام الحسابات والهواتف هنا قيم مؤقتة يجب تأكيدها مع إدارة العيادة قبل الإطلاق.
 */
export const CLINIC = {
  name: 'عيادة نضارة',
  timezone: 'Asia/Hebron',
  currency: '₪',

  address: 'شارع عمر المختار، برج فلسطين، الدور الثالث، حي الرمال، غزة، فلسطين.',
  shortAddress: 'غزة - الرمال، برج فلسطين',
  phone: '+970 11 234 5678',
  emergencyPhone: '+970 555 123 456',
  email: 'info@nadarah.ps',
  mapEmbedUrl: 'https://maps.google.com/maps?q=Gaza&t=&z=13&ie=UTF8&iwloc=&output=embed',

  workingHours: [
    { day: 'الأحد - الخميس', time: '09:00 ص - 09:00 م' },
    { day: 'السبت', time: '10:00 ص - 06:00 م' },
    { day: 'الجمعة', time: 'مغلق', closed: true },
  ],
};

/**
 * طرق الدفع اليدوية: المريض يحوّل المبلغ ثم يرفع صورة الإيصال.
 * `value` هو ما يُرسل للباك إند في حقل method (نص حر حتى 50 حرفاً).
 */
export const PAYMENT_METHODS = [
  { value: 'bank_of_palestine', label: 'بنك فلسطين', detailLabel: 'رقم الحساب', detail: '1234567' },
  { value: 'jawwal_pay', label: 'جوال باي (Jawwal Pay)', detailLabel: 'رقم المحفظة', detail: '0599123456' },
];

/** حدود الرفع كما يفرضها الباك إند (config/nadara.php). */
export const UPLOAD_LIMITS = {
  receipt: {
    maxBytes: 4 * 1024 * 1024,
    maxLabel: '4MB',
    types: ['image/jpeg', 'image/png', 'application/pdf'],
    accept: 'image/jpeg,image/png,application/pdf',
    typesLabel: 'JPG, PNG, PDF',
  },
  image: {
    maxBytes: 2 * 1024 * 1024,
    maxLabel: '2MB',
    types: ['image/jpeg', 'image/png', 'image/webp'],
    accept: 'image/jpeg,image/png,image/webp',
    typesLabel: 'JPG, PNG, WEBP',
  },
  consultationPhotos: 5,
};

export const BOOKING_RULES = {
  maxDaysAhead: 90,
  cancellationWindowHours: 24,
  minSymptomsLength: 20,
  maxSymptomsLength: 5000,
};
