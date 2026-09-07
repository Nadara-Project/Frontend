const StatCard = ({ icon: Icon, value, label }) => {
    return (
        <div
            className="
                flex
                items-center
                gap-[16px]
                rounded-[12px]
                border
                border-[#D5C7AD33]
                bg-white
                p-[16px]
                shadow-[0px_1px_2px_0px_#0000000D]
            "
        >
            <span
                aria-hidden="true"
                className="
                    flex
                    h-[44px]
                    w-[44px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#D5C7AD]
                    text-[#4C2325]
                "
            >
                <Icon className="h-[18px] w-[18px]" />
            </span>

            <div className="flex flex-col">
                <span className="text-[20px] font-bold leading-[28px] text-[#4C2325]">
                    {value}
                </span>
                <span className="text-[14px] font-normal leading-[20px] text-[#4C2325]">
                    {label}
                </span>
            </div>
        </div>
    );
};

export default StatCard;
