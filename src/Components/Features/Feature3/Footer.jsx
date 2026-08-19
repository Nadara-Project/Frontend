import FooterCTA from "./FooterCTA";
import BrandInfo from "./BrandInfo";
import FooterLinks from "./FooterLinks";
import ContactInfo from "./ContactInfo";
import Copyright from "./CopyRight";

const Footer = () => {
  return (
    <footer dir="rtl" className="mx-auto
    w-[1280px]
    h-[670.25px]
    pt-[64px]
    border-t
    border-[#D5C7AD33]
    bg-white
    opacity-100">

      <div className="mx-auto
            w-[1280px]
            h-[605.25px]
            max-w-[1280px]
            flex
            flex-col
            gap-[48px] "
      >
        {/* CTA Banner */}
        <FooterCTA />

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

        {/* Copyright */}
        <Copyright />
      </div>

    </footer>
  );
};

export default Footer;