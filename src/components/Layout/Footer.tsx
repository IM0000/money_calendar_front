import Logo from '../Logo';

export default function Footer() {
  return (
    <footer className="mt-8 flex h-auto w-full flex-col items-center border-t-2 bg-white p-4 text-gray-500">
      <div className="flex w-full max-w-screen-xl items-center justify-between p-4">
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
      <div className="mt-4 flex w-full max-w-screen-xl items-center justify-between border-t border-gray-700 p-4">
        <p>© 2024 머니캘린더. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="https://instagram.com" className="hover:underline">
            Instagram
          </a>
          <a href="https://facebook.com" className="hover:underline">
            Facebook
          </a>
          <a href="https://X.com" className="hover:underline">
            X
          </a>
        </div>
      </div>
    </footer>
  );
}
