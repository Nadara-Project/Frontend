const AboutIntro = () => {
    return (
        <section className="mx-auto w-full max-w-[768px]">
            {/* Heading */}
            <div className="mx-auto w-full max-w-[505px]">
                <h1
                    className="
                        font-[Tajawal]
                        text-[26px]
                        font-bold
                        leading-[36px]
                        text-center
                        text-[#4C2325]
                        sm:text-[30px]
                        sm:leading-[40px]
                        lg:text-[32px]
                        lg:leading-[41.6px]
                    "
                >
                    رعاية جلدية منظّمة… رغم كل الظروف
                </h1>
            </div>

            {/* Description */}
            <div className="mx-auto mt-[24px] w-full max-w-[768px]">
                <p
                    className="
                        w-full
                        px-[4px]
                        font-[Tajawal]
                        text-[16px]
                        font-normal
                        leading-[26px]
                        text-center
                        text-[#4C2325]
                        sm:text-[18px]
                        sm:leading-[29.25px]
                    "
                >
                    في نظارة، نؤمن بأن العناية بالبشرة ليست مجرد تجميل، بل هي علم
                    دقيق يتطلب خبرة واهتماماً بالتفاصيل. نحن هنا لنقدم لك أحدث
                    العلاجات بلمسة إنسانية تضمن راحتك وثقتك.
                </p>
            </div>
        </section>
    );
};

export default AboutIntro;