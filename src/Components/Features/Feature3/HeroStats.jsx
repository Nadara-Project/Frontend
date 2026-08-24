const HeroStats = () => {
    const stats = [
        {
            value: "24/7",
            label: "حجز متاح",
        },
        {
            value: "+60",
            label: "خدمات طبية",
        },
        {
            value: "-",
            label: "ورق ملف طبي",
        },
    ];

    return (
        <div
            className="
                grid
                w-full
                grid-cols-3
                gap-2
                pt-4
                sm:gap-4
                sm:pt-6
            "
        >
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="
                        flex
                        min-w-0
                        min-h-[82px]
                        flex-col
                        items-center
                        justify-center
                        rounded-[12px]
                        border
                        border-[#D5C7AD33]
                        bg-white
                        p-3
                        shadow-[0px_1px_2px_0px_#0000000D]
                        sm:p-4
                    "
                >
                    <span
                        className="
                            font-[Tajawal]
                            text-[17px]
                            font-bold
                            leading-[28px]
                            text-center
                            text-[#4C2325]
                            sm:text-[20px]
                        "
                    >
                        {stat.value}
                    </span>

                    <span
                        className="
                            font-[Tajawal]
                            text-[12px]
                            font-normal
                            leading-[20px]
                            text-center
                            text-[#4C2325]
                            sm:text-[14px]
                        "
                    >
                        {stat.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default HeroStats;