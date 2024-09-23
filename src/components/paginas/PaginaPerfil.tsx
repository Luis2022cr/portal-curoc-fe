import { ObtenerDatosUsuarioIniciado, User } from '@/api/servicios/usuarios';
import useAuth from '@/api/useAuth';
import { useEffect, useState } from 'react';
import Loading from '../Loading';

const Perfil = () => {
    useEffect(() => {
        document.title = "Perfil - UNAH COPAN";
    }, []);

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { email } = useAuth();

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const response = await ObtenerDatosUsuarioIniciado();
                if (response && typeof response === 'object') {
                    setUser(response);
                } else {
                    setError('No se encontró información del usuario');
                }
            } catch (error) {
                setError('Error al cargar la información del usuario.');
            } finally {
                setLoading(false);
            }
        };
        obtenerDatos();
    }, []);
    
    const obtenerFechaHoraActual = (): string => {
        const fecha = new Date();
        return fecha.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        });
    };

    const ultimaSesion = localStorage.getItem('ultimaSesion') || obtenerFechaHoraActual();
    localStorage.setItem('ultimaSesion', obtenerFechaHoraActual());

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r mt-11 from-blue-50 to-blue-100 shadow-lg rounded-lg">
            <div className="flex items-center space-x-6">
                <div>
                    {user ? (
                        <>
                            <h1 className="text-3xl font-bold text-gray-800">{user.names} {user.lastnames}</h1>
                            <p className="text-gray-500">{email}</p>
                        </>
                    ) : (
                        <p>No se encontró información del usuario</p>
                    )}
                </div>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 ">
                <div className="bg-white p-6 rounded-lg shadow-md w-full">
                    <h2 className="text-xl font-semibold text-gray-700">Información Personal</h2>
                    {user && (
                        <>
                            <p className="mt-4"><span className='font-bold'>Nº Cuenta:</span> {user.accountNumber}</p>
                            {user.career ? (
                                <p className="mt-2"><span className='font-bold'>Carrera:</span> {user.career.name}</p>
                            ) : (
                                <p className="mt-2">No está asociado a ninguna carrera.</p>
                            )}
                            <p className="mt-2"><span className='font-bold'>Última vez conectado:</span> {ultimaSesion}</p>
                            {user.organizations.length > 0 ? (
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-700">Organizaciones:</h3>
                                    <ul className="list-disc list-inside">
                                        {user.organizations.map((org) => (
                                            <li key={org.id} className="text-gray-600">{org.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="mt-2">No está asociado a ninguna organización.</p>
                            )}
                        </>
                    )}
                </div>
                {/* <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700">Configuraciones de Cuenta</h2>
                    <NavLink
                        to={
                            location.pathname.includes('dashboard-coordinador')
                                ? "/dashboard-coordinador/cambiar-contrasena"
                                : location.pathname.includes('dashboard-estudiante')
                                    ? "/dashboard-estudiante/cambiar-contrasena"
                                    : "/dashboard-voae/cambiar-contrasena"
                        }
                        className="block mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md text-center"
                    >
                        Cambiar Contraseña
                    </NavLink>
                </div> */}
            </div>
        </div>
    );
};

export default Perfil;
