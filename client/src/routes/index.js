import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Registeration from '../pages/RegisterationPage'
import CheckEmail from '../pages/CheckEmailPage'
import CheckPassword from '../pages/CheckPasswordPage'
import Home from '../pages/Home'
import MessagePage from '../components/MessagePage'
import AuthLayout from '../layout/authLayout'
import ForgotPassword from '../pages/ForgotPassword'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            {
                path: '/signup',
                element: <AuthLayout><Registeration/></AuthLayout>
            },
            {
                path: '/checkemail',
                element: <AuthLayout><CheckEmail/></AuthLayout>
            },
            {
                path: '/checkpassword',
                element: <AuthLayout><CheckPassword/></AuthLayout>
            },
            {
                path: '/forgotpassword',
                element: <AuthLayout><ForgotPassword/></AuthLayout>
            },
            {
                path: "",
                element: <Home/>,
                children: [
                    {
                        path : ':userId',
                        element: <MessagePage/>
                    }
                ]
            }
        ]
    }
])

export default router;