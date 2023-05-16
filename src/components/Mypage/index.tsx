import { useState } from 'react'
import { Link, Navigate, Outlet } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { userState } from '../../store'

const tabList = [
    {
        text: '내 정보',
        url: '',
    },
    {
        text: '내가 쓴 게시글',
        url: 'posts',
    },
    {
        text: '좋아요 한 게시글',
        url: 'likes',
    },
]

const BASIC_TAB_CLASS = 'tab tab-bordered'

const MyPage = () => {
    const user = useRecoilValue(userState)
    const [activeIndex, setActiveIndex] = useState(0)

    return (
        <>
            {user === null ? (
                <Navigate to="/" />
            ) : (
                <div className="px-4 py-6 max-w-6xl mx-auto">
                    <div className="tabs">
                        {tabList.map((tab, index) => {
                            return (
                                <Link
                                    key={`tab-${index}`}
                                    to={tab.url}
                                    className={`${BASIC_TAB_CLASS}${
                                        index === activeIndex ? ' tab-active' : ''
                                    }`}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    {tab.text}
                                </Link>
                            )
                        })}
                    </div>
                    <div className="mt-4">
                        <Outlet />
                    </div>
                </div>
            )}
        </>
    )
}

export default MyPage
