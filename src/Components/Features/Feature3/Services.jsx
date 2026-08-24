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
                w-full
                max-w-[1280px]
                border-t
                border-[#EEEEEE]
                bg-white
                px-4
                py-12
                md:px-6
                md:py-16
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-[1248px]
                    flex-col
                    gap-8
                    md:gap-10
                "
            >
                {/* Header */}
                <div
                    className="
                        flex
                        w-full
                        flex-col
                        items-start
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    {/* Title */}
                    <div className="w-full text-right sm:w-auto">
                        <h2
                            className="
                                font-[Tajawal]
                                text-[24px]
                                font-bold
                                leading-[32px]
                                text-[#39243D]
                                md:text-[30px]
                                md:leading-[36px]
                            "
                        >
                            خدمات مختارة
                        </h2>

                        <p
                            className="
                                mt-2
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
                            shrink-0
                            rounded-[8px]
                            border
                            border-[#4C2325]
                            px-4
                            py-2
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
                        grid
                        w-full
                        grid-cols-1
                        gap-6
                        sm:grid-cols-2
                        lg:grid-cols-3
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
        </section>
    );
};

export default Services;