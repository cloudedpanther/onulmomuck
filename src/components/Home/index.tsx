import { FormProvider, useForm } from 'react-hook-form'
import { CategorySelector } from '../Category'
import PostList from '../PostList'
import { useState, useEffect } from 'react'
import { IPost, getCategories, getPosts } from '../../../firebaseApp'

export interface ISearchForm {
    [key: string]: boolean | string
    search: string
}

interface IPostData {
    posts: IPost[]
    accPosts: IPost[]
    page: number
    lastVisible: number
    accLastVisible: number[]
    keyword: string
    selectedTags: string[]
    isLastPage: boolean
}

const PAGE_SIZE = 8

const Home = () => {
    const [postData, setPostData] = useState<IPostData>({
        posts: [],
        accPosts: [],
        page: 1,
        lastVisible: Infinity,
        accLastVisible: [],
        keyword: '',
        selectedTags: [],
        isLastPage: false,
    })

    const { posts, accPosts, page, lastVisible, keyword, selectedTags, isLastPage } = postData

    const [isLoading, setIsLoading] = useState(false)

    const methods = useForm<ISearchForm>()
    const { register, handleSubmit } = methods

    const cacheStates = (newState: IPostData) => {
        sessionStorage.setItem('homePosts', JSON.stringify(newState))
    }

    const loadCachedStates = () => {
        const json = sessionStorage.getItem('homePosts')

        if (!json) return false

        const {
            posts,
            accPosts,
            page,
            lastVisible,
            accLastVisible,
            keyword,
            selectedTags,
            isLastPage,
        } = JSON.parse(json)

        setPostData({
            posts,
            accPosts,
            page,
            lastVisible,
            accLastVisible,
            keyword,
            selectedTags,
            isLastPage,
        })

        return true
    }

    const onValid = async (data: ISearchForm) => {
        setIsLoading(true)

        const { search } = data
        const tags = Object.keys(data).filter((key) => {
            if (key === 'search') return false
            if (!data[key]) return false
            return true
        })

        const { posts: fetchedPosts, lastCheckIndex } = await getPosts(PAGE_SIZE, {
            keyword: search,
            selectedTags: tags,
        })

        setPostData((prev) => {
            const newState = {
                ...prev,
                posts: fetchedPosts,
                accPosts: [],
                page: 1,
                lastVisible: lastCheckIndex,
                accLastVisible: [],
                keyword: search,
                selectedTags: tags,
                isLastPage: false,
            }
            cacheStates(newState)
            return newState
        })

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
        const initHome = async () => {
            await getCategories()

            if (loadCachedStates()) return

            const { posts: fetchedPosts, lastCheckIndex } = await getPosts(PAGE_SIZE, {})

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
