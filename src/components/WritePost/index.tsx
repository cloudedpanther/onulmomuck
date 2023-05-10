import { FormProvider, useForm } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import { ICategory, categoriesState, userState } from '../../store'
import CategoryBadgeContainer from '../Category/CategoryBadgeContainer'
import { Navigate } from 'react-router-dom'
import { useState } from 'react'

const DEFAULT_THUMBNAIL = 'https://via.placeholder.com/448x320?text=Thumbnail'

const WritePost = () => {
    const user = useRecoilValue(userState)

    const [thumbnail, setThumbnail] = useState(DEFAULT_THUMBNAIL)

    const categoryGroupList = useRecoilValue(categoriesState)

    const methods = useForm()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setError,
    } = methods

    const handleThumbnailChange = () => {
        const thumbnail = watch('thumbnail')[0]
        const url = URL.createObjectURL(thumbnail)
        setThumbnail(url)
    }

    const onValid = (data: any) => {
        console.log(data)

        categoryGroupList.forEach(({ groupName, data: categories }) => {
            const selected =
                categories
                    .map(({ id }: ICategory) => data[id])
                    .filter((value: boolean) => value === true).length > 0

            if (!selected) {
                setError(groupName, {
                    message: `${groupName} 중에서 하나 이상의 카테고리를 선택해주셔야 합니다.`,
                })
            }
        })
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
                            src={thumbnail}
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
                            {categoryGroupList
                                .map<React.ReactNode>(({ groupName, data, colorClass }) => {
                                    return (
                                        <div key={groupName}>
                                            <CategoryBadgeContainer
                                                groupName={groupName}
                                                categoryList={data}
                                                colorClass={colorClass}
                                                submit={false}
                                            />
                                            <p className="text-xs mb-2 ml-4 text-orange-500">
                                                {String(errors[groupName]?.message || '')}
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
