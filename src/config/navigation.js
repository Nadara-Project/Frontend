import { FiCalendar, FiGrid, FiLayers, FiMessageCircle, FiPackage, FiUser } from 'react-icons/fi';

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

export const accountLinksFor = (role) => (role === 'admin' ? ADMIN_LINKS : ACCOUNT_LINKS);

/** الصفحة التي يصل إليها المستخدم بعد الدخول إن لم يطلب صفحة محددة. */
export const homePathFor = (user) => (user?.role === 'admin' ? '/admin' : '/dashboard');
