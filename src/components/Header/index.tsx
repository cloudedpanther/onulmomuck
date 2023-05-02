import { Link } from 'react-router-dom'
import Menu from './Menu'
import { useState } from 'react'

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true)

    const handleLogin = () => {
        setIsLoggedIn(true)
    }

    const handleLogout = () => {
        setIsLoggedIn(false)
    }

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const handleDropdownToggle = () => {
        if (isDropdownOpen) {
            const focused = document.activeElement as HTMLElement
            focused?.blur()
        }
        setIsDropdownOpen((prev) => !prev)
    }

    return (
        <div className="fixed navbar bg-white py-0 shadow z-50">
            <div className="flex-1">
                <Link
                    to="/"
                    className="btn btn-ghost  hover:bg-inherit normal-case text-xl text-orange-500"
                >
                    오늘모먹
                </Link>
            </div>
            <div className="flex-none">
                <div className="hidden md:flex items-center">
                    {isLoggedIn ? <p>고영준님</p> : null}
                    <ul className="menu menu-horizontal bg-inherit rounded-box p-2">
                        <Menu
                            isLoggedIn={isLoggedIn}
                            onLogin={handleLogin}
                            onLogout={handleLogout}
                        />
                    </ul>
                </div>

                <div onClick={handleDropdownToggle} className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-square btn-ghost md:hidden m-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block w-5 h-5 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                            ></path>
                        </svg>
                    </label>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                    >
                        <Menu
                            isLoggedIn={isLoggedIn}
                            onLogin={handleLogin}
                            onLogout={handleLogout}
                        />
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Header
