import { ToastContainer} from 'react-toastify';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import About from './pages/About';
import './index.css';
import Layout from './layouts/Layout';
import Layout_Login from './layouts/Layout_Login';
import DashboardCoordinador from './pages/coordinadores_dashboard/DashboardCoordinador';
import DashboardEstudiante from './pages/estudiantes_dashboard/DashboardEstudiante';
import DashboardAdminVoae from './pages/voae_dashboard/DashboardAdminVoae';
import PaginaMisActividades from './pages/estudiantes_dashboard/PaginaMisActividades';
import UnirseActividad from './pages/estudiantes_dashboard/UnirseActividades';
import NovedadesAdmin from './pages/voae_dashboard/NovedadesAdmin';
import PaginaGestionSolicitudesVOAE from './pages/voae_dashboard/PaginaAprobarSolicitudesVOAE';
import { AuthProvider } from './api/AuthContext';
import ActvidadesEnCurso from './components/paginas/ActvidadesEnCurso';
import CrearActividad from './components/paginas/CrearActividad';
import DetallesActividad from './components/paginas/DetallesActividad';
import GestionSolicitudes from './components/paginas/GestionSolicitudes';
import PaginaGestionActividad from './components/paginas/PaginaGestionActividad';
import Perfil from './components/paginas/PaginaPerfil';
import HorasVOAE from './components/paginas/HorasVoae';
import DetalleRegistro from './pages/auth/DetalleRegistro';
import Login from './pages/auth/Login';
import Registro from './pages/auth/Registro';
import ForgotPassword from './pages/auth/forgot-password';
import ResetPassword from './pages/auth/reset-password';
import ActividadesSolicitadas from './components/paginas/ActividadesSolicitadas';
import CambiarContrasena from './components/otraPaginas/CambiarContrasena';
import Calendario from './components/otraPaginas/PaginaDeCalendario';
import UpdateActividad from './components/paginas/UpdateActividad';
import SubirImagen from './components/otraPaginas/SubirImagen';
import CoordinadoresAuth from './api/seguridad/CoordinadoresAuth';
import EstudianteRoute from './api/seguridad/EstudiantesAuth';
import VoaeAuth from './api/seguridad/VoaeAuth';
import 'react-toastify/dist/ReactToastify.css';
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <>
    <AuthProvider>

      <BrowserRouter>
        <Routes>
          {/* Rutas que utilizan el Layout por defecto */}
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Registro />} />
            <Route path="confirmar-cuenta" element={<DetalleRegistro />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="restablecer-contrasena" element={<ResetPassword />} />
          </Route>

          {/* Rutas que utilizan el Layout de Login */}
          <Route path="/" element={<Layout_Login />}>
            {/* Dashboard de estudiantes */}

            <Route path="/" element={<EstudianteRoute />}>
              <Route path="dashboard-estudiante/main" element={<DashboardEstudiante />} />
              <Route path="dashboard-estudiante/actividades-solicitadas" element={<ActividadesSolicitadas />} />
              <Route path="dashboard-estudiante/actividades-en-curso" element={<ActvidadesEnCurso />} />
              <Route path="dashboard-estudiante/mis-actividades" element={<PaginaMisActividades />} />
              <Route path="dashboard-estudiante/unirse-actividad/:slug" element={<UnirseActividad />} />
              <Route path="dashboard-estudiante/crear-actividad" element={<CrearActividad />} />
              <Route path="dashboard-estudiante/actualizar-actividad/:id" element={<UpdateActividad />} />
              <Route path="dashboard-estudiante/editar-actividad" element={<CrearActividad />} />
              <Route path="dashboard-estudiante/calendario" element={<Calendario />} />
              <Route path="dashboard-estudiante/perfil" element={<Perfil />} />
              <Route path="dashboard-estudiante/cambiar-contrasena" element={<CambiarContrasena />} />
              <Route path="dashboard-estudiante/detalles-actividad/:slug" element={<DetallesActividad />} />
              <Route path="dashboard-estudiante/subir-imagen/:id" element={<SubirImagen />} />
            </Route>

            {/* Dashboard de coordinadores */}

            <Route path="/" element={<CoordinadoresAuth />}>
              <Route path="dashboard-coordinador/main" element={<DashboardCoordinador />} />
              <Route path="dashboard-coordinador/detalles-actividad/:slug" element={<DetallesActividad />} />
              <Route path="dashboard-coordinador/actividad-en-curso" element={<ActvidadesEnCurso />} />
              <Route path="dashboard-coordinador/gestion-actividad" element={<PaginaGestionActividad />} />
              <Route path="dashboard-coordinador/crear-actividad" element={<CrearActividad />} />
              <Route path="dashboard-coordinador/calendario" element={<Calendario />} />
              <Route path="dashboard-coordinador/perfil" element={<Perfil />} />
              <Route path="dashboard-coordinador/cambiar-contrasena" element={<CambiarContrasena />} />
              <Route path="dashboard-coordinador/horas-estudiantes" element={<HorasVOAE />} />
              <Route path="dashboard-coordinador/actividades-solicitadas" element={<ActividadesSolicitadas />} />
              <Route path="dashboard-coordinador/actualizar-actividad/:id" element={<UpdateActividad />} />
              <Route path="dashboard-coordinador/subir-imagen/:id" element={<SubirImagen />} />
            </Route>

            {/* Dashboard de voae */}

            <Route path="/" element={<VoaeAuth />}>
              <Route path="dashboard-voae/main" element={<DashboardAdminVoae />} />
              <Route path="dashboard-voae/actividad-en-curso" element={<ActvidadesEnCurso />} />
              <Route path="dashboard-voae/gestion-actividad" element={<PaginaGestionActividad />} />
              <Route path="dashboard-voae/detalles-actividades/:slug" element={<DetallesActividad />} />
              <Route path="dashboard-voae/novedades-admin" element={<NovedadesAdmin />} />
              <Route path="dashboard-voae/crear-actividad" element={<CrearActividad />} />
              <Route path="dashboard-voae/calendario" element={<Calendario />} />
              <Route path="dashboard-voae/gestionar-solicitud" element={<GestionSolicitudes />} />
              <Route path="dashboard-voae/solicitudes/:slug" element={<PaginaGestionSolicitudesVOAE />} />
              <Route path="dashboard-voae/perfil" element={<Perfil />} />
              <Route path="dashboard-voae/cambiar-contrasena" element={<CambiarContrasena />} />
              <Route path="dashboard-voae/horas-estudiantes" element={<HorasVOAE />} />
              <Route path="dashboard-voae/actividades-solicitadas" element={<ActividadesSolicitadas />} />
              <Route path="dashboard-voae/actualizar-actividad/:id" element={<UpdateActividad />} />
              <Route path="dashboard-voae/subir-imagen/:id" element={<SubirImagen />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
    <ToastContainer />
  </>
);
