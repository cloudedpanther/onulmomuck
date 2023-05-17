import { useState, useEffect } from 'react'
import { IPost, getMyPosts } from '../../../firebaseApp'
import { useRecoilValue } from 'recoil'
import { userState } from '../../store'
import PostList from '../PostList'

const PAGE_SIZE = 8

const MyPosts = () => {
    const user = useRecoilValue(userState)

    const [posts, setPosts] = useState<IPost[]>([])
    const [accPosts, setAccPosts] = useState<IPost[]>([])
    const [page, setPage] = useState(0)
    const [lastVisible, setLastVisible] = useState<number>(Infinity)
    const [accLastVisible, setAccLastVisible] = useState<number[]>([])
    const [isLastPage, setIsLastPage] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const initStates = (fetchedPosts: IPost[], lastCheckIndex: number) => {
        setPosts(fetchedPosts)
        setAccPosts([])
        setLastVisible(lastCheckIndex)
        setAccLastVisible([])
        setPage(1)
        setIsLastPage(false)
    }

    const handleNextPage = async () => {
        if (user === null || user.uid === null) return

        if (isLastPage) return

        const { posts: fetchedPosts, lastCheckIndex } = await getMyPosts(
            PAGE_SIZE,
            lastVisible,
            user?.uid
        )

        if (fetchedPosts.length === 0) {
            setIsLastPage(true)
            return
        }

        setAccPosts((prev) => [...prev, ...posts])
        setPosts(fetchedPosts)
        setAccLastVisible((prev) => [...prev, lastVisible])
        setLastVisible(lastCheckIndex)
        setPage((prev) => prev + 1)
    }

    const handlePrevPage = () => {
        if (accPosts.length === 0) return

        const prevPagePosts = accPosts.slice(-1 * PAGE_SIZE)
        setPosts(prevPagePosts)
        setAccPosts((prev) => prev.slice(0, -1 * PAGE_SIZE))
        setPage((prev) => prev - 1)
        const prevLastVisible = accLastVisible.slice(-1)[0]
        setLastVisible(prevLastVisible)
        setAccLastVisible((prev) => prev.slice(0, -1))
        setIsLastPage(false)
    }

    useEffect(() => {
        const initMyPosts = async () => {
            if (user === null || user.uid === null) {
                return
            }

            const { posts: fetchedPosts, lastCheckIndex } = await getMyPosts(
                PAGE_SIZE,
                lastVisible,
                user?.uid
            )
            initStates(fetchedPosts, lastCheckIndex)
        }
        setIsLoading(true)
        initMyPosts()
        setIsLoading(false)
    }, [])

    return (
        <div className={isLoading ? 'pointer-events-none' : ''}>
            <PostList posts={posts} page={page} onPrev={handlePrevPage} onNext={handleNextPage} />
        </div>
    )
}

export default MyPosts
