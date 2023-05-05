import { atom } from 'recoil'

export interface ICategory {
    id: string
    text: string
}

export const defaultColorClass = 'bg-gray-200 border-gray-200 text-gray-600'

export const categoriesState = atom({
    key: 'categories',
    default: [
        {
            groupName: 'time',
            data: [
                {
                    id: 'breakfast',
                    text: '아침',
                },
                {
                    id: 'brunch',
                    text: '아점',
                },
                {
                    id: 'lunch',
                    text: '점심',
                },
                {
                    id: 'linner',
                    text: '점저',
                },
                {
                    id: 'dinner',
                    text: '저녁',
                },
                {
                    id: 'midnight',
                    text: '야식',
                },
                {
                    id: 'snack',
                    text: '간식',
                },
            ],
            colorClass: 'border-blue-300 bg-blue-300 text-blue-800',
        },
        {
            groupName: 'foodType',
            data: [
                {
                    id: 'korean',
                    text: '한식',
                },
                {
                    id: 'western',
                    text: '양식',
                },
                {
                    id: 'japanese',
                    text: '일식',
                },
                {
                    id: 'chinese',
                    text: '중식',
                },
                {
                    id: 'asian',
                    text: '아시안',
                },
            ],
            colorClass: 'border-orange-200 bg-orange-200 text-red-600',
        },
    ],
})
