import { Link } from 'react-router-dom';

const cardStyles = `
    group
    flex
    h-full
    flex-col
    gap-[8px]
    rounded-[16px]
    border
    border-[#D5C7AD33]
    bg-white
    p-[24px]
    text-right
    shadow-[0px_1px_2px_0px_#0000000D]
    transition
`;

/**
 * بطاقة إجراء سريع. الإجراءات غير الجاهزة تُعرض معطّلة مع وسم "قريباً"
 * بدل أن تنقل المستخدم إلى مسار غير موجود.
 */
const QuickActionCard = ({ icon: Icon, title, description, to, comingSoon = false }) => {
    const content = (
        <>
            <div className="flex items-center justify-between">
                <span
                    aria-hidden="true"
                    className="
                        flex
                        h-[40px]
                        w-[40px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#D5C7AD]
                        text-[#4C2325]
                    "
                >
                    <Icon className="h-[18px] w-[18px]" />
                </span>

                {comingSoon && (
                    <span
                        className="
                            rounded-[4px]
                            bg-[#D5C7AD80]
                            px-[8px]
                            py-[4px]
                            text-[12px]
                            font-bold
                            leading-[16px]
                            text-[#4C2325]
                        "
                    >
                        قريباً
                    </span>
                )}
            </div>

            <h3 className="text-[18px] font-bold leading-[28px] text-[#4C2325]">
                {title}
            </h3>

            <p className="text-[14px] font-normal leading-[20px] text-[#4C2325]">
                {description}
            </p>
        </>
    );

    if (comingSoon) {
        return (
            <div aria-disabled="true" className={`${cardStyles} cursor-not-allowed opacity-60`}>
                {content}
            </div>
        );
    }

    return (
        <Link
            to={to}
            className={`
                ${cardStyles}
                hover:border-[#D5C7AD]
                hover:shadow-md
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-[#4C2325]
            `}
        >
            {content}
        </Link>
    );
};

export default QuickActionCard;
