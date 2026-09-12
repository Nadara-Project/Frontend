import { FaPhone, FaLocationDot, FaClock, FaStarOfLife } from 'react-icons/fa6';
import Header from '../../../Layouts/Header';

import Footer from '../../../Layouts/Footer';


const ContactUs = () => {
  return (
    <>
    <Header />
    <section 
      className="w-full bg-[#FAF9F6] pt-[40px] pb-[64px] px-[24px]" 
      dir="rtl"
      style={{ fontFamily: "'Tajawal', sans-serif" }}
    >
      <div className="max-w-[1232px] mx-auto">
        
        {/* Top Header Section */}
        <div className="w-full text-center max-w-[672px] mx-auto mb-[64px] flex flex-col items-center justify-center">
          {/* Main Title: 48px - Bold (700) - Line Height 56px - Spacing -0.96px */}
          <h1 className="text-[48px] font-bold leading-[56px] tracking-[-0.96px] text-[#4C2325] mb-4">
            تواصل معنا
          </h1>
          {/* Subtitle Text */}
          <p className="text-[18px] font-normal leading-[28px] text-[#4C2325]">
            نحن هنا للإجابة على استفساراتكم وتقديم الدعم اللازم. لا تترددوا في التواصل معنا عبر النموذج أدناه أو باستخدام معلومات الاتصال المباشرة.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row-reverse gap-8 items-start justify-between">
          
          {/* Form Card (Left Side - 584px Width) */}
          <div className="w-full lg:w-[584px] h-[815px] shrink-0 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-[20px] font-bold leading-[28px] text-[#4C2325] mb-6">
                أرسل لنا رسالة
              </h2>
              
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-[14px] font-medium leading-[20px] text-[#4C2325] mb-2">
                    الاسم الكامل
                  </label>
                  <input 
                    type="text" 
                    placeholder="أدخل اسمك" 
                    className="w-full px-4 py-3.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4C2325]/20 focus:border-[#4C2325] text-[16px] bg-gray-50/30 text-[#4C2325]"
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-medium leading-[20px] text-[#4C2325] mb-2">
                    البريد الإلكتروني
                  </label>
                  <input 
                    type="email" 
                    placeholder="example@domain.com" 
                    className="w-full px-4 py-3.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4C2325]/20 focus:border-[#4C2325] text-[16px] text-left placeholder:text-left bg-gray-50/30 text-[#4C2325]"
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-medium leading-[20px] text-[#4C2325] mb-2">
                    الموضوع (اختياري)
                  </label>
                  <select className="w-full px-4 py-3.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4C2325]/20 focus:border-[#4C2325] text-[16px] text-gray-500 bg-gray-50/30">
                    <option value="">اختر موضوع الرسالة</option>
                    <option value="inquiry">استفسار عام</option>
                    <option value="support">دعم فني</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[14px] font-medium leading-[20px] text-[#4C2325] mb-2">
                    نص الرسالة
                  </label>
                  <textarea 
                    rows="6" 
                    placeholder="تفضل بكتابة رسالتك هنا..." 
                    className="w-full px-4 py-3.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4C2325]/20 focus:border-[#4C2325] text-[16px] resize-none bg-gray-50/30 text-[#4C2325]"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#4C2325] hover:bg-[#381a1b] text-white py-4 rounded-lg font-medium transition duration-200 text-[16px] shadow-sm mt-4"
                >
                  إرسال الرسالة
                </button>
              </form>
            </div>
          </div>

          {/* Info Card Side (Right Side) */}
          <div className="w-full flex-1 space-y-6">
            
            {/* Emergency Hotline Box */}
            <div className="w-full h-[144px] bg-white  p-6 rounded-2xl border border-[#4C2325]/10 flex items-start justify-start gap-4">
              {/* Icon Container: 41.3px x 48px */}
              <div className="w-[41.3px] h-[48px] shrink-0 bg-[#E3D8D3] rounded-xl flex items-center justify-center">
                {/* Icon: 17.3px x 18px */}
                <FaStarOfLife className="w-[17.3px] h-[18px] text-[#4C2325]" />
              </div>

              {/* Text Content */}
              <div className="flex flex-col text-right">
                {/* 24px - Medium (500) - Line Height 32px */}
                <h3 className="text-[24px] font-medium leading-[32px] text-[#4C2325]">
                  الخط الساخن للطوارئ
                </h3>
                <p className="text-[14px] font-normal leading-[20px] text-gray-600 mt-1">
                  الحالات الطبية المستعجلة خارج أوقات العمل الرسمية.
                </p>
                <p className="text-[20px] font-bold text-[#4C2325] dir-ltr text-right mt-2">
                  +970 555 123 456
                </p>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-6 shadow-sm">
              <h3 className="text-[20px] font-bold text-[#4C2325] border-b border-gray-100 pb-3">
                معلومات التواصل
              </h3>
              
              <div className="space-y-5">
                {/* Main Address */}
                <div className="flex items-start gap-3.5">
                  <FaLocationDot className="text-[#4C2325] shrink-0 mt-1 text-lg" />
                  <div>
                    {/* Subtitle: 16px - Bold (700) - Line Height 24px */}
                    <h4 className="text-[16px] font-bold leading-[24px] text-[#4C2325]">
                      العنوان الرئيسي
                    </h4>
                    {/* Text: 16px - Regular (400) - Line Height 24px */}
                    <p className="text-[16px] font-normal leading-[24px] text-[#4C2325] mt-1">
                      شارع عمر المختار، برج فلسطين، الدور الثالث، حي الرمال، غزة، فلسطين.
                    </p>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-start gap-3.5">
                  <FaPhone className="text-[#4C2325] shrink-0 mt-1 text-base" />
                  <div>
                    <h4 className="text-[16px] font-bold leading-[24px] text-[#4C2325]">
                      رقم الهاتف
                    </h4>
                    <p className="text-[16px] font-normal leading-[24px] text-[#4C2325] mt-1 dir-ltr text-right">
                      +970 11 234 5678
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3.5">
                  <FaClock className="text-[#4C2325] shrink-0 mt-1 text-base" />
                  <div>
                    <h4 className="text-[16px] font-bold leading-[24px] text-[#4C2325]">
                      ساعات العمل
                    </h4>
                    <p className="text-[16px] font-normal leading-[24px] text-[#4C2325] mt-1">
                      السبت - الخميس: 9:00 صباحاً - 9:00 مساءً
                    </p>
                    <p className="text-[14px] font-normal text-gray-500 mt-0.5">
                      الجمعة: مغلق
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="w-full h-[256px] bg-white p-2 rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <iframe
                title="Location Map"
                src="https://maps.google.com/maps?q=Gaza&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full rounded-xl border-0 filter grayscale-[20%]"
                loading="lazy"
              ></iframe>
            </div>

          </div>

        </div>
      </div>
    </section>
    <Footer />
    </>
  );
};

export default ContactUs;