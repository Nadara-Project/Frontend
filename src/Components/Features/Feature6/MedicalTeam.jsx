import DoctorCard from "./DoctorCard";
import { Skeleton } from "../../Common/Feedback";
import { useAsync } from "../../../hooks/useAsync";
import { doctors } from "../../../services/api-client";

const MedicalTeam = () => {
    const { data, loading, error } = useAsync((signal) => doctors.list({ signal }), []);
    const team = data?.data ?? [];

    // الفريق يأتي من دليل الأطباء الحقيقي؛ عند غيابه لا نعرض أسماء وهمية
    if (error || (!loading && team.length === 0)) return null;

    return (
        <section className="w-full max-w-[429px] flex-1">
            <h2 className="mb-[28px] text-right font-[Tajawal] text-[20px] font-bold leading-[32px] text-[#4C2325] sm:text-[22px]">
                فريقنا الطبي
            </h2>

            <div className="flex w-full flex-col gap-[12px]">
                {loading && !data
                    ? [0, 1, 2].map((key) => <Skeleton key={key} className="h-[92px]" />)
                    : team.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}
            </div>
        </section>
    );
};

export default MedicalTeam;
