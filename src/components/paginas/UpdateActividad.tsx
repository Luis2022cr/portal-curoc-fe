import React, { useEffect, useState } from 'react';
import { ActividadCrear, updateActividad } from '@/api/servicios/actividadPost';
import { Carrera, obtenerEstudiantesPorCarreras, obtenerProfesorPorCarreras, obtenerTodasLasCarreras, UserCarrera } from '../../api/servicios/carreras';
import { EtiquetasAmbitosActividad } from '@/api/servicios/enums';
// import { useLocation, useNavigate } from 'react-router-dom';
import { organizations, obtenerLasOrganizaciones } from '@/api/servicios/organizaciones';
import { FiLoader } from 'react-icons/fi';
import axios from 'axios';
import SuccessModal from '../Modal';
import { useParams } from 'react-router-dom';


const CrearActividad = () => {
  const [formData, setFormData] = useState<ActividadCrear>({
    name: '',
    description: '',
    foreignCareersIds: [], // Asegúrate de que coincida con el tipo number[]
    startDate: '',
    endDate: '',
    goals: [''],
    scopes: [{ scope: 0, hours: 0 }],
    supervisorId: 0,
    coordinatorId: 0,
    totalSpots: 0,
    location: '',
    mainActivities: [''],
    organizers: [{ careerId: null, organizationId: 0, type: 1 }],
    supervisorText: '',   // Añadir estado para el texto del supervisor
    coordinatorText: '',  // Añadir estado para el texto del coordinador
  });
  const [selectedCareer, setSelectedCareer] = useState<number | 'none'>('none');
  const [selectedSupervisorCarreraId, setSelectedSupervisorCarreraId] = useState<number | undefined>(undefined);
  const [selectedCoordinatorCarreraId, setSelectedCoordinatorCarreraId] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [organizacion, setOrganizacion] = useState<organizations[]>([]);
  const [teachers, setTeachers] = useState<UserCarrera[]>([]);
  const [students, setStudents] = useState<UserCarrera[]>([]);
  const [error, setError] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const { id } = useParams<{ id?: string }>();
  const numericId = id ? parseInt(id, 10) : undefined;
  
  useEffect(() => {
    const obtenerCarreras = async () => {
      try {
        const response = await obtenerTodasLasCarreras();
        setCarreras(response);
      } catch (error) {
        console.error('Error fetching careers:', error);
      }
    };

    obtenerCarreras();
  }, []);

  useEffect(() => {
    const obtenerOrganizaciones = async () => {
      try {
        const response = await obtenerLasOrganizaciones();
        setOrganizacion(response);
      } catch (error) {
        console.error('Error fetching careers:', error);
      }
    };

    obtenerOrganizaciones();
  }, []);

  // Proporcionar un valor predeterminado en caso de undefined
  const supervisorText = formData.supervisorText ?? '';
  const coordinatorText = formData.coordinatorText ?? '';

  useEffect(() => {
    const fetchTeachers = async () => {
      if (selectedSupervisorCarreraId !== undefined) {
        try {
          const response = await obtenerProfesorPorCarreras(selectedSupervisorCarreraId, supervisorText);
          setTeachers(response);
        } catch (error) {
          console.error('Error fetching teachers:', error);
        }
      }
    };

    fetchTeachers();
  }, [selectedSupervisorCarreraId, supervisorText]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedCoordinatorCarreraId !== undefined) {
        try {
          const response = await obtenerEstudiantesPorCarreras(selectedCoordinatorCarreraId, coordinatorText);
          setStudents(response);
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      }
    };

    fetchStudents();
  }, [selectedCoordinatorCarreraId, coordinatorText]);


  const handleSupervisorCarreraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSupervisorCarreraId(Number(e.target.value));
  };

  const handleCoordinatorCarreraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCoordinatorCarreraId(Number(e.target.value));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleScopeChange = (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const newScopes = [...formData.scopes];
    newScopes[index] = { ...newScopes[index], scope: parseInt(value, 10) };
    setFormData(prevState => ({ ...prevState, scopes: newScopes }));
  };


  const handleHoursChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newScopes = [...formData.scopes];
    newScopes[index].hours = parseInt(event.target.value, 10); // Convertir a número
    setFormData({ ...formData, scopes: newScopes });
  };

  const handleAddScope = () => {
    setFormData(prevState => ({
      ...prevState,
      scopes: [...prevState.scopes, { scope: 0, hours: 0 }]
    }));
  };

  const handleAddActivity = () => {
    setFormData(prevState => ({
      ...prevState,
      mainActivities: [...prevState.mainActivities, '']
    }));
  };

  const handleAddGoals = () => {
    setFormData(prevState => ({
      ...prevState,
      goals: [...prevState.goals, '']
    }));
  };
  const handleGoalChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newGoals = [...formData.goals];
    newGoals[index] = value;
    setFormData(prevState => ({ ...prevState, goals: newGoals }));
  };
  const handleActivityChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newActivities = [...formData.mainActivities];
    newActivities[index] = value;
    setFormData(prevState => ({ ...prevState, mainActivities: newActivities }));
  };

  const handleAddOrganizer = () => {
    setFormData({
      ...formData,
      organizers: [
        ...formData.organizers,
        { careerId: 0, organizationId: 0, type: 0 } // Inicializa con valores por defecto numéricos
      ]
    });
  };


  const handleRemoveOrganizer = (index: number) => {
    // Eliminar organizadores adicionales, pero no el primer organizador
    if (index !== 0) {
      setFormData(prevState => ({
        ...prevState,
        organizers: prevState.organizers.filter((_, i) => i !== index)
      }));
    }
  };

  const handleOrganizerChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = event.target;
    const updatedValue = value === "" ? null : Number(value);

    const updatedOrganizers = formData.organizers.map((org, i) => {
      if (i === index) {
        if (id === 'type') {
          return { ...org, type: Number(value), careerId: null, organizationId: null };
        } else if (id === 'careersSelect') {
          return { ...org, careerId: updatedValue, organizationId: null };
        } else if (id === 'organizationId') {
          return { ...org, organizationId: updatedValue, careerId: null };
        }
      }
      return org;
    });

    setFormData({ ...formData, organizers: updatedOrganizers });
  };


  const handleCareerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCareer(parseInt(e.target.value, 10));
  };


  const handleSelectAllChange = () => {
    if (selectAll) {
      // Desmarcar "Seleccionar todas" y limpiar las carreras seleccionadas
      setFormData(prevState => ({
        ...prevState,
        foreignCareersIds: []
      }));
    } else {
      // Marcar "Seleccionar todas" y añadir todas las carreras
      setFormData(prevState => ({
        ...prevState,
        foreignCareersIds: carreras.map(carrera => carrera.id)
      }));
    }
    setSelectAll(!selectAll); // Alternar el estado de selectAll
  };


  const handleAddCareer = () => {
    if (selectedCareer !== 'none' && !formData.foreignCareersIds.includes(selectedCareer)) {
      setFormData(prevState => ({
        ...prevState,
        foreignCareersIds: [...prevState.foreignCareersIds, selectedCareer]
      }));
    }
    setSelectedCareer('none'); // Reset selection
  };

  const handleRemoveCareer = (id: number) => {
    setFormData(prevState => ({
      ...prevState,
      foreignCareersIds: prevState.foreignCareersIds.filter(careerId => careerId !== id)
    }));
  };

  const handleRemoveScope = (index: number) => {
    // Eliminar el ámbito en el índice especificado, excepto si es el primer ámbito
    if (index !== 0) {
      setFormData(prevState => ({
        ...prevState,
        scopes: prevState.scopes.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError([]);
    const startDate = new Date(formData.startDate).toISOString();
    const endDate = new Date(formData.endDate).toISOString();

    const actividad: ActividadCrear = {
      name: formData.name,
      description: formData.description,
      foreignCareersIds: formData.foreignCareersIds,
      startDate: startDate,
      endDate: endDate,
      goals: formData.goals,
      scopes: formData.scopes,
      supervisorId: formData.supervisorId,
      coordinatorId: formData.coordinatorId,
      totalSpots: formData.totalSpots,
      location: formData.location,
      mainActivities: formData.mainActivities.filter(activity => activity.trim() !== ''),
      organizers: formData.organizers
    };
    setIsLoading(true);
    try {
      if (numericId !== undefined) {
        await updateActividad(numericId, actividad);
      

      // Reset form data after successful creation
      setFormData({
        name: '',
        description: '',
        foreignCareersIds: [],
        startDate: '',
        endDate: '',
        goals: [''],
        scopes: [{ scope: 0, hours: 0 }],
        supervisorId: 0,
        coordinatorId: 0,
        totalSpots: 0,
        location: '',
        mainActivities: [''],
        organizers: [{ careerId: null, organizationId: 3, type: 1 }]
      });
      setIsModalOpen(true);
    } else {
      console.error('Error: numericId is undefined');
    }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          const errorDetails = err.response.data.errors.find(
            (error: { code: string }) => error.code === 'Activity.ActivityNameAlreadyExists'
          );
          if (errorDetails) {
            setError(prev => [...prev, 'Ya existe una actividad con ese nombre.']);
            return;
          }
        }

        if (err.response?.status === 400) {
          const errorMessages = err.response.data.errors;
          const translatedErrors = errorMessages.reduce((acc: string[], msg: string) => {
            if (msg.includes('The length of \'Description\' must be at least')) {
              acc.push('La descripción debe tener al menos 4 caracteres.');
            }
            if (msg.includes('The length of \'Location\' must be at least')) {
              acc.push('La ubicación debe tener al menos 4 caracteres.');
            }
            if (msg.includes('\'Start Date\' must be greater than')) {
              acc.push('La fecha debe ser posterior a la fecha actual.');
            }
            if (msg.includes('\'End Date\' must be greater than')) {
              acc.push('La fecha y hora de finalizacion no deben ser iguales a la de Inicio.');
            }
            if (msg.includes('\'Foreign Careers Ids\' must not be empty')) {
              acc.push('El campo de carreras permitidas no pueden estar vacíos.');
            }
            return acc;
          }, []);

          setError(prev => [...prev, ...translatedErrors]);
          return;
        }

        setError(prev => [...prev, 'Ocurrió un error al crear la actividad.']);
      } else {
        setError(prev => [...prev, 'Ocurrió un error inesperado.']);
      }
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-center text-3xl font-semibold mb-8 text-gray-800">Formulario de edicion de solicitud</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-bold text-gray-700 mb-1">Nombre Actividad:</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label htmlFor="description" className="text-sm font-bold text-gray-700 mb-1">Descripción:</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          {/* Foreign Careers IDs */}
          <div className="flex flex-col">
            <label htmlFor="careersSelect" className="text-sm font-bold text-gray-700 mb-1">Seleccionar Carreras admitidas(Para participar en la actividad):</label>

            <select
              id="careersSelect"
              value={selectedCareer}
              onChange={handleCareerChange}
              className="border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none" disabled>Seleccione una carrera</option>
              {carreras.map(carrera => (
                <option key={carrera.id} value={carrera.id}>
                  {carrera.name}
                </option>
              ))}
            </select>
            <div className="mb-">
              <label className="text-sm font-bold text-gray-700 mb-2">
                Seleccionar todas las carreras:
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                  className="ml-2"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={handleAddCareer}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-2 hover:bg-blue-700 transition duration-200"
            >
              Agregar Carrera Extra
            </button>
          </div>

          {/* Preview Selected Careers */}
          {formData.foreignCareersIds.length > 0 && (
            <div className="mt-6">
              <label className="text-xs font-bold text-gray-700 mb-2">Carreras Seleccionadas:</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.foreignCareersIds.map(careerId => {
                  const carrera = carreras.find(c => c.id === careerId);
                  return (
                    <div key={careerId} className="bg-gray-200 p-4 rounded-lg shadow-sm text-sm">
                      <h3 className="font-semibold text-gray-800">{carrera?.name}</h3>
                      <p className="text-xs text-gray-600">{carrera?.faculty.name}</p>
                      <button
                        type="button"
                        onClick={() => handleRemoveCareer(careerId)}
                        className="mt-2 text-red-500 hover:underline text-xs"
                      >
                        Eliminar
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Start Date */}
          <div className='block md:flex ml-auto w-full gap-4'>

            <div className="w-full">
              <label htmlFor="startDate" className="text-sm font-bold text-gray-700 mb-1">Fecha Inicio:</label>
              <input
                type="datetime-local"
                id="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* End Date */}
            <div className="w-full">
              <label htmlFor="endDate" className="text-sm font-bold text-gray-700 mb-1">Fecha Final:</label>
              <input
                type="datetime-local"
                id="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Goals */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-700 mb-1">Objetivos:</label>
            {formData.goals.map((goal, index) => (
              <div key={index} className="flex items-center space-x-4 mb-2">
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => handleGoalChange(index, e)}
                  className="border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddGoals}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Agregar objetivo Extra
            </button>
          </div>

          {/* Scopes */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-700 mb-1">Ámbitos:</label>

            {formData.scopes.map((scope, index) => (
              <div key={index} className="flex items-center mb-2">
                <select
                  value={scope.scope}
                  onChange={(e) => handleScopeChange(index, e)}
                  className="border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(EtiquetasAmbitosActividad).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={scope.hours}
                  onChange={(e) => handleHoursChange(index, e)}
                  className="border border-gray-300 rounded-lg w-1/3 py-2 px-3 text-gray-700 ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Horas"
                  min="1"
                  required
                />

                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveScope(index)}
                    className="bg-red-600 text-white py-1 px-2 rounded-lg ml-2 hover:bg-red-700 transition duration-200"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddScope}
              className="bg-blue-600 text-white py-1 px-2 rounded-lg mt-2 hover:bg-blue-700 transition duration-200"
            >
              Agregar Ámbito Extra
            </button>
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label htmlFor="location" className="text-sm font-bold text-gray-700 mb-1">Ubicación:</label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Main Activities */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-700 mb-1">Actividades Principales:</label>
            {formData.mainActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 mb-2">
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => handleActivityChange(index, e)}
                  className="border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddActivity}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Agregar Actividad Extra
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Asignación de Catedrático</h2>

            {/* Carrera para Supervisor */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-full">
                  <label htmlFor="supervisorCarreraId" className="block text-sm font-semibold mb-1">Carrera:</label>
                  <select
                    id="supervisorCarreraId"
                    value={selectedSupervisorCarreraId || ''}
                    onChange={handleSupervisorCarreraChange}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700"
                    required
                  >
                    <option value="">Seleccione una Carrera</option>
                    {carreras.map(carrera => (
                      <option key={carrera.id} value={carrera.id}>
                        {carrera.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full">
                  <label htmlFor="supervisorText" className="block text-sm font-semibold mb-1">Buscar:</label>
                  <input
                    type="text"
                    id="supervisorText"
                    value={formData.supervisorText}
                    placeholder="nombre, apellido, numero de empleado"
                    onChange={(e) => setFormData({ ...formData, supervisorText: e.target.value })}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700"
                  />
                </div>
              </div>

              {/* Supervisor ID */}
              <div>
                <label htmlFor="supervisorId" className="block text-sm font-semibold mb-1">Catedrático:</label>
                <select
                  id="supervisorId"
                  value={formData.supervisorId}
                  onChange={handleChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700"
                  required
                >
                  <option value="">Seleccione un Supervisor</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.names} {teacher.lastnames}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Asignación de Encargado</h2>

            {/* Carrera para Coordinador */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-full">
                  <label htmlFor="coordinatorCarreraId" className="block text-sm font-semibold mb-1">Carrera:</label>
                  <select
                    id="coordinatorCarreraId"
                    value={selectedCoordinatorCarreraId || ''}
                    onChange={handleCoordinatorCarreraChange}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700"
                    required
                  >
                    <option value="">Seleccione una Carrera</option>
                    {carreras.map(carrera => (
                      <option key={carrera.id} value={carrera.id}>
                        {carrera.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full">
                  <label htmlFor="coordinatorText" className="block text-sm font-semibold mb-1">Buscar:</label>
                  <input
                    type="text"
                    id="coordinatorText"
                    value={formData.coordinatorText}
                    placeholder="nombre, apellido, numero de cuenta"
                    onChange={(e) => setFormData({ ...formData, coordinatorText: e.target.value })}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700"
                  />
                </div>
              </div>

              {/* Coordinator ID */}
              <div>
                <label htmlFor="coordinatorId" className="block text-sm font-semibold mb-1">Encargado de la Actividad:</label>
                <select
                  id="coordinatorId"
                  value={formData.coordinatorId}
                  onChange={handleChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700"
                  required
                >
                  <option value="">Seleccione un Coordinador</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.names} {student.lastnames}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Total Spots */}
          <div>
            <label htmlFor="totalSpots" className="block text-sm font-bold mb-1">Cupos Totales:</label>
            <input
              type="number"
              id="totalSpots"
              value={formData.totalSpots}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              min="10"
              required
            />
          </div>

          {/* Organizers */}
          <div className="flex flex-col">
            <label className="block text-sm font-bold mb-1">Entidad Responsable:</label>

            {formData.organizers.map((organizer, index) => (
              <div key={index} className="flex space-x-4 mb-2 items-center">
                <select
                  id="type"
                  value={organizer.type}
                  onChange={(e) => handleOrganizerChange(index, e)}
                  className="border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Carrera del CUROC</option>
                  <option value={1}>Organización</option>
                </select>
                {/* Render condicionalmente el select para carrera u organización basado en type */}
                {organizer.type === 0 ? (
                  <select
                    id="careersSelect"
                    value={organizer.careerId ?? ''}
                    onChange={(e) => handleOrganizerChange(index, e)}
                    className="border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="" disabled>Seleccione una carrera</option>
                    {carreras.map(carrera => (
                      <option key={carrera.id} value={carrera.id}>
                        {carrera.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    id="organizationId"
                    value={organizer.organizationId ?? ''}
                    onChange={(e) => handleOrganizerChange(index, e)}
                    className="border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="" >Seleccione una organización</option>
                    {organizacion.map(org => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                )}

                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOrganizer(index)}
                    className="bg-red-600 text-white py-1 px-2 rounded-lg hover:bg-red-700 transition duration-200"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddOrganizer}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Agregar Entidad Extra
            </button>
          </div>

          {error.length > 0 && (
            <ul style={{ color: 'red' }}>
              {error.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              disabled={isLoading} className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded">
              {isLoading ? (<FiLoader className="mr-2 animate-spin" />) : ('Reenviar Solicitud')}
            </button>
          </div>
          <SuccessModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => setIsModalOpen(false)} 
            message="La solicitud de actividad se enviado con exito."
          />
        </form>
      </div>
    </div>
  );
};

export default CrearActividad;
