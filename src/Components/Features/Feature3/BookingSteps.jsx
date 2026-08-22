import BookingStepCard from "./BookingStepCard";

const BookingSteps = () => {
    const steps = [
        {
            number: "١",
            title: "أنشئ حسابك",
            description: "تسجيل سريع ببيانات أساسية فقط.",
        },
        {
            number: "٢",
            title: "اختر الخدمة والموعد",
            description: "المواعيد المحجوزة تظهر غير متاحة تلقائيًا.",
        },
        {
            number: "٣",
            title: "أكمل الدفع",
            description: "دفع إلكتروني فوري مع رقم عملية.",
        },
        {
            number: "٤",
            title: "تابع حالتك",
            description: "تأكيد الموعد وردود الطبيب في لوحتك.",
        },
    ];

    return (
        <section dir="rtl" className="mx-auto
        w-[1280px]
        h-[374px]
        px-[16px]
        pt-[64px]
        pb-[64px]
        bg-[#D5C7AD1A]
    
">
            <div
                className="
                     mx-auto
                     h-[246px]
                     w-[1248px]
                     max-w-[1280px]
                     gap-[48px]
    "
            >
                {/* Heading */}

                <h2
                    className="
                    mb-[40px]
                    text-center
                    font-[Tajawal]
                    text-[30px]
                    font-bold
                    leading-[36px]
                    text-[#39243D]
                "
                >
                    كيف تحجز في ٤ خطوات
                </h2>

                {/* Cards Container */}
                <div
                    className="
                    mx-auto
                    flex
                    h-[162px]
                    w-[1248px]
                    gap-[24px]
                "
                >
                    {steps.map((step) => (
                        <BookingStepCard
                            key={step.number}
                            number={step.number}
                            title={step.title}
                            description={step.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BookingSteps;