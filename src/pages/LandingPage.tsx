import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Bell, Search, User } from 'lucide-react';
import Logo from '@/components/Logo';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 내비게이션 바 */}
      <nav className="container flex items-center justify-between px-4 py-6 mx-auto">
        <div className="flex items-center">
          <Logo
            divClassName="text-black"
            spanClassName="bold logo"
            height="32px"
          />
        </div>

        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          <a href="#features" className="text-gray-600 hover:text-blue-600">
            기능
          </a>
          <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">
            사용방법
          </a>
          <Link
            to="/login"
            className="px-6 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700"
          >
            시작하기
          </Link>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="container flex flex-col px-4 py-4 mx-auto space-y-4">
            <a href="#features" className="text-gray-600 hover:text-blue-600">
              기능
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-blue-600"
            >
              사용방법
            </a>
            <Link
              to="/login"
              className="px-6 py-2 text-center text-white bg-blue-600 rounded-full hover:bg-blue-700"
            >
              시작하기
            </Link>
          </div>
        </div>
      )}

      {/* 히어로 섹션 */}
      <section className="container px-4 py-16 mx-auto md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="flex flex-col space-y-6">
            <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
              투자자를 위한
              <br />
              <span className="text-blue-600">똑똑한 일정 관리</span>
            </h1>
            <p className="text-lg text-gray-600">
              실적 발표, 배당금 일정, 경제지표 발표를 효율적으로 관리하고
              <br />
              중요한 투자 정보를 놓치지 마세요.
            </p>
            <div className="flex flex-col pt-4 space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link
                to="/sign-up"
                className="inline-flex items-center justify-center px-8 py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700"
              >
                무료로 시작하기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-3 text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section id="features" className="container px-4 py-16 mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900">주요 기능</h2>
          <p className="mt-4 text-lg text-gray-600">
            머니캘린더가 제공하는 핵심 기능을 확인하세요
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* 투자 캘린더 */}
          <div className="p-6 transition-transform bg-white shadow-md rounded-xl hover:scale-105">
            <div className="inline-flex p-3 mb-4 bg-blue-100 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold">투자 캘린더</h3>
            <p className="text-gray-600">
              모든 실적 발표, 배당 일정, 주요 경제지표를 한눈에 확인하고 관심
              일정만 모아볼 수 있습니다.
            </p>
          </div>

          {/* 알림 센터 */}
          <div className="p-6 transition-transform bg-white shadow-md rounded-xl hover:scale-105">
            <div className="inline-flex p-3 mb-4 bg-orange-100 rounded-full">
              <Bell className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="mb-2 text-xl font-bold">알림 센터</h3>
            <p className="text-gray-600">
              중요한 투자 이벤트를 놓치지 않도록 이메일이나 푸시 알림으로 미리
              알려드립니다.
            </p>
          </div>

          {/* 빠른 검색 */}
          <div className="p-6 transition-transform bg-white shadow-md rounded-xl hover:scale-105">
            <div className="inline-flex p-3 mb-4 bg-green-100 rounded-full">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold">빠른 검색</h3>
            <p className="text-gray-600">
              종목명이나 티커로 빠르게 검색하고 관련된 모든 투자 정보를 쉽게
              찾아보세요.
            </p>
          </div>

          {/* 맞춤 프로필 */}
          <div className="p-6 transition-transform bg-white shadow-md rounded-xl hover:scale-105">
            <div className="inline-flex p-3 mb-4 bg-purple-100 rounded-full">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold">맞춤 프로필</h3>
            <p className="text-gray-600">
              개인정보와 알림 설정을 간편하게 관리하고 소셜 계정으로 쉽게 연동할
              수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 사용 방법 섹션 */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              이렇게 사용하세요
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              머니캘린더로 더 스마트한 투자를 시작하는 방법
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-2xl font-bold text-white bg-blue-600 rounded-full">
                1
              </div>
              <h3 className="mb-2 text-xl font-bold">계정 만들기</h3>
              <p className="text-gray-600">
                간단한 회원가입으로 머니캘린더의 모든 기능을 이용하세요.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-2xl font-bold text-white bg-blue-600 rounded-full">
                2
              </div>
              <h3 className="mb-2 text-xl font-bold">관심 일정 설정</h3>
              <p className="text-gray-600">
                자주 확인하고 싶은 종목이나 경제지표를 즐겨찾기하세요.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-2xl font-bold text-white bg-blue-600 rounded-full">
                3
              </div>
              <h3 className="mb-2 text-xl font-bold">알림 받기</h3>
              <p className="text-gray-600">
                중요한 일정을 놓치지 않도록 알림을 설정하고 투자 결정에
                활용하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="container px-4 py-16 mx-auto">
        <div className="px-6 py-12 text-center text-white bg-blue-600 rounded-2xl md:px-12">
          <h2 className="mb-4 text-3xl font-bold">지금 바로 시작하세요</h2>
          <p className="mb-8 text-lg">
            투자 일정을 효율적으로 관리하고 더 스마트한 투자 결정을 내리세요.
          </p>
          <Link
            to="/sign-up"
            className="inline-flex items-center px-8 py-3 font-medium text-blue-600 bg-white rounded-full hover:bg-gray-100"
          >
            무료로 시작하기
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-12 text-white bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="flex items-center mb-8">
            <Logo
              divClassName="text-white"
              spanClassName="bold logo"
              width="44px"
              height="44px"
            />
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h4 className="mb-4 text-lg font-bold">서비스</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white"
                  >
                    기능
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-400 hover:text-white"
                  >
                    사용방법
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-bold">이용하기</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white">
                    로그인
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sign-up"
                    className="text-gray-400 hover:text-white"
                  >
                    회원가입
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-bold">정보</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    개인정보처리방침
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    이용약관
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-bold">연락처</h4>
              <p className="text-gray-400">
                문의사항이 있으시면 언제든지 연락주세요.
              </p>
              <p className="mt-2 text-gray-400">support@moneycalendar.com</p>
            </div>
          </div>

          <div className="pt-8 mt-12 text-center text-gray-400 border-t border-gray-800">
            <p>
              © {new Date().getFullYear()} 머니캘린더. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
