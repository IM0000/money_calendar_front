import { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaUser, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import Logo from '../Logo';
import { useAuthStore } from '../../zustand/useAuthStore';
import { getUnreadNotificationsCount } from '@/api/services/notificationService';
import { useQuery } from '@tanstack/react-query';

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, checkAuth } = useAuthStore();

  // 읽지 않은 알림 개수 쿼리
  const { data: unreadCountData } = useQuery({
    queryKey: ['unreadNotificationsCount'],
    queryFn: () => getUnreadNotificationsCount(),
    enabled: isAuthenticated,
    refetchOnMount: true,
  });

  // 드롭다운 상태
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [calendarDropdownOpen, setCalendarDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 로그아웃
  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
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
    <header className="fixed top-0 z-50 w-full bg-white bg-opacity-90 shadow-md">
      <div className="flex w-full items-center justify-between px-8 py-[0.8rem]">
        <div className="flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="mr-4 p-2 text-black md:hidden"
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <Logo divClassName="text-black" height="32px" />
        </div>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:block">
          <ul className="text-md flex space-x-8 text-black">
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
                <div className="absolute -left-6 top-full w-40 rounded-lg bg-white py-2 shadow-lg">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setCalendarDropdownOpen(false)}
                  >
                    모든 일정
                  </Link>
                  <Link
                    to="/favorites/calendar"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
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
                알림
                {(unreadCountData?.data?.count || 0) > 0 && (
                  <span className="absolute -right-5 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadCountData?.data?.count}
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* 사용자 영역 */}
        <div className="relative">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="rounded-full p-2 text-black hover:bg-gray-200"
              >
                <FaUser size={20} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 w-32 rounded-lg bg-white py-2 shadow-lg">
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
                <button className="rounded-lg border bg-white p-2 text-black hover:bg-gray-200">
                  로그인
                </button>
              </Link>
              <Link to="/sign-up">
                <button className="rounded-lg bg-blue-400 p-2 text-white hover:bg-blue-500">
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
          <ul className="flex flex-col space-y-2 px-4 py-2 text-sm text-black">
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
                  <span className="absolute -right-4 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
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
