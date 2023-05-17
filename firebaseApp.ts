import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
    collection,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    startAfter,
} from 'firebase/firestore'
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

export interface IPost {
    id: string
    title: string
    text?: string
    thumbnailUrl: string
    createdAt?: string
    createrUid?: string
    tags?: string[]
    totalComments: number
    totalLikes: number
}

interface IGetPosts {
    keyword?: string
    selectedTags?: string[]
    lastVisible?: number
}

export const getPosts = async (
    pageSize: number,
    { keyword, selectedTags, lastVisible }: IGetPosts
) => {
    let posts: IPost[] = []

    const searchKey = keyword ? keyword.trim() : ''

    const postRef = collection(db, 'post')

    let lastCheckIndex = lastVisible || Infinity

    while (posts.length < pageSize) {
        const q = query(
            postRef,
            orderBy('createdAt', 'desc'),
            startAfter(lastCheckIndex),
            limit(pageSize)
        )

        const postSnap = await getDocs(q)

        if (postSnap.docs.length === 0) break

        postSnap.forEach((docs) => {
            const { createdAt, title, thumbnailUrl, totalComments, likeUids, tags } = docs.data()

            if (posts.length === pageSize) return

            lastCheckIndex = Number(createdAt)

            if (selectedTags) {
                const unMatchedTags = [...selectedTags].filter((tag) => !tags.includes(tag))
                const unSelected = unMatchedTags.length > 0

                if (unSelected) return
            }

            if (keyword) {
                if (!title.includes(searchKey)) return
            }

            const newPost = {
                id: docs.id,
                createdAt,
                title,
                thumbnailUrl,
                totalComments,
                totalLikes: likeUids.length,
            }

            posts = [...posts, newPost]
        })
    }

    return { posts, lastCheckIndex }
}

export const getMyPosts = async (pageSize: number, lastVisible: number, uid: string) => {
    let posts: IPost[] = []

    const postRef = collection(db, 'post')

    let lastCheckIndex = lastVisible || Infinity

    while (posts.length < pageSize) {
        const q = query(
            postRef,
            orderBy('createdAt', 'desc'),
            startAfter(lastCheckIndex),
            limit(pageSize)
        )

        const postSnap = await getDocs(q)

        if (postSnap.docs.length === 0) break

        postSnap.forEach((docs) => {
            const { createdAt, title, thumbnailUrl, totalComments, likeUids, createrUid } =
                docs.data()

            if (posts.length === pageSize) return

            lastCheckIndex = Number(createdAt)

            if (uid !== createrUid) return

            const newPost = {
                id: docs.id,
                createdAt,
                title,
                thumbnailUrl,
                totalComments,
                totalLikes: likeUids.length,
            }

            posts = [...posts, newPost]
        })
    }

    return { posts, lastCheckIndex }
}

export const getMyLikes = async (pageSize: number, lastVisible: number, uid: string) => {
    let posts: IPost[] = []

    const postRef = collection(db, 'post')

    let lastCheckIndex = lastVisible || Infinity

    while (posts.length < pageSize) {
        const q = query(
            postRef,
            orderBy('createdAt', 'desc'),
            startAfter(lastCheckIndex),
            limit(pageSize)
        )

        const postSnap = await getDocs(q)

        if (postSnap.docs.length === 0) break

        postSnap.forEach((docs) => {
            const { createdAt, title, thumbnailUrl, totalComments, likeUids } = docs.data()

            if (posts.length === pageSize) return

            lastCheckIndex = Number(createdAt)

            if (!likeUids.includes(uid)) return

            const newPost = {
                id: docs.id,
                createdAt,
                title,
                thumbnailUrl,
                totalComments,
                totalLikes: likeUids.length,
            }

            posts = [...posts, newPost]
        })
    }

    return { posts, lastCheckIndex }
}
