import { Link, NavLink, Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Layout() {
  const { token, logout } = useApp();

  return (
    <div className="app-layout">
      <header className="site-header">
        <Link to="/gallery" className="brand">
          <span className="brand-mark" aria-hidden />
          <span className="brand-text">Memory Gallery</span>
        </Link>

        <nav className="main-nav" aria-label="Main">
          <NavLink
            to="/gallery"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            end
          >
            Gallery
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Upload
          </NavLink>
          <NavLink
            to="/auth"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            {token ? "Account" : "Sign in"}
          </NavLink>
        </nav>

        {token ? (
          <button type="button" className="nav-logout" onClick={logout}>
            Log out
          </button>
        ) : (
          <span className="nav-spacer" aria-hidden />
        )}
      </header>

      <main className="app">
        <Outlet />
      </main>
    </div>
  );
}
