const BrandInfo = () => {
    return (
        <div
            dir="rtl"
            className="
                flex
                w-full
                flex-col
                items-start
                gap-6
            "
        >
            <img
                src="/Logo.svg"
                alt="Nadara Clinic"
                className="h-10 w-[118px] object-contain"
            />

            <p
                className="
                    w-full
                    max-w-[373px]
                    text-right
                    font-[Tajawal]
                    text-[14px]
                    font-normal
                    leading-[22px]
                    text-[#4C2325]
                "
            >
                عيادة نضارة للجلدية والعناية بالبشرة - منصة رقمية لحجز المواعيد،
                الدفع الإلكتروني، والاستشارات الطبية عن بعد. لتوفير وقتك وعنائك في التنقل.
            </p>
        </div>
    );
};

export default BrandInfo;