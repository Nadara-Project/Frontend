import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiChevronDown, FiUploadCloud, FiClock, FiAlertCircle } from 'react-icons/fi';

export default function AppointmentPayment() {
  const navigate = useNavigate();

  // حالات الصفحة: 'pending' (بانتظار الدفع) | 'under_review' (قيد المراجعة)
  const [step, setStep] = useState('pending');
  const [timeLeft, setTimeLeft] = useState(1799); // 30 دقيقة
  const [uploadedFile, setUploadedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // العداد التنازلي لمهلة الدفع
  useEffect(() => {
    if (step !== 'pending' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  // تنسيق وقت العداد
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // معالجة اختيار الملف
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setErrorMessage('');
    }
  };

  // معالجة الضغط على زر إرسال الإيصال
  const handleConfirmPayment = () => {
    if (!uploadedFile) {
      setErrorMessage('يرجى إرفاق إيصال الدفع أولاً لنتمكن من مراجعته');
      return;
    }
    setErrorMessage('');
    setStep('under_review');
  };

  // العودة لشاشة الحجوزات
  const handleGoToAppointments = () => {
    navigate('/patient-profile'); // قم بتعديل المسار حسب توجيه صفحة الحجوزات لديك
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE] font-['Tajawal'] text-right" dir="rtl">
      {/* Header */}
      <header className="w-full bg-white border-b border-[#E5E7EB] h-[64px] md:h-[72px] px-[16px] sm:px-[24px] md:px-[64px] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-[12px]">
          <img src="/Logo.svg" alt="NADARA" className="h-[28px] sm:h-[32px] md:h-[36px] w-auto" />
        </div>

        <nav className="hidden lg:flex items-center gap-[24px] xl:gap-[32px] text-[#4A5568] text-[15px] xl:text-[16px]">
          <Link to="/" className="hover:text-[#4C2325] transition-colors">الرئيسية</Link>
          <a href="#" className="hover:text-[#4C2325] transition-colors">خدماتنا</a>
          <div className="flex items-center gap-[6px] text-[#4C2325] font-bold border-b-2 border-[#4C2325] pb-1 cursor-pointer">
            <span>حجوزاتي</span>
            <span className="w-[18px] h-[18px] rounded-full bg-[#E5D7D8] text-[#4C2325] text-[10px] font-bold flex items-center justify-center">2</span>
          </div>
          <a href="#" className="flex items-center gap-[6px] hover:text-[#4C2325] transition-colors">
            <span>استشاراتي</span>
            <span className="w-[18px] h-[18px] rounded-full bg-[#E5D7D8] text-[#4C2325] text-[10px] font-bold flex items-center justify-center">1</span>
          </a>
        </nav>

        <div className="flex items-center gap-[8px] cursor-pointer">
          <div className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full bg-[#EEEEEE] flex items-center justify-center text-[#718096]">
            <FiUser className="w-[18px] h-[18px] text-[#4C2325]" />
          </div>
          <span className="text-[13px] sm:text-[14px] text-[#212121] font-[500]">سارة أحمد</span>
          <FiChevronDown className="w-[16px] h-[16px] text-[#718096]" />
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-[720px] mx-auto pt-[32px] pb-[60px] px-[16px]">
        
        {/* Step 1: بانتظار رفع الإيصال */}
        {step === 'pending' && (
          <div className="space-y-[20px]">
            
            {/* التنبيه بالوقت المتبقي */}
            <div className="bg-[#FFF3F3] border border-[#FCD2D2] rounded-[16px] p-[16px] flex items-center justify-between">
              <div className="text-[13px] text-[#718096] leading-[1.8]">
                <p className="font-[700] text-[#4C2325] mb-[2px]">
                  يرجى إتمام عملية الدفع خلال <span className="text-[#E53E3E] font-bold dir-ltr inline-block">{formatTime(timeLeft)}</span>
                </p>
                <p>تم حجز الفترة الزمنية مؤقتاً باسمك، سيتم إلغاء الحجز تلقائياً وتحرير الموعد للجمهور إذا انقضت المهلة دون إرفاق إيصال الدفع.</p>
              </div>
              <div className="w-[36px] h-[36px] rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#EF4444] shrink-0 mr-[12px]">
                <FiClock className="w-[20px] h-[20px]" />
              </div>
            </div>

            {/* عرض رسائل الخطأ */}
            {errorMessage && (
              <div className="p-[14px] bg-[#FFF5F5] border border-[#FEB2B2] text-[#C53030] rounded-[12px] flex items-center gap-[10px] text-[14px] font-[600]">
                <FiAlertCircle className="w-[20px] h-[20px] shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* بطاقة الدفع */}
            <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-[24px] shadow-sm">
              <div className="flex items-center justify-between pb-[16px] mb-[20px] border-b border-[#F1F5F9]">
                <h2 className="text-[16px] font-[700] text-[#212121]">إتمام حجز الموعد</h2>
                <span className="bg-[#FEF3C7] text-[#D97706] text-[12px] font-[600] px-[12px] py-[4px] rounded-full flex items-center gap-[4px]">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#D97706]"></span>
                  بانتظار الدفع
                </span>
              </div>

              <div className="bg-[#FDFBF7] rounded-[12px] border border-[#F3EFE6] p-[16px] flex items-center justify-between mb-[24px]">
                <div>
                  <span className="text-[12px] text-[#A0AEC0] block mb-[4px]">الخدمة والطبيب</span>
                  <span className="text-[14px] font-[700] text-[#212121]">تنظيف بشرة عميق - د. نورة أحمد</span>
                </div>
                <div className="text-left">
                  <span className="text-[12px] text-[#A0AEC0] block mb-[4px]">الموعد</span>
                  <span className="text-[14px] font-[700] text-[#212121]">30/08/2026 - 10:00 صباحاً</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-[24px] px-[4px]">
                <span className="text-[14px] font-[600] text-[#718096]">المبلغ المطلوب للدفع:</span>
                <span className="text-[22px] font-[800] text-[#4C2325]">50 شيكل</span>
              </div>

              {/* طرق الدفع المتاحة */}
              <div className="mb-[24px]">
                <label className="block text-[13px] font-[700] text-[#212121] mb-[10px]">طرق الدفع المتاحة:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
                  <div className="p-[14px] border border-[#E2E8F0] rounded-[12px] bg-[#FAFAFA]">
                    <span className="text-[13px] font-[700] text-[#212121] block">بنك فلسطين</span>
                    <span className="text-[12px] text-[#718096]">رقم الحساب: 1234567</span>
                  </div>
                  <div className="p-[14px] border border-[#E2E8F0] rounded-[12px] bg-[#FAFAFA]">
                    <span className="text-[13px] font-[700] text-[#212121] block">جوال باي (Jawwal Pay)</span>
                    <span className="text-[12px] text-[#718096]">رقم المحفظة: 0599123456</span>
                  </div>
                </div>
              </div>

              {/* منطقة رفع الملف */}
              <div>
                <label className="block text-[13px] font-[700] text-[#212121] mb-[10px]">إرفاق إيصال الدفع <span className="text-[#E53E3E]">*</span>:</label>
                <label className={`border-2 border-dashed rounded-[14px] p-[28px] flex flex-col items-center justify-center gap-[8px] cursor-pointer transition-all ${
                  uploadedFile ? 'border-[#4C2325] bg-[#FDFBF7]' : 'border-[#CBD5E1] hover:bg-[#F8FAFC]'
                }`}>
                  <input type="file" onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
                  <FiUploadCloud className={`w-[32px] h-[32px] ${uploadedFile ? 'text-[#4C2325]' : 'text-[#94A3B8]'}`} />
                  <span className="text-[13px] font-[600] text-[#475569]">
                    {uploadedFile ? uploadedFile.name : 'اضغط هنا لرفع الصورة أو قم بسحبها وإفلاتها'}
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">صيغ مدعومة: JPG, PNG, PDF (الحد الأقصى 5MB)</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleConfirmPayment}
                className="w-full h-[48px] bg-[#4C2325] hover:bg-[#381A1B] text-white rounded-[12px] font-[600] text-[14px] transition-all mt-[24px] cursor-pointer shadow-sm active:scale-[0.99]"
              >
                تأكيد الموعد وإرسال الإيصال
              </button>
            </div>
          </div>
        )}

        {/* Step 2: قيد المراجعة والتدقيق */}
        {step === 'under_review' && (
          <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-[32px] text-center shadow-sm max-w-[600px] mx-auto">
            <div className="w-[64px] h-[64px] bg-[#FEF3C7] text-[#D97706] rounded-full flex items-center justify-center mx-auto mb-[20px]">
              <FiClock className="w-[36px] h-[36px]" />
            </div>

            <h1 className="text-[22px] font-[800] text-[#212121] mb-[8px]">تم إرسال إيصال الدفع بنجاح!</h1>
            <p className="text-[13px] text-[#718096] mb-[20px] leading-[1.7]">
              طلبك الآن <span className="font-bold text-[#D97706]">قيد المراجعة</span>. يقوم فريق الاستقبال بمطابقة الإيصال وتأكيد الموعد نهائياً خلال بضع دقائق.
            </p>

            <div className="inline-flex items-center gap-[8px] bg-[#F1F5F9] px-[16px] py-[8px] rounded-full text-[12px] text-[#475569] font-[600] mb-[24px]">
              <span className="bg-[#D97706] text-white text-[10px] px-[8px] py-[2px] rounded-full">الحالة: قيد التدقيق</span>
              <span>|</span>
              <span>رقم الموعد: ND-04920#</span>
            </div>

            {/* تفاصيل الموعد المعلق */}
            <div className="bg-[#F8FAFC] rounded-[16px] border border-[#E2E8F0] p-[20px] text-right space-y-[14px] text-[13px] mb-[28px]">
              <h3 className="font-[700] text-[#212121] border-b border-[#E2E8F0] pb-[10px]">تفاصيل الزيارة:</h3>
              <div className="flex justify-between items-center">
                <span className="text-[#718096]">الخدمة المطلوبة:</span>
                <span className="font-[700] text-[#212121]">تنظيف بشرة عميق</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#718096]">الطبيب المعالج:</span>
                <span className="font-[700] text-[#212121]">د. نورة أحمد</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#718096]">تاريخ الزيارة:</span>
                <span className="font-[700] text-[#212121]">الأحد 30/08/2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#718096]">التوقيت:</span>
                <span className="font-[700] text-[#212121]">10:00 صباحاً</span>
              </div>
              <div className="flex justify-between items-center border-t border-[#E2E8F0] pt-[10px]">
                <span className="text-[#718096]">موقع العيادة:</span>
                <span className="font-[700] text-[#212121]">غزة - الرمال - برج فلسطين</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoToAppointments}
              className="text-[#4C2325] hover:underline font-[700] text-[14px] cursor-pointer"
            >
              ← الانتقال إلى قائمة حجوزاتي لمتابعة حالة الطلب
            </button>
          </div>
        )}

      </main>
    </div>
  );
}