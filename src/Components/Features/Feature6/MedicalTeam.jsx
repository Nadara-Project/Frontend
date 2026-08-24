import DoctorCard from "./DoctorCard";

const MedicalTeam = () => {
    const doctors = [
        {
            name: "د. أحمد علي",
            specialty: "استشاري أمراض جلدية وتناسلية",
            initials: "أع",
        },
        {
            name: "د. سارة محمود",
            specialty: "أخصائية تجميل وليزر",
            initials: "سم",
        },
        {
            name: "د. كريم حسن",
            specialty: "استشاري جراحة الجلد والأورام",
            initials: "كح",
        },
    ];

    return (
        <section className="w-full max-w-[429px] flex-1">
            <h2
                className="
                    mb-[28px]
                    text-right
                    font-[Tajawal]
                    text-[20px]
                    font-bold
                    leading-[32px]
                    text-[#4C2325]
                    sm:text-[22px]
                "
            >
                فريقنا الطبي
            </h2>

            <div className="flex w-full flex-col gap-[12px]">
                {doctors.map((doctor) => (
                    <DoctorCard
                        key={doctor.name}
                        name={doctor.name}
                        specialty={doctor.specialty}
                        initials={doctor.initials}
                    />
                ))}
            </div>
        </section>
    );
};

export default MedicalTeam;