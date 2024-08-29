import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import Logo from '../Logo';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // 로그아웃 로직 추가
  };

  useEffect(() => {
    localStorage.setItem('isLoggedIn', 'true');
    // 로그인 여부 확인
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      setIsLoggedIn(true);
    }

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

  return (
    <header className="fixed top-0 z-50 flex h-16 w-full justify-between bg-white bg-opacity-90 p-4 text-white shadow-md">
      <div className="flex w-full items-center justify-between pl-16 pr-16">
        <Logo divClassName="text-black mt-1" width="30px" height="30px" />
        <div className="">
          <ul className="flex cursor-pointer flex-row space-x-6 text-black">
            <Link to="/search">
              <li className="hover:text-gray-500">이벤트 검색</li>
            </Link>
            <Link to="/search">
              <li className="hover:text-gray-500">시장</li>
            </Link>
          </ul>
        </div>
        <div className="flex items-center pl-24">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleDropdownToggle}
                className="m-2 rounded-full p-2 text-black hover:bg-gray-200"
              >
                <FaUser size={20} />
              </button>
              {dropdownOpen && (
                <div className="absolute left-1/2 right-0 mt-2 w-32 -translate-x-1/2 transform rounded-lg bg-white py-2 shadow-lg">
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
                <button className="m-2 rounded-lg border bg-white p-2 text-black hover:bg-gray-200">
                  로그인
                </button>
              </Link>
              <Link to="/signup">
                <button className="m-2 rounded-lg bg-blue-400 p-2 text-white hover:bg-blue-500">
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
