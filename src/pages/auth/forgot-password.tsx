import React, { useEffect, useState } from 'react';
import logo1 from '@/assets/logo.avif';
import logo2 from '@/assets/logo2.avif';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { FiLoader } from 'react-icons/fi';
import axios from 'axios';
import axiosInstance from '@/api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const verificarEmailUnah = /^[a-zA-Z0-9._%+-]+@unah\.(edu\.)?hn$/;

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        document.title = "Recuperar Contraseña - UNAH COPAN";
    }, []);

    const recuperarPassword = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        // Validate email format
        if (!verificarEmailUnah.test(email)) {
            setError('Debe ser un correo institucional correcto (ejemplo@unah.edu.hn o ejemplo@unah.hn)');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post('/auth/forgot-password', { email });
           
            if (response.status === 200) {
                setSuccessMessage('El correo para recuperar la contraseña se ha enviado correctamente. Verifica tu bandeja de entrada o SPAM.');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (error.response?.status === 404) {
                    if (responseData.errors && responseData.errors.length > 0) {
                        const errorDetail = responseData.errors[0];
                        if (errorDetail.code === 'Authentication.NotFound') {
                            setError('Cuenta no encontrada');
                        } else {
                            setError('Error al recuperar la contraseña, vuelva a intentarlo');
                        }
                    } else {
                        setError('Error al recuperar la contraseña, vuelva a intentarlo');
                    }
                } else {
                    setError('Error al recuperar la contraseña, vuelva a intentarlo');
                }
            } else {
                setError('Error al recuperar la contraseña, vuelva a intentarlo');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const navigate =useNavigate();

    return (
        <>
            <div className="flex items-center justify-center h-full my-11 md:my-32">
                <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">

                    <div className="flex items-center justify-center">
                        <img src={logo1} alt="Logo 1" className="w-48 h-40 mr-7 md:mr-0 mt-5 md:mt-0 md:w-80 md:h-52" />
                    </div>
                    <div className="hidden md:flex items-center justify-center">
                        <img src={logo2} alt="Logo 2" className="w-48 h-32 md:w-80 md:h-52" />
                    </div>

                    <div className="bg-yellow-500 w-11/12 md:w-1/2 shadow-2xl rounded-lg p-4 md:p-8">
                        <form className="p-1" onSubmit={recuperarPassword}>
                            <div className="flex items-center text-lg my-5 relative">
                                <MdOutlineAlternateEmail className='absolute ml-4' />
                                <input
                                    type="email"
                                    id="email"
                                    className="bg-gray-200 pl-12 py-2 md:py-4 focus:outline-none w-full rounded-md shadow-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="Correo Institucional"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {error && <div className="mt-4 text-center text-sm font-bold text-red-600 my-2">{error}</div>}
                            {successMessage && <div className="mt-4 text-center text-sm font-bold text-green-600 my-2">{successMessage}</div>}

                            <button
                                type="submit"
                                className="bg-gradient-to-b mt-4 from-blue-800 to-blue-900 font-medium p-2 md:p-4 text-white uppercase w-full rounded-md shadow-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (<FiLoader className="mr-2 animate-spin" />) : ('Recuperar Contraseña')}
                            </button>
                        </form>
                        <div className="flex flex-col items-center space-y-2 mt-5"
                        >
                            <span
                            onClick={() => {
                              navigate("/login");
                            }}
                           className="text-sm text-blue-900 hover:underline">¿Ya tienes una cuenta? Iniciar Sesión</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;
