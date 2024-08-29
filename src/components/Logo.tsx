import { Link } from 'react-router-dom';
import logoBlack from '../assets/money_calendar_logo_b.png';
import logoWhite from '../assets/money_calendar_logo_w.png';

interface LogoProps {
  width?: string;
  height?: string;
  divClassName?: string;
  spanClassName?: string;
}

export default function Logo({
  width = '44px',
  height = '44px',
  divClassName = '',
  spanClassName = '',
}: LogoProps) {
  const isWhite = divClassName.includes('text-white');
  const logoSrc = isWhite ? logoWhite : logoBlack;

  return (
    <Link to="/">
      <div className={`flex gap-x-2 text-2xl ${divClassName}`}>
        <img src={logoSrc} alt="Logo" style={{ width, height }} />
        <span className={`pt-0.5 align-text-bottom ${spanClassName}`}>
          머니캘린더
        </span>
      </div>
    </Link>
  );
}
