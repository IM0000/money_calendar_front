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

  // 읽지 않은 알림 개수를 가져오는 쿼리
  const { data: unreadCountData } = useQuery({
    queryKey: ['unreadNotificationsCount'],
    queryFn: () => getUnreadNotificationsCount(),
    enabled: isAuthenticated,
    refetchOnMount: true, // 컴포넌트가 마운트될 때마다 새로 쿼리 실행
  });

  // 드롭다운(로그인 상태) 토글을 위한 상태
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // 캘린더 드롭다운 상태
  const [calendarDropdownOpen, setCalendarDropdownOpen] = useState(false);
  // 모바일 메뉴(햄버거 메뉴)를 위한 상태
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const calendarDropdownRef = useRef<HTMLLIElement>(null);

  // 드롭다운 토글 함수
  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // 캘린더 드롭다운 토글 함수
  const handleCalendarDropdownToggle = () => {
    setCalendarDropdownOpen(!calendarDropdownOpen);
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  // 모바일 메뉴 토글 함수 (햄버거 메뉴 버튼 클릭 시)
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // 드롭다운 영역 외 클릭 시 드롭다운 닫기 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        calendarDropdownRef.current &&
        !calendarDropdownRef.current.contains(event.target as Node)
      ) {
        setCalendarDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  // 데스크탑 메뉴 링크 클래스
  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'relative text-blue-500 hover:text-blue-500'
      : 'relative hover:text-gray-500';

  return (
    <header className="fixed top-0 z-50 w-full bg-white bg-opacity-90 shadow-md">
      {/* 헤더 상단의 메인 컨테이너 */}
      <div className="flex w-full items-center justify-between px-8 py-2">
        {/* 로고와 모바일 햄버거 메뉴 영역 */}
        <div className="flex items-center">
          {/* 모바일 화면에서만 보이는 햄버거 메뉴 버튼 (md:hidden: 중간 화면 이상에서는 숨김) */}
          <button
            onClick={toggleMobileMenu}
            className="mr-4 p-2 text-black md:hidden"
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          {/* 로고 영역 */}
          <Logo divClassName="text-black" width="55px" height="55px" />
        </div>

        {/* 데스크탑 화면에서만 보이는 네비게이션 메뉴 (hidden md:block: 모바일에서는 숨김) */}
        <nav className="hidden md:block">
          <ul className="text-md flex space-x-6 text-black">
            <li className="relative" ref={calendarDropdownRef}>
              <button
                onClick={handleCalendarDropdownToggle}
                className="flex items-center space-x-1 hover:text-gray-500"
              >
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
                <div className="absolute left-0 mt-2 w-32 rounded-lg bg-white py-2 shadow-lg">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setCalendarDropdownOpen(false)}
                  >
                    전체 캘린더
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
                {/* 알림 갯수가 0보다 크면 뱃지 노출 */}
                {(unreadCountData?.data?.count || 0) > 0 && (
                  <span className="absolute -right-5 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadCountData?.data?.count}
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* 사용자 영역: 로그인 상태이면 사용자 아이콘, 아니면 로그인/회원가입 버튼 */}
        <div className="relative">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleDropdownToggle}
                className="rounded-full p-2 text-black hover:bg-gray-200"
              >
                <FaUser size={20} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-lg bg-white py-2 shadow-lg">
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

      {/* 모바일 메뉴: 햄버거 메뉴 버튼을 누르면 나타남 (md:hidden: 모바일에서만 보임) */}
      {mobileMenuOpen && (
        <nav className="bg-white shadow-md md:hidden">
          <ul className="flex flex-col space-y-2 px-4 py-2 text-sm text-black">
            <li>
              <NavLink
                to="/calendar"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'relative text-blue-500 hover:text-blue-500'
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
                    ? 'relative text-blue-500 hover:text-blue-500'
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
                    ? 'relative text-blue-500 hover:text-blue-500'
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
                    ? 'relative text-blue-500 hover:text-blue-500'
                    : 'relative hover:text-gray-500'
                }
              >
                알림센터
                {(unreadCountData?.data?.count || 0) && (
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
