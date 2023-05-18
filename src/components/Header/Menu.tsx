import { Link } from 'react-router-dom'
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
            url: '/logout',
            text: '로그아웃',
        },
    ]

    return (
        <>
            {user !== null ? (
                <>
                    {loggedInMenuList.map((menu) => {
                        return (
                            <li key={menu.text}>
                                <Link className="focus:bg-inherit" to={menu.url}>
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
