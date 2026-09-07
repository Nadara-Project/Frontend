import { useId } from "react";
import { FRAME, MARK, TEXT } from "../../assets/nadaraLogo";

/**
 * شعار نضارة الأفقي كـ SVG متجه.
 *
 * introTarget: يضع علامات على الرمز والاسم حتى تستطيع مقدمة الصفحة الرئيسية
 * (IntroSequence) قياس مكانهما وتحريكهما. تُستخدم مرة واحدة فقط في الصفحة.
 */
const NadaraLogo = ({ className = "", introTarget = false }) => {
    const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

    return (
        <svg
            viewBox={`${FRAME.x} ${FRAME.y} ${FRAME.width} ${FRAME.height}`}
            role="img"
            aria-label="نضارة"
            className={className}
        >
            <defs>
                <linearGradient
                    id={`nadara-mark-${uid}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0" stopColor="#DCC0AE" />
                    <stop offset="0.5" stopColor="#B78D7B" />
                    <stop offset="1" stopColor="#96594A" />
                </linearGradient>
            </defs>

            <path
                d={MARK}
                fill={`url(#nadara-mark-${uid})`}
                fillRule="evenodd"
                {...(introTarget ? { "data-intro-mark": "" } : {})}
            />

            <path
                d={TEXT}
                fill="#3B1A17"
                fillRule="evenodd"
                {...(introTarget ? { "data-intro-text": "" } : {})}
            />
        </svg>
    );
};

export default NadaraLogo;
