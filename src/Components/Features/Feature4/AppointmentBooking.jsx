import { Navigate } from "react-router-dom";
import Header from "../../../Layouts/Header";
import BookingHero from "./BookingHero";
import LoginRequired from "../../Common/LoginRequired";
import Footer from "../../../Layouts/Footer";
import { useAuth } from "../../../hooks/useAuth";

const AppointmentBooking = () => {
    const { isAuthenticated } = useAuth();

    // المستخدم المسجّل يذهب مباشرة لنموذج الحجز
    if (isAuthenticated) {
        return <Navigate to="/book-appointment" replace />;
    }

    return (
        <div dir="rtl" className="min-h-screen w-full bg-white">
            <Header />

            <main className="w-full">
                <BookingHero />
                <LoginRequired from="/book-appointment" />
            </main>

            <Footer />
        </div>
    );
};

export default AppointmentBooking;
