import { useFormContext } from 'react-hook-form'

export interface ICategory {
    id: string
    text: string
}

interface ICategoryBadge {
    category: ICategory
    colorClass: string
}

const CategoryBadge = ({ category, colorClass }: ICategoryBadge) => {
    const { register } = useFormContext()

    return (
        <label htmlFor={category.id} className="swap mr-4">
            <input type="checkbox" id={category.id} {...register(category.id)} />

            <div
                className="swap-off fill-current badge bg-gray-200 
        border-gray-200 text-gray-600 text-xs font-bold p-3"
            >
                {category.text}
            </div>

            <div className={`swap-on fill-current badge text-xs font-bold p-3 ${colorClass}`}>
                {category.text}
            </div>
        </label>
    )
}

export default CategoryBadge
