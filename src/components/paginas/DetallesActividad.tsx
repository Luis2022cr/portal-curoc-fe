import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ActivityStatus,
  useObtenerActividadesPorNombre,
} from "../../api/servicios/actividades";
import {
  EtiquetasAmbitosActividad,
  formatDate,
} from "../../api/servicios/enums";
import Loading from "../Loading";
import { PublishButton } from "../PublishButton";

const DetallesActividad: React.FC = () => {
  useEffect(() => {
    document.title = "Detalle de Actividad - UNAH COPAN";
  }, []);

  // const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { slug } = useParams<{ slug?: string }>();
  if (!slug) {
    setError("No name parameter provided");
  }
  const [{ data: activity, loading }] = useObtenerActividadesPorNombre(slug!);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!activity) {
    return <div>No activity data found</div>;
  }

  return (
    <>
      <div className="my-3"></div>
      <div className="h-full mx-3 md:mx-6 overflow-hidden flex flex-col md:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-4">
        <div className="bg-blue-900 w-full md:w-2/3 shadow-xl relative rounded-lg ">
          <div className="p-3 md:p-6">
            <div className="flex justify-between align-middle  mb-2">
              <h2 className="text-base md:text-2xl font-bold mb-6 text-center text-white">
                Detalles de la Actividad
              </h2>
              {activity.activityStatus === ActivityStatus.Approved && (
                <PublishButton
                  activityOwnerId={activity.requestedBy?.id}
                  activityId={activity.id}
                />
              )}
            </div>
            <div
              className="overflow-y-auto max-h-96 rounded-lg border shadow-md"
              style={{ scrollbarWidth: "thin" }}
            >
              <table
                className="w-full text-left text-xs md:text-sm border-collapse bg-white rounded-lg"
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
                      Ubicacion
                    </td>
                    <td className="border px-4 py-2">{activity.location}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 bg-yellow-500">
                      Descripción
                    </td>
                    <td className="border px-4 py-2">{activity.description}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 bg-yellow-500">Ámbito</td>

                    <ul className="list-disc pl-5">
                      {activity.scopes.map((scope, index) => (
                        <li key={index}>
                          {EtiquetasAmbitosActividad[scope.scope] ||
                            scope.scope}{" "}
                          | {scope.hours} horas
                        </li>
                      ))}
                    </ul>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 bg-yellow-500">
                      supervisor
                    </td>
                    <td className="border px-4 py-2">
                      {activity.supervisor.names}{" "}
                      {activity.supervisor.lastnames}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 bg-yellow-500">
                      Coordinador
                    </td>
                    <td className="border px-4 py-2">
                      {activity.coordinator.names}{" "}
                      {activity.coordinator.lastnames}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 bg-yellow-500">
                      Objetivos
                    </td>

                    <ul className="list-disc pl-5">
                      {activity.goals.map((goal, index) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 bg-yellow-500">
                      Acticidades Principales
                    </td>
                    <ul className="list-disc pl-5">
                      {activity.mainActivities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </tr>

                  <tr>
                    <td className="border px-4 py-2 bg-yellow-500">Carrera</td>

                    <ul className="list-disc pl-5">
                      {activity.foreingCareers.map((career, index) => (
                        <li key={index}>{career.name}</li>
                      ))}
                    </ul>
                  </tr>

                  <tr>
                    <td className="border px-4 py-2 bg-yellow-500">Cupos</td>
                    <td className="border px-4 py-2">{activity.totalSpots}</td>
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
          </div>
        </div>

        <div className="bg-yellow-500 w-full md:w-3/5 shadow-xl relative rounded-lg">
          <div className="p-3 md:p-6">
            <h2 className="text-base md:text-2xl font-bold  text-center text-gray-900">
              Lista de Inscriptos
            </h2>

            <div
              className="overflow-y-auto max-h-96 rounded-lg border border-gray-200 bg-white shadow-md"
              style={{ scrollbarWidth: "thin" }}
            >
              <table
                className="w-full text-left border-collapse text-xs md:text-sm bg-white rounded-lg"
                style={{ overflowX: "auto" }}
              >
                <thead>
                  <tr>
                    <th className="border px-4 py-2 bg-blue-900 text-white">
                      Nombre
                    </th>
                    <th className="border px-4 py-2 bg-blue-900 text-white">
                      Número de Cuenta
                    </th>
                    <th className="border px-4 py-2 bg-blue-900 text-white">
                      carrera
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {activity?.members?.map((participant, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-100" : ""}
                    >
                      <td className="border px-4 py-2">{participant.nombre}</td>
                      <td className="border px-4 py-2">
                        {participant.numerocuenta}
                      </td>
                      <td className="border px-4 py-2">
                        {participant.carrera}
                      </td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetallesActividad;
