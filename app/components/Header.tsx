import {CiUser} from 'react-icons/ci';
import {Link} from 'react-router';

export default function Header() {
  return (
    <header className="mb-12 pb-1.5 border-b border-dashed border-gray-300">
      <div className="flex justify-between items-center">
        <Link to="/">
          <h1 className="text-3xl text-[var(--color-primary)] font-title inline-block">ahntree.log</h1>
        </Link>
        <div className="flex items-center relative">
          <Link to="/about">
            <CiUser className="text-2xl" />
          </Link>
        </div>
      </div>
    </header>
  );
}
