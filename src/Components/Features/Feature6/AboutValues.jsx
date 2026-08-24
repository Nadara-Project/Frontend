import { FaFlag, FaGem, FaShieldAlt } from "react-icons/fa";
import AboutValueCard from "./AboutValueCard";

const AboutValues = () => {
    const values = [
        {
            title: "رسالتنا",
            description:
                "تقديم رعاية جلدية استثنائية تعتمد على أسس علمية راسخة، مع التركيز على تلبية الاحتياجات الفريدة لكل مراجع لضمان أفضل النتائج.",
            icon: <FaFlag size={18} />,
        },
        {
            title: "قيمنا",
            description:
                "النزاهة، الشفافية، والتطور المستمر. نحن نلتزم بأعلى معايير الجودة والكفاءة لتوفير بيئة آمنة ومريحة وموثوقة لجميع مراجعينا.",
            icon: <FaGem size={18} />,
        },
        {
            title: "تخصصنا",
            description:
                "نضم نخبة واسعة من تخصصات الأمراض الجلدية والعلاجات التجميلية بالليزر، باستخدام أحدث التقنيات العالمية لضمان الدقة والفعالية.",
            icon: <FaShieldAlt size={18} />,
        },
    ];

    return (
        <section
            className="
                mx-auto
                flex
                w-full
                max-w-[1120px]
                flex-col
                gap-[24px]
                sm:gap-[32px]
                lg:flex-row
                lg:gap-[40px]
            "
        >
            {values.map((value) => (
                <AboutValueCard
                    key={value.title}
                    title={value.title}
                    description={value.description}
                    icon={value.icon}
                />
            ))}
        </section>
    );
};

export default AboutValues;