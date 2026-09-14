import { FiCalendar, FiMessageCircle, FiUser } from 'react-icons/fi';

/** أقسام حساب المريض: تُستخدم في قائمة الهيدر والقائمة الجانبية على الموبايل. */
export const ACCOUNT_LINKS = [
  { to: '/dashboard', label: 'مواعيدي', Icon: FiCalendar },
  { to: '/dashboard/consultations', label: 'استشاراتي', Icon: FiMessageCircle },
  { to: '/dashboard/profile', label: 'ملفي الشخصي', Icon: FiUser },
];
