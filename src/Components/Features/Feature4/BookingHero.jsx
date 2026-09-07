const BookingHero = () => {
    return (
        <section
            dir="rtl"
            className="
                w-full
                border-b
                border-b-[#D5C7AD33]
                bg-[#D5C7AD80]
                px-[16px]
                py-[48px]
                sm:py-[56px]
                lg:h-[229px]
                lg:px-[24px]
                lg:py-[64px]
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-[1280px]
                    flex-col
                    items-center
                    gap-[16px]
                "
            >
                {/* Heading */}
                <div className="w-full">
                    <h1
                        className="
                            mx-auto
                            w-full
                            font-[Tajawal]
                            text-[32px]
                            font-bold
                            leading-[40px]
                            text-center
                            text-[#4C2325]
                            sm:text-[40px]
                            sm:leading-[44px]
                            lg:w-[412px]
                            lg:text-[48px]
                            lg:leading-[48px]
                        "
                    >
                        احجز موعدك أونلاين
                    </h1>
                </div>

                {/* Description */}
                <div className="w-full">
                    <p
                        className="
                            mx-auto
                            w-full
                            max-w-[664px]
                            font-[Tajawal]
                            text-[15px]
                            font-normal
                            leading-[24px]
                            text-center
                            text-[#4C2325]
                            sm:text-[16px]
                            sm:leading-[26px]
                            lg:text-[18px]
                            lg:leading-[28px]
                        "
                    >
                        المواعيد المحجوزة تظهر غير متاحة تلقائياً. ويتم تثبيت
                        الحجز بعد الدفع بانتظار موافقة الإدارة.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default BookingHero;