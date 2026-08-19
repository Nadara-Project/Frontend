import Header from "../Layouts/Header";

import Hero from "../Components/Features/Feature3/Hero";
import WhyNadara from "../Components/Features/Feature3/WhyNadara";
import BookingSteps from "../Components/Features/Feature3/BookingSteps";
import Services from "../Components/Features/Feature3/Services";
import Footer from "../Components/Features/Feature3/Footer";

const Dashboard = () => {
    return (
        <div className="min-h-screen w-full bg-white">

            <Header />

            <main className="
        w-[1280px]
        h-[1925.4px]
        top-[105px]
        pt-[96px]
        bg-[#D5C7AD1A]
    ">

                <Hero />
                <WhyNadara />
                <BookingSteps />
                <Services />

            </main>

            <Footer />

        </div>
    );
};

export default Dashboard;