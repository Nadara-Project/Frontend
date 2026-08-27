import { useEffect, useId, useRef, useState } from "react";
import { LOCKUP, MARK, MARK_BOX, TEXT, TEXT_BOX } from "../../assets/nadaraLogo";

/**
 * مقدمة الصفحة الرئيسية.
 *
 * التتابع: الشعار يظهر محفوراً بالذهب، يمرّ عليه شعاع ضوء، ثم تتلاشى الستارة
 * وينتقل الرمز نفسه إلى مكانه في الهيدر بينما تطلع الصفحة من تحته.
 *
 * الرمز الطائر والرمز الثابت في الهيدر يستخدمان نفس مسارات nadaraLogo،
 * فالتبديل بينهما في نهاية الانتقال لا يُحدث أي إزاحة.
 */

// التوقيت المعتمد (بالثواني)
const T = {
    appear: 1.25,      // ظهور الشعار المحفور
    sweepStart: 0.85,  // بداية شعاع الضوء
    sweepDur: 1.45,    // مدة الشعاع
    hold: 0.45,        // وقفة قبل الانتقال
    fly: 1.4,          // مدة انتقال الرمز إلى الهيدر
};

const LOGO_WIDTH = 34;                              // نسبة من عرض الشاشة
const FLY_EASE = "cubic-bezier(.45,-0.12,.2,1.16)";
const RISE_EASE = "cubic-bezier(.2,.8,.2,1)";

const FLY_START = Math.max(T.appear, T.sweepStart + T.sweepDur) + T.hold; // 2.75s
const TOTAL = FLY_START + T.fly;                                          // 4.15s

const SESSION_KEY = "nadara:intro-seen";

// تخطيط الشعار في المقدمة: الرمز فوق والاسم تحته
const [MX1, MY1, MX2, MY2] = MARK_BOX;
const [TX1, TY1, TX2, TY2] = TEXT_BOX;
const MARK_W = MX2 - MX1;
const MARK_H = MY2 - MY1;
const TEXT_W = TX2 - TX1;
const TEXT_H = TY2 - TY1;
const STACK_GAP = MARK_H * 0.3;
const STACK_W = Math.max(MARK_W, TEXT_W) + 40;
const STACK_H = MARK_H + STACK_GAP + TEXT_H;
const MARK_DX = (STACK_W - MARK_W) / 2 - MX1;
const MARK_DY = -MY1;
const TEXT_DX = (STACK_W - TEXT_W) / 2 - TX1;
const TEXT_DY = MARK_H + STACK_GAP - TY1;

const shouldPlay = () => {
    if (typeof window === "undefined") return false;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return false;
    }

    // ?intro=1 يعيد تشغيلها في أي وقت، للمراجعة داخل الفريق
    if (new URLSearchParams(window.location.search).get("intro") === "1") {
        return true;
    }

    try {
        return !window.sessionStorage.getItem(SESSION_KEY);
    } catch {
        return true;
    }
};

// لمعة قصيرة تمرّ على الشعار بعد وصوله إلى الهيدر
const runLandingShine = (markEl) => {
    const svg = markEl.ownerSVGElement;
    if (!svg) return () => {};

    const layer = document.createElementNS("http://www.w3.org/2000/svg", "g");

    layer.innerHTML = `
        <defs>
            <linearGradient id="nadara-shine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#fff" stop-opacity="0" />
                <stop offset="0.5" stop-color="#fff" stop-opacity="0.75" />
                <stop offset="1" stop-color="#fff" stop-opacity="0" />
            </linearGradient>
            <mask id="nadara-shine-mask">
                <path d="${MARK}" fill="#fff" fill-rule="evenodd" />
            </mask>
        </defs>
        <g mask="url(#nadara-shine-mask)">
            <rect
                x="${-LOCKUP.width * 0.3}"
                y="${-LOCKUP.height * 0.3}"
                width="${LOCKUP.width * 0.18}"
                height="${LOCKUP.height * 1.6}"
                fill="url(#nadara-shine)"
            />
        </g>
    `;

    svg.appendChild(layer);

    const band = layer.querySelector("rect");

    const animation = band.animate(
        [
            { transform: "rotate(14deg) translateX(0)" },
            { transform: `rotate(14deg) translateX(${LOCKUP.width * 0.75}px)` },
        ],
        { duration: 820, easing: "cubic-bezier(.4,0,.3,1)" }
    );

    animation.onfinish = () => layer.remove();

    return () => {
        animation.cancel();
        layer.remove();
    };
};

