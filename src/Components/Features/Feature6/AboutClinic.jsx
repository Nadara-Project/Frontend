import Header from "../../../Layouts/Header";
import Footer from "../../../Layouts/Footer";

import AboutIntro from "./AboutIntro";
import AboutValues from "./AboutValues";
import MedicalTeam from "./MedicalTeam";
import WorkingHours from "./WorkingHours";

const AboutClinic = () => {
    return (
        <div
            dir="rtl"
            className="min-h-screen bg-[#D5C7AD1A]"
        >
            <Header />

            <main
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-[1440px]
                    flex-col
                    gap-[40px]
                    px-[20px]
                    py-[48px]
                    sm:gap-[48px]
                    sm:px-[32px]
                    sm:py-[56px]
                    lg:gap-[64px]
                    lg:px-[80px]
                    lg:py-[64px]
                "
            >
                <AboutIntro />

                <AboutValues />

                {/* Working Hours + Medical Team */}
                <section
                    className="
                        mx-auto
                        flex
                        w-full
                        max-w-[1120px]
                        flex-col
                        gap-[40px]
                        px-0
                        py-[32px]
                        sm:gap-[48px]
                        sm:py-[48px]
                        lg:flex-row
                        lg:gap-[80px]
                        lg:py-[64px]
                    "
                >
                    <WorkingHours />

                    <MedicalTeam />
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutClinic;