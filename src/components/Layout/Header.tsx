import { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaUser, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import Logo from '../Logo';
import { useAuthStore } from '../../zustand/useAuthStore';
import { getUnreadNotificationsCount } from '@/api/services/notificationService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { NewNotificationBubble } from '../notification/NotificationBubble';
import {
  isRefreshInProgress,
  startRefresh,
  finishRefresh,
  queueEventSource,
} from '@/utils/refreshManager';
import { refresh } from '@/api/services/authService';
import { createRefreshEventSource } from '@/utils/refreshEventSource';

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, checkAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const [showBubble, setShowBubble] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  const { data: unreadCountData } = useQuery({
    queryKey: ['unreadNotificationsCount'],
    queryFn: () => getUnreadNotificationsCount(),
    enabled: isAuthenticated,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    esRef.current?.close();
    let cancelled = false;

    const instantiate = async () => {
      try {
        const es = await createRefreshEventSource(
          `${VITE_BACKEND_URL}/api/v1/notifications/stream`,
          { withCredentials: true },
        );

        if (cancelled) {
          es.close();
          return;
        }
        esRef.current = es;

        es.onmessage = (e) => {
          console.log('es onmessage');
          try {
            queryClient.setQueryData<{ data: { count: number } }>(
              ['unreadNotificationsCount'],
              (old) => ({ data: { count: (old?.data.count || 0) + 1 } }),
            );
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
          } catch (err) {
            console.error('SSE 데이터 파싱 실패:', e.data, err);
            toast.error('알림 수신 중 문제가 발생했습니다.');
          }
          setShowBubble(true);
        };

        es.onerror = () => {
          console.log('es error, 재연결 큐잉');
          es.close();
          // 큐에 재연결 로직 추가
          queueEventSource(instantiate);
          // 리프레시가 진행 중이 아니면 직접 트리거
          if (!isRefreshInProgress()) {
            startRefresh();
            refresh()
              .then(() => finishRefresh(true))
              .catch(() => finishRefresh(false));
          }
        };
      } catch (err) {
        console.error('EventSource 연결 실패:', err);
      }
    };

    instantiate();

    return () => {
      cancelled = true;
      esRef.current?.close();
    };
  }, [isAuthenticated, queryClient]);

  // 드롭다운 상태
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [calendarDropdownOpen, setCalendarDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 로그아웃
  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    esRef.current?.close();
    queryClient.removeQueries({ queryKey: ['unreadNotificationsCount'] });
    queryClient.removeQueries({ queryKey: ['notifications'] });
    navigate('/');
  };

  // 모바일 메뉴 토글
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 로그인 상태 확인
  useEffect(() => {
    checkAuth();
  }, []);

  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'relative text-blue-500 hover:text-blue-500'
      : 'relative hover:text-gray-500';

  return (
    <header className="fixed top-0 z-50 w-full bg-white shadow-md bg-opacity-90">
      <div className="flex w-full items-center justify-between px-8 py-[0.8rem]">
        <div className="flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="p-2 mr-4 text-black md:hidden"
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <Logo divClassName="text-black" height="32px" />
        </div>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8 text-black text-md">
            <li
              className="relative"
              onMouseEnter={() => setCalendarDropdownOpen(true)}
              onMouseLeave={() => setCalendarDropdownOpen(false)}
            >
              <button className="flex items-center space-x-1 hover:text-gray-500">
                <span>캘린더</span>
                <FaChevronDown
                  size={12}
                  className={
                    calendarDropdownOpen
                      ? 'rotate-180 transform transition-transform'
                      : 'transition-transform'
                  }
                />
              </button>
              {calendarDropdownOpen && (
                <div className="absolute z-10 w-40 py-2 bg-white rounded-lg shadow-lg -left-6 top-full">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setCalendarDropdownOpen(false)}
                  >
                    모든 일정
                  </Link>
                  <Link
                    to="/favorites/calendar"
                    className="block px-4 py-2 text_gray-800 hover:bg-gray-100"
                    onClick={() => setCalendarDropdownOpen(false)}
                  >
                    관심 일정
                  </Link>
                </div>
              )}
            </li>
            <li>
              <NavLink to="/search" className={desktopLinkClass}>
                검색
              </NavLink>
            </li>
            <li>
              <NavLink to="/notifications" className={desktopLinkClass}>
                알림센터
                {(unreadCountData?.data?.count || 0) > 0 && (
                  <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -right-5 -top-2">
                    {unreadCountData?.data?.count}
                  </span>
                )}
              </NavLink>
              {showBubble && (
                <NewNotificationBubble onClose={() => setShowBubble(false)} />
              )}
            </li>
          </ul>
        </nav>

        {/* 사용자 영역 */}
        <div className="relative">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2 text-black rounded-full hover:bg-gray-200"
              >
                <FaUser size={20} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 w-32 py-2 bg-white rounded-lg shadow-lg">
                  <Link
                    to="/mypage"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    마이페이지
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link to="/login">
                <button className="p-2 text-black bg-white border rounded-lg hover:bg-gray-200">
                  로그인
                </button>
              </Link>
              <Link to="/sign-up">
                <button className="p-2 text-white bg-blue-400 rounded-lg hover:bg-blue-500">
                  회원가입
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <nav className="bg-white shadow-md md:hidden">
          <ul className="flex flex-col px-4 py-2 space-y-2 text-sm text-black">
            <li>
              <NavLink
                to="/calendar"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'relative text-blue-500'
                    : 'relative hover:text-gray-500'
                }
              >
                캘린더
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/favorites/calendar"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'relative text-blue-500'
                    : 'relative hover:text-gray-500'
                }
              >
                관심 일정
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/search"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'relative text-blue-500'
                    : 'relative hover:text-gray-500'
                }
              >
                검색
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'relative text-blue-500'
                    : 'relative hover:text-gray-500'
                }
              >
                알림센터
                {(unreadCountData?.data?.count || 0) > 0 && (
                  <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -right-4 -top-2">
                    {unreadCountData?.data?.count}
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
