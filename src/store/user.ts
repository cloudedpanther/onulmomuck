import { atom } from 'recoil'
import { User } from 'firebase/auth'

interface UserInfo {
    displayName: string | null
    email: string | null
    providerId: string | null
    uid: string | null
}

export const parseUser = ({ displayName, email, providerId, uid }: User): UserInfo => ({
    displayName,
    email,
    providerId,
    uid,
})

export const userState = atom<UserInfo | null>({
    key: 'user',
    default: null,
})
