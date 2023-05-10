import { createBrowserRouter } from 'react-router-dom'
import Root from '../components/Root'
import Home from '../components/Home'
import Login from '../components/Login'
import Join from '../components/Join'
import MyPage from '../components/Mypage'
import ViewPost from '../components/ViewPost'
import WritePost from '../components/WritePost'
import Logout from '../components/Logout'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '',
                element: <Home />,
            },
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'join',
                element: <Join />,
            },
            {
                path: 'logout',
                element: <Logout />,
            },
            {
                path: 'mypage',
                element: <MyPage />,
            },
            {
                path: 'post/view/:id',
                element: <ViewPost />,
            },
            {
                path: 'post/write',
                element: <WritePost />,
            },
        ],
    },
])

export default router
