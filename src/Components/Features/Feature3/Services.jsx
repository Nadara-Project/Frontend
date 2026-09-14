import { Link } from "react-router-dom";
import ServiceCard from "./ServiceCard";
import { Skeleton } from "../../Common/Feedback";
import { useAsync } from "../../../hooks/useAsync";
import { catalog } from "../../../services/api-client";

const FEATURED_COUNT = 3;

const Services = () => {
    // نعرض الخدمات القابلة للحجز أولاً، فالزائر يصل منها مباشرة لنموذج الحجز
    const { data, loading, error } = useAsync(
        (signal) => catalog.services({ perPage: 30, signal }),
        []
    );

    const services = [...(data?.data ?? [])]
        .sort((a, b) => (b.bookable_doctors_count ?? 0) - (a.bookable_doctors_count ?? 0))
        .slice(0, FEATURED_COUNT);

    // عند تعذّر التحميل نخفي القسم بدل عرض خطأ في الصفحة الرئيسية
    if (error || (!loading && services.length === 0)) return null;

    return (
        <section
            dir="rtl"
            className="
                mx-auto
                w-full
                max-w-[1280px]
                border-t
                border-[#EEEEEE]
                bg-white
                px-4
                py-12
                md:px-6
                md:py-16
            "
        >
            <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-8 md:gap-10">
                {/* Header */}
                <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="w-full text-right sm:w-auto">
                        <h2 className="font-[Tajawal] text-[24px] font-bold leading-[32px] text-[#39243D] md:text-[30px] md:leading-[36px]">
                            خدمات مختارة
                        </h2>
                        <p className="mt-2 font-[Tajawal] text-[14px] font-normal leading-[20px] text-[#39243D]">
                            الأسعار يحددها كل طبيب، ونعرض لك أقل سعر متاح.
                        </p>
                    </div>

                    <Link
                        to="/services"
                        className="shrink-0 rounded-[8px] border border-[#4C2325] px-4 py-2 font-[Tajawal] text-[14px] font-bold leading-[20px] text-[#4C2325] transition-colors hover:bg-[#4C2325] hover:text-white"
                    >
                        كل الخدمات
                    </Link>
                </div>

                {/* Services Cards */}
                <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {loading && !data
                        ? Array.from({ length: FEATURED_COUNT }, (_, key) => (
                              <Skeleton key={key} className="mx-auto h-[211px] w-full max-w-[400px] rounded-[16px]" />
                          ))
                        : services.map((service) => <ServiceCard key={service.id} service={service} />)}
                </div>
            </div>
        </section>
    );
};

export default Services;
