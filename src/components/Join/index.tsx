import { useForm } from 'react-hook-form'
import { auth, storeUserName } from '../../../firebaseApp'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const JoinFormKeys = {
    EMAIL: 'email',
    USERNAME: 'userName',
    PASSWORD: 'password',
    PASSWORDCONFIG: 'passwordConfig',
} as const

interface IJoinForm {
    email: string
    userName: string
    password: string
    passwordConfig: string
}

const inputList = [
    {
        id: JoinFormKeys.EMAIL,
        labelText: 'Email',
        settings: {
            type: 'email',
            placeholder: 'email',
            maxLength: 50,
        },
        registerSettings: {
            required: '이메일을 적어주세요',
            maxLength: {
                value: 50,
                message: '이메일은 50자리 보다 짧아야 합니다.',
            },
            pattern: {
                value: /^[0-9a-zA-Z]([-_.0-9a-zA-Z])*@[0-9a-zA-Z]([-.0-9a-zA-Z])*\.[0-9a-zA-Z]{2,5}$/,
                message: '이메일 형식에 맞지 않습니다.',
            },
        },
    },
    {
        id: JoinFormKeys.USERNAME,
        labelText: 'Name',
        settings: {
            type: 'text',
            placeholder: 'name',
            maxLength: 20,
        },
        registerSettings: {
            required: '이름을 적어주세요.',
            maxLength: {
                value: 20,
                message: '이름은 20자리 보다 짧아야 합니다.',
            },
            pattern: {
                value: /^([_0-9a-zA-Z(ㄱ-ㅎ|ㅏ-ㅣ|가-힣)]){1,20}$/,
                message:
                    '이름에는 한글, 숫자, 영어 대소문자, 또는 특수문자(_)만 포함될 수 있습니다.',
            },
        },
    },
    {
        id: JoinFormKeys.PASSWORD,
        labelText: 'Password',
        settings: {
            type: 'password',
            placeholder: 'password',
            maxLength: 16,
        },
        registerSettings: {
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
    },
    {
        id: JoinFormKeys.PASSWORDCONFIG,
        labelText: 'Password Config',
        settings: {
            type: 'password',
            placeholder: 'password config',
            maxLength: 16,
        },
        registerSettings: {
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
    },
]

const Join = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<IJoinForm>({ mode: 'onBlur' })

    const navigate = useNavigate()

    const onValid = async (data: IJoinForm) => {
        const { email, userName, password, passwordConfig } = data

        if (password !== passwordConfig) {
            setError(JoinFormKeys.PASSWORDCONFIG, { message: '비밀번호가 일치하지 않습니다.' })
            return
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password)

            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: userName,
                })
                await storeUserName(auth.currentUser.uid, userName)

                navigate('/')
                location.reload()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div
                className="flex justify-center py-14 bg-base-200"
                style={{ minHeight: 'calc(100vh - 4rem)' }}
            >
                <div className="flex flex-col w-3/5 items-center">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold mb-8">회원가입</h2>
                    </div>
                    <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
                        <form className="card-body" onSubmit={handleSubmit(onValid)}>
                            {inputList.map((input) => {
                                return (
                                    <div key={input.id} className="form-control">
                                        <label className="label cursor-pointer" htmlFor={input.id}>
                                            <span className="label-text">{input.labelText}</span>
                                        </label>
                                        <input
                                            className="input input-bordered"
                                            id={input.id}
                                            {...input.settings}
                                            {...register(input.id, input.registerSettings)}
                                        />
                                        <p className="text-xs mt-2 ml-2 text-orange-500">
                                            {String(errors[input.id]?.message || '')}
                                        </p>
                                    </div>
                                )
                            })}
                            <div className="form-control mt-6">
                                <button type="submit" className="btn btn-primary">
                                    가입하기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Join
