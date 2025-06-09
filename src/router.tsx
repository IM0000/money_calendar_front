import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import MyPage from './pages/MyPage';
import AuthSuccess from './pages/AuthSuccessPage';
import AuthError from './pages/AuthErrorPage';
import EmailVerifyPage from './pages/EmailVerifyPage';
import SignUpPage from './pages/SignupPage';
import SetPasswordPage from './pages/SetPasswordPage';
import FavoriteCalendarPage from './pages/FavoriteCalendarPage';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './routes/ProtectedRoute';
import SearchPage from './pages/SearchPage';
import { NotificationCenter } from './pages/NotificationCenter';
import LandingPage from './pages/LandingPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NotificationTester from './pages/NotificationTester';

const router = createBrowserRouter([
  {
    path: '/landing',
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: <MainPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/sign-up',
    element: <SignUpPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/email-verify',
    element: <EmailVerifyPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/search',
    element: (
      <ProtectedRoute>
        <SearchPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/users/password',
    element: <SetPasswordPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/mypage',
    element: (
      <ProtectedRoute>
        <MyPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/favorites/calendar',
    element: (
      <ProtectedRoute>
        <FavoriteCalendarPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/auth/success',
    element: <AuthSuccess />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/auth/error',
    element: <AuthError />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/error',
    element: <ErrorPage />,
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <NotificationCenter />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/notifications/test',
    element: (
      <ProtectedRoute>
        <NotificationTester />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
]);

export default router;
