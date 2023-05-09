import { useFormContext } from 'react-hook-form'
import { ICategory, defaultColorClass } from '../../store'
import CategoryBadgeUI from './CategoryBadgeUI'

interface ICategoryBadge {
    groupName: string
    category: ICategory
    colorClass: string
    submit: boolean
}

const CategoryBadge = ({ groupName, category, colorClass, submit }: ICategoryBadge) => {
    const { register, handleSubmit, clearErrors } = useFormContext()

    const onValid = (data: any) => {
        console.log(data)
    }

    const registerSettings = {
        onChange: () => {
            if (submit) {
                handleSubmit(onValid)()
                return
            }

            clearErrors(groupName)
        },
    }

    return (
        <label htmlFor={category.id} className="swap">
            <input type="checkbox" id={category.id} {...register(category.id, registerSettings)} />

            <CategoryBadgeUI className={`${defaultColorClass} swap-off`} text={category.text} />

            <CategoryBadgeUI className={`${colorClass} swap-on`} text={category.text} />
        </label>
    )
}

export default CategoryBadge
