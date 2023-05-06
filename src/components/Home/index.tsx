import { FormProvider, useForm } from 'react-hook-form'
import { CategorySelector } from '../Category'
import PostList from '../PostList'
import { useState, useEffect } from 'react'
import { IPost, posts as totalPosts } from '../../fakeApi'

const Home = () => {
    const [posts, setPosts] = useState<IPost[]>([])

    const methods = useForm()
    const { register, handleSubmit } = methods

    const onValid = (data: any) => {
        console.log(data)
    }

    useEffect(() => {
        setPosts(totalPosts)
    }, [])

    return (
        <div className="px-4 py-6 max-w-6xl mx-auto">
            <form onSubmit={handleSubmit(onValid)}>
                <FormProvider {...methods}>
                    <CategorySelector />
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

            <PostList posts={posts} />
        </div>
    )
}

export default Home
