const ConsultationHero = () => {
    return (
        <section
            dir="rtl"
            className="
                w-full
                min-h-[229px]
                px-[20px]
                py-[48px]
                sm:px-[24px]
                sm:py-[64px]
                bg-[#D5C7AD80]
                border-b
                border-b-[#D5C7AD33]
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
                            max-w-[484px]
                            font-[Tajawal]
                            text-[32px]
                            font-bold
                            leading-[40px]
                            text-center
                            text-[#4C2325]
                            sm:text-[40px]
                            sm:leading-[44px]
                            lg:text-[48px]
                            lg:leading-[48px]
                        "
                    >
                        استشارة جلدية عن بعد
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
                            text-[16px]
                            font-normal
                            leading-[24px]
                            text-center
                            text-[#4C2325]
                            sm:text-[18px]
                            sm:leading-[28px]
                        "
                    >
                        احصل على تشخيص مبدئي وخطة علاجية من نخبة أطباء
                        الجلدية، وأنت في منزلك.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ConsultationHero;