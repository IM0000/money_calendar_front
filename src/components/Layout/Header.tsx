import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import Logo from '../Logo';
import { useAuthStore } from '../../zustand/useAuthStore';

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, checkAuth } = useAuthStore(); // AuthStore 상태와 메서드 사용
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout(); // 로그아웃 메서드 호출
    navigate('/');
  };

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

  // 초기 로그인 상태 확인
  useEffect(() => {
    checkAuth(); // AuthStore에서 로그인 상태 확인
  }, [checkAuth]);

  return (
    <header className="fixed top-0 z-50 flex justify-between w-full h-16 p-4 text-white bg-white shadow-md bg-opacity-90">
      <div className="flex items-center justify-between w-full pl-16 pr-16">
        <Logo divClassName="text-black mt-1" width="30px" height="30px" />
        <div className="">
          <ul className="flex flex-row space-x-6 text-black cursor-pointer">
            <Link to="/search">
              <li className="hover:text-gray-500">경제지표</li>
            </Link>
            <Link to="/search">
              <li className="hover:text-gray-500">실적</li>
            </Link>
            <Link to="/search">
              <li className="hover:text-gray-500">배당</li>
            </Link>
          </ul>
        </div>
        <div className="flex items-center pl-24">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleDropdownToggle}
                className="p-2 m-2 text-black rounded-full hover:bg-gray-200"
              >
                <FaUser size={20} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 w-32 py-2 mt-2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg left-1/2">
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
            <>
              <Link to="/login">
                <button className="p-2 m-2 text-black bg-white border rounded-lg hover:bg-gray-200">
                  로그인
                </button>
              </Link>
              <Link to="/sign-up">
                <button className="p-2 m-2 text-white bg-blue-400 rounded-lg hover:bg-blue-500">
                  회원가입
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
