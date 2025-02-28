import Logo from '../Logo';

export default function Footer() {
  return (
    <footer className="flex flex-col items-center w-full p-4 mt-8 text-gray-500 bg-white border-t-2">
      {/* 상단 영역: px-8로 좌우 여백을 맞춤 */}
      <div className="flex items-center justify-between w-full px-8 py-4">
        <Logo divClassName="text-black" width="30px" height="30px" />

        <div className="flex space-x-4">
          <a href="/terms" className="hover:underline">
            이용약관
          </a>
          <a href="/privacy" className="hover:underline">
            개인정보처리방침
          </a>
        </div>
      </div>
      {/* 하단 영역: px-8로 좌우 여백을 맞춤 */}
      <div className="flex items-center justify-between w-full px-8 py-4 mt-4 border-t border-gray-700">
        <p>© 2025 머니캘린더. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="https://discord.com" className="hover:underline">
            Discord
          </a>
          <a href="https://X.com" className="hover:underline">
            X
          </a>
          <a href="https://facebook.com" className="hover:underline">
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}
