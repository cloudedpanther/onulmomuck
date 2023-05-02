import { atom, selector } from 'recoil'

export const isLoggedInState = atom({
    key: 'isLoggedIn',
    default: selector({
        key: 'localIsLoggedIn',
        get: () => {
            const json = localStorage.getItem(isLoggedInState.key)

            if (!json) return false

            const isLoggedIn = JSON.parse(json)

            return isLoggedIn
        },
    }),
})

export const isLoggedInSelector = selector({
    key: 'isLoggedInSelector',
    get: ({ get }) => get(isLoggedInState),
    set: ({ set }, newValue) => {
        set(isLoggedInState, newValue)

        const json = JSON.stringify(newValue)
        localStorage.setItem(isLoggedInState.key, json)
    },
})
