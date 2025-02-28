import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaUser, FaBars, FaTimes } from 'react-icons/fa';
import Logo from '../Logo';
import { useAuthStore } from '../../zustand/useAuthStore';

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, checkAuth } = useAuthStore();

  // 드롭다운(로그인 상태) 토글을 위한 상태
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // 모바일 메뉴(햄버거 메뉴)를 위한 상태
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 토글 함수
  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 데스크탑 메뉴 링크 클래스
  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-blue-500 hover:text-blue-500' : 'hover:text-gray-500';

  return (
    <header className="fixed top-0 z-50 w-full bg-white shadow-md bg-opacity-90">
      {/* 헤더 상단의 메인 컨테이너 */}
      <div className="flex items-center justify-between w-full px-8 py-2">
        {/* 로고와 모바일 햄버거 메뉴 영역 */}
        <div className="flex items-center">
          {/* 모바일 화면에서만 보이는 햄버거 메뉴 버튼 (md:hidden: 중간 화면 이상에서는 숨김) */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 mr-4 text-black md:hidden"
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          {/* 로고 영역 */}
          <Logo divClassName="text-black" width="30px" height="30px" />
        </div>

        {/* 데스크탑 화면에서만 보이는 네비게이션 메뉴 (hidden md:block: 모바일에서는 숨김) */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 text-black text-md">
            <li>
              <NavLink to="/" className={desktopLinkClass}>
                캘린더
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
                className="p-2 text-black rounded-full hover:bg-gray-200"
              >
                <FaUser size={20} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 w-32 py-2 mt-2 bg-white rounded-lg shadow-lg">
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

      {/* 모바일 메뉴: 햄버거 메뉴 버튼을 누르면 나타남 (md:hidden: 모바일에서만 보임) */}
      {mobileMenuOpen && (
        <nav className="bg-white shadow-md md:hidden">
          <ul className="flex flex-col px-4 py-2 space-y-2 text-sm text-black">
            <li>
              <NavLink
                to="/search/economic"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'text-blue-500 hover:text-blue-500'
                    : 'hover:text-gray-500'
                }
              >
                경제지표
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/search/earnings"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'text-blue-500 hover:text-blue-500'
                    : 'hover:text-gray-500'
                }
              >
                실적
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/search/dividends"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'text-blue-500 hover:text-blue-500'
                    : 'hover:text-gray-500'
                }
              >
                배당
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
