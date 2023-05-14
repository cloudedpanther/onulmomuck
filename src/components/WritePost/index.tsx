import { FormProvider, useForm } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import { ITag, categoriesState, userState } from '../../store'
import CategoryBadgeContainer from '../Category/CategoryBadgeContainer'
import { Navigate } from 'react-router-dom'
import { useState } from 'react'
import { db, storage } from '../../../firebaseApp'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { collection, doc, setDoc } from 'firebase/firestore'

interface IThumbnail {
    url: string
    type: string | undefined
}

type IPostForm = {
    [key: string]: string | boolean | Blob[]
    title: string
    thumbnail: Blob[]
    text: string
}

const DEFAULT_THUMBNAIL = 'https://via.placeholder.com/448x320?text=Thumbnail'

const WritePost = () => {
    const categories = useRecoilValue(categoriesState)

    const user = useRecoilValue(userState)

    const [thumbnail, setThumbnail] = useState<IThumbnail>({
        url: DEFAULT_THUMBNAIL,
        type: undefined,
    })

    const methods = useForm<IPostForm>()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setError,
    } = methods

    const handleThumbnailChange = () => {
        const imgFile = watch('thumbnail')[0]
        const reader = new FileReader()
        reader.onloadend = (e: ProgressEvent<FileReader>) => {
            const url = String(e.target?.result)
            if (url) {
                setThumbnail({
                    url,
                    type: imgFile.type,
                })
            }
        }
        reader.readAsDataURL(imgFile)
    }

    const onValid = async (data: IPostForm) => {
        if (!categories || !user) return

        for (const { name, tags } of categories) {
            const trues = tags?.map(({ id }: ITag) => data[id]).filter((value) => value === true)

            const selected = trues && trues.length > 0

            if (!selected) {
                setError(name, {
                    message: `${name} 중에서 하나 이상의 카테고리를 선택해주셔야 합니다.`,
                })

                return
            }
        }

        const metaData = {
            contentType: thumbnail.type,
        }

        const thumbnailRef = ref(storage, `${user.uid}${Date.now()}`)

        const response = await uploadString(thumbnailRef, thumbnail.url, 'data_url', metaData)

        const attachmentUrl = await getDownloadURL(response.ref)

        const tags = Object.keys(data).filter((key) => {
            if (key === 'title' || key === 'text' || key === 'thumbnail') return false

            return data[key]
        })

        const newPost = {
            createdAt: Date.now(),
            createrUid: user.uid,
            title: data.title,
            text: data.text,
            thumbnailUrl: attachmentUrl,
            tags,
            totalComments: 0,
            likeUids: [],
        }

        const postRef = collection(db, 'post')
        const docRef = doc(postRef)

        await setDoc(docRef, newPost)
    }

    return (
        <div className="px-4 py-6 max-w-6xl mx-auto">
            {user !== null ? (
                <form className="flex flex-col" onSubmit={handleSubmit(onValid)}>
                    <input
                        type="text"
                        placeholder="제목을 입력해주세요"
                        className="input input-bordered input-warning border-amber-500 w-full max-w-xs"
                        maxLength={30}
                        {...register('title', {
                            required: '제목을 반드시 작성하셔야 합니다.',
                            maxLength: {
                                value: 30,
                                message: '제목은 30자 이하여야 합니다.',
                            },
                        })}
                    />
                    <p className="text-xs mt-2 ml-2 text-orange-500">
                        {String(errors['title']?.message || '')}
                    </p>

                    <div className="mt-4 flex md:items-end flex-col md:flex-row">
                        <img
                            className="max-w-md max-h-80 rounded object-contain object-left-top"
                            src={thumbnail.url}
                        />
                        <input
                            type="file"
                            accept="image/jpg, image/jpeg, image/png"
                            className="file-input file-input-bordered file-input-warning border-amber-500 w-full max-w-xs mt-4 md:mt-0 md:ml-4"
                            {...register('thumbnail', {
                                required: '썸네일을 선택해주세요.',
                                onChange: handleThumbnailChange,
                            })}
                        />
                    </div>
                    <p className="text-xs mt-2 ml-2 text-orange-500">
                        {String(errors['thumbnail']?.message || '')}
                    </p>

                    <textarea
                        className="textarea textarea-warning border-amber-500 mt-4 resize-none"
                        placeholder="내용을 입력해주세요"
                        maxLength={30}
                        rows={10}
                        {...register('text', {
                            required: '본문을 반드시 작성하셔야 합니다.',
                            maxLength: {
                                value: 1000,
                                message: '본문은 1000자 이하여야 합니다.',
                            },
                        })}
                    ></textarea>
                    <p className="text-xs mt-2 ml-2 text-orange-500">
                        {String(errors['text']?.message || '')}
                    </p>

                    <FormProvider {...methods}>
                        <div className="border-solid border border-amber-500 rounded-md mt-4">
                            {categories
                                ?.map<React.ReactNode>(({ name, tags, colorClass }) => {
                                    return (
                                        <div key={name}>
                                            <CategoryBadgeContainer
                                                name={name}
                                                tags={tags}
                                                colorClass={colorClass}
                                                submit={false}
                                            />
                                            <p className="text-xs mb-2 ml-4 text-orange-500">
                                                {String(errors[name]?.message || '')}
                                            </p>
                                        </div>
                                    )
                                })
                                .reduce((acc, cur, idx) => [
                                    acc,
                                    <div
                                        key={`divider-${idx}`}
                                        className="divider my-0 h-0 px-2 before:bg-amber-500 before:opacity-25 after:bg-amber-500 after:opacity-25"
                                    ></div>,
                                    cur,
                                ])}
                        </div>
                    </FormProvider>

                    <div className="mt-4 flex justify-end">
                        <button type="submit" className="btn btn-primary">
                            저장
                        </button>
                    </div>
                </form>
            ) : (
                <Navigate to="/" />
            )}
        </div>
    )
}

export default WritePost
