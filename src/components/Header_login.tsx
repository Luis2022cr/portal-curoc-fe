import { useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { CiLogout, CiUser } from 'react-icons/ci';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { IoNotificationsOutline } from 'react-icons/io5';
import { LuLayoutDashboard } from 'react-icons/lu';
import { PiNut } from 'react-icons/pi';

export default function Header_login() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    return (
        <>
            <header className="px-4 lg:px-6 h-14 flex items-center bg-primary text-primary-foreground bg-blue-900">
                <a className="flex md:hidden items-center justify-center" href="/">
                    <img src="https://res.cloudinary.com/dxc3qadsk/image/upload/v1719073675/curoc-removebg-preview_f5xnoe.png" alt="logo unah" className="w-8 h-8" />
                    <span className="text-xs font-bold text-white ml-2">UNAH CUROC</span>
                </a>
                <nav className="ml-auto hidden md:flex gap-4 text-white">
                    <a href="/login" className="text-sm hover:underline">@Nombre Usuario</a>
                </nav>
                <button 
                    className="ml-auto md:hidden text-white focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </header>
            {isMenuOpen && (
                <nav className="bg-blue-900 md:hidden">
                    <a href="/perfil" className="px-4 py-2 text-sm text-white hover:underline flex items-center">
                        <CiUser className='mr-1' /> Perfil
                    </a>
                    <NavLink
                        to={
                            location.pathname.includes('dashboard-coordinador')
                                ? "/dashboard-coordinador/main"
                                : location.pathname.includes('dashboard-estudiante')
                                ? "/dashboard-estudiante/main"
                                : "/dashboard-voae/main"
                        }
                        className="px-4 py-2 text-sm text-white hover:underline flex items-center"
                    >
                        <LuLayoutDashboard className='mr-1' /> Dashboard
                    </NavLink>
                    <a href="/calendario" className="px-4 py-2 text-sm text-white hover:underline flex items-center">
                        <FaRegCalendarAlt className='mr-1' /> Calendario
                    </a>
                    <a href="/notificaciones" className="px-4 py-2 text-sm text-white hover:underline flex items-center">
                        <IoNotificationsOutline className='mr-1' /> Notificaciones
                    </a>
                    <a href="/configuracion" className="px-4 py-2 text-sm text-white hover:underline flex items-center">
                        <PiNut className='mr-1' /> Configuración
                    </a>
                    <a href="/logout" className="px-4 py-2 text-sm text-white hover:underline flex items-center">
                        <CiLogout className='mr-1' /> Cerrar Sesión
                    </a>
                </nav>
            )}
        </>
    )
}
