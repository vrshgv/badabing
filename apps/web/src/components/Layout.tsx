import { Link, NavLink, Outlet } from 'react-router';

export function Layout() {
  return (
    <>
      <header>
        <Link to="/screenings">badabing</Link>
        <nav>
          <NavLink to="/screenings" end>Screenings</NavLink>
          <NavLink to="/screenings/new">New screening</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}