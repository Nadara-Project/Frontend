import { FaArrowLeft } from "react-icons/fa";

const DoctorCard = ({ name, specialty, initials }) => {
    return (
        <div
            dir="ltr"
            className="
                flex
                min-h-[92px]
                w-full
                items-center
                justify-between
                gap-[12px]
                rounded-[8px]
                bg-white
                px-[12px]
                py-[12px]
                shadow-[0px_4px_20px_0px_#0000000D]
                sm:px-[20px]
            "
        >
            {/* Arrow */}
            <button
                type="button"
                className="
                    flex
                    h-[36px]
                    w-[36px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#D5C7AD80]
                    text-[#4C2325]
                "
            >
                <FaArrowLeft size={13} />
            </button>

            {/* Doctor Information */}
            <div

                className="
                    flex
                    min-w-0
                    items-center
                    gap-[10px]
                    sm:gap-[16px]
                "
            >
                {/* Text */}
                <div className="min-w-0 text-right">
                    <h3
                        className="
                            truncate
                            font-[Tajawal]
                            text-[16px]
                            font-bold
                            leading-[24px]
                            text-[#4C2325]
                            sm:text-[18px]
                            sm:leading-[28px]
                        "
                    >
                        {name}
                    </h3>

                    <p
                        className="
                            truncate
                            mt-[2px]
                            font-[Tajawal]
                            text-[11px]
                            font-normal
                            leading-[20px]
                            text-[#4C2325]/70
                            sm:text-[13px]
                            sm:leading-[22px]
                        "
                    >
                        {specialty}
                    </p>
                </div>

                {/* Initials */}
                <div
                    className="
                        flex
                        h-[44px]
                        w-[44px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#4C2325]
                        font-[Tajawal]
                        text-[14px]
                        font-medium
                        text-white
                        sm:h-[52px]
                        sm:w-[52px]
                        sm:text-[16px]
                    "
                >
                    {initials}
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;