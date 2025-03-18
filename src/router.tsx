import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import SearchPage from './pages/SearchPage';
import MyPage from './pages/MyPage2';
import AuthSuccess from './pages/AuthSuccessPage';
import AuthError from './pages/AuthErrorPage';
import EmailVerifyPage from './pages/EmailVerifyPage';
import SignUpPage from './pages/SignUpPage';
import SetPasswordPage from './pages/SetPasswordPage';
import ProtectedRoute from './routes/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/sign-up',
    element: <SignUpPage />,
  },
  {
    path: '/email-verify',
    element: <EmailVerifyPage />,
  },
  {
    path: '/search',
    element: <SearchPage />,
  },
  {
    path: '/users/password',
    element: <SetPasswordPage />,
  },
  {
    path: '/mypage',
    element: (
      <ProtectedRoute>
        <MyPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/auth/success',
    element: <AuthSuccess />,
  },
  {
    path: '/auth/error',
    element: <AuthError />,
  },
]);

export default router;
