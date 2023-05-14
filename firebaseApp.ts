import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { ICategory, ITag } from './src/store'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENSOR_ID,
    appId: import.meta.env.VITE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export const getCategories = async () => {
    let categories: ICategory[] = []

    const categoryRef = collection(db, 'category')
    const categorySnap = await getDocs(categoryRef)

    categorySnap.forEach((docs) => {
        const { name, colorClass } = docs.data()

        const category = {
            id: docs.id,
            name,
            colorClass,
            tags: [],
        }

        categories = [category, ...categories]
    })

    for (const category of categories) {
        let tags: ITag[] = []

        const tagRef = collection(db, `category/${category.id}/tag`)
        const tagQ = query(tagRef, orderBy('tid'))

        const tagSnap = await getDocs(tagQ)

        tagSnap.forEach((tagDocs) => {
            const { text } = tagDocs.data()
            const tag = { id: tagDocs.id, text }
            tags = [...tags, tag]
        })

        category.tags = tags
    }

    return categories
}
