import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import SignupPage from './pages/SignupPage';
import SearchPage from './pages/SearchPage';
import MyPage from './pages/MyPage';

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
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/search',
    element: <SearchPage />,
  },
  {
    path: '/mypage',
    element: <MyPage />,
  },
]);

export default router;
