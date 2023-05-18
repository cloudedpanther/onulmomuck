import { useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../../firebaseApp'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { userState } from '../../store'

const Logout = () => {
    const setUser = useSetRecoilState(userState)
    const navigate = useNavigate()

    useEffect(() => {
        const logout = async () => {
            try {
                await signOut(auth)
                setUser(null)
                navigate('/')
            } catch (error) {
                console.log(error)
            }
        }

        logout()
    })

    return <></>
}

export default Logout
