/**
 * تسميات الحالات القادمة من الباك إند وألوانها، في مكان واحد
 * حتى تظهر الحالة بنفس الاسم واللون في كل الصفحات.
 */

export const TONE_CLASSES = {
  warning: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
  info: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
  success: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
  danger: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]',
  neutral: 'bg-[#F4F2EE] text-[#6B5E5F] border-[#E9E2DA]',
  brand: 'bg-[#D5C7AD33] text-[#4C2325] border-[#D5C7AD80]',
};

export const TONE_DOTS = {
  warning: 'bg-[#F59E0B]',
  info: 'bg-[#3B82F6]',
  success: 'bg-[#10B981]',
  danger: 'bg-[#EF4444]',
  neutral: 'bg-[#A8A29E]',
  brand: 'bg-[#4C2325]',
};

export const APPOINTMENT_STATUS = {
  pending_payment: { label: 'بانتظار الدفع', tone: 'warning' },
  awaiting_review: { label: 'قيد مراجعة الإيصال', tone: 'info' },
  approved: { label: 'مؤكد', tone: 'success' },
  completed: { label: 'مكتمل', tone: 'brand' },
  expired: { label: 'انتهت المهلة', tone: 'neutral' },
  rejected: { label: 'مرفوض', tone: 'danger' },
  cancelled: { label: 'ملغي', tone: 'neutral' },
};

export const CONSULTATION_STATUS = {
  pending_payment: { label: 'بانتظار الدفع', tone: 'warning' },
  awaiting_reply: { label: 'بانتظار رد الطبيب', tone: 'info' },
  replied: { label: 'تم الرد', tone: 'success' },
  closed: { label: 'مغلقة', tone: 'neutral' },
};

export const PAYMENT_STATUS = {
  pending: { label: 'بانتظار الإيصال', tone: 'warning' },
  submitted: { label: 'قيد المراجعة', tone: 'info' },
  verified: { label: 'تم التحقق', tone: 'success' },
  rejected: { label: 'مرفوض', tone: 'danger' },
};

/** الحالات التي انتهى فيها الموعد ولا يمكن التعديل عليه. */
export const CLOSED_APPOINTMENT_STATUSES = ['completed', 'expired', 'rejected', 'cancelled'];

/**
 * الاستشارة تبقى pending_payment حتى بعد رفع الإيصال وإلى أن يتحقق الطاقم،
 * لذلك نشتق حالة العرض من حالة الدفعة لتكون أوضح للمريض.
 */
export const consultationDisplayStatus = (consultation) => {
  if (consultation?.status === 'pending_payment' && consultation?.payment?.status === 'submitted') {
    return { label: 'قيد مراجعة الإيصال', tone: 'info' };
  }
  if (consultation?.status === 'pending_payment' && consultation?.payment?.status === 'rejected') {
    return { label: 'الإيصال مرفوض', tone: 'danger' };
  }
  return CONSULTATION_STATUS[consultation?.status] ?? { label: consultation?.status ?? '—', tone: 'neutral' };
};

export const appointmentDisplayStatus = (appointment) =>
  APPOINTMENT_STATUS[appointment?.status] ?? { label: appointment?.status ?? '—', tone: 'neutral' };

/** هل يستطيع المريض رفع إيصال الآن؟ */
export const canPayAppointment = (appointment) => appointment?.status === 'pending_payment';

export const canPayConsultation = (consultation) =>
  consultation?.status === 'pending_payment' &&
  !['submitted', 'verified'].includes(consultation?.payment?.status);
