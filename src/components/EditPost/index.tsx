import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { userState } from '../../store'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { editPost, getPost } from '../../../firebaseApp'
import { useForm } from 'react-hook-form'

interface IEditPostForm {
    text: string
}

const EditPost = () => {
    const user = useRecoilValue(userState)
    const { pathname } = useLocation()
    const pid = [...pathname.split('/')].pop()

    const { register, setValue, handleSubmit } = useForm<IEditPostForm>()

    const navigate = useNavigate()

    const onValid = async (data: IEditPostForm) => {
        if (!pid) return

        try {
            await editPost(pid, data.text)
            navigate(`/post/view/${pid}`)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!pid) return

        const fetchPostData = async () => {
            const postData = await getPost(pid)
            setValue('text', postData?.text || '')
        }
        fetchPostData()
    })

    return (
        <div className="px-4 py-6 max-w-6xl mx-auto">
            {user === null || !pid ? (
                <Navigate to="/" />
            ) : (
                <form onSubmit={handleSubmit(onValid)}>
                    <p className="text-sm font-bold">본문 내용만 수정 가능합니다</p>
                    <textarea
                        className="textarea textarea-warning border-amber-500 mt-4 resize-none w-full"
                        placeholder="내용을 입력해주세요"
                        maxLength={1000}
                        rows={10}
                        {...register('text', {
                            required: '본문을 반드시 작성하셔야 합니다.',
                            maxLength: {
                                value: 1000,
                                message: '본문은 1000자 이하여야 합니다.',
                            },
                        })}
                    ></textarea>
                    <div className="flex justify-end mt-2">
                        <button type="submit" className="btn btn-primary">
                            저장
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default EditPost
