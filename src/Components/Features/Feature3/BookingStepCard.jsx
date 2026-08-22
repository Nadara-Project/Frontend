const BookingStepCard = ({ number, title, description }) => {
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
            {/* Number */}
            <div
                className="
                    flex
                    h-[40px]
                    w-[40px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#4C2325]
                    font-[Tajawal]
                    text-[16px]
                    font-bold
                    leading-[24px]
                    text-white
                "
            >
                {number}
            </div>

            {/* Title */}
            <h3
                className="
                   h-[36px]
                    w-[244px]
                    pt-[8px]
                    font-[Tajawal]
                    text-[18px]
                    font-bold
                    leading-[28px]
                    tracking-[0px]
                    text-center
                    text-[#4C2325]
                "
            >
                {title}
            </h3>

            <div
                className="
                    h-[20px]
                    w-[244px]
                "
            >
                <p
                    className="
                        mx-auto
                        h-[20px]
                        w-[206px]
                        font-[Tajawal]
                        text-[14px]
                        font-normal
                        leading-[20px]
                        tracking-[0px]
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

export default BookingStepCard;