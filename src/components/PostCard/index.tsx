import { Link } from 'react-router-dom'
import { Comment, FilledHeart } from '../Icons'
import { IPost } from '../../../firebaseApp'

interface IPostCard {
    postData: IPost
}

const PostCard = ({ postData }: IPostCard) => {
    const { id, thumbnailUrl, title, totalComments, totalLikes } = postData

    return (
        <article>
            <Link to={`/post/view/${id}`}>
                <div className="card bg-base-100 shadow-xl h-72 cursor-pointer">
                    <figure
                        className="h-3/5 bg-cover bg-center"
                        style={{ backgroundImage: `url('${thumbnailUrl}')` }}
                    ></figure>
                    <div className="card-body p-4 h-2/5">
                        <p className="font-bold truncate">{title}</p>
                        <div className="card-actions justify-end">
                            <div className="flex items-center">
                                <Comment className="w-4 h-4 mr-2" />
                                <p className="grow-0 text-sm font-bold w-8 truncate">
                                    {totalComments}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <FilledHeart className="w-5 h-5 mr-2" colorClass="fill-black" />
                                <p className="grow-0 text-sm font-bold w-8 truncate">
                                    {totalLikes}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    )
}

export default PostCard
