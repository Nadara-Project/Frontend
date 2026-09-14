import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { initials } from "../../../utils/format";

const DoctorCard = ({ doctor }) => {
    const firstService = doctor.services?.[0];
    const bookingLink = firstService
        ? `/book-appointment?service_id=${firstService.id}&doctor_id=${doctor.id}`
        : "/book-appointment";

    return (
        <Link
            to={bookingLink}
            aria-label={`احجز مع ${doctor.name}`}
            className="
                group
                flex
                min-h-[92px]
                w-full
                items-center
                justify-between
                gap-[12px]
                rounded-[8px]
                bg-white
                px-[12px]
                py-[12px]
                shadow-[0px_4px_20px_0px_#0000000D]
                transition-shadow
                hover:shadow-md
                sm:px-[20px]
            "
        >
            {/* Doctor Information */}
            <div className="flex min-w-0 items-center gap-[10px] sm:gap-[16px]">
                {doctor.image_url ? (
                    <img
                        src={doctor.image_url}
                        alt=""
                        className="h-[44px] w-[44px] shrink-0 rounded-full object-cover sm:h-[52px] sm:w-[52px]"
                    />
                ) : (
                    <div
                        aria-hidden="true"
                        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#4C2325] font-[Tajawal] text-[14px] font-medium text-white sm:h-[52px] sm:w-[52px] sm:text-[16px]"
                    >
                        {initials(doctor.name)}
                    </div>
                )}

                <div className="min-w-0 text-right">
                    <h3 className="truncate font-[Tajawal] text-[16px] font-bold leading-[24px] text-[#4C2325] sm:text-[18px] sm:leading-[28px]">
                        {doctor.name}
                    </h3>
                    {doctor.specialty && (
                        <p className="mt-[2px] truncate font-[Tajawal] text-[12px] leading-[20px] text-[#4C2325]/70 sm:text-[13px] sm:leading-[22px]">
                            {doctor.specialty}
                            {doctor.accepts_online_consultations ? " · استشارات أونلاين" : ""}
                        </p>
                    )}
                </div>
            </div>

            <span
                aria-hidden="true"
                className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#D5C7AD80] text-[#4C2325] transition-transform group-hover:-translate-x-1"
            >
                <FaArrowLeft size={13} />
            </span>
        </Link>
    );
};

export default DoctorCard;
