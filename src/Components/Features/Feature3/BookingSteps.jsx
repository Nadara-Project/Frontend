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
            title: "ارفع إيصال الدفع",
            description: "حوّل المبلغ وارفع الإيصال خلال 30 دقيقة.",
        },
        {
            number: "٤",
            title: "تابع حالتك",
            description: "تأكيد الموعد وردود الطبيب في لوحتك.",
        },
    ];

    return (
        <section
            dir="rtl"
            className="
                mx-auto
                w-full
                bg-[#D5C7AD1A]
                px-4
                py-16
            "
        >
            <div
                className="
                    mx-auto
                    w-full
                    max-w-[1248px]
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

                        max-sm:text-[24px]
                        max-sm:leading-[32px]
                    "
                >
                    كيف تحجز في ٤ خطوات
                </h2>

                {/* Cards Container */}
                <div
                    className="
                        mx-auto
                        flex
                        w-full
                        flex-wrap
                        justify-center
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