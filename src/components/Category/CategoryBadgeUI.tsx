interface ICategoryBadgeUI {
    className: string
    text: string
}

const CategoryBadgeUI = ({ className, text }: ICategoryBadgeUI) => {
    return <div className={`fill-current badge text-xs font-bold p-3 ${className}`}>{text}</div>
}

export default CategoryBadgeUI
