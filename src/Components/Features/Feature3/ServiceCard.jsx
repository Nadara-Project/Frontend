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
              h-[211px]
              w-[400px]
              flex-col
              gap-[16px]
              rounded-[16px]
              border
              border-[#D5C7AD33]
              bg-[#D5C7AD1A]
              p-[24px]
            "
        >
            {/* Top */}
            <div
                className="
                    flex
                    h-[28px]
                    w-[350px]
                    items-center
                    justify-between
                "
            >
                {/* Title */}
                <h3
                    className="
                       h-[28px]
                       w-[162.5px]
                       font-[Tajawal]
                       text-[20px]
                       font-bold
                       leading-[28px]
                       tracking-[0px]
                       text-right
                       text-[#4C2325]
                    "
                >
                    {title}
                </h3>

                {/* Category */}
                <span
                    className="
                  h-[24px]
                  w-[63px]
                  rounded-[4px]
                  bg-[#D5C7AD80]
                  px-[8px]
                  py-[4px]
                  font-[Tajawal]
                  text-[12px]
                  font-bold
                  leading-[16px]
                  tracking-[0px]
                  text-right
                  text-[#4C2325]
                    "
                >
                    {category}
                </span>
            </div>

            {/* Description Container */}
            <div
                className="
                      h-[56px]
                      w-[350px]
                      pb-[16px]
    "
            >
                <p
                    className="
                   h-[40px]
                   w-[330px]
                   font-[Tajawal]
                   text-[14px]
                   font-normal
                   leading-[20px]
                   tracking-[0px]
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
                   flex
                   w-[350px]
                   h-[45px]
                   justify-between
                   pt-[16px]
                   border-t-[1px]
                   border-t-[#EEEEEE]
                   opacity-100
                   rotate-0
                "
            >
                {/* Duration */}
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
                        text-[16px]
                        font-bold
                        leading-[24px]
                        text-[#39243D]
                    "
                >
                    {price}
                </span>
            </div>
        </div>
    );
};

export default ServiceCard;