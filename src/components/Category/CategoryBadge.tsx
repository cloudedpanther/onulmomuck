import { useFormContext } from 'react-hook-form'
import { ITag, defaultColorClass } from '../../store'
import CategoryBadgeUI from './CategoryBadgeUI'

interface ICategoryBadge {
    name: string
    tag: ITag
    colorClass: string
    submit: boolean
}

const CategoryBadge = ({ name, tag, colorClass, submit }: ICategoryBadge) => {
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
