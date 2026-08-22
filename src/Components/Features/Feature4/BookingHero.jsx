const BookingHero = () => {
    return (
        <section
            dir="rtl"
            className="w-full
                       h-[229px]
                       pt-[64px]
                       pb-[64px]
                       bg-[#D5C7AD80]
                       border-b
                       border-b-[#D5C7AD33]"
        >
            <div className="
                 w-full
                 max-w-[1280px]
                 h-[100px]
                 mx-auto
                 pr-[24px]
                 pl-[24px]
                 flex
                 flex-col
                 gap-[16px]
                 opacity-100
  ">
                <div className="w-full max-w-[1232px] h-[56px] pt-[8px]">
                    <h1
                        className="
                               w-[412px]
                               h-[48px]
                               mx-auto
                               font-[Tajawal]
                               text-[48px]
                               font-bold
                               leading-[48px]
                               tracking-[0px]
                               text-center
                               text-[#4C2325]
    "
                    >
                        احجز موعدك أونلاين
                    </h1>
                </div>

                <div className="w-full max-w-[1232px] h-[28px] ">
                    <p
                        className="
                                 w-[664px]
                                 h-[28px]
                                 mx-auto
                                 font-[Tajawal]
                                 text-[18px]
                                 font-normal
                                 leading-[28px]
                                 tracking-[0px]
                                 text-center
                                 text-[#4C2325]
    "
                    >
                        المواعيد المحجوزة تظهر غير متاحة تلقائياً. ويتم تثبيت الحجز بعد الدفع بانتظار موافقة الإدارة.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default BookingHero;