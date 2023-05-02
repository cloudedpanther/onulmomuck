import { Outlet } from 'react-router-dom'
import Header from '../Header'

const Root = () => {
    return (
        <>
            <Header />
            <main className="pt-16 h-full box-border">
                <Outlet />
            </main>
        </>
    )
}

export default Root
