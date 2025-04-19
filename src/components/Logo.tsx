import { Link } from 'react-router-dom';
import logoBlack from '../assets/money-calendar-logo-b.png';
import logoWhite from '../assets/money-calendar-logo-w.png';

interface LogoProps {
  width?: string;
  height?: string;
  divClassName?: string;
  spanClassName?: string;
}

export default function Logo({
  width = '55px',
  height = '55px',
  divClassName = '',
  spanClassName = '',
}: LogoProps) {
  const isWhite = divClassName.includes('text-white');
  const logoSrc = isWhite ? logoWhite : logoBlack;

  return (
    <Link to="/">
      <div className={`flex items-center gap-x-1 text-2xl ${divClassName}`}>
        <img
          src={logoSrc}
          alt="Logo"
          className="block"
          style={{ width, height }}
        />
        {spanClassName ? (
          <span className={`${spanClassName} pt-2 leading-none`}>
            머니캘린더
          </span>
        ) : (
          ''
        )}
      </div>
    </Link>
  );
}
