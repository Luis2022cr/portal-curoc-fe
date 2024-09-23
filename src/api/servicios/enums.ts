
export const estadoActividadMap: { [key: number]: string } = {
  0: "Pendiente",
  1: "Rechazado",
  2: "Aprobado",
  3: "Publicado",
  4: "Cancelado",
  5: "En Progreso",
  6: "Completado",
};

export enum ActivityScope {
  Cientifico = 0,
  Cultural = 1,
  Social = 2,
  Deportes = 3,
  Becas = 4,
}

export const EtiquetasAmbitosActividad: { [key: number]: string } = {
  [ActivityScope.Cientifico]: "Científico",
  [ActivityScope.Cultural]: "Cultural",
  [ActivityScope.Social]: "Social",
  [ActivityScope.Deportes]: "Deportes",
  [ActivityScope.Becas]: "Becas",
};

export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};
