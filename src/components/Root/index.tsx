import { Outlet } from 'react-router-dom'
import Header from '../Header'

const Root = () => {
    return (
        <>
            <Header />
            <div className="pt-16">
                <Outlet />
            </div>
        </>
    )
}

export default Root