const IntroSequence = () => {
    const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
    const [active, setActive] = useState(shouldPlay);

    const rootRef = useRef(null);
    const skipRef = useRef(null);
    const positionRef = useRef(null);
    const logoRef = useRef(null);
    const curtainRef = useRef(null);
    const plateRef = useRef(null);
    const wordRef = useRef(null);
    const goldRef = useRef(null);
    const brandRef = useRef(null);
    const bandRef = useRef(null);
    const markWrapRef = useRef(null);

    useEffect(() => {
        if (!active) return undefined;

        const markEl = document.querySelector("[data-intro-mark]");
        const textEl = document.querySelector("[data-intro-text]");

        // بدون شعار في الهيدر لا يوجد مكان ينتقل إليه الرمز
        if (!markEl || !textEl) {
            const bail = setTimeout(() => setActive(false), 0);
            return () => clearTimeout(bail);
        }

        const pageEls = Array.from(
            document.querySelectorAll("[data-intro-page] > *")
        );

        const animations = [];
        const timers = [];
        let cancelShine = null;
        let done = false;

        const play = (el, frames, options) => {
            const animation = el.animate(frames, { fill: "both", ...options });
            animations.push(animation);
            return animation;
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        markEl.style.opacity = "0";
        textEl.style.opacity = "0";
        pageEls.forEach((el) => {
            el.style.opacity = "0";
        });

        // إزالة فقط: تُستدعى أيضاً عند تنظيف التأثير، وتنظيف React
        // في وضع StrictMode لا يعني أن المقدمة انتهت
        const teardown = () => {
            if (done) return;
            done = true;

            timers.forEach(clearTimeout);
            animations.forEach((animation) => animation.cancel());
            if (cancelShine) cancelShine();

            markEl.style.opacity = "";
            textEl.style.opacity = "";
            pageEls.forEach((el) => {
                el.style.opacity = "";
            });

            document.body.style.overflow = previousOverflow;
        };

        // انتهاء فعلي للمقدمة: لا تظهر مرة أخرى في هذه الجلسة
        const finish = () => {
            teardown();

            try {
                window.sessionStorage.setItem(SESSION_KEY, "1");
            } catch {
                // التخزين غير متاح: المقدمة ستعمل مرة أخرى، وهذا مقبول
            }

            setActive(false);
        };

        const skip = finish;

        skipRef.current = skip;

        // متصفحات الموبايل تُطلق resize عند طيّ شريط العنوان،
        // فلا يُلغى التتابع إلا إذا تغيّر العرض فعلاً وصار القياس غير صالح
        let lastWidth = window.innerWidth;
        const onResize = () => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            skip();
        };

        // ١ · الشعار يظهر محفوراً
        play(
            plateRef.current,
            [
                { opacity: 0, transform: "scale(1.06)" },
                { opacity: 1, transform: "scale(1)" },
            ],
            { duration: T.appear * 1000, easing: RISE_EASE }
        );

        play(
            wordRef.current,
            [{ opacity: 0 }, { opacity: 1 }],
            {
                duration: T.appear * 0.7 * 1000,
                delay: T.appear * 0.45 * 1000,
            }
        );

        // ٢ · شعاع ضوء واحد يعبر المعدن
        play(
            bandRef.current,
            [
                { opacity: 0, transform: "translateX(0)" },
                { opacity: 1, offset: 0.2 },
                { opacity: 0, transform: `translateX(${STACK_W * 1.75}px)` },
            ],
            {
                duration: T.sweepDur * 1000,
                delay: T.sweepStart * 1000,
                easing: "cubic-bezier(.5,0,.3,1)",
            }
        );

        // ٣ · الانتقال: يُقاس مكان شعار الهيدر لحظة الانطلاق لا قبلها
        timers.push(
            setTimeout(() => {
                const host = logoRef.current.getBoundingClientRect();
                const from = markWrapRef.current.getBoundingClientRect();
                const to = markEl.getBoundingClientRect();

                const scale = to.width / from.width;
                const dx =
                    to.left + to.width / 2 -
                    (host.left + (from.left + from.width / 2 - host.left) * scale);
                const dy =
                    to.top + to.height / 2 -
                    (host.top + (from.top + from.height / 2 - host.top) * scale);

                play(
                    logoRef.current,
                    [
                        { transform: "none" },
                        { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
                    ],
                    { duration: T.fly * 1000, easing: FLY_EASE }
                );

                // الاسم المكدّس يختفي، فالهيدر له اسمه الخاص
                play(wordRef.current, [{ opacity: 1 }, { opacity: 0 }], {
                    duration: Math.min(0.35, T.fly * 0.4) * 1000,
                    fill: "forwards",
                });

                // لون المقدمة الذهبي يتحوّل إلى تدرّج العلامة في الطريق
                play(goldRef.current, [{ opacity: 1 }, { opacity: 0 }], {
                    duration: T.fly * 0.45 * 1000,
                    delay: T.fly * 0.4 * 1000,
                });
                play(brandRef.current, [{ opacity: 0 }, { opacity: 1 }], {
                    duration: T.fly * 0.45 * 1000,
                    delay: T.fly * 0.4 * 1000,
                });

                // الستارة تتلاشى
                play(curtainRef.current, [{ opacity: 1 }, { opacity: 0 }], {
                    duration: T.fly * 0.85 * 1000,
                    easing: "ease-out",
                });

                // الصفحة تطلع من تحت بتدرّج
                pageEls.forEach((el, index) => {
                    play(
                        el,
                        [
                            { opacity: 0, transform: "translateY(16px)" },
                            { opacity: 1, transform: "none" },
                        ],
                        {
                            duration: 700,
                            delay: T.fly * 0.3 * 1000 + index * 70,
                            easing: RISE_EASE,
                        }
                    );
                });

                // اسم الشعار يصل إلى جانب الرمز الهابط
                play(
                    textEl,
                    [
                        { opacity: 0, transform: "translateX(10px)" },
                        { opacity: 1, transform: "none" },
                    ],
                    {
                        duration: 520,
                        delay: T.fly * 0.72 * 1000,
                        easing: RISE_EASE,
                    }
                );
            }, FLY_START * 1000)
        );

        // ٤ · تسليم الرمز الحقيقي في الهيدر ثم لمعة قصيرة
        timers.push(
            setTimeout(() => {
                markEl.style.opacity = "1";

                if (logoRef.current) {
                    logoRef.current.style.opacity = "0";
                }

                // الستارة اختفت: لا تعترض الصفحة حتى تنتهي اللمعة
                if (rootRef.current) {
                    rootRef.current.style.pointerEvents = "none";
                }

                cancelShine = runLandingShine(markEl);
            }, TOTAL * 1000)
        );

        timers.push(setTimeout(finish, (TOTAL + 1.1) * 1000));

        window.addEventListener("keydown", skip);
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("keydown", skip);
            window.removeEventListener("resize", onResize);
            skipRef.current = null;
            teardown();
        };
    }, [active]);

    if (!active) return null;

    const markId = `intro-mark-${uid}`;
    const brandId = `intro-brand-${uid}`;
    const sweepId = `intro-sweep-${uid}`;
    const embossId = `intro-emboss-${uid}`;
    const maskId = `intro-mask-${uid}`;

    return (
        <div
            ref={rootRef}
            className="fixed inset-0 z-[100] cursor-pointer"
            onClick={() => skipRef.current?.()}
            aria-hidden="true"
        >
            {/* الستارة */}
            <div
                ref={curtainRef}
                className="absolute inset-0"
                style={{
                    backgroundImage:
                        "radial-gradient(120% 130% at 50% 44%, #5A3330 0%, #3A1D1F 38%, #221113 72%, #150A0B 100%)",
                }}
            >
                {/* داخل الستارة ليختفي معها بدل أن يبقى معلّقاً فوق الصفحة */}
                <button
                    type="button"
                    onClick={() => skipRef.current?.()}
                    className="
                        absolute
                        bottom-6
                        left-1/2
                        -translate-x-1/2
                        rounded-full
                        border
                        border-[#D5C7AD40]
                        px-5
                        py-2
                        font-[Tajawal]
                        text-[13px]
                        text-[#D5C7AD]
                        transition
                        hover:bg-[#D5C7AD1A]
                    "
                >
                    تخطّي
                </button>
            </div>

            {/* الشعار الطائر */}
            <div
                ref={positionRef}
                className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2"
                style={{ width: `${LOGO_WIDTH}%` }}
            >
                <div ref={logoRef} className="origin-top-left will-change-transform">
                    <svg
                        viewBox={`0 0 ${STACK_W} ${STACK_H}`}
                        className="block h-auto w-full overflow-visible"
                    >
                        <defs>
                            <linearGradient id={markId} x1="0" y1="0" x2="0.85" y2="1">
                                <stop offset="0" stopColor="#F5E4CB" />
                                <stop offset="0.42" stopColor="#D8B892" />
                                <stop offset="1" stopColor="#9E734E" />
                            </linearGradient>

                            <linearGradient id={brandId} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0" stopColor="#DCC0AE" />
                                <stop offset="0.5" stopColor="#B78D7B" />
                                <stop offset="1" stopColor="#96594A" />
                            </linearGradient>

                            <linearGradient id={sweepId} x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                                <stop offset="0.5" stopColor="#FFF7E9" stopOpacity="0.92" />
                                <stop offset="1" stopColor="#fff" stopOpacity="0" />
                            </linearGradient>

                            <filter
                                id={embossId}
                                x="-30%"
                                y="-30%"
                                width="160%"
                                height="160%"
                            >
                                <feDropShadow
                                    dx="0"
                                    dy="4"
                                    stdDeviation="5"
                                    floodColor="#000"
                                    floodOpacity="0.6"
                                />
                            </filter>

                            <mask id={maskId}>
                                <g fill="#fff" fillRule="evenodd">
                                    <path
                                        transform={`translate(${MARK_DX}, ${MARK_DY})`}
                                        d={MARK}
                                    />
                                    <path
                                        transform={`translate(${TEXT_DX}, ${TEXT_DY})`}
                                        d={TEXT}
                                    />
                                </g>
                            </mask>
                        </defs>

                        <g
                            ref={plateRef}
                            filter={`url(#${embossId})`}
                            style={{
                                opacity: 0,
                                transformBox: "view-box",
                                transformOrigin: "50% 50%",
                            }}
                        >
                            <g
                                ref={markWrapRef}
                                transform={`translate(${MARK_DX}, ${MARK_DY})`}
                            >
                                <path
                                    ref={goldRef}
                                    d={MARK}
                                    fill={`url(#${markId})`}
                                    fillRule="evenodd"
                                />
                                <path
                                    ref={brandRef}
                                    d={MARK}
                                    fill={`url(#${brandId})`}
                                    fillRule="evenodd"
                                    style={{ opacity: 0 }}
                                />
                            </g>

                            <path
                                ref={wordRef}
                                transform={`translate(${TEXT_DX}, ${TEXT_DY})`}
                                d={TEXT}
                                fill={`url(#${markId})`}
                                fillRule="evenodd"
                                style={{ opacity: 0 }}
                            />
                        </g>

                        <g mask={`url(#${maskId})`}>
                            <g ref={bandRef} style={{ opacity: 0 }}>
                                <rect
                                    x={-STACK_W * 0.6}
                                    y={-STACK_H * 0.4}
                                    width={STACK_W * 0.42}
                                    height={STACK_H * 1.9}
                                    transform={`rotate(14 ${STACK_W / 2} ${STACK_H / 2})`}
                                    fill={`url(#${sweepId})`}
                                />
                            </g>
                        </g>
                    </svg>
                </div>
            </div>

        </div>
    );
};

export default IntroSequence;
