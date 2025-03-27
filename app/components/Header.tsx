import {Link} from 'react-router';

export default function Header() {
  return (
    <header className="mb-14">
      <Link to="/">
        <h1 className="text-3xl text-[var(--color-title)] font-title inline-block">ahntree.log</h1>
      </Link>
    </header>
  );
}
