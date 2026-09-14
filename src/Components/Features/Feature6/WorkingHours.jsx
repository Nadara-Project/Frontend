import { FaClock } from "react-icons/fa";
import { CLINIC } from "../../../config/clinic";

const WorkingHours = () => {
    return (
        <section className="w-full max-w-[429.33px] pb-[40px] sm:pb-[60px] lg:pb-[80px]">
            <div className="flex w-full flex-col rounded-[12px] border border-[#D5C7AD33] bg-white p-[24px] shadow-[0px_4px_20px_0px_#0000000D] sm:p-[32px] lg:p-[40px]">
                {/* Title */}
                <div className="mb-[32px] flex w-full items-center justify-start gap-[12px] sm:mb-[36px]">
                    <FaClock size={17} className="shrink-0 text-[#4C2325]" aria-hidden="true" />
                    <h2 className="font-[Tajawal] text-[20px] font-bold leading-[32px] text-[#4C2325] sm:text-[22px]">
                        أوقات العمل
                    </h2>
                </div>

                {/* Working Hours */}
                <dl className="flex w-full flex-col gap-[16px]">
                    {CLINIC.workingHours.map((item) => (
                        <div
                            key={item.day}
                            className="flex min-h-[45px] w-full items-center justify-between border-b border-b-[#EEEEEE] py-[8px] font-[Tajawal]"
                        >
                            <dt className="text-right font-[Tajawal] text-[14px] leading-[24px] text-[#4C2325] sm:text-[16px]">
                                {item.day}
                            </dt>
                            <dd
                                className={`shrink-0 rounded-[8px] px-[10px] py-[4px] text-center font-[Tajawal] text-[12px] leading-[20px] sm:px-[12px] sm:text-[14px] ${
                                    item.closed ? "bg-[#FFDAD64D] text-[#B45454]" : "bg-[#D5C7AD33] text-[#4C2325]"
                                }`}
                            >
                                {item.time}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
};

export default WorkingHours;
