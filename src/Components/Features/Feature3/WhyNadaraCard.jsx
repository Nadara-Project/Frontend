const WhyNadaraCard = ({ icon: Icon, title, description }) => {
    return (
        <div
            dir="rtl"
            className="
                flex
                w-full
                min-h-[162px]
                flex-col
                items-center
                gap-2
                rounded-[16px]
                border
                border-[#D5C7AD33]
                bg-white
                p-6
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
                    w-full
                    font-[Tajawal]
                    text-[16px]
                    font-bold
                    leading-[24px]
                    text-center
                    text-[#4C2325]
                    md:text-[18px]
                    md:leading-[28px]
                "
            >
                {title}
            </h3>

            {/* Description */}
            <p
                className="
                    w-full
                    font-[Tajawal]
                    text-[13px]
                    font-normal
                    leading-[20px]
                    text-center
                    text-[#4C2325]
                    md:text-[14px]
                "
            >
                {description}
            </p>
        </div>
    );
};

export default WhyNadaraCard;