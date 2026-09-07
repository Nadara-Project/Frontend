import {
    FaCalendarCheck,
    FaCalendarPlus,
    FaComments,
    FaFileMedical,
    FaHistory,
    FaReceipt,
    FaRegCalendarTimes,
} from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import MainHeader from '../../../Layouts/Header';
import Footer from '../Feature3/Footer';
import { useAuth } from '../../../hooks/useAuth';
import QuickActionCard from './QuickActionCard';
import StatCard from './StatCard';

const dateFormatter = new Intl.DateTimeFormat('ar', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

const quickActions = [
    {
        icon: FaCalendarPlus,
        title: 'حجز موعد',
        description: 'اختر الخدمة والوقت المناسب واحصل على تأكيد من العيادة.',
        to: '/booking',
        comingSoon: true,
    },
    {
        icon: FaComments,
        title: 'استشارة أونلاين',
        description: 'أرسل استفسارك عن بشرتك واحصل على رد موثق من الطبيب.',
        to: '/online-consultation',
        comingSoon: true,
    },
    {
        icon: FaFileMedical,
        title: 'ملفي الطبي',
        description: 'ملاحظات الطبيب وخطط العلاج محفوظة رقمياً في حسابك.',
        to: '/medical-record',
        comingSoon: true,
    },
    {
        icon: FaReceipt,
        title: 'تصفح الخدمات',
        description: 'اطّلع على خدمات العيادة ومددها وأسعارها المحدّثة.',
        to: '/',
    },
];

const PatientDashboard = () => {
    const { user } = useAuth();

    // TODO: استبدال هذه القيم ببيانات المواعيد من الـ API عند جاهزيتها.
    const appointments = [];
    const upcomingCount = appointments.length;

    const firstName = user?.name?.trim().split(/\s+/)[0];
    const today = dateFormatter.format(new Date());

    return (
        <div dir="rtl" className="flex min-h-screen flex-col bg-[#F8F9FA]">
            <MainHeader />

            <main className="mx-auto flex w-full max-w-[1248px] flex-1 flex-col gap-[32px] px-[16px] py-[40px]">

                {/* الترحيب */}
                <section
                    className="
                        flex
                        flex-col
                        gap-[16px]
                        rounded-[16px]
                        border
                        border-[#D5C7AD33]
                        bg-white
                        p-[24px]
                        shadow-[0px_1px_2px_0px_#0000000D]
                        md:flex-row
                        md:items-center
                        md:justify-between
                        md:p-[32px]
                    "
                >
                    <div className="flex flex-col items-start gap-[8px]">
                        <span
                            className="
                                rounded-[9999px]
                                bg-[#D5C7AD33]
                                px-[12px]
                                py-[4px]
                                text-[14px]
                                font-medium
                                leading-[20px]
                                text-[#4C2325]
                            "
                        >
                            لوحة المريض
                        </span>

                        <h1 className="text-[28px] font-bold leading-[36px] text-[#4C2325] md:text-[30px]">
                            {firstName ? `مرحباً، ${firstName}` : 'مرحباً بك'}
                        </h1>

                        <p className="text-[16px] font-normal leading-[24px] text-[#4C2325]">
                            {today}
                        </p>
                    </div>

                    <div
                        className="
                            flex
                            flex-col
                            gap-[4px]
                            rounded-[12px]
                            bg-[#D5C7AD1A]
                            px-[20px]
                            py-[16px]
                            text-[14px]
                            leading-[20px]
                            text-[#4C2325]
                        "
                    >
                        <span className="font-bold">{user?.name ?? 'حسابي'}</span>
                        {user?.email && (
                            <span dir="ltr" className="text-right opacity-80">
                                {user.email}
                            </span>
                        )}
                    </div>
                </section>

                {/* المؤشرات */}
                <section aria-label="ملخص حسابك" className="grid gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard icon={FaCalendarCheck} value={upcomingCount} label="مواعيد قادمة" />
                    <StatCard icon={FaComments} value={0} label="استشارات نشطة" />
                    <StatCard icon={FaHistory} value={0} label="زيارات سابقة" />
                </section>

                {/* الإجراءات السريعة */}
                <section aria-labelledby="quick-actions-title" className="flex flex-col gap-[16px]">
                    <h2
                        id="quick-actions-title"
                        className="text-[20px] font-bold leading-[28px] text-[#39243D]"
                    >
                        إجراءات سريعة
                    </h2>

                    <div className="grid gap-[24px] sm:grid-cols-2 lg:grid-cols-4">
                        {quickActions.map((action) => (
                            <QuickActionCard key={action.title} {...action} />
                        ))}
                    </div>
                </section>

                {/* المواعيد القادمة */}
                <section aria-labelledby="appointments-title" className="flex flex-col gap-[16px]">
                    <h2
                        id="appointments-title"
                        className="text-[20px] font-bold leading-[28px] text-[#39243D]"
                    >
                        مواعيدك القادمة
                    </h2>

                    <div
                        className="
                            flex
                            flex-col
                            items-center
                            gap-[12px]
                            rounded-[16px]
                            border
                            border-[#D5C7AD33]
                            bg-white
                            px-[24px]
                            py-[48px]
                            text-center
                            shadow-[0px_1px_2px_0px_#0000000D]
                        "
                    >
                        <span
                            aria-hidden="true"
                            className="
                                flex
                                h-[80px]
                                w-[80px]
                                items-center
                                justify-center
                                rounded-full
                                bg-[#D5C7AD33]
                                text-[#4C2325]
                            "
                        >
                            <FaRegCalendarTimes className="h-[32px] w-[32px]" />
                        </span>

                        <h3 className="text-[18px] font-bold leading-[28px] text-[#4C2325]">
                            لا توجد مواعيد قادمة
                        </h3>

                        <p className="max-w-[420px] text-[14px] font-normal leading-[20px] text-[#4C2325]">
                            بمجرد حجز موعدك سيظهر هنا مع حالته وموعده وتفاصيل الخدمة.
                        </p>

                        <a
                            href="/#services"
                            className="
                                mt-[8px]
                                flex
                                items-center
                                gap-[8px]
                                rounded-[8px]
                                bg-[#4C2325]
                                px-[24px]
                                py-[12px]
                                text-[16px]
                                font-medium
                                leading-[24px]
                                text-white
                                transition-colors
                                hover:bg-[#36181A]
                                focus-visible:outline-2
                                focus-visible:outline-offset-2
                                focus-visible:outline-[#4C2325]
                            "
                        >
                            <span>تصفح الخدمات</span>
                            <FiArrowLeft className="h-[16px] w-[16px]" aria-hidden="true" />
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default PatientDashboard;
