import Header from "../../../Layouts/Header";
import BookingHero from "./BookingHero";
import LoginRequired from "./LoginRequired";
import Footer from "../../../Layouts/Footer";

const AppointmentBooking = () => {
    return (
        <div dir="rtl" className="min-h-screen w-full bg-white">
            <Header />

            <main className="w-full">
                <BookingHero />
                <LoginRequired />
            </main>

            <Footer />
        </div>
    );
};

export default AppointmentBooking;