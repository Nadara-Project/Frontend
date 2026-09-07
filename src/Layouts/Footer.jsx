import BrandInfo from "../Components/Features/Feature3/BrandInfo";
import FooterLinks from "../Components/Features/Feature3/FooterLinks";
import ContactInfo from "../Components/Features/Feature3/ContactInfo";
import CopyRight from "../Components/Features/Feature3/CopyRight";

const Footer = () => {
    return (
        <footer
            dir="rtl"
            className="
                w-full
                bg-white
                pt-[48px]
                sm:pt-[64px]
            "
        >
            {/* Footer Columns */}
            <div
                className="
                    mx-auto
                    grid
                    w-full
                    max-w-[1216px]
                    grid-cols-1
                    gap-[40px]
                    px-[24px]
                    sm:px-[32px]
                    md:grid-cols-2
                    lg:grid-cols-3
                    lg:gap-[48px]
                    lg:pb-[48px]
                "
            >
                {/* Right */}
                <div className="w-full">
                    <BrandInfo />
                </div>

                {/* Center */}
                <div className="w-full">
                    <FooterLinks />
                </div>

                {/* Left */}
                <div className="w-full">
                    <ContactInfo />
                </div>
            </div>

            <CopyRight />
        </footer>
    );
};

export default Footer;