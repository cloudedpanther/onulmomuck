import { ICategory } from '../../store'
import CategoryBadge from './CategoryBadge'

interface ICategoryBadgeContainer {
    groupName: string
    categoryList: ICategory[]
    colorClass: string
    submit: boolean
}

const CategoryBadgeContainer = ({
    groupName,
    categoryList,
    colorClass,
    submit,
}: ICategoryBadgeContainer) => {
    return (
        <div className="py-3 flex flex-wrap gap-3 items-center mx-4">
            {categoryList.map((category) => {
                return (
                    <CategoryBadge
                        key={category.id}
                        groupName={groupName}
                        category={category}
                        colorClass={colorClass}
                        submit={submit}
                    />
                )
            })}
        </div>
    )
}

export default CategoryBadgeContainer
