import { Link } from 'react-router-dom'

const Login = () => {
    return (
        <>
            <div className="flex justify-center pt-16 h-screen bg-base-200">
                <div className="flex-col w-3/5">
                    <div className="text-center">
                        <h2 className="text-5xl font-bold mb-8">로그인</h2>
                    </div>
                    <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
                        <form className="card-body">
                            <div className="form-control">
                                <label className="label cursor-pointer" htmlFor="email">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="email"
                                    className="input input-bordered"
                                    id="email"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label cursor-pointer" htmlFor="password">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="password"
                                    className="input input-bordered"
                                    id="password"
                                />
                            </div>
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
        </>
    )
}

export default Login
