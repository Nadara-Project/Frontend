import ServiceCard from "./ServiceCard";

const Services = () => {
    const services = [
        {
            category: "تشخيص",
            title: "فحص جلدي شامل",
            description:
                "تقييم كامل لحالة الجلد مع خطة عناية مدنية يضعها طبيب الجلدية.",
            duration: "30 دقيقة",
            price: "50 ₪",
        },
        {
            category: "علاجي",
            title: "علاج حب الشباب",
            description:
                "بروتوكول علاجي متدرج لحب الشباب والآثار الناتجة عنه مع متابعة دورية.",
            duration: "45 دقيقة",
            price: "70 ₪",
        },
        {
            category: "تجميلي",
            title: "جلسة ليزر",
            description:
                "جلسات ليزر آمنة لإزالة الشعر أو معالجة التصبغات حسب نوع البشرة.",
            duration: "60 دقيقة",
            price: "120 ₪",
        },
    ];

    return (

        <section
            dir="rtl"
            className="
               mx-auto
               w-[1280px]
               h-[448px]
               px-[16px]
               pt-[64px]
               pb-[64px]
               border-t
               border-[#EEEEEE]
               bg-white
            "
        >
            <div className="mx-auto
                            w-[1248px]
                            h-[319px]
                            max-w-[1280px]
                            flex
                            flex-col
                            gap-[40px]">
                {/* Header */}
                <div
                    className="
                   
                    flex
                    w-full
                    items-start
                    justify-between
                "
                >
                    {/* Title */}
                    <div className="text-right">
                        <h2
                            className="
                            font-[Tajawal]
                            text-[30px]
                            font-bold
                            leading-[36px]
                            text-[#39243D]
                        "
                        >
                            خدمات مختارة
                        </h2>

                        <p
                            className="
                            mt-[8px]
                            font-[Tajawal]
                            text-[14px]
                            font-normal
                            leading-[20px]
                            text-[#39243D]
                        "
                        >
                            الأسعار والمدد يحددها فريق العيادة بشكل مستمر.
                        </p>
                    </div>

                    {/* All Services Button */}
                    <button
                        className="
                        rounded-[8px]
                        border
                        border-[#4C2325]
                        px-[16px]
                        py-[8px]
                        font-[Tajawal]
                        text-[14px]
                        font-bold
                        leading-[20px]
                        text-[#4C2325]
                    "
                    >
                        كل الخدمات
                    </button>
                </div>

                {/* Services Cards */}
                <div
                    className="
                    
                    flex
                    w-full
                    gap-[24px]
                "
                >
                    {services.map((service) => (
                        <ServiceCard
                            key={service.title}
                            category={service.category}
                            title={service.title}
                            description={service.description}
                            duration={service.duration}
                            price={service.price}
                        />
                    ))}
                </div>
            </div>
        </section >

    );
};

export default Services;