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
                flex
                w-[600px]
                h-[106px]
                gap-[16px]
                pt-[24px]
                opacity-100
            "
        >
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="
                      w-[189.33px]
                      h-[82px]
                      rounded-[12px]
                      border
                      border-[#D5C7AD33]
                      bg-white
                      p-[16px]
                      shadow-[0px_1px_2px_0px_#0000000D]
                    "
                >
                    <div
                        className="
                          flex
                          h-[28px]
                          w-[155.34px]
                          items-center
                          justify-center
        "
                    >
                        <span
                            className="
                            h-[28px]
                            w-[36px]
                            font-[Tajawal]
                            text-center
                            text-[20px]
                            font-bold
                            leading-[28px]
                            text-[#4C2325]
            "
                        >
                            {stat.value}
                        </span>
                    </div>

                    <div
                        className="
                          flex
                          w-[155.33px]
                          h-[20px]
                          items-center
                          justify-center
    "
                    >
                        <span
                            className="
                             w-[81px]
                             h-[20px]
                             font-[Tajawal]
                             text-[14px]
                             font-normal
                             leading-[20px]
                             text-center
                             text-[#4C2325]
        "
                        >
                            {stat.label}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HeroStats;