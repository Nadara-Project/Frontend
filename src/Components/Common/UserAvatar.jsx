import { FiUser } from "react-icons/fi";

/** صورة المستخدم إن وُجدت، وإلا دائرة بيج بأيقونة شخص (تصميم فيجما). */
const UserAvatar = ({ user, className = "h-[36px] w-[36px]" }) =>
    user?.image_url ? (
        <img src={user.image_url} alt="" className={`${className} shrink-0 rounded-full object-cover`} />
    ) : (
        <span
            aria-hidden="true"
            className={`${className} flex shrink-0 items-center justify-center rounded-full bg-[#EFE3D3] text-[#4C2325]`}
        >
            <FiUser className="h-[18px] w-[18px]" strokeWidth={2.2} />
        </span>
    );

export default UserAvatar;
