import { Link } from 'react-router-dom'

interface IMenu {
    isLoggedIn: boolean
    onLogin: () => void
    onLogout: () => void
}

const Menu = ({ isLoggedIn, onLogin, onLogout }: IMenu) => {
    const handleLogin = () => {
        onLogin()
    }

    const handleLogout = () => {
        onLogout()
    }

    return (
        <>
            {isLoggedIn ? (
                <>
                    <li>
                        <Link className="focus:bg-inherit" to="/post/write">
                            글쓰기
                        </Link>
                    </li>
                    <li>
                        <Link className="focus:bg-inherit" to="/mypage">
                            마이페이지
                        </Link>
                    </li>
                    <li>
                        <Link className="focus:bg-inherit" to="/" onClick={handleLogout}>
                            로그아웃
                        </Link>
                    </li>
                </>
            ) : (
                <>
                    <li>
                        <Link className="focus:bg-inherit" to="/login" onClick={handleLogin}>
                            로그인/회원가입
                        </Link>
                    </li>
                </>
            )}
        </>
    )
}

export default Menu
