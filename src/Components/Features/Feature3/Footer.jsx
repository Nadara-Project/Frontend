import FooterCTA from "./FooterCTA";
import BrandInfo from "./BrandInfo";
import FooterLinks from "./FooterLinks";
import ContactInfo from "./ContactInfo";
import Copyright from "./CopyRight";

const Footer = () => {
  return (
    <footer
      dir="rtl"
      className="
                mx-auto
                w-full
                border-t
                border-[#D5C7AD33]
                bg-white
                pt-10
                md:pt-16
            "
    >
      <div
        className="
                    mx-auto
                    flex
                    w-full
                    max-w-[1280px]
                    flex-col
                    gap-10
                    px-4
                    md:gap-12
                    md:px-8
                "
      >
        {/* CTA */}
        <FooterCTA />

        {/* Footer Columns */}
        <div
          className="
                        grid
                        w-full
                        grid-cols-1
                        gap-8
                        pb-8
                        md:grid-cols-3
                        md:gap-12
                        md:pb-12
                    "
        >
          <BrandInfo />
          <FooterLinks />
          <ContactInfo />
        </div>

        {/* Copyright */}
        <Copyright />
      </div>
    </footer>
  );
};

export default Footer;