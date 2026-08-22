import BrandInfo from "../Components/Features/Feature3/BrandInfo";
import FooterLinks from "../Components/Features/Feature3/FooterLinks";
import ContactInfo from "../Components/Features/Feature3/ContactInfo";
import CopyRight from "../Components/Features/Feature3/CopyRight";


const Footer = () => {
    return (
        <footer dir="rtl"
            className="w-full min-h-[375.25px] bg-white pt-[64px]">

            {/* Footer Columns */}
            <div
                className="
                    mx-auto
                    grid
                    w-[1216px]
                    h-[242.25px]
                    grid-cols-3
                    items-start
                    gap-[48px]
                    pb-[48px]
                    rotate-0
                    opacity-100
                "
            >
                {/* Right */}
                <div className="col-start-1">
                    <BrandInfo />
                </div>

                {/* Center */}
                <div className="col-start-2">
                    <FooterLinks />
                </div>

                {/* Left */}
                <div className="col-start-3">
                    <ContactInfo />
                </div>
            </div>
            <CopyRight />
        </footer>
    );
};

export default Footer;