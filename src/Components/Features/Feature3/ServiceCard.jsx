import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { formatPrice } from "../../../utils/format";

const ServiceCard = ({ service }) => {
    const bookable = (service.bookable_doctors_count ?? 0) > 0;
    const target = bookable ? `/book-appointment?service_id=${service.id}` : "/services";

    return (
        <Link
            to={target}
            dir="rtl"
            className="
                group
                mx-auto
                flex
                min-h-[211px]
                w-full
                max-w-[400px]
                flex-col
                gap-4
                rounded-[16px]
                border
                border-[#D5C7AD33]
                bg-[#D5C7AD1A]
                p-6
                transition-shadow
                hover:shadow-md
            "
        >
            {/* Top */}
            <div className="flex min-h-[28px] w-full items-start justify-between gap-3">
                <h3 className="min-w-0 text-right font-[Tajawal] text-[18px] font-bold leading-[28px] text-[#4C2325] md:text-[20px]">
                    {service.name}
                </h3>

                {service.category?.name && (
                    <span className="shrink-0 rounded-[4px] bg-[#D5C7AD80] px-2 py-1 text-right font-[Tajawal] text-[12px] font-bold leading-[16px] text-[#4C2325]">
                        {service.category.name}
                    </span>
                )}
            </div>

            {/* Description */}
            <p className="line-clamp-3 w-full text-right font-[Tajawal] text-[14px] font-normal leading-[20px] text-[#4C2325]">
                {service.description}
            </p>

            {/* Bottom */}
            <div className="mt-auto flex min-h-[45px] w-full items-center justify-between border-t border-[#EEEEEE] pt-4">
                <span className="flex items-center gap-[6px] font-[Tajawal] text-[14px] font-medium leading-[20px] text-[#39243D]">
                    {bookable ? "احجز الآن" : "التفاصيل"}
                    <FiArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                </span>

                <span className="font-[Tajawal] text-[15px] font-bold leading-[24px] text-[#39243D] md:text-[16px]">
                    {service.starting_price ? `يبدأ من ${formatPrice(service.starting_price)}` : ""}
                </span>
            </div>
        </Link>
    );
};

export default ServiceCard;
