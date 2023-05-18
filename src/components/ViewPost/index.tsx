import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FilledHeart, OutlineHeart } from '../Icons'
import { deletePost, getPost, getPostCreaterName, updateLiked } from '../../../firebaseApp'
import { useRecoilValue } from 'recoil'
import { categoriesState, defaultColorClass, userState } from '../../store'
import CategoryBadgeUI from '../Category/CategoryBadgeUI'
import CommentSection from '../CommentSection'
import { parseDate } from '../../utils'

interface IPostData {
    title: string
    text: string
    thumbnailUrl: string
    totalLikes: number
    createdAt: string
    createrName: string
    likeUids: string[]
    tags: string[]
}

const ViewPost = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { pathname } = location
    const pid = pathname.split('/post/view/')[1]

    const user = useRecoilValue(userState)
    const categories = useRecoilValue(categoriesState)

    const [init, setInit] = useState(false)
    const [post, setPost] = useState<IPostData>()
    const [liked, setLiked] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loginConfirmChecked, setLoginConfirmChecked] = useState(false)

    const getTagData = (tagId: string) => {
        let tagData = {
            colorClass: defaultColorClass,
            text: '...',
        }
        categories.forEach((category) => {
            category.tags.forEach((tag) => {
                if (tag.id === tagId) {
                    tagData = {
                        colorClass: category.colorClass,
                        text: tag.text,
                    }
                }
            })
        })
        return tagData
    }

    const handleLikeChnage = async () => {
        if (!post) return

        setIsLoading(true)

        if (user === null || user.uid === null) {
            setLoginConfirmChecked(true)
            setIsLoading(false)
            return
        }

        const prevLikeUids = [...post.likeUids]
        if (liked) {
            const newLikeUids = prevLikeUids.filter((uid) => uid !== user.uid)
            await updateLiked(pid, newLikeUids)
        } else {
            const newLikeUids = [...prevLikeUids, user.uid]
            await updateLiked(pid, newLikeUids)
        }
        setLiked((prev) => !prev)
        setIsLoading(false)
    }

    const handleEditPost = () => {
        navigate(`/post/edit/${pid}`)
    }

    const handleDeletePost = async () => {
        setIsLoading(true)
        await deletePost(pid)
        sessionStorage.removeItem('homePosts')
        navigate('/')
    }

    useEffect(() => {
        const initViewPost = async () => {
            const fetchedPost = await getPost(pid)

            if (!fetchedPost) {
                navigate('/')
                return
            }

            const { createdAt, likeUids, tags, text, thumbnailUrl, title, createrUid } = fetchedPost

            const createrName = await getPostCreaterName(createrUid)

            if (!createrName) {
                navigate('/')
                return
            }

            const postData = {
                title,
                text,
                thumbnailUrl,
                totalLikes: likeUids.length,
                createdAt: parseDate(new Date(createdAt)),
                createrName,
                likeUids,
                tags,
            }

            setPost(postData)

            if (user !== null && likeUids.includes(user.uid)) setLiked(true)

            setInit(true)
        }
        initViewPost()
    }, [])

    return (
        <div className={isLoading ? 'pointer-events-none' : ''}>
            {!init || !post ? (
                <div className="flex justify-center items-center bg-slate-50 h-screen">
                    <p className="text-orange-500 font-bold text-2xl mb-10">Loading...</p>
                </div>
            ) : (
                <div className="px-4 py-6 max-w-6xl mx-auto">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{post.title}</h2>
                        {user?.displayName === post?.createrName ? (
                            <div className="flex gap-2">
                                <button className="btn btn-sm text-xs" onClick={handleEditPost}>
                                    수정
                                </button>
                                <button
                                    className="btn btn-sm text-xs"
                                    onClick={() => setDeleteModal(true)}
                                >
                                    삭제
                                </button>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="mt-4 text-sm text-gray-500 flex items-center">
                        <p>{post.createrName}</p>
                        <p className="mx-2">|</p>
                        <p>{post.createdAt}</p>
                        <p className="ml-4">
                            <FilledHeart className="w-4 h-4" colorClass="fill-gray-500" />
                        </p>
                        <p className="ml-2">{post.totalLikes}</p>
                    </div>
                    <div className="my-4 whitespace-nowrap overflow-scroll scrollbar-hide flex gap-2">
                        {post.tags.map((tagId) => {
                            const { colorClass, text } = getTagData(tagId)
                            return (
                                <CategoryBadgeUI
                                    key={`tag-${tagId}`}
                                    className={colorClass}
                                    text={text}
                                />
                            )
                        })}
                    </div>
                    <div className="w-content border-2 border-orange-500 rounded px-4 py-8">
                        <div>
                            <img
                                src={post.thumbnailUrl}
                                alt="썸네일"
                                className="max-w-md max-h-80 rounded object-contain object-left-top"
                            />
                        </div>
                        <p className="mt-6">{post.text}</p>
                        <div className="mt-12 flex justify-center items-center">
                            <button
                                className="btn btn-ghost bg-gray-200 font-normal flex flex-col w-28 h-16"
                                onClick={handleLikeChnage}
                            >
                                <p className="mb-1">{liked ? '좋아요 취소' : '좋아요'}</p>
                                {liked ? (
                                    <FilledHeart className="w-4 h-4" colorClass="fill-red-500" />
                                ) : (
                                    <OutlineHeart className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                    <CommentSection pid={pid} />
                </div>
            )}
            <div>
                <input
                    type="checkbox"
                    id="loginConfirm"
                    className="modal-toggle"
                    checked={loginConfirmChecked}
                    onChange={() => {}}
                />
                <div className="modal">
                    <div className="modal-box">
                        <p className="py-4">로그인 후에 이용하실 수 있습니다.</p>
                        <div className="modal-action">
                            <label
                                htmlFor="loginConfirm"
                                className="btn"
                                onClick={() => setLoginConfirmChecked(false)}
                            >
                                확인
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <input
                    type="checkbox"
                    id="deletePost"
                    className="modal-toggle"
                    checked={deleteModal}
                    onChange={() => {}}
                />
                <div className="modal">
                    <div className="modal-box">
                        <p className="py-4">정말 삭제하시겠습니까?</p>
                        <div className="modal-action">
                            <button className="btn" onClick={handleDeletePost}>
                                확인
                            </button>
                            <button className="btn" onClick={() => setDeleteModal(false)}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewPost
