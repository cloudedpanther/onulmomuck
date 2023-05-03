import { Link } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { isLoggedInSelector } from '../../store'

const Menu = () => {
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInSelector)

    const loggedInMenuList = [
        {
            url: '/post/write',
            text: '글쓰기',
        },
        {
            url: '/mypage',
            text: '마이페이지',
        },
        {
            url: '/',
            text: '로그아웃',
            onClick: () => {
                setIsLoggedIn(false)
            },
        },
    ]

    return (
        <>
            {isLoggedIn ? (
                <>
                    {loggedInMenuList.map((menu) => {
                        return (
                            <li key={menu.text}>
                                <Link
                                    className="focus:bg-inherit"
                                    to={menu.url}
                                    onClick={menu.onClick}
                                >
                                    {menu.text}
                                </Link>
                            </li>
                        )
                    })}
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
