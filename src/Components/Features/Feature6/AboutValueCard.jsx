const AboutValueCard = ({ icon, title, description }) => {
    return (
        <div
            className="
                flex
                w-full
                min-h-[299px]
                flex-1
                flex-col
                items-start
                gap-[20px]
                rounded-[12px]
                border
                border-[#D5C7AD33]
                bg-white
                p-[24px]
                shadow-[0px_4px_20px_0px_#0000000D]
                sm:p-[32px]
                lg:p-[40px]
            "
        >
            {/* Icon */}
            <div
                className="
                    flex
                    h-[56px]
                    w-[56px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#D5C7AD80]
                    text-[#4C2325]
                "
            >
                {icon}
            </div>

            {/* Content */}
            <div className="flex w-full flex-col gap-[8px]">
                <h3
                    className="
                        w-full
                        font-[Tajawal]
                        text-[22px]
                        font-bold
                        leading-[33.6px]
                        text-right
                        text-[#4C2325]
                        sm:text-[24px]
                    "
                >
                    {title}
                </h3>

                <p
                    className="
                        w-full
                        font-[Tajawal]
                        text-[14px]
                        font-normal
                        leading-[24px]
                        text-right
                        text-[#4C2325]
                        sm:text-[16px]
                    "
                >
                    {description}
                </p>
            </div>
        </div>
    );
};

export default AboutValueCard;