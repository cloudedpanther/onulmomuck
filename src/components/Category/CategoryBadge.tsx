import { useFormContext } from 'react-hook-form'
import { ITag, defaultColorClass } from '../../store'
import CategoryBadgeUI from './CategoryBadgeUI'
import { ISearchForm } from '../Home'

interface ICategoryBadge {
    name: string
    tag: ITag
    colorClass: string
    onSubmit?: (data: ISearchForm) => Promise<void>
}

const CategoryBadge = ({ name, tag, colorClass, onSubmit }: ICategoryBadge) => {
    const { register, handleSubmit, clearErrors } = useFormContext<ISearchForm>()

    const registerSettings = {
        onChange: () => {
            if (onSubmit !== undefined) {
                handleSubmit(onSubmit)()
                return
            }

            clearErrors(name)
        },
    }

    return (
        <label htmlFor={tag.id} className="swap">
            <input type="checkbox" id={tag.id} {...register(tag.id, registerSettings)} />

            <CategoryBadgeUI className={`${defaultColorClass} swap-off`} text={tag.text} />

            <CategoryBadgeUI className={`${colorClass} swap-on`} text={tag.text} />
        </label>
    )
}

export default CategoryBadge
