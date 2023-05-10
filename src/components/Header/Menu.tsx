import { Link, Navigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { userState } from '../../store'

const Menu = () => {
    const user = useRecoilValue(userState)

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
                return <Navigate to="/logout" />
            },
        },
    ]

    return (
        <>
            {user !== null ? (
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
