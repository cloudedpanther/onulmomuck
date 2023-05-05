import { ICategory } from '../../store'
import CategoryBadge from './CategoryBadge'

interface ICategoryBadgeContainer {
    categoryList: ICategory[]
    colorClass: string
}

const CategoryBadgeContainer = ({ categoryList, colorClass }: ICategoryBadgeContainer) => {
    return (
        <div className="h-12 flex items-center mx-4">
            {categoryList.map((category) => {
                return (
                    <CategoryBadge key={category.id} category={category} colorClass={colorClass} />
                )
            })}
        </div>
    )
}

export default CategoryBadgeContainer
