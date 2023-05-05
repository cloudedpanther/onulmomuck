import { FormProvider, useForm } from 'react-hook-form'
import { CategorySelector } from '../Category'

export const CategoryKeys = {
    BREAKFAST: 'breakfast',
    BRUNCH: 'brunch',
    LUNCH: 'lunch',
    LINNER: 'linner',
    DINNER: 'dinner',
    MIDNIGHT: 'midnight',
    SNACK: 'snack',
    KOREAN: 'korean',
    WESTERN: 'western',
    JAPANESE: 'japanese',
    CHINESE: 'chinese',
    ASIAN: 'asian',
}

export const categoryGroupList = [
    {
        id: 'time',
        data: [
            {
                id: CategoryKeys.BREAKFAST,
                text: '아침',
            },
            {
                id: CategoryKeys.BRUNCH,
                text: '아점',
            },
            {
                id: CategoryKeys.LUNCH,
                text: '점심',
            },
            {
                id: CategoryKeys.LINNER,
                text: '점저',
            },
            {
                id: CategoryKeys.DINNER,
                text: '저녁',
            },
            {
                id: CategoryKeys.MIDNIGHT,
                text: '야식',
            },
            {
                id: CategoryKeys.SNACK,
                text: '간식',
            },
        ],
        colorClass: 'border-blue-300 bg-blue-300 text-blue-800',
    },
    {
        id: 'foodType',
        data: [
            {
                id: CategoryKeys.KOREAN,
                text: '한식',
            },
            {
                id: CategoryKeys.WESTERN,
                text: '양식',
            },
            {
                id: CategoryKeys.JAPANESE,
                text: '일식',
            },
            {
                id: CategoryKeys.CHINESE,
                text: '중식',
            },
            {
                id: CategoryKeys.ASIAN,
                text: '아시안',
            },
        ],
        colorClass: 'border-orange-200 bg-orange-200 text-red-600',
    },
]

const Home = () => {
    const methods = useForm()

    return (
        <div className="mx-4 my-6">
            <form>
                <FormProvider {...methods}>
                    <CategorySelector />
                </FormProvider>
            </form>
        </div>
    )
}

export default Home
