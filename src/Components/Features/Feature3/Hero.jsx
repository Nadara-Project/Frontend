import HeroContent from "./HeroContent";
import HeroStats from "./HeroStats";
import { FaRegHospital, FaRegClock } from "react-icons/fa";

const Hero = () => {
    return (
        <section
            dir="rtl"
            className="
                 mx-auto
                 flex
                 w-full
                 max-w-[1248px]
                 h-[566px]
                 items-start
                 gap-[48px]
                 pb-[96px]
                 opacity-100
            "
        >
            {/* right Side - content */}
            <div
                className="
                    flex
                    w-[600px]
                    h-[470px]
                    shrink-0
                    flex-col
                    gap-[24px]
                    opacity-100
                    "
            >

                {/* Small Clinic Info */}
                <div
                    className="
                        flex
                        w-[233px]
                        h-[28px]
                        items-center
                        gap-[8px]
                        rounded-[9999px]
                        bg-[#D5C7AD33]
                        px-[12px]
                        py-[4px]
    "
                >
                    <FaRegHospital
                        className="
                          w-[20px]
                          h-[20px]
                          shrink-0
                          text-[#4C2325]
        "
                    />

                    <span
                        className="
                           whitespace-nowrap
                           font-[Tajawal]
                           text-[14px]
                           font-medium
                           leading-[20px]
                           text-right
                           text-[#4C2325]
        "
                    >
                        عيادة جلدية وعناية بالبشرة - غزة
                    </span>
                </div>

                {/* Main Hero Content */}
                <HeroContent />

                {/* Hero Statistics */}
                <HeroStats />
            </div>

            {/* Left Side - Image */}
            <div
                className="
                          flex
                          w-[600px]
                          h-[450.5px]
                          justify-start
                          opacity-100
    "
            >
                <div
                    className="
                           relative
                           w-[600px]
                           h-[450.5px]
                           overflow-hidden
                           rounded-[24px]
        "
                >
                    <img
                        src="/interface.jpg"
                        alt="عيادة نظارة"
                        className="
                                 h-full
                                 w-full
                                 object-cover
            "
                    />



                    {/* Waiting Time Badge */}
                    <div
                        className="
                                absolute
                                bottom-[24px]
                                right-[24px]
                                flex
                                items-center
                                gap-[8px]
                                rounded-full
                                bg-white
                                px-[16px]
                                py-[10px]
                                font-[Tajawal]
                                text-[14px]
                                font-bold
                                text-[#4C2325]
                                shadow-md
                            "
                    >
                        <FaRegClock className="text-[16px]" />

                        <span>
                            متوسط الانتظار أقل من 10 دقائق
                        </span>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default Hero;