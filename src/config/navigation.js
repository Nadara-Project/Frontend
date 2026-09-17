import { FiCalendar, FiGrid, FiLayers, FiMessageCircle, FiPackage, FiUser } from 'react-icons/fi';

/** أقسام بوابة الطبيب. */
export const DOCTOR_LINKS = [
  { to: '/doctor', label: 'جدولي', Icon: FiCalendar, end: true },
  { to: '/doctor/consultations', label: 'الاستشارات', Icon: FiMessageCircle },
];

/** أقسام حساب المريض: تُستخدم في قائمة الهيدر والقائمة الجانبية على الموبايل. */
export const ACCOUNT_LINKS = [
  { to: '/dashboard', label: 'مواعيدي', Icon: FiCalendar },
  { to: '/dashboard/consultations', label: 'استشاراتي', Icon: FiMessageCircle },
  { to: '/dashboard/profile', label: 'ملفي الشخصي', Icon: FiUser },
];

/** أقسام لوحة إدارة المنصة. */
export const ADMIN_LINKS = [
  { to: '/admin', label: 'نظرة عامة', Icon: FiGrid, end: true },
  { to: '/admin/services', label: 'الخدمات', Icon: FiPackage },
  { to: '/admin/categories', label: 'التصنيفات', Icon: FiLayers },
];

export const accountLinksFor = (role) => {
  if (role === 'admin') return ADMIN_LINKS;
  if (role === 'doctor') return DOCTOR_LINKS;
  return ACCOUNT_LINKS;
};

/** الصفحة التي يصل إليها المستخدم بعد الدخول إن لم يطلب صفحة محددة. */
export const homePathFor = (user) => {
  if (user?.role === 'admin') return '/admin';
  if (user?.role === 'doctor') return '/doctor';
  return '/dashboard';
};
