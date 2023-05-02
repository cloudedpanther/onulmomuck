import { Link } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { isLoggedInSelector } from '../../store'

const Menu = () => {
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInSelector)

    const handleLogout = () => {
        setIsLoggedIn(false)
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
                        <Link className="focus:bg-inherit" to="/login">
                            로그인/회원가입
                        </Link>
                    </li>
                </>
            )}
        </>
    )
}

export default Menu
