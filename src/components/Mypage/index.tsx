import { useState, useEffect } from 'react'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
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
    const [activeIndex, setActiveIndex] = useState<number>()
    const location = useLocation()

    const saveActiveIndex = (index: number) => {
        setActiveIndex(index)
        localStorage.setItem('activeTabIndex', JSON.stringify(index))
    }

    const handleActiveIndexChange = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const selectedIndex = Number(e.currentTarget.dataset.index)

        if (isNaN(selectedIndex)) return

        saveActiveIndex(selectedIndex)
    }

    useEffect(() => {
        if (location.pathname === '/mypage') {
            saveActiveIndex(0)
            return
        }

        const json = localStorage.getItem('activeTabIndex')

        if (json === null) return

        const localActiveTabIndex = JSON.parse(json)

        setActiveIndex(localActiveTabIndex)
    })

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
                                    data-index={index}
                                    onClick={handleActiveIndexChange}
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
