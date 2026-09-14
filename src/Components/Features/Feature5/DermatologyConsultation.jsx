import { Navigate } from "react-router-dom";
import Header from "../../../Layouts/Header";
import ConsultationHero from "./ConsultationHero";
import LoginRequired from "../../Common/LoginRequired";
import Footer from "../../../Layouts/Footer";
import { useAuth } from "../../../hooks/useAuth";

const DermatologyConsultation = () => {
    const { isAuthenticated } = useAuth();

    // المستخدم المسجّل يذهب مباشرة لنموذج طلب الاستشارة
    if (isAuthenticated) {
        return <Navigate to="/consultation-request" replace />;
    }

    return (
        <div dir="rtl" className="min-h-screen w-full bg-white">
            <Header />

            <main className="w-full">
                <ConsultationHero />
                <LoginRequired from="/consultation-request" />
            </main>

            <Footer />
        </div>
    );
};

export default DermatologyConsultation;
