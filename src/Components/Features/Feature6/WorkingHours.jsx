import { FaClock } from "react-icons/fa";

const WorkingHours = () => {
    const workingHours = [
        {
            day: "الأحد - الخميس",
            time: "09:00 ص - 09:00 م",
        },
        {
            day: "السبت",
            time: "10:00 ص - 06:00 م",
        },
        {
            day: "الجمعة",
            time: "مغلق",
            closed: true,
        },
    ];

    return (
        <section
            className="
                w-full
                max-w-[429.33px]
                pb-[80px]
                sm:pb-[100px]
                lg:pb-[138px]
            "
        >
            <div
                className="
                    flex
                    w-full
                    flex-col
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
                {/* Title */}
                <div
                    className="
                        mb-[32px]
                        flex
                        w-full
                        items-center
                        justify-start
                        gap-[12px]
                        sm:mb-[36px]
                    "
                >
                    <FaClock
                        size={17}
                        className="shrink-0 text-[#4C2325]"
                    />

                    <h2
                        className="
                            font-[Tajawal]
                            text-[20px]
                            font-bold
                            leading-[32px]
                            text-[#4C2325]
                            sm:text-[22px]
                        "
                    >
                        أوقات العمل
                    </h2>
                </div>

                {/* Working Hours */}
                <div className="flex w-full flex-col gap-[16px]">
                    {workingHours.map((item) => (
                        <div
                            key={item.day}
                            className="
                                flex
                                min-h-[45px]
                                w-full
                                items-center
                                justify-between
                                border-b
                                border-b-[#EEEEEE]
                                py-[8px]
                                font-[Tajawal]
                            "
                        >
                            {/* Day */}
                            <span
                                className="
                                    font-[Tajawal]
                                    text-[14px]
                                    font-normal
                                    leading-[24px]
                                    text-right
                                    text-[#4C2325]
                                    sm:text-[16px]
                                "
                            >
                                {item.day}
                            </span>

                            {/* Time */}
                            <span
                                className={`
                                    shrink-0
                                    rounded-[8px]
                                    px-[10px]
                                    py-[4px]
                                    font-[Tajawal]
                                    text-[12px]
                                    font-normal
                                    leading-[20px]
                                    text-center
                                    sm:px-[12px]
                                    sm:text-[14px]
                                    ${item.closed
                                        ? "bg-[#FFDAD64D] text-[#D98989]"
                                        : "bg-[#D5C7AD33] text-[#4C2325]"
                                    }
                                `}
                            >
                                {item.time}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WorkingHours;