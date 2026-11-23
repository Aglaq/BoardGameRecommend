import { NavLink } from "react-router";

const Navbar = ({ isLoggedIn }) => {
  return (
    <div className="navbar">
      <NavLink
        to={"/"}
        style={({ isActive }) =>
          isActive ? linkStyles.activeLink : linkStyles.defaultLink
        }
      >
        Home
      </NavLink>

      {isLoggedIn === false && (
        <>
          <NavLink
            to="/register"
            style={({ isActive }) =>
              isActive ? linkStyles.activeLink : linkStyles.defaultLink
            }
          >
            Sign Up
          </NavLink>
          <NavLink
            to="/login"
            style={({ isActive }) =>
              isActive ? linkStyles.activeLink : linkStyles.defaultLink
            }
          >
            Log In
          </NavLink>
        </>
      )}

      {isLoggedIn === true && (
        <>
          <NavLink
            to="/account"
            style={({ isActive }) =>
              isActive ? linkStyles.activeLink : linkStyles.defaultLink
            }
          >
            My Account
          </NavLink>
        </>
      )}
    </div>
  );
};

export default Navbar;

const linkStyles = {
  activeLink: {
    color: "gray",
    padding: "20px",
  },
  defaultLink: {
    textDecoration: "none",
    color: "white",
    padding: "20px",
  },
};
