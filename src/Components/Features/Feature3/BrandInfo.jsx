const BrandInfo = () => {
    return (
        <div
            dir="rtl"
            className="flex w-[373.33px] h-[134.25px] flex-col items-start gap-[25.25px]"
        >
            {/* Link */}
            <img
                src="/Logo.svg"
                alt="Nadara Clinic"
                className="w-[118.06px] h-[40px] object-contain"
            />

            {/* Container */}
            <div className="w-[373.33px] h-[69px] ">
                <p className="w-[371px] h-[69px] text-right font-[Tajawal] font-normal text-[14px] leading-[22.75px] tracking-[0px] text-[#4C2325]">
                    عيادة نضارة للجلدية والعناية بالبشرة - منصة رقمية لحجز المواعيد،
                    الدفع الإلكتروني، والاستشارات الطبية عن بعد. لتوفير وقتك وعنائك في التنقل.
                </p>
            </div>
        </div>
    );
};

export default BrandInfo;