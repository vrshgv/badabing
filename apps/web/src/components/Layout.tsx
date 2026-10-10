import { Link, NavLink, Outlet } from 'react-router';
import { UserSwitcher } from './UserSwitcher';

export function Layout() {
  return (
    <>
      <header>
        <Link to="/screenings">badabing</Link>
        <nav>
          <NavLink to="/screenings" end>Screenings</NavLink>
          <NavLink to="/screenings/new">New screening</NavLink>
        </nav>
        <UserSwitcher />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}