import { NavLink, useLocation } from "react-router-dom";
import { FaHome, FaSearch, FaThumbtack } from "react-icons/fa";

function NavBar() {
  const IconsStyle = `transition-all ease-in-out text-2xl hover:scale-120`;
  const NavStyles = `p-3`;

  const location = useLocation();

  // Calculate left position for the indicator based on active route
  const left =
    location.pathname === "/"
      ? 12
      : location.pathname === "/search"
        ? 68
        : location.pathname === "/pins"
          ? 124
          : 12;

  return (
    <div
      className={`
        w-auto h-auto
        fixed bottom-0 left-1/2 translate-x-[-50%] p-2
        text-white border-2 border-white/50 rounded-t-2xl
        flex justify-center gap-3 items-center flex-row z-100
        bg-black/80
      `}
    >
      <NavLink
        className={({ isActive }) =>
          `${NavStyles} ${isActive ? "opacity-100" : "opacity-50"}`
        }
        to="/"
      >
        <FaHome className={IconsStyle} />
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          `${NavStyles} ${isActive ? "opacity-100" : "opacity-50"}`
        }
        to="/search"
      >
        <FaSearch className={IconsStyle} />
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          `${NavStyles} ${isActive ? "opacity-100" : "opacity-50"}`
        }
        to="/pins"
      >
        <FaThumbtack className={IconsStyle} />
      </NavLink>

      {/* Horizontal indicator that moves left/right */}
      <div
        className="absolute w-10 h-1 bg-white -translate-y-full top-0 rounded-full transition-all duration-300"
        style={{ left: `${left}px` }}
      ></div>
    </div>
  );
}

export default NavBar;
