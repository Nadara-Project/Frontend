function Copyright() {
    return (
        <div
            className="
                w-full
                border-t
                border-[#D5C7AD33]
                bg-[#D5C7AD1A]
                py-6
            "
        >
            <p
                className="
                    w-full
                    text-center
                    font-[Tajawal]
                    text-[12px]
                    font-medium
                    leading-5
                    text-[#4C2325]
                    sm:text-[14px]
                "
            >
                © {new Date().getFullYear()} عيادة نضارة NADARA - جميع الحقوق محفوظة
            </p>
        </div>
    );
}

export default Copyright;