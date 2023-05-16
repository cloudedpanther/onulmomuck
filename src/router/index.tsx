import { createBrowserRouter } from 'react-router-dom'
import Root from '../components/Root'
import Home from '../components/Home'
import Login from '../components/Login'
import Join from '../components/Join'
import MyPage from '../components/Mypage'
import ViewPost from '../components/ViewPost'
import WritePost from '../components/WritePost'
import Logout from '../components/Logout'
import MyInfo from '../components/Mypage/MyInfo'
import MyPosts from '../components/Mypage/MyPosts'
import MyLikes from '../components/Mypage/MyLikes'

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
                path: 'mypage/',
                element: <MyPage />,
                children: [
                    {
                        path: '',
                        element: <MyInfo />,
                    },
                    {
                        path: 'posts',
                        element: <MyPosts />,
                    },
                    {
                        path: 'likes',
                        element: <MyLikes />,
                    },
                ],
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
