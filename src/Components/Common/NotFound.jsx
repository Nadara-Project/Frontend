import { Link } from 'react-router-dom';
import Header from '../../Layouts/Header';

/** صفحة 404 بدل التحويل الصامت للرئيسية، حتى يعرف المستخدم أن الرابط خاطئ. */
const NotFound = () => (
  <div className="min-h-screen bg-[#F8F9FA] font-['Tajawal']" dir="rtl">
    <Header />
    <main className="mx-auto flex max-w-[520px] flex-col items-center gap-[12px] px-[16px] py-[96px] text-center">
      <span className="text-[72px] font-[800] leading-none text-[#D5C7AD]" dir="ltr">
        404
      </span>
      <h1 className="text-[24px] font-[700] text-[#4C2325]">الصفحة غير موجودة</h1>
      <p className="text-[15px] leading-[24px] text-[#6B5E5F]">الرابط الذي فتحته غير صحيح أو أن الصفحة نُقلت.</p>
      <div className="mt-[12px] flex flex-wrap justify-center gap-[10px]">
        <Link to="/" className="inline-flex h-[44px] items-center rounded-[10px] bg-[#4C2325] px-[20px] text-[14px] font-[600] text-white hover:bg-[#381A1B]">
          الصفحة الرئيسية
        </Link>
        <Link to="/services" className="inline-flex h-[44px] items-center rounded-[10px] border border-[#4C2325] px-[20px] text-[14px] font-[600] text-[#4C2325] hover:bg-[#4C2325]/5">
          تصفّح الخدمات
        </Link>
      </div>
    </main>
  </div>
);

export default NotFound;
