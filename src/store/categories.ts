import { atom, useRecoilValue } from 'recoil'

export interface ICategory {
    id: string
    name: string
    colorClass: string
    tags: ITag[]
}

export interface ITag {
    id: string
    text: string
}

export const defaultColorClass = 'bg-gray-200 border-gray-200 text-gray-600'

export const categoriesState = atom<ICategory[]>({
    key: 'categories',
    default: [],
})

export const getTagTypes = () => {
    const categories = useRecoilValue(categoriesState)

    return categories
        .map((category) => {
            return category.tags.map((tag) => tag.id)
        })
        .flat()
}
