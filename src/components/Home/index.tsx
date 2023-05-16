import { FormProvider, useForm } from 'react-hook-form'
import { CategorySelector } from '../Category'
import PostList from '../PostList'
import { useState, useEffect } from 'react'
import { IPost, getCategories, getPosts } from '../../../firebaseApp'

export interface ISearchForm {
    [key: string]: boolean | string
    search: string
}

const PAGE_SIZE = 8

const Home = () => {
    const [posts, setPosts] = useState<IPost[]>([])
    const [accPosts, setAccPosts] = useState<IPost[]>([])
    const [page, setPage] = useState(0)
    const [lastVisible, setLastVisible] = useState<number>(Infinity)
    const [accLastVisible, setAccLastVisible] = useState<number[]>([])
    const [keyword, setKeyword] = useState<string>('')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [isLastPage, setIsLastPage] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const methods = useForm<ISearchForm>()
    const { register, handleSubmit } = methods

    const initStates = (fetchedPosts: IPost[], lastCheckIndex: number) => {
        setPosts(fetchedPosts)
        setAccPosts([])
        setLastVisible(lastCheckIndex)
        setAccLastVisible([])
        setPage(1)
        setIsLastPage(false)
    }

    const onValid = async (data: ISearchForm) => {
        setIsLoading(true)

        const { search } = data
        const tags = Object.keys(data).filter((key) => {
            if (key === 'search') return false
            if (!data[key]) return false
            return true
        })

        setKeyword(search)
        setSelectedTags(tags)

        const { posts: fetchedPosts, lastCheckIndex } = await getPosts(PAGE_SIZE, {
            keyword: search,
            selectedTags: tags,
        })
        initStates(fetchedPosts, lastCheckIndex)

        setIsLoading(false)
    }

    const handleNextPage = async () => {
        if (isLastPage) return

        const { posts: fetchedPosts, lastCheckIndex } = await getPosts(PAGE_SIZE, {
            keyword,
            selectedTags,
            lastVisible,
        })

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
        const initHome = async () => {
            await getCategories()

            const { posts: fetchedPosts, lastCheckIndex } = await getPosts(PAGE_SIZE, {})
            initStates(fetchedPosts, lastCheckIndex)
        }
        initHome()
    }, [])

    return (
        <div className={`px-4 py-6 max-w-6xl mx-auto${isLoading ? ' pointer-events-none' : ''}`}>
            <form onSubmit={handleSubmit(onValid)}>
                <FormProvider {...methods}>
                    <CategorySelector onSubmit={onValid} />
                </FormProvider>

                <div className="form-control mt-4">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Search…"
                            className="input input-bordered focus:outline-none w-screen"
                            {...register('search')}
                        />
                        <button className="btn btn-square">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </form>

            <PostList posts={posts} page={page} onPrev={handlePrevPage} onNext={handleNextPage} />
        </div>
    )
}

export default Home
