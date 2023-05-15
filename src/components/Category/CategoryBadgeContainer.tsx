import { ITag } from '../../store'
import { ISearchForm } from '../Home'
import CategoryBadge from './CategoryBadge'

interface ICategoryBadgeContainer {
    name: string
    tags: ITag[]
    colorClass: string
    onSubmit?: (data: ISearchForm) => Promise<void>
}

const CategoryBadgeContainer = ({ name, tags, colorClass, onSubmit }: ICategoryBadgeContainer) => {
    return (
        <div className="py-3 flex flex-wrap gap-3 items-center mx-4">
            {tags?.map((tag) => {
                return (
                    <CategoryBadge
                        key={tag.id}
                        name={name}
                        tag={tag}
                        colorClass={colorClass}
                        onSubmit={onSubmit}
                    />
                )
            })}
        </div>
    )
}

export default CategoryBadgeContainer
