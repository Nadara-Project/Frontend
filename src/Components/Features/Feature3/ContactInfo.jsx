import {
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
} from "react-icons/fa";

const ContactInfo = () => {
    return (
        <div
            dir="rtl"
            className="flex w-full flex-col gap-4"
        >
            <h3
                className="
                    text-right
                    font-[Tajawal]
                    text-[16px]
                    font-bold
                    leading-6
                    text-[#4C2325]
                "
            >
                تواصل معنا
            </h3>

            <div className="flex flex-col gap-3">
                {/* Location */}
                <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="shrink-0 text-[#8b6579]" />

                    <span
                        className="
                            font-[Tajawal]
                            text-[14px]
                            font-medium
                            leading-5
                            text-[#4C2325]
                        "
                    >
                        غزة - شارع الرمال
                    </span>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                    <FaPhoneAlt className="shrink-0 text-[#8b6579]" />

                    <span
                        dir="ltr"
                        className="
                            font-[Tajawal]
                            text-[14px]
                            font-medium
                            leading-5
                            text-[#4C2325]
                        "
                    >
                        111 000 0599
                    </span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                    <FaEnvelope className="shrink-0 text-[#8b6579]" />

                    <span
                        dir="ltr"
                        className="
                            font-[Tajawal]
                            text-[14px]
                            font-medium
                            leading-5
                            text-[#4C2325]
                        "
                    >
                        info@nadarah.ps
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;