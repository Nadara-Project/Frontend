import { useState } from 'react';
import { FiSearch, FiClock, FiArrowLeft } from 'react-icons/fi';
import Header from '../../../Layouts/Header';
import Footer from '../../../Layouts/Footer';

const ServicesPage = () => {
  const [activeFilter, setActiveFilter] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['الكل', 'تشخيصية', 'علاجية', 'تجميلية', 'ليزر'];

  const services = [
    {
      id: 1,
      title: 'استشارة طبيب جلدية',
      category: 'تشخيصية',
      description: 'فحص شامل للجلد والشعر والأظافر لتشخيص الحالات ووضع خطة علاجية مخصصة.',
      price: '50 شيكل',
      duration: '30 دقيقة',
      image: '/استشارة طبيب جلدية.jpg'
    },
    {
      id: 2,
      title: 'ليزر فراكشنال للندبات',
      category: 'ليزر',
      description: 'جلسة ليزر متقدمة لتحفيز الكولاجين وعلاج ندبات حب الشباب وتجديد سطح البشرة.',
      price: '100 شيكل',
      duration: '45 دقيقة',
      image: '/ليزر.jpg'
    },
    {
      id: 3,
      title: 'جلسة نضارة عميقة (ميزوثرابي)',
      category: 'تجميلية',
      description: 'حقن فيتامينات ومعادن مخصصة لتغذية البشرة وإعادة النضارة والإشراق الفوري.',
      price: '250 شيكل',
      duration: '60 دقيقة',
      image: '/تجميلية.jpg'
    },
    {
      id: 4,
      title: 'تقشير كيميائي طبي',
      category: 'علاجية',
      description: 'علاج فعال للتصبغات وآثار الحبوب باستخدام أحماض طبية آمنة بإشراف طبي.',
      price: '250 شيكل',
      duration: '45 دقيقة',
      image: '/علاجية.jpg'
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesCategory = activeFilter === 'الكل' || service.category === activeFilter;
    const matchesSearch = service.title.includes(searchQuery) || service.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <>
    <div className="min-h-screen bg-[#FDFBF9]  px-4 sm:px-6 lg:px-8 font-['Tajawal']" dir="rtl">
      
      <Header />
      <div className=" py 10 max-w-[1120px] mx-auto space-y-8">
        
    {/* قسم العنوان والوصف */}
<div className="pt-[64px] text-right max-w-[768px] flex flex-col gap-[11.4px]">
  <h1 className="text-[48px] font-bold text-[#4C2325] leading-[57.6px] tracking-[-0.96px]">
    خدمات الجلدية والعناية بالبشرة
  </h1>

  <p className="text-[18px] font-normal text-[#4C2325] leading-[28.8px] tracking-normal max-w-[720.59px]">
    نقدم لكم مجموعة واسعة من الخدمات الطبية والتجميلية المتقدمة باستخدام أحدث التقنيات لضمان أفضل النتائج لبشرتكم. اكتشف خدماتنا المصممة خصيصاً لتلبية احتياجاتك.
  </p>
</div>

{/* حاوية البحث والفلاتر الخارجية (Filters Section) */}
<div className="w-full max-w-[1120px] h-auto md:h-[76px] bg-white border border-[#D5C7AD]/20 rounded-[16px] p-[12px] flex flex-col-reverse md:flex-row items-center justify-between gap-4 mt-8 mx-auto">

  {/* 1. أزرار الفلترة (على اليمين) */}
  <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
    {categories.map((category) => {
      const isActive = activeFilter === category;
      return (
        <button
          key={category}
          onClick={() => setActiveFilter(category)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            isActive
              ? 'bg-[#4C2325] text-white'
              : 'bg-[#F5F2EE] text-[#6B5E5F] hover:bg-[#EAE4DC]'
          }`}
        >
          {category}
        </button>
      );
    })}
  </div>

  {/* 2. حقل البحث (على اليسار بعرض 320px وارتفاع 50px) */}
  <div className="relative w-full md:w-[320px] h-[50px]">
    <input
      type="text"
      placeholder="ابحث عن خدمة..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full h-full bg-white border border-[#D5C7AD]/50 rounded-full pt-[15px] pb-[14px] px-[48px] text-sm text-right text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4C2325]"
    />
    
    <div className="absolute right-[16px] top-1/2 -translate-y-1/2 w-[18px] h-[24px] flex items-center justify-center text-[#4C2325] pointer-events-none">
      <FiSearch className="w-[18px] h-[18px]" />
    </div>
  </div>

</div>

      {/* شبكة الكروت (Services Grid) */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
  {filteredServices.map((service) => (
    <div 
      key={service.id} 
      className="w-full h-[515.16px] bg-white rounded-[16px] overflow-hidden border border-[#D5C7AD]/20 shadow-sm flex flex-col justify-between"
    >
      {/* 1. الجزء العلوي: الصورة + البادج */}
      <div className="relative h-[192px] w-full bg-gray-100 flex-shrink-0">
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover"
        />
        {service.category && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs text-[#4C2325] px-3 py-1 rounded-full font-medium">
            {service.category}
          </span>
        )}
      </div>

      {/* 2. محتوى الكرت النصي والسفلي */}
      <div className="px-[24px] pt-[23px] pb-[24px] flex-1 flex flex-col justify-between text-right">
        {/* التفاصيل النصية */}
        <div>
          <h3 className="text-[24px] font-medium text-[#4C2325] leading-[33.6px] mb-[12px]">
            {service.title}
          </h3>
          <p className="text-[16px] font-normal text-[#4C2325] leading-[24px] line-clamp-2">
            {service.description}
          </p>
        </div>

        {/* الجزء السفلي: السعر، الوقت، والزر */}
        <div className="pt-[16px] border-t border-[#EEEEEE] flex flex-col gap-[16px]">
          {/* تم تعديل الترتيب هنا لتسهيل ضمهما مع نظام RTL */}
          <div className="flex items-center justify-between flex-row-reverse">
            {/* بادج الوقت (سيكون على اليسار) */}
            <div className="flex items-center gap-[4px] px-[12px] py-[4px] bg-[#D5C7AD33] border border-[#D5C7AD]/20 rounded-[8px] shadow-sm">
              <FiClock className="w-[15px] h-[15px] text-[#4C2325]" />
              <span className="text-[12px] font-medium leading-[14.4px] text-[#4C2325]">
                {service.duration}
              </span>
            </div>

            {/* السعر (سيكون على اليمين) */}
            <div className="text-right flex flex-col justify-center">
              <span className="text-[12px] font-normal text-[#6B5E5F] leading-none mb-1">
                السعر يبدأ من
              </span>
              <span className="text-[24px] font-bold text-[#4C2325] leading-[33.6px]">
                {service.price}
              </span>
            </div>
          </div>

          {/* زر حجز الموعد */}
          <button className="w-full h-[48px] bg-[#4C2325] hover:bg-[#381a1b] text-white text-[14px] font-medium rounded-full transition-colors flex items-center justify-center gap-2">
            <span>حجز موعد</span>
            <FiArrowLeft className="text-base" />
          </button>
        </div>
      </div>

    </div>
  ))}
  
</div>
{/* شريط ترقيم الصفحات (Pagination) */}
<div className="w-full max-w-[1120px] mx-auto h-[64px] mt-[104px] flex items-center justify-center">
  <div className="flex items-center gap-[8px] dir-rtl">
    
    {/* زر الصفحة السابقة (الأيمن في RTL) */}
    <button className="w-[40px] h-[40px] flex items-center justify-center text-[#212121] hover:bg-gray-100 rounded-full transition-colors">
      <span className="text-[18px]">&lt;</span>
    </button>

    {/* الرقم 1 (نشط) */}
    <button className="w-[40px] h-[40px] flex items-center justify-center bg-[#EBE7E1] text-[#212121] text-[16px] font-normal leading-[24px] rounded-full">
      1
    </button>

    {/* الرقم 2 */}
    <button className="w-[40px] h-[40px] flex items-center justify-center text-[#212121] text-[16px] font-normal leading-[24px] hover:bg-gray-100 rounded-full transition-colors">
      2
    </button>

    {/* الرقم 3 */}
    <button className="w-[40px] h-[40px] flex items-center justify-center text-[#212121] text-[16px] font-normal leading-[24px] hover:bg-gray-100 rounded-full transition-colors">
      3
    </button>

    {/* زر الصفحة التالية (الأيسر في RTL) */}
    <button className="w-[40px] h-[40px] flex items-center justify-center text-[#212121] hover:bg-gray-100 rounded-full transition-colors">
      <span className="text-[18px]">&gt;</span>
    </button>

  </div>
</div>
      </div>
    </div>
  
    <Footer/>
    </>  
  );
};

export default ServicesPage;