import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    setDoc,
    startAfter,
    updateDoc,
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { ICategory, ITag } from './src/store'
import { parseDate } from './src/utils'

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

export const storeUserName = async (uid: string, username: string) => {
    const userRef = collection(db, 'user')
    await setDoc(doc(userRef, uid), {
        name: username,
    })
}

export const getPostCreaterName = async (uid: string) => {
    const userRef = collection(db, 'user')
    const userDoc = doc(userRef, uid)
    const userSnap = await getDoc(userDoc)

    const userData = userSnap.data()
    if (!userData) return undefined

    const { name } = userData
    return name
}

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

export const getPost = async (pid: string) => {
    const postRef = collection(db, 'post')
    const postDoc = doc(postRef, pid)
    const postSnap = await getDoc(postDoc)

    return postSnap.data()
}

export const editPost = async (pid: string, text: string) => {
    try {
        await updateDoc(doc(db, 'post', pid), {
            text,
        })
    } catch (error) {
        console.log(error)
    }
}

export const deletePost = async (pid: string) => {
    const postRef = collection(db, 'post')
    const postDoc = doc(postRef, pid)

    try {
        await deleteDoc(postDoc)
    } catch (error) {
        console.log(error)
    }
}

export const updateLiked = async (pid: string, likeUids: string[]) => {
    await updateDoc(doc(db, 'post', pid), {
        likeUids,
    })
}

interface ICreateNewComment {
    pid: string
    uid: string
    createrName: string
    content: string
}

export const createNewComment = async ({ pid, uid, createrName, content }: ICreateNewComment) => {
    const postDoc = doc(db, 'post', pid)
    const postSnap = await getDoc(postDoc)
    const postData = postSnap.data()

    if (!postData) return

    const { totalComments } = postData

    await updateDoc(postDoc, {
        totalComments: totalComments + 1,
    })

    const commentsRef = collection(postDoc, 'comments')
    await setDoc(doc(commentsRef), {
        uid,
        createrName,
        content,
        createdAt: Date.now(),
    })
}

export interface IComment {
    id: string
    createrName: string
    content: string
    createdAt: string
}

export const getComments = async (pageSize: number, pid: string, lastVisible?: number) => {
    let comments: IComment[] = []

    const postDoc = doc(db, 'post', pid)
    const commentsRef = collection(postDoc, 'comments')

    let lastCheckIndex = lastVisible || Infinity

    const q = query(
        commentsRef,
        orderBy('createdAt', 'desc'),
        startAfter(lastCheckIndex),
        limit(pageSize)
    )

    const commentsSnap = await getDocs(q)

    commentsSnap.forEach((comment) => {
        const { createrName, content, createdAt } = comment.data()

        lastCheckIndex = createdAt

        const commentData = {
            id: comment.id,
            createrName,
            content,
            createdAt: parseDate(new Date(createdAt)),
        }
        comments = [...comments, commentData]
    })

    return { comments, lastCheckIndex }
}
