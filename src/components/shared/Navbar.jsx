import { useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";

const Navbar = () => {
  const { logOut, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const res = await logOut();
      console.log(res.user);
      navigate(location?.state ? location.state : "/");
    } catch (err) {
      console.error(err.message);
    }
  };
  

  const navLinks = (
    <>
      <li>
        <NavLink
          className="text-sm md:text-xl font-semibold transition-all duration-300 ease-in-out text-[#04734C] hover:bg-[#04734C] hover:text-white"
          style={({ isActive }) => ({
            background: isActive ? "#04734C" : "",
            color: isActive ? "#fff" : "",
            padding: isActive ? "5px 16px" : "5px 12px",
            borderRadius: isActive ? "5px" : "",
            transition: "all 0.3s ease-in-out",
          })}
          to="/"
        >
          Home
        </NavLink>
      </li>
      {!user && (
        <li>
          <NavLink
            className="text-sm md:text-xl font-semibold transition-all duration-300 ease-in-out text-[#04734C] hover:bg-[#04734C] hover:text-white"
            style={({ isActive }) => ({
              background: isActive ? "#04734C" : "",
              color: isActive ? "#fff" : "",
              padding: isActive ? "5px 16px" : "5px 12px",
              borderRadius: isActive ? "5px" : "",
              transition: "all 0.3s ease-in-out",
            })}
            to="/login"
          >
            Login
          </NavLink>
        </li>
      )}
      {user && (
        <li>
          <NavLink
            className="text-sm md:text-xl font-semibold transition-all duration-300 ease-in-out text-[#04734C] hover:bg-[#04734C] hover:text-white"
            style={({ isActive }) => ({
              background: isActive ? "#04734C" : "",
              color: isActive ? "#fff" : "",
              padding: isActive ? "5px 16px" : "5px 12px",
              borderRadius: isActive ? "5px" : "",
              transition: "all 0.3s ease-in-out",
            })}
            to={`/profile/${user.email}`}
          >
            My Profile
          </NavLink>
        </li>
      )}
      <li>
        {user ? (
          <button
            className="text-sm md:text-xl font-semibold transition-all duration-300 ease-in-out text-[#04734C] hover:bg-[#04734C] hover:text-white"
            style={{
              padding: "5px 16px",
              borderRadius: "5px",
              transition: "all 0.3s ease-in-out",
              border: "none",
              cursor: "pointer",
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <NavLink
            className="text-base md:text-xl font-semibold transition-all duration-300 ease-in-out text-[#04734C] hover:bg-[#04734C] hover:text-white"
            style={({ isActive }) => ({
              background: isActive ? "#04734C" : "",
              color: isActive ? "#fff" : "",
              padding: isActive ? "5px 16px" : "5px 12px",
              borderRadius: isActive ? "5px" : "",
              transition: "all 0.3s ease-in-out",
            })}
            to="/register"
          >
            Register
          </NavLink>
        )}
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-100 px-4 md:px-8 lg:px-16 shadow">
      <div className="navbar-start max-sm:hidden">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {navLinks}
          </ul>
        </div>
        <a
          href="/"
          className="text-[#04734C] font-bold text-lg md:text-2xl lg:text-4xl"
        >
          Book House
        </a>
      </div>
      <div className="navbar-center sm:hidden">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {navLinks}
          </ul>
        </div>
        <a
          href="/"
          className="text-[#04734C] font-bold text-lg md:text-2xl lg:text-4xl"
        >
          Book House
        </a>
      </div>
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-5">{navLinks}</ul>
      </div>
    </div>
  );
};

export default Navbar;
