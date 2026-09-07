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
                flex-col
                gap-8
                px-4
                pb-12
                sm:px-6
                lg:flex-row
                lg:items-start
                lg:gap-12
                lg:px-0
                lg:pb-24
            "
        >
            {/* Right Side - Content */}
            <div
                className="
                    flex
                    w-full
                    flex-col
                    gap-5
                    lg:w-[600px]
                    lg:shrink-0
                    lg:gap-6
                "
            >
                {/* Small Clinic Info */}
                <div
                    className="
                        flex
                        w-fit
                        max-w-full
                        items-center
                        gap-2
                        rounded-full
                        bg-[#D5C7AD33]
                        px-3
                        py-1
                    "
                >
                    <FaRegHospital
                        className="
                            h-5
                            w-5
                            shrink-0
                            text-[#4C2325]
                        "
                    />

                    <span
                        className="
                            font-[Tajawal]
                            text-[13px]
                            font-medium
                            leading-5
                            text-right
                            text-[#4C2325]
                            sm:text-[14px]
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
                    w-full
                    lg:w-[600px]
                    lg:shrink-0
                "
            >
                <div
                    className="
                        relative
                        w-full
                        overflow-hidden
                        rounded-[20px]
                        sm:rounded-[24px]
                        lg:h-[450.5px]
                    "
                >
                    <img
                        src="/interface.jpg"
                        alt="عيادة نظارة"
                        className="
                            aspect-[4/3]
                            h-auto
                            w-full
                            object-cover
                            lg:aspect-auto
                            lg:h-full
                        "
                    />

                    {/* Waiting Time Badge */}
                    <div
                        className="
                            absolute
                            bottom-3
                            right-3
                            flex
                            max-w-[calc(100%-24px)]
                            items-center
                            gap-2
                            rounded-full
                            bg-white
                            px-3
                            py-2
                            font-[Tajawal]
                            text-[12px]
                            font-bold
                            text-[#4C2325]
                            shadow-md
                            sm:bottom-6
                            sm:right-6
                            sm:px-4
                            sm:py-[10px]
                            sm:text-[14px]
                        "
                    >
                        <FaRegClock className="h-4 w-4 shrink-0" />

                        <span>
                            متوسط الانتظار أقل من 10 دقائق
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;