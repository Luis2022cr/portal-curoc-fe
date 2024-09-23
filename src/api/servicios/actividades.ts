import axiosInstance, { useAxios } from "../axiosInstance";
import { ActivityScope } from "./enums";

export interface Organizer {
  career: {
    id: number;
    name: string;
  };
  organization: {
    id: number;
    name: string;
  };
}

export enum ActivityStatus {
  Pending,
  Rejected,
  Approved,
  Published,
  Cancelled,
  InProgress,
  Completed
}

export interface Person {
  id: number;
  names: string;
  lastNames: string;
  role: number;
}

export interface ForeignCareer {
  id: number;
  name: string;
}

export interface Scope {
  id: number;
  hourAmount: number;
  scope: number;
}

export interface ActividadEstado {
  id: number;
  slug: string;
  name: string;
  description: string;
  location: string;
  mainActivities: string[];
  goals: string[];
  startDate: string;
  endDate: string;
  totalSpots: number;
  bannerLink: string;
  lastRequestedAt: string;
  activityStatus: number;
  lastReviewedAt: string;
  reviewObservations: string[];
  organizers: Organizer[];
  supervisor: Person;
  coordinator: Person;
  requestedBy: Person;
  foreingCareers: ForeignCareer[];
  scopes: Scope[];
}

export const ObtenerActividadesPorEstado = async (
  status: number
): Promise<ActividadEstado[]> => {
  try {
    const response = await axiosInstance.get(`/activities?status=${status}`);
    return Array.isArray(response.data.items) ? response.data.items : [];
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};
export const ObtenerTodasLasActividades = async (): Promise<
  ActividadEstado[]
> => {
  try {
    const response = await axiosInstance.get(`/activities`);
    return Array.isArray(response.data.items) ? response.data.items : [];
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

export const ObtenerActividadesSolicitadas = async (): Promise<
  ActividadEstado[]
> => {
  try {
    const response = await axiosInstance.get(`/users/my-requests`);
    return response.data;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

interface Coordinator {
  id: number;
  names: string;
  lastnames: string;
  role: number;
}

export interface Scope2 {
  id: number;
  hours: number;
  scope: number | ActivityScope;
}

export interface ActividadNombre {
  id: number;
  name: string;
  goals: string[];
  activityStatus: ActivityStatus | number;
  mainActivities: string[];
  description: string;
  coordinator: Coordinator;
  supervisor: Coordinator;
  location: string;
  scopes: Scope2[];
  foreingCareers: ForeignCareer[];
  totalSpots: number;
  startDate: string;
  endDate: string;
  members: Person[];
  requestedBy: Person;
}

export const useObtenerActividadesPorNombre = (slug: string) => {
  const response = useAxios<ActividadNombre>({
    url: `/activities/by-slug/${slug}`,
  },{
    useCache: false,
  });
  return response;
};

export const AprobarActividad = async (
  id: number,
  reviewerObservation: string
): Promise<void> => {
  try {
    const response = await axiosInstance.put(`/activities/${id}/approve`, {
      reviewerObservation,
    });
    return response.data;
  } catch (error) {
    console.error("Error al aprobar la actividad:", error);
    throw error;
  }
};

export const RechazarActividad = async (
  id: number,
  reviewerObservation: string
): Promise<void> => {
  try {
    const response = await axiosInstance.put(`/activities/${id}/reject`, {
      reviewerObservation,
    });
    return response.data;
  } catch (error) {
    console.error("Error al aprobar la actividad:", error);
    throw error;
  }
};

export const usePublishActivityMutation =   (id?: number)  => {
  if (!id) {
    throw new Error("No se ha proporcionado un ID de actividad");
  }

  const mutation = useAxios(
    {
      url: `/activities/${id}/publish`,
      method: "PUT"
    },
    { manual: true }
  );

  return mutation;
}

export interface Scope3 {
  scope: number; // ID del ámbito asociado a la actividad
  hours: number; // Cantidad de horas asignadas al ámbito
}

export interface MemberScope {
  scope: number; // ID del ámbito asociado al miembro
  hours: number; // Cantidad de horas asignadas al miembro en este ámbito
}

export interface MisActividades {
  id: number; // ID de la actividad
  name: string; // Nombre de la actividad
  description: string; // Descripción de la actividad
  memberScopes: MemberScope[]; // Lista de ámbitos asociados a los miembros y sus horas
  activityScopes: Scope3[]; // Lista de ámbitos asociados a la actividad y sus horas
  startDate: string; // Fecha de inicio de la actividad (ISO string)
  endDate: string; // Fecha de finalización de la actividad (ISO string)
  slug: string; // Slug de la actividad (identificador único)
  activityStatus: number; // Estado de la actividad
}
