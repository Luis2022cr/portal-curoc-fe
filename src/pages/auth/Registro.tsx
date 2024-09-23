import React, { useEffect, useState } from "react";
import logo1 from "@/assets/logo.avif";
import logo2 from "@/assets/logo2.avif";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FiLoader } from "react-icons/fi";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface ApiResponse {
  email: string;
}

const verificarEmailUnah = /^[a-zA-Z0-9._%+-]+@unah\.(edu\.)?hn$/;
const errorMessages: { [key: number]: string } = {
  409: "El correo institucional ya está en uso",
};
const successMessages: { [key: number]: string } = {
  200: "El correo se ha enviado correctamente. Verifica tu bandeja de entrada o SPAM.",
};
const defaultErrorMessage = "Error al registrarse, vuelva a intentarlo";

const Registro: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<ApiResponse>();

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    document.title = "Registro - UNAH COPAN";
  }, []);

  const onSubmit: SubmitHandler<ApiResponse> = async (data) => {
    setIsLoading(true);
    clearErrors("email");
    setSuccessMessage("");
    try {
      const response = await axiosInstance.post<ApiResponse>(
        "/auth/register",
        data
      );

      setSuccessMessage(
        successMessages[response.status] || defaultErrorMessage
      );
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleErrors = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      setError("email", {
        type: "manual",
        message: errorMessages[statusCode!] || defaultErrorMessage,
      });
    } else {
      setError("email", {
        type: "manual",
        message: defaultErrorMessage,
      });
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="ml-5 mr-5 h-full md:mt-32 md:mb-32 bg-white overflow-hidden flex items-center justify-center">
        <div className="flex flex-col md:flex-row w-full h-full mb-10 items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="flex items-center justify-center">
            <img
              src={logo1}
              alt="Logo 1"
              className="w-48 h-32 mr-7 md:mr-0 mt-5 md:mt-0 md:w-80 md:h-52"
            />
          </div>
          <div className="hidden md:flex items-center justify-center">
            <img
              src={logo2}
              alt="Logo 2"
              className="w-48 h-32 md:w-80 md:h-52"
            />
          </div>
          <div className="bg-yellow-500 w-full sm:w-8/12 md:w-6/12 lg:w-5/12 xl:w-4/12 shadow-2xl rounded-lg p-4 sm:p-4">
            <form className="p-1" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-center text-lg my-5 relative">
                <MdOutlineAlternateEmail className="absolute ml-4" />
                <input
                  type="email"
                  {...register("email", {
                    required: "El correo es obligatorio",
                    pattern: {
                      value: verificarEmailUnah,
                      message: "Debe ser un correo institucional valido",
                    },
                  })}
                  className="bg-gray-200 pl-12 py-2 md:py-4 focus:outline-none w-full rounded-md shadow-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Correo Institucional"
                />
              </div>
              {errors.email && (
                <div className="mt-4 text-center text-sm font-bold text-red-600 my-2">
                  {errors.email.message}
                </div>
              )}
              {successMessage && (
                <div className="mt-4 text-center text-sm font-bold text-green-600 my-2">
                  {successMessage}
                </div>
              )}
              <button
                type="submit"
                className="bg-gradient-to-b mt-4 from-blue-800 to-blue-900 font-medium p-2 md:p-4 text-white uppercase w-full rounded-md shadow-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <FiLoader className="mr-2 animate-spin" />
                ) : (
                  "Regístrate"
                )}
              </button>
            </form>
            <div className="flex flex-col items-center space-y-2 mt-5">
              <span
                onClick={() => {
                  navigate("/login");
                }}
                className="text-sm text-blue-900 hover:underline"
              >
                ¿Ya tienes una cuenta? Iniciar Sesión
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registro;
