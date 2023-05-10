import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../../firebaseApp'
import { useSetRecoilState } from 'recoil'
import { userState } from '../../store'

const Root = () => {
    const [init, setInit] = useState(false)
    const setUser = useSetRecoilState(userState)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userCopy = JSON.parse(JSON.stringify(user))
                setUser(userCopy)
            }
            setInit(true)
        })
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
