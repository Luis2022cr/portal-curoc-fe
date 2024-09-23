import logoCuroc from "@/assets/logoCuroc.avif";
import { useState } from "react";
import { CiLogout, CiUser } from "react-icons/ci";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { LuLayoutDashboard } from "react-icons/lu";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../api/useAuth";

export default function Header_login() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { email, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <header className="px-4 lg:px-6 h-14 flex items-center bg-primary text-primary-foreground bg-blue-900">
        <span
          className="flex md:hidden items-center justify-center"
          onClick={() => {
            navigate("/");
          }}
        >
          <img src={logoCuroc} alt="logo unah" className="w-8 h-8" />
          <span className="text-xs font-bold text-white ml-2">UNAH COPAN</span>
        </span>
        <nav className="ml-auto hidden md:flex gap-4 text-white">
          <h2 className="text-sm hover:underline">{email}</h2>
        </nav>
        <button
          className="ml-auto md:hidden text-white focus:outline-none"
          aria-label="Abrir menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <HiOutlineMenuAlt3 className="h-6 w-6" />
        </button>
      </header>
      {isMenuOpen && (
        <nav className="bg-blue-900 md:hidden">
          <NavLink
            to={
              location.pathname.includes("dashboard-coordinador")
                ? "/dashboard-coordinador/perfil"
                : location.pathname.includes("dashboard-estudiante")
                ? "/dashboard-estudiante/perfil"
                : "/dashboard-voae/perfil"
            }
            className="px-4 py-2 text-sm text-white hover:underline flex items-center"
          >
            <CiUser className="mr-1" /> Perfil
          </NavLink>
          <NavLink
            to={
              location.pathname.includes("dashboard-coordinador")
                ? "/dashboard-coordinador/main"
                : location.pathname.includes("dashboard-estudiante")
                ? "/dashboard-estudiante/main"
                : "/dashboard-voae/main"
            }
            className="px-4 py-2 text-sm text-white hover:underline flex items-center"
          >
            <LuLayoutDashboard className="mr-1" /> Dashboard
          </NavLink>
          <NavLink
            to={
              location.pathname.includes("dashboard-coordinador")
                ? "/dashboard-coordinador/calendario"
                : location.pathname.includes("dashboard-estudiante")
                ? "/dashboard-estudiante/calendario"
                : "/dashboard-voae/calendario"
            }
            className="px-4 py-2 text-sm text-white hover:underline flex items-center"
          >
            <FaRegCalendarAlt className="mr-1" /> Calendario
          </NavLink>
          <span
            onClick={logout}
            className="px-4 py-2 text-sm text-white hover:underline flex items-center"
          >
            <CiLogout className="mr-1" /> Cerrar Sesión
          </span>
        </nav>
      )}
    </>
  );
}
