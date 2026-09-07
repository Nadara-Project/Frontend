import Hero from "../Feature3/Hero";
import WhyNadara from "../Feature3/WhyNadara";
import BookingSteps from "../Feature3/BookingSteps";
import Services from "../Feature3/Services";
import Footer from "../Feature3/Footer";
import Header from '../../../Layouts/Header';
import IntroSequence from '../../Common/IntroSequence';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA]" dir="rtl">

      {/* مقدمة الشعار: تعمل مرة واحدة لكل جلسة */}
      <IntroSequence />

      <Header />
      <main className="flex flex-col gap-12 py-9" data-intro-page>
      
        <Hero />
        <WhyNadara />
        <BookingSteps />
        <Services />
      </main>

      {/* 3. الفوتر */}
      <Footer />
    </div>
  );
};

export default Dashboard;