import { createBrowserRouter } from 'react-router-dom'
import Root from '../components/Root'
import Home from '../components/Home'
import Login from '../components/Login'
import Join from '../components/Join'
import MyPage from '../components/Mypage'
import ViewPost from '../components/ViewPost'
import WritePost from '../components/WritePost'

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
                path: 'mypage',
                element: <MyPage />,
            },
            {
                path: 'post/view',
                element: <ViewPost />,
            },
            {
                path: 'post/write',
                element: <WritePost />,
            },
        ],
    },
    {
        path: 'login',
        element: <Login />,
    },
    {
        path: 'join',
        element: <Join />,
    },
])

export default router
