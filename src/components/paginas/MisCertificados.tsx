import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { NavLink } from "react-router-dom";
import FiltroMA from "../filtros/filtroMisActividades";

export default function PaginaMisCertificados() {
    useEffect(() => {
        // titulo de la pestaña del navegador
        document.title = "Mis Certificados - UNAH CUROC";
    }, []);

          
    //tabla de datos
    const initialData = [
      
      { nombre: "Charla", encargado: "Juan Perez",  ambito: "Cultural", fecha: "2024-07-12 01:14:23" },
      { nombre: "Charla", encargado: "Juan Perez",  ambito: "Cultural", fecha: "2024-07-13 01:14:23" },
      { nombre: "Charla ", encargado: "Juan Perez",  ambito: "Cultural", fecha: "2024-07-14 01:14:23" },
      { nombre: "Charla", encargado: "Juan Perez",  ambito: "Cultural", fecha: "2024-07-16 01:14:23" },
      { nombre: "Charla", encargado: "Juan Perez", ambito: "Cultural", fecha: "2024-07-21 01:14:23" },
      { nombre: "Charla ", encargado: "Biblioteca",  ambito: "Cultural", fecha: "22024-07-30 01:14:23" },
      { nombre: "Charla", encargado: "Juan Perez",  ambito: "Cultural", fecha: "2024-07-10 01:14:23" },
      { nombre: "plantacion de arboles", encargado: "Biblioteca",  ambito: "Cultural", fecha: "2024-07-01 01:14:23" ,                                                                        },
      { nombre: "Charla", encargado: "Juan Perez",  ambito: "Cultural", fecha: "2024-07-12 01:14:23" },
      { nombre: "Charla", encargado: "Juan Perez",  ambito: "Cultural", fecha: "2024-07-12 01:14:23" },
      { nombre: "Charla", encargado: "Juan Perez",  ambito: "Cultural", fecha: "2024-07-18 01:14:23" },
      { nombre: "Charla", encargado: "Juan Perez",  ambito: "Cultural", fecha: "2024-07-12 01:14:23" },
      { nombre: "Charla", encargado: "Juan Perez",  ambito: "Cultural", fecha: "2024-07-12 01:14:23" },
      
  ];






    const [filtrarData, setFiltrarData] = useState(initialData); // Estado para datos filtrados
    const [PaginaInicial, setPaginaInicial] = useState(1);
    
    //funcion de paginacion
    const itemsPerPaginas = 10;
    const TotalPaginas = Math.ceil(filtrarData.length / itemsPerPaginas); // Usar FiltrarData en lugar de initialData

    const handlePaginasChange = (Paginas: number) => {
        setPaginaInicial(Paginas);
    };

    const paginatedData = filtrarData.slice((PaginaInicial - 1) * itemsPerPaginas, PaginaInicial * itemsPerPaginas); // Usar FiltrarData en lugar de initialData

    // Función para aplicar filtro
    const aplicarFiltros = ( fechaInicio: string, ambito: string,  fechaFin: string, busqueda: string) => {
        const fechaInicioDate = fechaInicio ? new Date(fechaInicio.split('T')[0]) : null; // Obtener solo la fecha
        const fechaFinDate = fechaFin ? new Date(fechaFin.split('T')[0]) : null; // Obtener solo la fecha
    
        const filtrar = initialData.filter(item => {
            const inicioDate = new Date(item.fecha.split(' ')[0]); // Obtener solo la fecha desde la cadena de inicio
    
            return (
              (ambito === "" || item.ambito === ambito) &&
                (!fechaInicioDate || inicioDate >= fechaInicioDate) &&
                (!fechaFinDate || inicioDate <= fechaFinDate) &&
                (busqueda === "" || item.nombre.toLowerCase().includes(busqueda.toLowerCase()))
            );
        });
    
        setFiltrarData(filtrar);
        setPaginaInicial(1); // Reiniciar la página actual al aplicar filtros
    };
    
//filtros
    return (
        <>
            <div className="container mx-auto p-2">
                <div className="block md:flex items-center justify-center mb-4 mt-2">

                    <FiltroMA aplicarFiltros={aplicarFiltros}/>
                </div>


                <div className="rounded-xl">
                    <div className="overflow-x-auto">
                        <table className=" border-collapse block md:table min-w-full table-auto bg-white border border-gray-200">
                            <thead className="block md:table-header-group">
                                <tr 
                                   className="border text-sm border-gray-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative bg-yellow-500 text-black">
                                   <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">Nombre</th>
                                   <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">Encargado</th>
                                   <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">Ambito</th>
                                   <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">Fecha</th>
                                   <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">Certificado</th>
   

                                  
                                </tr>
                            </thead>
                            <tbody className="block md:table-row-group text-sm md:text-xs">
                                {paginatedData.map((item, index) => (
                                    <tr key={index} className="bg-yellow-500 md:bg-white text-left md:text-center hover:bg-gray-200 transition-colors duration-200 border border-gray-500 md:border-none block md:table-row">
                                        <td className="p-1 md:border md:border-gray-500 block md:table-cell">
                                            <span className="inline-block w-1/3 md:hidden font-bold mr-4">Nombre:</span>{item.nombre}
                                        </td>
                                        <td className="p-1 md:border md:border-gray-500 block md:table-cell">
                                            <span className="inline-block w-1/3 md:hidden font-bold mr-4">Encargado:</span>{item.encargado}                                        </td>
                                        
                                        <td className="p-1 md:border md:border-gray-500 block md:table-cell">
                                            <span className="inline-block w-1/3 md:hidden font-bold mr-4">Ambito:</span>{item.ambito}
                                        </td>
                                        <td className="p-1 md:border md:border-gray-500 block md:table-cell">
                                            <span className="inline-block w-1/3 md:hidden font-bold mr-4">Fecha:</span>{item.fecha}
                                        </td>
                                        

                                        <td className="p-1 md:border text-center md:border-gray-500 block md:table-cell relative">
                                    <NavLink
                                        to={
                                            location.pathname.includes('dashboard-coordinador')
                                                ? "/dashboard-coordinador/mis-certificados/certificados-actividad"
                                                : location.pathname.includes('dashboard-estudiante')
                                                    ? "/dashboard-estudiante/mis-certificados/certificados"
                                                    : "/dashboard-voae/mis-certificados/vcertificado"
                                        }
                                        className="flex justify-center items-center font-bold group"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={32} height={32} color={"#000000"} fill={"none"} className="group-hover:text-blue-500 hidden md:block">
                                                <path d="M21.544 11.045C21.848 11.4713 22 11.6845 22 12C22 12.3155 21.848 12.5287 21.544 12.955C20.1779 14.8706 16.6892 19 12 19C7.31078 19 3.8221 14.8706 2.45604 12.955C2.15201 12.5287 2 12.3155 2 12C2 11.6845 2.15201 11.4713 2.45604 11.045C3.8221 9.12944 7.31078 5 12 5C16.6892 5 20.1779 9.12944 21.544 11.045Z" stroke="currentColor" strokeWidth="1.5" />
                                                <path d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z" stroke="currentColor" strokeWidth="1.5" />
                                            </svg>
                                            <span className="hover:text-blue-500 group-hover:text-blue-500 md:hidden">Ver detalles</span>
                                    </NavLink>
                                    </td>

                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination PaginaInicial={PaginaInicial} TotalPaginas={TotalPaginas} onPageChange={handlePaginasChange} />

            </div>
        </>
    )
}
