import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { userState } from '../../store'
import { useForm } from 'react-hook-form'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebaseApp'

const LoginFormKeys = {
    EMAIL: 'email',
    PASSWORD: 'password',
} as const

interface ILoginForm {
    email: string
    password: string
}

const inputList = [
    {
        id: LoginFormKeys.EMAIL,
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
        id: LoginFormKeys.PASSWORD,
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
]

const Login = () => {
    const [user, setUser] = useRecoilState(userState)

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ILoginForm>()

    const onValid = async (data: ILoginForm) => {
        const { email, password } = data

        try {
            await signInWithEmailAndPassword(auth, email, password)

            if (auth.currentUser) {
                setUser(auth.currentUser)
            }

            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {user === null ? (
                <div
                    className="flex justify-center py-14 bg-base-200"
                    style={{ minHeight: 'calc(100vh - 4rem)' }}
                >
                    <div className="flex flex-col w-3/5 items-center">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold mb-8">로그인</h2>
                        </div>
                        <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
                            <form className="card-body" onSubmit={handleSubmit(onValid)}>
                                {inputList.map((input) => {
                                    return (
                                        <div key={input.id} className="form-control">
                                            <label
                                                className="label cursor-pointer"
                                                htmlFor={input.id}
                                            >
                                                <span className="label-text">
                                                    {input.labelText}
                                                </span>
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
                                        로그인
                                    </button>
                                </div>
                                <div className="form-control mt-2">
                                    <Link to="/join" className="label-text-alt link text-center">
                                        아직 가입한 계정이 없나요?
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <Navigate to="/" />
            )}
        </>
    )
}

export default Login
