import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../Header'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, getCategories } from '../../../firebaseApp'
import { useSetRecoilState } from 'recoil'
import { categoriesState, parseUser, userState } from '../../store'

const postPathList = ['/', '/mypage/posts', '/mypage/likes']

const Root = () => {
    const [init, setInit] = useState(false)

    const setUser = useSetRecoilState(userState)
    const setCategories = useSetRecoilState(categoriesState)

    const location = useLocation()
    const { pathname } = location

    useEffect(() => {
        const json = sessionStorage.getItem('historyStack')

        const historyStack = json ? JSON.parse(json) : []
        const lastIndex = historyStack.length - 1

        if (
            historyStack.length > 0 &&
            postPathList.includes(pathname) &&
            !historyStack[lastIndex].includes('view')
        ) {
            sessionStorage.removeItem('homePosts')
            sessionStorage.removeItem('myPosts')
            sessionStorage.removeItem('myLikes')
        }

        const newStack = [...historyStack, pathname]
        sessionStorage.setItem(
            'historyStack',
            JSON.stringify(newStack.length > 5 ? newStack.slice(-5) : newStack)
        )

        console.log(newStack)
    }, [location])

    useEffect(() => {
        const initialize = async () => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const userCopy = parseUser(user)
                    setUser(userCopy)
                }
            })

            const categories = await getCategories()
            setCategories(categories)

            setInit(true)
        }

        initialize()
    }, [])

    return (
        <>
            {!init ? (
                <div className="flex justify-center items-center bg-slate-50 h-screen">
                    <p className="text-orange-500 font-bold text-2xl mb-10">Loading...</p>
                </div>
            ) : (
                <>
                    <Header />
                    <main className="pt-16 h-full box-border">
                        <Outlet />
                    </main>
                </>
            )}
        </>
    )
}

export default Root
