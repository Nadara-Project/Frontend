const WhyNadaraCard = ({ icon: Icon, title, description }) => {
    return (
        <div
            dir="rtl"
            className="
                flex
                h-[162px]
                w-[294px]
                flex-col
                items-center
                gap-[8px]
                rounded-[16px]
                border
                border-[#D5C7AD33]
                bg-white
                p-[24px]
                shadow-[0px_1px_2px_0px_#0000000D]
            "
        >
            {/* Icon */}
            <div
                className="
                    flex
                    h-[40px]
                    w-[40px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#D5C7AD]
                    text-[#4C2325]
                "
            >
                <Icon className="h-[18px] w-[18px]" />
            </div>

            {/* Title */}
            <h3
                className="
                    h-[28px]
                    w-[244px]
                    font-[Tajawal]
                    text-[18px]
                    font-bold
                    leading-[28px]
                    text-center
                    text-[#4C2325]
                "
            >
                {title}
            </h3>

            {/* Description */}
            <div
                className="
                    h-[40px]
                    w-[244px]
                "
            >
                <p
                    className="
                        mx-auto
                        w-[244px]
                        font-[Tajawal]
                        text-[14px]
                        font-normal
                        leading-[20px]
                        text-center
                        text-[#4C2325]
                    "
                >
                    {description}
                </p>
            </div>
        </div>
    );
};

export default WhyNadaraCard;