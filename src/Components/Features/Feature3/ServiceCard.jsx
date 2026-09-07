const ServiceCard = ({
    category,
    title,
    description,
    duration,
    price,
}) => {
    return (
        <div
            dir="rtl"
            className="
                flex
                w-full
                max-w-[400px]
                min-h-[211px]
                mx-auto
                flex-col
                gap-4
                rounded-[16px]
                border
                border-[#D5C7AD33]
                bg-[#D5C7AD1A]
                p-6
            "
        >
            {/* Top */}
            <div
                className="
                    flex
                    w-full
                    min-h-[28px]
                    items-center
                    justify-between
                    gap-3
                "
            >
                {/* Title */}
                <h3
                    className="
                        min-w-0
                        font-[Tajawal]
                        text-[18px]
                        font-bold
                        leading-[28px]
                        text-right
                        text-[#4C2325]
                        md:text-[20px]
                    "
                >
                    {title}
                </h3>

                {/* Category */}
                <span
                    className="
                        shrink-0
                        rounded-[4px]
                        bg-[#D5C7AD80]
                        px-2
                        py-1
                        font-[Tajawal]
                        text-[12px]
                        font-bold
                        leading-[16px]
                        text-right
                        text-[#4C2325]
                    "
                >
                    {category}
                </span>
            </div>

            {/* Description */}
            <div className="w-full">
                <p
                    className="
                        w-full
                        font-[Tajawal]
                        text-[14px]
                        font-normal
                        leading-[20px]
                        text-right
                        text-[#4C2325]
                    "
                >
                    {description}
                </p>
            </div>

            {/* Bottom */}
            <div
                className="
                    mt-auto
                    flex
                    min-h-[45px]
                    w-full
                    items-center
                    justify-between
                    border-t
                    border-[#EEEEEE]
                    pt-4
                "
            >
                {/* Duration */}
                <div
                    className="
                        flex
                        items-center
                        gap-[6px]
                        font-[Tajawal]
                        text-[14px]
                        font-normal
                        leading-[20px]
                        text-[#39243D]
                    "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="9" />
                        <polyline points="12 7 12 12 15 14" />
                    </svg>

                    <span>{duration}</span>
                </div>

                {/* Price */}
                <span
                    dir="ltr"
                    className="
                        font-[Tajawal]
                        text-[15px]
                        font-bold
                        leading-[24px]
                        text-[#39243D]
                        md:text-[16px]
                    "
                >
                    {price}
                </span>
            </div>
        </div>
    );
};

export default ServiceCard;