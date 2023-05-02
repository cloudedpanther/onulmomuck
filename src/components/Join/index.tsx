const Join = () => {
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
                                <label className="label cursor-pointer" htmlFor="userName">
                                    <span className="label-text">Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="name"
                                    className="input input-bordered"
                                    id="userName"
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
                            <div className="form-control">
                                <label className="label cursor-pointer" htmlFor="passwordConfig">
                                    <span className="label-text">Password Config</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="password config"
                                    className="input input-bordered"
                                    id="passwordConfig"
                                />
                            </div>
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
