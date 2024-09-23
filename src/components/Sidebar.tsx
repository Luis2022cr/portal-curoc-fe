import React from "react";
import { CiLogout, CiUser } from "react-icons/ci";
import { FaRegCalendarAlt } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../api/useAuth";
import logoCuroc from "@/assets/logoCuroc.avif";

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="bg-blue-900 text-white h-screen w-40 hidden md:flex text-sm bottom-0 fixed">
      {" "}
      {/* Ajustar top */}
      {/* Opciones de navegación */}
      <nav className="mt-5">
        <ul className="space-y-2">
          <li>
            <span
              className="flex items-center justify-center"
              onClick={() => {
                navigate("/");
              }}
            >
              <img src={logoCuroc} alt="logo unah" className="w-10 h-10" />
              <span className="text-sm font-bold text-white ml-2">
                UNAH COPAN
              </span>
            </span>
          </li>
          {location.pathname.includes("dashboard-coordinador") && (
            <>
              <li>
                <NavLink
                  to="/dashboard-coordinador/main"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-6 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <LuLayoutDashboard className="h-6 w-6 mr-2" />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard-coordinador/perfil"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-6 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <CiUser className="h-6 w-6 mr-2" />
                  Perfil
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard-coordinador/calendario"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-6 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <FaRegCalendarAlt className="h-6 w-6 mr-2" />
                  Calendario
                </NavLink>
              </li>
            </>
          )}
          {location.pathname.includes("dashboard-estudiante") && (
            <>
              <li>
                <NavLink
                  to="/dashboard-estudiante/main"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-6 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <LuLayoutDashboard className="h-6 w-6 mr-2" />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard-estudiante/perfil"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-6 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <CiUser className="h-6 w-6 mr-2" />
                  Perfil
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard-estudiante/calendario"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-6 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <FaRegCalendarAlt className="h-6 w-6 mr-2" />
                  Calendario
                </NavLink>
              </li>
            </>
          )}
          {location.pathname.includes("dashboard-voae") && (
            <>
              <li>
                <NavLink
                  to="/dashboard-voae/main"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-6 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <LuLayoutDashboard className="h-6 w-6 mr-2" />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard-voae/perfil"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-6 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <CiUser className="h-6 w-6 mr-2" />
                  Perfil
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard-voae/calendario"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-6 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <FaRegCalendarAlt className="h-6 w-6 mr-2" />
                  Calendario
                </NavLink>
              </li>
            </>
          )}
          <hr className="my-4 border-t border-gray-300" />
          <li>
            <a
              onClick={logout}
              className={`flex items-center py-3 px-6 hover:bg-red-700`}
            >
              <CiLogout className="h-6 w-6 mr-2" />
              Cerrar Sesión
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
