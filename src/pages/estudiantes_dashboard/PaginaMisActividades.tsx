
import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import FiltroMA from "../../components/filtros/filtroMisActividades";
import { estadoActividadMap, EtiquetasAmbitosActividad, formatDate } from "@/api/servicios/enums";
import Skeleton from "@/components/Skeleton";
import { MisActividades } from "@/api/servicios/actividades";
import axiosInstance from "@/api/axiosInstance";
export default function PaginaMisActividades() {
    useEffect(() => {
        document.title = "Mis Horas - UNAH CUROC";
    }, []);

    const [filtrarData, setFiltrarData] = useState<MisActividades[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [paginaInicial, setPaginaInicial] = useState(1);

    useEffect(() => {
        const obtenerDatos = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/users/my-activities', {});
                 setFiltrarData(response.data);
            } catch (error) {
                setError('Hay problemas de conexion con el Servidor');
            } finally {
                setLoading(false);
            }
        };
        obtenerDatos();
    }, []);

    const itemsPerPaginas = 10;
    const TotalPaginas = Math.ceil(filtrarData.length / itemsPerPaginas);

    const handlePaginasChange = (Paginas: number) => {
        setPaginaInicial(Paginas);
    };

    const paginatedData = filtrarData.slice((paginaInicial - 1) * itemsPerPaginas, paginaInicial * itemsPerPaginas);

    const aplicarFiltros = (ambito: string, fechaInicio: string, fechaFin: string, busqueda: string) => {
        const fechaInicioDate = fechaInicio ? new Date(fechaInicio.split('T')[0]) : null;
        const fechaFinDate = fechaFin ? new Date(fechaFin.split('T')[0]) : null;

        const filtrar = filtrarData.filter(item => {
            const inicioDate = new Date(item.startDate.split(' ')[0]);

            return (
                (ambito === "" || item.activityScopes.some(s => EtiquetasAmbitosActividad[s.scope] === ambito)) &&
                (!fechaInicioDate || inicioDate >= fechaInicioDate) &&
                (!fechaFinDate || inicioDate <= fechaFinDate) &&
                (busqueda === "" || item.name.toLowerCase().includes(busqueda.toLowerCase()))
            );
        });

        setFiltrarData(filtrar);
        setPaginaInicial(1);
    };

    if (loading) {
        return <Skeleton />;
    }

    if (error) {
        return <div className="text-2xl font-bold text-center mt-20">Error: {error}</div>;
    }

    // Obtener todos los ámbitos y las horas para generar las columnas y filas
    const ambitosHoras: { [ambito: string]: number } = {};

    filtrarData.forEach(actividad => {
        actividad.memberScopes.forEach(memberScopes => {
            const ambitoNombre = EtiquetasAmbitosActividad[memberScopes.scope] || `Ámbito ${memberScopes.scope}`;
            if (!ambitosHoras[ambitoNombre]) {
                ambitosHoras[ambitoNombre] = 0;
            }
            ambitosHoras[ambitoNombre] += memberScopes.hours;
        });
    });

    const ambitos = Object.keys(ambitosHoras);
    const horas = Object.values(ambitosHoras);

    return (
        <>
            <div className="container mx-auto p-2">
                <div className="block md:flex items-center justify-center mb-4 mt-2">
                    <FiltroMA aplicarFiltros={aplicarFiltros} />
                </div>

                <h2 className="text-center my-5 text-xl font-bold underline">Horas</h2>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="min-w-full table-auto bg-white border border-gray-200">
    <thead className="hidden md:table-header-group">
        <tr className="bg-blue-900 text-white">
            <th className="p-4 font-bold text-left">Ámbito</th>
            <th className="p-4 font-bold text-left">Horas Totales</th>
        </tr>
    </thead>
    <tbody>
        {/* Para pantallas pequeñas */}
        {ambitos.map((ambito, index) => (
            <tr key={index} className="md:hidden text-white">
                <td className="p-4 bg-blue-900 font-bold text-left">{ambito}</td>
                <td className="p-4 text-black border-b border-gray-200">{horas[index]}</td>
            </tr>
        ))}

        {/* Para pantallas más grandes */}
        {ambitos.map((ambito, index) => (
            <tr key={index} className="hidden md:table-row bg-white">
                <td className="p-4 font-bold text-left">{ambito}</td>
                <td className="p-4 border-b border-gray-200">{horas[index]}</td>
            </tr>
        ))}
    </tbody>
</table>

                    </div>
                </div>

                <h2 className="text-center my-5 text-xl font-bold underline">Actividades</h2>
                <div className="rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="border-collapse block md:table min-w-full table-auto bg-white border border-gray-200">
                            <thead className="block md:table-header-group">
                                <tr className="border text-sm border-gray-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative bg-yellow-500 text-black">
                                    <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">Nombre</th>
                                    <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">Descripcion</th>
                                    <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">Ámbitos</th>
                                    <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">Fecha Inicio</th>
                                    <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">Fecha Final</th>
                                    <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="block md:table-row-group text-sm md:text-xs">
                                {paginatedData.map((item, index) => (
                                    <tr key={index} className="bg-yellow-500 md:bg-white text-left md:text-center hover:bg-gray-200 transition-colors duration-200 border border-gray-500 md:border-none block md:table-row">
                                        <td className="p-1 md:border md:border-gray-500 block md:table-cell">
                                            <span className="inline-block w-1/3 md:hidden font-bold mr-4">Nombre:</span>{item.name}
                                        </td>
                                        <td className="p-1 md:border md:border-gray-500 block md:table-cell">
                                            <span className="inline-block w-1/3 md:hidden font-bold mr-4">Descripcion:</span>{item.description}
                                        </td>
                                        <td className="p-1 md:border md:border-gray-500 block md:table-cell">
                                            <span className="inline-block w-1/3 md:hidden font-bold mr-4">Ámbitos:</span>{item.activityScopes.map(s => EtiquetasAmbitosActividad[s.scope] || s.scope).join(", ")}
                                        </td>
                                        <td className="p-1 md:border md:border-gray-500 block md:table-cell">
                                            <span className="inline-block w-1/3 md:hidden font-bold mr-4">Fecha Inicio:</span>{formatDate(item.startDate)}
                                        </td>
                                        <td className="p-1 md:border md:border-gray-500 block md:table-cell">
                                            <span className="inline-block w-1/3 md:hidden font-bold mr-4">Fecha final:</span>{formatDate(item.endDate)}
                                        </td>
                                        <td className="p-1 md:border md:border-gray-500 block md:table-cell">
                                            <span className="inline-block w-1/3 md:hidden font-bold mr-4">Estado:</span>{estadoActividadMap[item.activityStatus] || item.activityStatus}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination PaginaInicial={paginaInicial} TotalPaginas={TotalPaginas} onPageChange={handlePaginasChange} />
            </div>
        </>
    );
}
