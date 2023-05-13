import { collection, doc, setDoc } from 'firebase/firestore'
import { db } from '../../../firebaseApp'
import { useRecoilValue } from 'recoil'
import { categoriesState } from '../../store'

export const SetCategoryButton = () => {
    const categoryState = useRecoilValue(categoriesState)
    const handleClick = async () => {
        const categoryRef = collection(db, 'category')
        const timeRef = doc(categoryRef, 'time')
        const foodTypeRef = doc(categoryRef, 'foodType')

        await setDoc(timeRef, {
            name: '시간대',
            colorClass: 'border-blue-300 bg-blue-300 text-blue-800',
        })
        await setDoc(foodTypeRef, {
            name: '음식 종류',
            colorClass: 'border-orange-200 bg-orange-200 text-red-600',
        })

        const timeTagRef = collection(timeRef, 'tag')
        const foodTypeTagRef = collection(foodTypeRef, 'tag')

        categoryState[0].data.forEach(async ({ id, text }, index) => {
            await setDoc(doc(timeTagRef, id), {
                tid: index,
                text: text,
            })
        })
        categoryState[1].data.forEach(async ({ id, text }, index) => {
            await setDoc(doc(foodTypeTagRef, id), {
                tid: index,
                text: text,
            })
        })
        await setDoc(doc(foodTypeTagRef, 'else'), {
            tid: 999,
            text: '기타',
        })
    }

    return (
        <>
            <button onClick={handleClick}>카테고리 설정</button>
        </>
    )
}
