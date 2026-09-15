import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import UserAvatar from "./UserAvatar";
import { accountLinksFor } from "../../config/navigation";

/**
 * زر الحساب في الهيدر: الصورة والاسم وسهم، ويفتح قائمة فيها أقسام الحساب وتسجيل الخروج.
 */
const UserMenu = ({ user, onLogout }) => {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);
    const menuRef = useRef(null);
    const triggerRef = useRef(null);
    const menuId = useId();
    const { pathname } = useLocation();

    const displayName = user?.name?.trim() || "حسابي";

    // إغلاق عند النقر خارج القائمة أو الضغط على Escape
    useEffect(() => {
        if (!open) return undefined;

        const onPointerDown = (event) => {
            if (!rootRef.current?.contains(event.target)) setOpen(false);
        };
        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    // التركيز على أول عنصر عند الفتح لمستخدمي لوحة المفاتيح
    useEffect(() => {
        if (open) menuRef.current?.querySelector('[role="menuitem"]')?.focus();
    }, [open]);

    const moveFocus = (event) => {
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        event.preventDefault();

        const items = [...menuRef.current.querySelectorAll('[role="menuitem"]')];
        const current = items.indexOf(document.activeElement);
        const next = {
            ArrowDown: (current + 1) % items.length,
            ArrowUp: (current - 1 + items.length) % items.length,
            Home: 0,
            End: items.length - 1,
        }[event.key];

        items[next]?.focus();
    };

    const itemClass =
        "flex h-[42px] w-full items-center gap-[10px] rounded-[8px] px-[12px] text-right font-[Tajawal] text-[15px] transition-colors focus:outline-none";

    return (
        <div ref={rootRef} className="relative">
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={menuId}
                className="flex h-[44px] cursor-pointer items-center gap-[10px] rounded-full py-[4px] pe-[8px] ps-[4px] transition-colors hover:bg-[#D5C7AD26]"
            >
                <UserAvatar user={user} />
                <span className="max-w-[160px] truncate font-[Tajawal] text-[16px] font-medium text-[#2B2527]">
                    {displayName}
                </span>
                <FiChevronDown
                    aria-hidden="true"
                    className={`h-[18px] w-[18px] shrink-0 text-[#2B2527] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    strokeWidth={2.5}
                />
            </button>

            {open && (
                <div
                    ref={menuRef}
                    id={menuId}
                    role="menu"
                    aria-label="قائمة الحساب"
                    onKeyDown={moveFocus}
                    className="absolute left-0 top-[calc(100%+8px)] z-[60] w-[240px] rounded-[14px] border border-[#E9E2DA] bg-white p-[6px] shadow-[0px_12px_32px_-8px_#4C232533]"
                >
                    <div className="mb-[4px] border-b border-[#F1ECE6] px-[12px] pb-[10px] pt-[8px]">
                        <p className="truncate font-[Tajawal] text-[14px] font-bold text-[#2B2527]">{displayName}</p>
                        {user?.email && (
                            <p dir="ltr" className="truncate text-right font-[Tajawal] text-[12px] text-[#8A7F80]">
                                {user.email}
                            </p>
                        )}
                    </div>

                    {accountLinksFor(user?.role).map(({ to, label, Icon }) => {
                        const active = pathname === to;
                        return (
                            <Link
                                key={to}
                                to={to}
                                role="menuitem"
                                aria-current={active ? "page" : undefined}
                                onClick={() => setOpen(false)}
                                className={`${itemClass} ${
                                    active
                                        ? "bg-[#D5C7AD33] font-bold text-[#4C2325]"
                                        : "text-[#4C2325] hover:bg-[#D5C7AD1A] focus:bg-[#D5C7AD1A]"
                                }`}
                            >
                                <Icon className="h-[17px] w-[17px] shrink-0" aria-hidden="true" />
                                {label}
                            </Link>
                        );
                    })}

                    <div className="my-[4px] border-t border-[#F1ECE6]" />

                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                            setOpen(false);
                            onLogout();
                        }}
                        className={`${itemClass} cursor-pointer text-[#B91C1C] hover:bg-[#FEF2F2] focus:bg-[#FEF2F2]`}
                    >
                        <FiLogOut className="h-[17px] w-[17px] shrink-0" aria-hidden="true" />
                        تسجيل الخروج
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
