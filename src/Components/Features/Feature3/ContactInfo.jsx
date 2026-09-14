import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { CLINIC } from "../../../config/clinic";

const itemTextClass = "font-[Tajawal] text-[14px] font-medium leading-5 text-[#4C2325]";

const ContactInfo = () => {
    return (
        <div dir="rtl" className="flex w-full flex-col gap-4">
            <h3 className="text-right font-[Tajawal] text-[16px] font-bold leading-6 text-[#4C2325]">
                تواصل معنا
            </h3>

            <address className="flex flex-col gap-3 not-italic">
                <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="shrink-0 text-[#8b6579]" aria-hidden="true" />
                    <span className={itemTextClass}>{CLINIC.shortAddress}</span>
                </div>

                <a href={`tel:${CLINIC.phone.replace(/\s+/g, "")}`} className="flex items-center gap-3 hover:underline">
                    <FaPhoneAlt className="shrink-0 text-[#8b6579]" aria-hidden="true" />
                    <span dir="ltr" className={itemTextClass}>
                        {CLINIC.phone}
                    </span>
                </a>

                <a href={`mailto:${CLINIC.email}`} className="flex items-center gap-3 hover:underline">
                    <FaEnvelope className="shrink-0 text-[#8b6579]" aria-hidden="true" />
                    <span dir="ltr" className={itemTextClass}>
                        {CLINIC.email}
                    </span>
                </a>
            </address>
        </div>
    );
};

export default ContactInfo;
