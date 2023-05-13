import { ITag } from '../../store'
import CategoryBadge from './CategoryBadge'

interface ICategoryBadgeContainer {
    name: string
    tags: ITag[]
    colorClass: string
    submit: boolean
}

const CategoryBadgeContainer = ({ name, tags, colorClass, submit }: ICategoryBadgeContainer) => {
    return (
        <div className="py-3 flex flex-wrap gap-3 items-center mx-4">
            {tags?.map((tag) => {
                return (
                    <CategoryBadge
                        key={tag.id}
                        name={name}
                        tag={tag}
                        colorClass={colorClass}
                        submit={submit}
                    />
                )
            })}
        </div>
    )
}

export default CategoryBadgeContainer
