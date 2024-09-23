import { useObtenerActividadesPorNombre } from "@/api/servicios/actividades";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  EtiquetasAmbitosActividad,
  formatDate,
  ActivityScope,
} from "../../api/servicios/enums";
import axiosInstance from "@/api/axiosInstance";
import Alert from "@/components/Alert";
import RadioWithSubcategories from "@/components/RadioWithSubcategories";

const UnirseActividad: React.FC = () => {
  useEffect(() => {
    document.title = "Detalle de Actividad - UNAH CUROC";
  }, []);

  const [error, setError] = useState<string | null>(null);
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  const [selectedScopes, setSubcategories] = useState<
    Record<ActivityScope, boolean>
  >({} as Record<ActivityScope, boolean>);

  const handleCheckboxChange = (value: {
    scope: ActivityScope;
    checked: boolean;
  }) => {
    if (value.scope === ActivityScope.Becas) {
      setSubcategories({
        [ActivityScope.Becas]: true,
      } as Record<ActivityScope, boolean>);
    } else {
      setSubcategories((prev) => ({
        ...prev,
        [value.scope]: value.checked,
        [ActivityScope.Becas]: false,
      }));
    }
  };

  if (!slug) {
    setError("No se proporcionó el parámetro de nombre");
  }

  const [{ data: activity, loading }] = useObtenerActividadesPorNombre(slug!);

  const handleJoinActivity = async () => {
    if (activity && selectedScopes !== null) {
      try {
        const scopes = Object.entries(selectedScopes)
          .filter((scope) => scope[1])
          .map((scope) => +scope[0]);
        await axiosInstance.put(`/activities/${activity.id}/join`, {
          scopes: scopes
        });
        Alert({
          title: "Éxito",
          text: "Te has unido a la actividad con exito",
          icon: "success",
          callback: () => navigate(-1),
        });
      } catch (error) {
        Alert({
          title: "Error",
          text: "Hubo un problema al unirse a la actividad",
          icon: "error",
        });
      }
    } else {
      Alert({
        title: "Advertencia",
        text: "Por favor selecciona un ámbito para unirte a la actividad.",
        icon: "warning",
      });
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!activity) {
    return <div>Actividad no encontrada</div>;
  }

  return (
    <>
      <div className="my-2"></div>
      <div className="h-full overflow-hidden flex items-center justify-center space-x-8">
        <div className="bg-blue-900 lg:w-4/5 md:w-6/12 w-full mx-2 shadow-xl relative rounded-lg">
          <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">
              Detalles de la Actividad
            </h2>
            <div className="flex flex-col lg:flex-row">
              <div
                className="overflow-y-auto max-h-96 rounded-lg border border-gray-200 bg-white shadow-md flex-grow"
                style={{ scrollbarWidth: "thin" }}
              >
                <table
                  className="w-full text-left border-collapse bg-white rounded-lg text-xs md:text-base"
                  style={{ overflowX: "auto" }}
                >
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 bg-yellow-500 w-1/4">
                        Nombre de la Actividad
                      </td>
                      <td className="border px-4 py-2">{activity.name}</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 bg-yellow-500">
                        Objetivos
                      </td>
                      <td className="border px-4 py-2">
                        <ul className="list-disc pl-5">
                          {activity.goals.map((goal, index) => (
                            <li key={index}>{goal}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 bg-yellow-500">
                        Descripción
                      </td>
                      <td className="border px-4 py-2">
                        {activity.description}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 bg-yellow-500">
                        Carrera admitidas
                      </td>
                      <td className="border px-4 py-2">
                        <ul className="list-disc pl-5">
                          {activity.foreingCareers.map((career, index) => (
                            <li key={index}>{career.name}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 bg-yellow-500">
                        Ámbitos
                      </td>
                      <td className="border px-4 py-2">
                        <ul className="list-disc pl-5">
                          {activity.scopes.map((scope, index) => (
                            <li key={index}>
                              {EtiquetasAmbitosActividad[scope.scope] ||
                                scope.scope}{" "}
                              | {scope.hours} horas
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 bg-yellow-500">
                        Supervisor
                      </td>
                      <td className="border px-4 py-2">
                        {activity.supervisor.names}{" "}
                        {activity.supervisor.lastnames}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 bg-yellow-500">
                        Encargado de Actividad
                      </td>
                      <td className="border px-4 py-2">
                        {activity.coordinator.names}{" "}
                        {activity.coordinator.lastnames}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 bg-yellow-500">Cupos</td>
                      <td className="border px-4 py-2">
                        {activity.totalSpots}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 bg-yellow-500">
                        Fecha Inicio
                      </td>
                      <td className="border px-4 py-2">
                        {formatDate(activity.startDate)}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 bg-yellow-500">
                        Fecha Final
                      </td>
                      <td className="border px-4 py-2">
                        {formatDate(activity.endDate)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col justify-between ml-4">
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                  <h4 className="text-lg font-bold text-gray-800 mb-6">
                    Seleccione sus horas
                  </h4>

                  <RadioWithSubcategories
                    scopes={activity.scopes}
                    selectedOption={selectedScopes}
                    handleCheckboxChange={handleCheckboxChange}
                  />
                </div>
                <button
                  onClick={handleJoinActivity}
                  className="bg-green-500 text-white py-2 px-4 rounded shadow hover:bg-green-600 focus:outline-none"
                >
                  Unirse a la Actividad
                </button>
                <button
                  onClick={handleGoBack}
                  className="bg-red-500 text-white py-2 px-4 rounded shadow hover:bg-red-600 focus:outline-none"
                >
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnirseActividad;
