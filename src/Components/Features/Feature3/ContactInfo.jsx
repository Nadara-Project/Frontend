import {
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
} from "react-icons/fa";

const ContactInfo = () => {
    return (
        <div
            dir="rtl"
            className="flex w-[373.34px] flex-col gap-[16px] pb-[46.25px]"
        >
            {/* Heading */}
            <h3 className="w-[373.34px] h-[24px] text-right font-[Tajawal] font-bold text-[16px] leading-[24px] tracking-[0px] text-[#4C2325]">
                تواصل معنا
            </h3>

            {/* List */}
            <div className="flex w-[373.34px] h-[108px] flex-col gap-[12px]">

                {/* Location */}
                <div className="flex w-[373.34px] h-[28px] items-center gap-[12px] pl-[232.92px]">
                    <FaMapMarkerAlt className="text-[#8b6579]" />

                    <span className="w-[101px] h-[20px] text-right font-[Tajawal] font-medium text-[14px] leading-[20px] tracking-[0px] text-[#4C2325]">
                        غزة - شارع الرمال
                    </span>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                    <FaPhoneAlt className="text-[#8b6579]" />

                    <span dir="ltr" className="font-medium text-[14px] leading-[20px] text-[#4C2325]">
                        111 000 0599
                    </span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-[12px] h-[28px] w-full">
                    <FaEnvelope className="text-[#8b6579]" />

                    <span dir="ltr" className="font-medium text-[14px] leading-[20px] text-[#4C2325]">
                        info@nadarah.ps
                    </span>
                </div>

            </div>
        </div>
    );
};

export default ContactInfo;