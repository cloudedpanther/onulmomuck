import { useForm } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import { userState } from '../../store'
import { auth } from '../../../firebaseApp'
import { updatePassword, updateProfile } from 'firebase/auth'

interface INicknameForm {
    nickname: string
}

interface IPasswordForm {
    password: string
    passwordConfig: string
}

const registerSettings = {
    nickname: {
        required: '이름을 적어주세요.',
        maxLength: {
            value: 20,
            message: '이름은 20자리 보다 짧아야 합니다.',
        },
        pattern: {
            value: /^([_0-9a-zA-Z(ㄱ-ㅎ|ㅏ-ㅣ|가-힣)]){1,20}$/,
            message: '이름에는 한글, 숫자, 영어 대소문자, 또는 특수문자(_)만 포함될 수 있습니다.',
        },
    },
    password: {
        required: '비밀번호를 적어주세요',
        minLength: {
            value: 8,
            message: '비밀번호는 8자리 보다 길어야 합니다.',
        },
        maxLength: {
            value: 16,
            message: '비밀번호는 16자리 보다 짧아야 합니다.',
        },
        pattern: {
            value: /^([!@#$%^&*0-9a-zA-Z]){8,16}$/,
            message:
                '비밀번호에는 숫자, 영어 대소문자 또는 특수문자(!,@,#,$,%,^,&,*)만 포함될 수 있습니다.',
        },
    },
    passwordConfig: {
        required: '비밀번호를 똑같이 적어주세요',
        minLength: {
            value: 8,
            message: '비밀번호는 8자리 보다 길어야 합니다.',
        },
        maxLength: {
            value: 16,
            message: '비밀번호는 16자리 보다 짧아야 합니다.',
        },
    },
}

const MyInfo = () => {
    const user = useRecoilValue(userState)

    const {
        register: registerNickname,
        handleSubmit: handleSubmitNickname,
        formState: { errors: nicknameErrors },
    } = useForm<INicknameForm>({
        defaultValues: {
            nickname: user?.displayName || '',
        },
    })
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        setError: setErrorPassword,
    } = useForm<IPasswordForm>()

    const onNicknameSubmit = async (data: INicknameForm) => {
        const { nickname } = data

        try {
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: nickname,
                })

                location.reload()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onPasswordSubmit = async (data: IPasswordForm) => {
        const { password, passwordConfig } = data

        if (password !== passwordConfig) {
            setErrorPassword('passwordConfig', { message: '비밀번호가 일치하지 않습니다.' })
            return
        }

        try {
            if (auth.currentUser) {
                await updatePassword(auth.currentUser, password)

                location.reload()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <form
                className="border border-2 border-slate-500 w-content p-4 rounded"
                onSubmit={handleSubmitNickname(onNicknameSubmit)}
            >
                <label htmlFor="nickname" className="label">
                    <span className="label-text text-xs font-bold">닉네임</span>
                </label>
                <div className="flex">
                    <input
                        id="nickname"
                        type="text"
                        className="input input-bordered border-2 w-3/4"
                        {...registerNickname('nickname', registerSettings.nickname)}
                    />
                </div>
                <p className="text-xs mt-2 ml-1 text-orange-500">
                    {String(nicknameErrors.nickname?.message || '')}
                </p>
                <div className="mt-2 flex justify-end">
                    <button type="submit" className="btn btn-primary">
                        저장
                    </button>
                </div>
            </form>
            <form
                className="mt-6 border border-2 border-slate-500 w-content p-4 rounded"
                onSubmit={handleSubmitPassword(onPasswordSubmit)}
            >
                <div>
                    <label htmlFor="password" className="label">
                        <span className="label-text text-xs font-bold">비밀번호 변경</span>
                    </label>
                    <div className="flex">
                        <input
                            id="password"
                            type="password"
                            className="input input-bordered border-2 w-3/4"
                            {...registerPassword('password', registerSettings.password)}
                        />
                    </div>
                    <p className="text-xs mt-2 ml-1 text-orange-500">
                        {String(passwordErrors.password?.message || '')}
                    </p>
                </div>
                <div className="mt-4">
                    <label htmlFor="passwordConfig" className="label">
                        <span className="label-text text-xs font-bold">비밀번호 확인</span>
                    </label>
                    <div className="flex">
                        <input
                            id="passwordConfig"
                            type="password"
                            className="input input-bordered border-2 w-3/4"
                            {...registerPassword('passwordConfig', registerSettings.passwordConfig)}
                        />
                    </div>
                    <p className="text-xs mt-2 ml-1 text-orange-500">
                        {String(passwordErrors.passwordConfig?.message || '')}
                    </p>
                </div>
                <div className="mt-2 flex justify-end">
                    <button type="submit" className="btn btn-primary">
                        저장
                    </button>
                </div>
            </form>
        </>
    )
}

export default MyInfo
