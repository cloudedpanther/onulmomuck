import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import { userState } from '../../store'
import { IComment, createNewComment, getComments } from '../../../firebaseApp'

interface ICommentSection {
    pid: string
}

interface INewCommentForm {
    newComment: string
}

const PAGE_SIZE = 5

const CommentSection = ({ pid }: ICommentSection) => {
    const user = useRecoilValue(userState)

    const [comments, setComments] = useState<IComment[]>([])
    const [accComments, setAccComments] = useState<IComment[]>([])
    const [page, setPage] = useState(0)
    const [lastVisible, setLastVisible] = useState<number>(Infinity)
    const [accLastVisible, setAccLastVisible] = useState<number[]>([])
    const [isLastPage, setIsLastPage] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { register, handleSubmit } = useForm<INewCommentForm>()

    const onValid = async ({ newComment }: INewCommentForm) => {
        if (user === null || user.uid === null || user.displayName === null) return

        setIsLoading(true)

        await createNewComment({
            pid,
            uid: user.uid,
            createrName: user.displayName,
            content: newComment,
        })

        location.reload()

        setIsLoading(false)
    }

    const handleNextPage = async () => {
        if (isLastPage) return

        const { comments: fetchedComments, lastCheckIndex } = await getComments(
            PAGE_SIZE,
            pid,
            lastVisible
        )

        if (fetchedComments.length === 0) {
            setIsLastPage(true)
            return
        }

        setAccComments((prev) => [...prev, ...comments])
        setComments(fetchedComments)
        setAccLastVisible((prev) => [...prev, lastVisible])
        setLastVisible(lastCheckIndex)
        setPage((prev) => prev + 1)
    }

    const handlePrevPage = () => {
        if (accComments.length === 0) return

        const prevPageComments = accComments.slice(-1 * PAGE_SIZE)
        setComments(prevPageComments)
        setAccComments((prev) => prev.slice(0, -1 * PAGE_SIZE))
        setPage((prev) => prev - 1)
        const prevLastVisible = accLastVisible.slice(-1)[0]
        setLastVisible(prevLastVisible)
        setAccLastVisible((prev) => prev.slice(0, -1))
        setIsLastPage(false)
    }

    useEffect(() => {
        const initComments = async () => {
            const { comments: fetchedComments, lastCheckIndex } = await getComments(PAGE_SIZE, pid)

            setComments(fetchedComments)
            setLastVisible(lastCheckIndex)
            setPage(1)
        }
        initComments()
    }, [])

    return (
        <section>
            {user === null ? (
                <></>
            ) : (
                <form
                    className={isLoading ? 'pointer-events-none' : ''}
                    onSubmit={handleSubmit(onValid)}
                >
                    <div className="bg-orange-100 mt-4 rounded">
                        <textarea
                            className="textarea border-orange-100 bg-orange-100 focus:outline-none w-full resize-none"
                            placeholder="댓글을 작성해주세요..."
                            {...register('newComment')}
                        ></textarea>
                        <div className="flex justify-end p-3">
                            <button
                                type="submit"
                                className="btn bg-indigo-600 border-indigo-600 hover:bg-indigo-700"
                            >
                                등록
                            </button>
                        </div>
                    </div>
                </form>
            )}
            <ul className="mt-4">
                {comments.length > 0 &&
                    comments
                        ?.map<React.ReactNode>((comment) => {
                            return (
                                <li key={comment.id} className="p-4 pb-6">
                                    <div className="mb-4 flex items-center">
                                        <p className="font-bold">{comment.createrName}</p>
                                        <p className="mx-2 text-xs">|</p>
                                        <p className="text-xs text-gray-500">{comment.createdAt}</p>
                                    </div>
                                    <p>{comment.content}</p>
                                </li>
                            )
                        })
                        .reduce((acc, cur, idx) => [
                            acc,
                            <hr key={`div-${idx}`} className="w-full mx-3 border-orange-200" />,
                            cur,
                        ])}
            </ul>
            <div className="btn-group mt-4 w-full flex justify-center">
                <button className="btn" onClick={handlePrevPage}>
                    «
                </button>
                <button className="btn pointer-events-none">Page {page}</button>
                <button className="btn" onClick={handleNextPage}>
                    »
                </button>
            </div>
        </section>
    )
}

export default CommentSection
