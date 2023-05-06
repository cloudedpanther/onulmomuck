import { useFormContext } from 'react-hook-form'
import { ICategory, defaultColorClass } from '../../store'
import CategoryBadgeUI from './CategoryBadgeUI'

interface ICategoryBadge {
    category: ICategory
    colorClass: string
}

const CategoryBadge = ({ category, colorClass }: ICategoryBadge) => {
    const { register, handleSubmit } = useFormContext()

    const onValid = (data: any) => {
        console.log(data)
    }

    return (
        <label htmlFor={category.id} className="swap mr-4">
            <input
                type="checkbox"
                id={category.id}
                {...register(category.id, {
                    onChange: () => handleSubmit(onValid)(),
                })}
            />

            <CategoryBadgeUI className={`${defaultColorClass} swap-off`} text={category.text} />

            <CategoryBadgeUI className={`${colorClass} swap-on`} text={category.text} />
        </label>
    )
}

export default CategoryBadge
