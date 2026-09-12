import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiChevronDown, FiCalendar, FiArrowRight, FiAlertCircle } from 'react-icons/fi';

export default function BookAppointment() {
  const navigate = useNavigate();

  // بيانات الأطباء للاختيار
  const doctorsList = [
    { id: 1, name: 'د. نورة أحمد', title: 'أخصائية جلدية', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150' },
    { id: 2, name: 'د. خالد سعد', title: 'استشاري تجميل', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150' },
    { id: 3, name: 'د. محمد أحمد', title: 'استشاري عام', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150' },
  ];

  // الأوقات المتاحة
  const timeSlots = [
    { time: '09:00 ص', available: true },
    { time: '09:30 ص', available: false },
    { time: '10:00 ص', available: true },
    { time: '10:30 ص', available: true },
    { time: '11:00 ص', available: true },
    { time: '11:30 ص', available: true },
  ];

  // حالات النماذج
  const [selectedService, setSelectedService] = useState('جلسة ليزر كاملة');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [period, setPeriod] = useState('morning');

  // حالة رسالة الخطأ
  const [errorMessage, setErrorMessage] = useState('');

  // دالة التعامل مع الضغط على زر تقديم الحجز
  const handleBookingSubmit = () => {
    // التحقق من الحقول المطلوبة
    if (!selectedService) {
      setErrorMessage('يرجى اختيار الخدمة المطلوبة أولاً');
      return;
    }
    if (!selectedDoctor) {
      setErrorMessage('يرجى اختيار الطبيب المعالج');
      return;
    }
    if (!selectedDate) {
      setErrorMessage('يرجى تحديد تاريخ الزيارة');
      return;
    }
    if (!selectedTime) {
      setErrorMessage('يرجى اختيار الوقت المناسب للحضور');
      return;
    }

    // إذا كانت كل البيانات المحددة مكتملة، يتم مسح الخطأ والانتقال لصفحة الدفع
    setErrorMessage('');
    navigate('/appointment-payment');
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE] font-['Tajawal'] text-right" dir="rtl">
      {/* Header */}
      <header className="w-full bg-white border-b border-[#E5E7EB] h-[64px] md:h-[72px] px-[16px] sm:px-[24px] md:px-[64px] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-[12px]">
          <img src="/Logo.svg" alt="NADARA" className="h-[28px] sm:h-[32px] md:h-[36px] w-auto" />
        </div>

        <nav className="hidden lg:flex items-center gap-[24px] xl:gap-[32px] text-[#4A5568] text-[15px] xl:text-[16px] font-[400]">
          <Link to="/" className="hover:text-[#4C2325] transition-colors">الرئيسية</Link>
          <a href="#" className="hover:text-[#4C2325] transition-colors">خدماتنا</a>
          <div className="flex items-center gap-[6px] text-[#4C2325] font-bold border-b-2 border-[#4C2325] pb-1 cursor-pointer">
            <span>حجوزاتي</span>
            <span className="w-[18px] h-[18px] rounded-full bg-[#E5D7D8] text-[#4C2325] text-[10px] font-bold flex items-center justify-center">
              2
            </span>
          </div>
          <a href="#" className="flex items-center gap-[6px] hover:text-[#4C2325] transition-colors">
            <span>استشاراتي</span>
            <span className="w-[18px] h-[18px] rounded-full bg-[#E5D7D8] text-[#4C2325] text-[10px] font-bold flex items-center justify-center">1</span>
          </a>
        </nav>

        <div className="flex items-center gap-[8px] cursor-pointer">
          <div className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full bg-[#EEEEEE] flex items-center justify-center text-[#718096]">
            <FiUser className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-[#4C2325]" />
          </div>
          <span className="text-[13px] sm:text-[14px] text-[#212121] font-[500]">سارة أحمد</span>
          <FiChevronDown className="w-[16px] h-[16px] text-[#718096]" />
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-[1100px] mx-auto pt-[24px] sm:pt-[32px] pb-[60px] px-[16px] sm:px-[24px]">
        {/* زر العودة */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-[6px] text-[#4C2325] text-[14px] font-[500] mb-[20px] hover:opacity-80 transition-all cursor-pointer"
        >
          <FiArrowRight className="w-[16px] h-[16px]" />
          <span>عودة لحجوزاتي</span>
        </button>

        {/* عنوان الصفحة */}
        <h1 className="text-[24px] sm:text-[28px] font-[700] text-[#4C2325] text-center mb-[28px]">
          حجز موعد جديد
        </h1>

        {/* عرض رسالة الخطأ والتنبيه عند نقص أحد البيانات */}
        {errorMessage && (
          <div className="mb-[20px] p-[14px] bg-[#FFF5F5] border border-[#FEB2B2] text-[#C53030] rounded-[12px] flex items-center gap-[10px] text-[14px] font-[600] animate-fade-in">
            <FiAlertCircle className="w-[20px] h-[20px] shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px] items-start">
          
          {/* 1. نموذج إدخال البيانات (اليمين) */}
          <div className="lg:col-span-8 bg-white rounded-[16px] p-[20px] sm:p-[32px] border border-[#E5E7EB] shadow-sm">
            <h2 className="text-[18px] font-[700] text-[#4C2325] mb-[20px] border-r-4 border-[#4C2325] pr-[10px]">
              بيانات الموعد
            </h2>

            <div className="space-y-[20px]">
              
              {/* الخدمات المتاحة */}
              <div>
                <label className="block text-[13px] font-[600] text-[#4C2325] mb-[8px]">
                  الخدمات المتاحة <span className="text-[#E53E3E]">*</span>
                </label>
                <div className="relative">
                  <select 
                    value={selectedService}
                    onChange={(e) => {
                      setSelectedService(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className={`w-full h-[48px] px-[16px] rounded-[10px] border bg-white text-[14px] text-[#212121] focus:outline-none appearance-none cursor-pointer ${
                      !selectedService && errorMessage ? 'border-[#E53E3E]' : 'border-[#E2E8F0] focus:border-[#4C2325]'
                    }`}
                  >
                    <option value="">اضغط لاختيار الخدمة أو التخصص</option>
                    <option value="جلسة ليزر كاملة">جلسة ليزر كاملة</option>
                    <option value="تنظيف بشرة عميق">تنظيف بشرة عميق</option>
                    <option value="استشارة جلدية">استشارة جلدية</option>
                  </select>
                  <FiChevronDown className="absolute left-[16px] top-[16px] text-[#A0AEC0] pointer-events-none" />
                </div>
              </div>

              {/* اختر الطبيب */}
              <div>
                <label className="block text-[13px] font-[600] text-[#4C2325] mb-[8px]">
                  اختر الطبيب <span className="text-[#E53E3E]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-[12px]">
                  {doctorsList.map((doc) => {
                    const isSelected = selectedDoctor?.id === doc.id;
                    return (
                      <div 
                        key={doc.id}
                        onClick={() => {
                          setSelectedDoctor(doc);
                          if (errorMessage) setErrorMessage('');
                        }}
                        className={`p-[12px] rounded-[12px] border text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-[6px] ${
                          isSelected 
                            ? 'border-[#4C2325] bg-[#FDFBF7] ring-1 ring-[#4C2325]' 
                            : !selectedDoctor && errorMessage
                              ? 'border-[#FEB2B2] bg-[#FFF5F5]'
                              : 'border-[#E2E8F0] hover:border-[#CBD5E0]'
                        }`}
                      >
                        <img src={doc.image} alt={doc.name} className="w-[48px] h-[48px] rounded-full object-cover mb-[2px]" />
                        <span className="text-[13px] font-[700] text-[#212121]">{doc.name}</span>
                        <span className="text-[11px] text-[#718096]">{doc.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>


{/* تاريخ الزيارة */}
<div>
  <label className="block text-[13px] font-[600] text-[#4C2325] mb-[8px]">
    تاريخ الزيارة <span className="text-[#E53E3E]">*</span>
  </label>
  <div className="relative">
    <input 
      type="date"
      value={selectedDate}
      onChange={(e) => {
        setSelectedDate(e.target.value);
        setSelectedTime('');
        if (errorMessage) setErrorMessage('');
      }}
      className={`w-full h-[48px] pr-[44px] pl-[16px] rounded-[10px] border bg-white text-[14px] text-[#212121] focus:outline-none cursor-pointer text-right [direction:ltr] [&::-webkit-date-and-time-value]:text-right [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
        !selectedDate && errorMessage ? 'border-[#E53E3E]' : 'border-[#E2E8F0] focus:border-[#4C2325]'
      }`}
    />
    <FiCalendar className="absolute right-[16px] top-[16px] text-[#A0AEC0] pointer-events-none text-[18px]" />
  </div>
</div>

              {/* الوقت المناسب */}
              <div>
                <label className="block text-[13px] font-[600] text-[#4C2325] mb-[8px]">
                  الوقت المناسب <span className="text-[#E53E3E]">*</span>
                </label>

                {!selectedDate ? (
                  <div className="w-full border border-dashed border-[#E2E8F0] bg-[#F8FAFC] rounded-[12px] p-[24px] flex flex-col items-center justify-center text-center gap-[8px]">
                    <FiCalendar className="w-[24px] h-[24px] text-[#A0AEC0]" />
                    <span className="text-[13px] text-[#718096]">
                      الرجاء اختيار التاريخ أولاً لرؤية الأوقات المتاحة
                    </span>
                  </div>
                ) : (
                  <div className="space-y-[12px]">
                    <div className="grid grid-cols-3 gap-[8px] bg-[#F1F5F9] p-[4px] rounded-[10px] text-[12px]">
                      <button 
                        type="button"
                        onClick={() => setPeriod('morning')}
                        className={`py-[6px] rounded-[8px] font-[500] transition-all ${period === 'morning' ? 'bg-white text-[#4C2325] shadow-sm' : 'text-[#64748B]'}`}
                      >
                        ☀️ الصباحية <br/><span className="text-[10px] opacity-75">9:00 ص - 12:00 م</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPeriod('afternoon')}
                        className={`py-[6px] rounded-[8px] font-[500] transition-all ${period === 'afternoon' ? 'bg-white text-[#4C2325] shadow-sm' : 'text-[#64748B]'}`}
                      >
                        🌤️ الظهيرة <br/><span className="text-[10px] opacity-75">12:00 م - 4:00 م</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPeriod('evening')}
                        className={`py-[6px] rounded-[8px] font-[500] transition-all ${period === 'evening' ? 'bg-white text-[#4C2325] shadow-sm' : 'text-[#64748B]'}`}
                      >
                        🌙 المسائية <br/><span className="text-[10px] opacity-75">4:00 م - 9:00 م</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-[10px]">
                      {timeSlots.map((slot, index) => {
                        const isSelected = selectedTime === slot.time;
                        return (
                          <button
                            key={index}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => {
                              setSelectedTime(slot.time);
                              if (errorMessage) setErrorMessage('');
                            }}
                            className={`h-[40px] rounded-[8px] text-[13px] font-[500] transition-all border ${
                              !slot.available 
                                ? 'bg-[#F1F5F9] text-[#94A3B8] border-transparent cursor-not-allowed line-through' 
                                : isSelected 
                                  ? 'bg-[#4C2325] text-white border-[#4C2325]' 
                                  : 'bg-white text-[#4C2325] border-[#E2E8F0] hover:border-[#4C2325]'
                            }`}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* ملاحظات إضافية */}
              <div>
                <label className="block text-[13px] font-[600] text-[#4C2325] mb-[8px]">
                  ملاحظات إضافية (اختياري)
                </label>
                <textarea 
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="هل تريد إخبارنا بشيء قبل الزيارة؟"
                  className="w-full p-[14px] rounded-[10px] border border-[#E2E8F0] bg-white text-[14px] text-[#212121] placeholder-[#A0AEC0] focus:outline-none focus:border-[#4C2325] resize-none"
                />
              </div>

            </div>
          </div>

          {/* 2. ملخص الحجز (اليسار) */}
          <div className="lg:col-span-4 bg-white text-[#212121] rounded-[16px] border border-[#E5E7EB] p-[20px] sm:p-[24px] shadow-sm flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex items-center gap-[8px] border-b border-[#E2E8F0] pb-[12px] mb-[20px]">
                <span className="text-[16px]">📋</span>
                <h2 className="text-[16px] font-[700] text-[#4C2325]">ملخص الحجز</h2>
              </div>

              <div className="space-y-[14px] text-[13px] sm:text-[14px]">
                <div className="flex justify-between items-center">
                  <span className="text-[#718096]">الخدمة المختارة:</span>
                  <span className="font-[600] text-[#212121]">{selectedService || '--'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#718096]">الطبيب:</span>
                  <span className="font-[600] text-[#212121]">{selectedDoctor?.name || '--'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#718096]">تاريخ الموعد:</span>
                  <span className="font-[600] text-[#212121]">{selectedDate || '--/--/----'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#718096]">توقيت الحضور:</span>
                  <span className="font-[600] text-[#212121]">{selectedTime || '--'}</span>
                </div>
              </div>
            </div>

            <div className="mt-[24px] pt-[16px] border-t border-[#E2E8F0]">
              <div className="flex justify-between items-center mb-[16px]">
                <span className="text-[14px] text-[#718096]">رسوم الحجز:</span>
                <span className="text-[18px] font-[700] text-[#4C2325]">50 شيكل</span>
              </div>
              
              {/* زر تقديم طلب الحجز مع استدعاء دالة التحقق handleBookingSubmit */}
              <button 
                type="button"
                onClick={handleBookingSubmit}
                className="w-full h-[48px] bg-[#4C2325] hover:bg-[#381A1B] text-white rounded-[12px] font-[600] text-[14px] transition-all cursor-pointer flex items-center justify-center gap-[8px] shadow-sm active:scale-[0.99]"
              >
                <span>تقديم طلب الحجز</span>
                <span className="text-[16px]">←</span>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}