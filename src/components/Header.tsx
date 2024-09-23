import { useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { MdLogin, MdRoundaboutRight } from "react-icons/md";
import logoCuroc from "@/assets/logoCuroc.avif";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <header className="fixed z-20 w-full px-4 lg:px-6 h-14 flex items-center bg-primary text-primary-foreground bg-blue-900">
        <span
          className="flex items-center justify-center"
          onClick={() => {
            navigate("/");
          }}
        >
          <img src={logoCuroc} alt="logo unah" className="w-8 h-8" />
          <span className="text-xs md:text-lg font-bold text-white ml-2">
            UNAH Campus Copán
          </span>
        </span>
        <nav className="ml-auto hidden md:flex gap-4 text-white">
          <span
            onClick={() => {
              navigate("/");
            }}
            className="text-sm hover:underline cursor-pointer"
          >
            Inicio
          </span>
          <span
            onClick={() => {
              navigate("/about");
            }}
            className="text-sm hover:underline cursor-pointer"
          >
            Acerca de
          </span>
          <span
            onClick={() => {
              navigate("/login");
            }}
            className="text-sm hover:underline cursor-pointer"
          >
            Acceder
          </span>
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
        <nav className="bg-blue-900 md:hidden mt-14">
          <span
            onClick={() => {
              navigate("/");
            }}
            className="flex px-4 py-2 text-sm text-white hover:underline items-center"
          >
            <IoHomeOutline className="mr-1" />
            Inicio
          </span>
          <span
            onClick={() => {
              navigate("/about");
            }}
            className="flex px-4 py-2 text-sm text-white hover:underline items-center"
          >
            <MdRoundaboutRight className="mr-1" />
            Acerca de
          </span>
          <span
            onClick={() => {
              navigate("/login");
            }}
            className="flex px-4 py-2 text-sm text-white hover:underline items-center"
          >
            <MdLogin className="mr-1" />
            Acceder
          </span>
        </nav>
      )}
    </>
  );
}
