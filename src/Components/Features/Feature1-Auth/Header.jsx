
const Header = ({ title, subtitle }) => {
  return (
    <div
      className="
                flex
                w-full
                flex-col
                items-center
                text-center
                px-4
                pt-5
                mb-6
                sm:px-6
                sm:pt-6
                sm:mb-8
            "
    >
      {/* Logo */}
      <div
        className="
                    h-[60px]
                    sm:h-[72px]
                    py-[10px]
                    sm:py-[16px]
                    flex
                    items-center
                    justify-center
                    w-full
                "
      >
        <img
          src="/Logo.svg"
          alt="نضارة - Nadara"
          className="h-full w-auto max-w-[180px] object-contain"
        />
      </div>

      {/* Title */}
      <h1
        className="
                    mt-3
                    font-[Tajawal]
                    font-medium
                    text-[21px]
                    sm:text-[24px]
                    leading-[30px]
                    sm:leading-[32px]
                    text-center
                    text-[#4C2325]
                "
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        className="
                    mt-1
                    px-2
                    font-[Tajawal]
                    font-normal
                    text-[14px]
                    sm:text-[16px]
                    leading-[22px]
                    sm:leading-[24px]
                    text-center
                    text-[#4C2325]
                "
      >
        {subtitle}
      </p>
    </div>
  );
};

export default Header;