import { IPost } from '../../fakeApi'
import PostCard from '../PostCard'

interface IPostList {
    posts: IPost[]
}

const PostList = ({ posts }: IPostList) => {
    return (
        <section>
            {posts.length === 0 ? (
                <div className="flex justify-center mt-20">
                    <p>검색 결과가 없습니다.</p>
                </div>
            ) : (
                <>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                        {posts.map((post) => {
                            return <PostCard key={post.id} postData={post} />
                        })}
                    </div>

                    <div className="btn-group mt-4 w-full flex justify-center">
                        <button className="btn">«</button>
                        <button className="btn pointer-events-none">Page 1</button>
                        <button className="btn">»</button>
                    </div>
                </>
            )}
        </section>
    )
}

export default PostList
