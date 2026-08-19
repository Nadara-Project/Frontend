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
            h-[441.4px]
            w-[1280px]
            border-t
            border-b
            border-[#EEEEEE]
            bg-white
            px-[16px]
            pt-[64px]
            pb-[64px]
            "
        >
            {/* Heading */}
            <div className="mb-[48px]
                            h-[68px]
                            w-[1248px]
                            text-center
">
                <h2
                    className="
                       w-[1248px]
                       h-[36px]
                       font-[Tajawal]
                       text-[30px]
                       font-bold
                       leading-[36px]
                       tracking-[0px]
                       text-center
                       align-middle
                       text-[#4C2325];
]
                    "
                >
                    لماذا نظارة؟
                </h2>

                <p
                    className="
                        mt-[8px]
                        w-[1248px]
                        h-[24px]
                        font-[Tajawal]
                        text-[16px]
                        font-normal
                        leading-[24px]
                        tracking-[0px]
                        text-center
                        align-middle
                        text-[#4C2325]
                    "
                >
                    صممنا كل خطوة لتقليل التنقل والانتظار والحفاظ على سجلك الطبي بأمان.
                </p>
            </div>

            {/* Cards Container */}
            <div
                className="
                   mx-auto
                   flex
                    h-[195.4px]
                    w-[1248px]
                    gap-[24px]
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