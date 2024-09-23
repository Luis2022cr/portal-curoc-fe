import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Pagination from "../Pagination";
import Filtro from "../filtros/Filtros";
import { EtiquetasAmbitosActividad, formatDate } from "@/api/servicios/enums";
import { ActividadEstado, ObtenerActividadesPorEstado } from "@/api/servicios/actividades";

const ActvidadesEnCurso: React.FC = () => {
    useEffect(() => {
        document.title = "Actividades en Curso - UNAH COPAN";
    }, []);

    const [filtrarData, setFiltrarData] = useState<ActividadEstado[]>([]);
    const [paginaInicial, setPaginaInicial] = useState(1);
    const [initialData, setInitialData] = useState<ActividadEstado[]>([]);
    const [loading, setLoading] = useState(true); // Estado para mostrar un cargando
    const [error, setError] = useState<string | null>(null);

    // Función de paginación
    const itemsPerPage = 12;
    const totalPaginas = Math.ceil(filtrarData.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setPaginaInicial(page);
    };

    const paginatedData = filtrarData.slice((paginaInicial - 1) * itemsPerPage, paginaInicial * itemsPerPage);

    // Función para aplicar filtro
    const aplicarFiltros = (carrera: string, ambito: string, fechaInicio: string, fechaFin: string, busqueda: string) => {
        const fechaInicioDate = fechaInicio ? new Date(fechaInicio.split('T')[0]) : null;
        const fechaFinDate = fechaFin ? new Date(fechaFin.split('T')[0]) : null;

        const filtrar = initialData.filter(item => {
            const inicioDate = new Date(item.startDate.split(' ')[0]);

            return (
                (carrera === "" || item.foreingCareers.some(fc => fc.name === carrera)) &&
                (ambito === "" || item.scopes.some(s => EtiquetasAmbitosActividad[s.scope] === ambito)) &&
                (!fechaInicioDate || inicioDate >= fechaInicioDate) &&
                (!fechaFinDate || inicioDate <= fechaFinDate) &&
                (busqueda === "" || item.name.toLowerCase().includes(busqueda.toLowerCase()))
            );
        });

        setFiltrarData(filtrar);
        setPaginaInicial(1);
    };

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const data = await ObtenerActividadesPorEstado(3); // Obtén datos para el estado deseado
                 setInitialData(data);
                setFiltrarData(data);
                setLoading(false);
            } catch (error) {
                setError('Error!, recarge la pagina para ver las actividades');
                setLoading(false);
            }
        };
        obtenerDatos();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <div className="block md:flex items-center justify-center mb-4 mt-2">
                <Filtro aplicarFiltros={aplicarFiltros} />
            </div>

            {loading ? (
                <div className="text-center py-4">Cargando...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-4">{error}</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {paginatedData.map((item, index) => (
                            <div key={index} className="flex flex-col rounded-lg shadow-md overflow-hidden bg-white border border-gray-200">
                                <img
                                    src={item.bannerLink}
                                    alt={item.name}
                                    className="w-full h-60 object-cover"
                                />
                                <div className="p-4 flex flex-col flex-grow text-gray-700">
                                    <h2 className="text-lg font-bold mb-2">{item.name}</h2>
                                    <p className=" mb-1"><span className="font-bold">Ubicación:</span> {item.location}</p>
                                    <p className=" mb-1"><span className="font-bold">Ámbito:</span> {item.scopes.map(s => EtiquetasAmbitosActividad[s.scope] || s.scope).join(", ")}</p>
                                    <p className=" mb-1"><span className="font-bold">Cupos disponibles:</span> {item.totalSpots}</p>
                                    <p className=" mb-1"><span className="font-bold">Inicio:</span> {formatDate(item.startDate)}</p>
                                    <p className=" mb-1"><span className="font-bold">Final:</span> {formatDate(item.endDate)}</p>
                                    <div className="mt-auto">
                                        <NavLink
                                            to={
                                                location.pathname.includes('dashboard-coordinador')
                                                    ? `/dashboard-coordinador/detalles-actividad/${item.slug}`
                                                    : location.pathname.includes('dashboard-estudiante')
                                                        ? `/dashboard-estudiante/unirse-actividad/${item.slug}`
                                                        : `/dashboard-voae/detalles-actividades/${item.slug}`
                                            }
                                            className="block text-center bg-yellow-500 text-black font-bold py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
                                        >
                                            Ver detalles
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Pagination PaginaInicial={paginaInicial} TotalPaginas={totalPaginas} onPageChange={handlePageChange} />
                </>
            )}
        </div>
    );
};

export default ActvidadesEnCurso;
