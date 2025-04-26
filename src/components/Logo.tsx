import { Link } from 'react-router-dom';
import logoBlack from '../assets/moneycalendar_logo_cropped_55px.png';
import logoWhite from '../assets/money-calendar-logo-w.png';

interface LogoProps {
  width?: string;
  height?: string;
  divClassName?: string;
  spanClassName?: string;
}

export default function Logo({
  width = 'auto',
  height = '55px',
  divClassName = '',
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
      </div>
    </Link>
  );
}
