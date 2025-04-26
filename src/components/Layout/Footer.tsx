import Logo from '../Logo';

export default function Footer() {
  return (
    <footer className="mt-8 flex w-full flex-col items-center border-t-2 bg-white p-4 text-gray-500">
      {/* 상단 영역: px-8로 좌우 여백을 맞춤 */}
      <div className="flex w-full items-center justify-between px-8 py-4">
        <Logo divClassName="text-black" height="44px" />

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
      <div className="mt-4 flex w-full items-center justify-between border-t border-gray-700 px-8 py-4">
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
