import WhyNadaraCard from "./WhyNadaraCard";

import {
    FaCalendarCheck,
    FaCreditCard,
    FaComments,
    FaShieldAlt,
} from "react-icons/fa";

const WhyNadara = () => {
    const features = [
        {
            icon: FaCalendarCheck,
            title: "حجز مؤكد 24/7",
            description:
                "اختر الخدمة والموعد المتاح واحصل على تأكيد من إدارة العيادة دون اتصالات هاتفية.",
        },
        {
            icon: FaCreditCard,
            title: "دفع إلكتروني آمن",
            description:
                "ادفع قيمة الجلسة أو الاستشارة إلكترونيًا واحفظ إيصالك الرقمي في حسابك.",
        },
        {
            icon: FaComments,
            title: "استشارة جلدية عن بُعد",
            description:
                "أرسل استفسارك عن بشرتك واحصل على رد موثق من طبيب الجلدية داخل حسابك.",
        },
        {
            icon: FaShieldAlt,
            title: "سجل طبي محفوظ",
            description:
                "ملاحظات الطبيب وخطط العلاج مخزنة رقميًا، لا خوف من فقدان الملفات الورقية.",
        },
    ];

    return (
        <section
            dir="rtl"
            className="
                box-border
                mx-auto
                w-full
                max-w-[1280px]
                border-t
                border-b
                border-[#EEEEEE]
                bg-white
                px-4
                py-12
                md:px-6
                md:py-16
            "
        >
            {/* Heading */}
            <div
                className="
                    mx-auto
                    mb-10
                    w-full
                    max-w-[1248px]
                    text-center
                    md:mb-12
                "
            >
                <h2
                    className="
                        font-[Tajawal]
                        text-[24px]
                        font-bold
                        leading-[32px]
                        text-center
                        text-[#4C2325]
                        md:text-[30px]
                        md:leading-[36px]
                    "
                >
                    لماذا نظارة؟
                </h2>

                <p
                    className="
                        mt-2
                        w-full
                        font-[Tajawal]
                        text-[14px]
                        font-normal
                        leading-[22px]
                        text-center
                        text-[#4C2325]
                        md:text-[16px]
                        md:leading-[24px]
                    "
                >
                    صممنا كل خطوة لتقليل التنقل والانتظار والحفاظ على سجلك الطبي بأمان.
                </p>
            </div>

            {/* Cards Container */}
            <div
                className="
                    mx-auto
                    grid
                    w-full
                    max-w-[1248px]
                    grid-cols-1
                    gap-6
                    sm:grid-cols-2
                    lg:grid-cols-4
                "
            >
                {features.map((feature) => (
                    <WhyNadaraCard
                        key={feature.title}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </div>
        </section>
    );
};

export default WhyNadara;