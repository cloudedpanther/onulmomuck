import { useState, useEffect } from 'react'
import { IPost, getMyLikes } from '../../../firebaseApp'
import { useRecoilValue } from 'recoil'
import { userState } from '../../store'
import PostList from '../PostList'

interface IPostData {
    posts: IPost[]
    accPosts: IPost[]
    page: number
    lastVisible: number
    accLastVisible: number[]
    isLastPage: boolean
}

const PAGE_SIZE = 8

const MyLikes = () => {
    const user = useRecoilValue(userState)

    const [postData, setPostData] = useState<IPostData>({
        posts: [],
        accPosts: [],
        page: 1,
        lastVisible: Infinity,
        accLastVisible: [],
        isLastPage: false,
    })

    const { posts, accPosts, page, lastVisible, isLastPage } = postData

    const [isLoading, setIsLoading] = useState(false)

    const cacheStates = (newState: IPostData) => {
        sessionStorage.setItem('myLikes', JSON.stringify(newState))
    }

    const loadCachedStates = () => {
        const json = sessionStorage.getItem('myLikes')

        if (!json) return false

        const { posts, accPosts, page, lastVisible, accLastVisible, isLastPage } = JSON.parse(json)

        setPostData({
            posts,
            accPosts,
            page,
            lastVisible,
            accLastVisible,
            isLastPage,
        })

        return true
    }

    const handleNextPage = async () => {
        if (user === null || user.uid === null) return

        if (isLastPage) return

        const { posts: fetchedPosts, lastCheckIndex } = await getMyLikes(
            PAGE_SIZE,
            lastVisible,
            user?.uid
        )

        if (fetchedPosts.length === 0) {
            setPostData((prev) => {
                const newState = {
                    ...prev,
                    isLastPage: true,
                }
                cacheStates(newState)
                return newState
            })
            return
        }

        setPostData((prev) => {
            const newState = {
                ...prev,
                posts: fetchedPosts,
                accPosts: [...prev.accPosts, ...prev.posts],
                lastVisible: lastCheckIndex,
                accLastVisible: [...prev.accLastVisible, prev.lastVisible],
                page: prev.page + 1,
            }
            cacheStates(newState)
            return newState
        })
    }

    const handlePrevPage = () => {
        if (accPosts.length === 0) return

        setPostData((prev) => {
            const newState = {
                ...prev,
                posts: prev.accPosts.slice(-1 * PAGE_SIZE),
                accPosts: prev.accPosts.slice(0, -1 * PAGE_SIZE),
                page: prev.page - 1,
                lastVisible: prev.accLastVisible.slice(-1)[0],
                accLastVisible: prev.accLastVisible.slice(0, -1),
                isLastPage: false,
            }
            cacheStates(newState)
            return newState
        })
    }

    useEffect(() => {
        const initMyLikes = async () => {
            if (user === null || user.uid === null) {
                return
            }

            if (loadCachedStates()) return

            const { posts: fetchedPosts, lastCheckIndex } = await getMyLikes(
                PAGE_SIZE,
                lastVisible,
                user?.uid
            )

            setPostData((prev) => {
                const newState = {
                    ...prev,
                    posts: fetchedPosts,
                    lastVisible: lastCheckIndex,
                }
                cacheStates(newState)
                return newState
            })
        }
        setIsLoading(true)
        initMyLikes()
        setIsLoading(false)
    }, [])

    return (
        <div className={isLoading ? 'pointer-events-none' : ''}>
            <PostList posts={posts} page={page} onPrev={handlePrevPage} onNext={handleNextPage} />
        </div>
    )
}

export default MyLikes
