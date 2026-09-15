/** رأس موحّد لصفحات الإدارة: عنوان ووصف قصير وأزرار الإجراءات. */
const AdminPageHeader = ({ title, description, actions, breadcrumb }) => (
  <div className="mb-[20px] flex flex-col gap-[14px] sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      {breadcrumb && <div className="mb-[6px] text-[13px] text-[#6B5E5F]">{breadcrumb}</div>}
      <h1 className="text-[24px] font-[800] leading-[34px] text-[#2B2527] sm:text-[28px]">{title}</h1>
      {description && <p className="mt-[2px] max-w-[620px] text-[14px] leading-[22px] text-[#6B5E5F]">{description}</p>}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap gap-[10px]">{actions}</div>}
  </div>
);

export default AdminPageHeader;
