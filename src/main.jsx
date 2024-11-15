import React, { useEffect } from "react";
import NotFound from "./errores/404";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { Home } from "./views/Home";
import { Terminos } from "./views/Terminos";
import { Quien } from "./views/Quiensoy";
import { Politicas } from "./views/Politicas";
import { Cookies } from "./views/Cookies";
import { Regalu } from "./views/RegAlumnos";
import "./index.css";
import SearchComponent from "./views/Misalumnos";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { Login } from "./views/Login";
import { Salud } from "./views/Salud";
import { Preguntas } from "./views/Preguntas"; 
import { Historial } from "./views/Historial";
import { ModA } from "./views/Modalumnos";
import { ReContraseña } from "./views/ReContraseña";
import { Re2Contraseña } from "./views/Re2Contraseña";
import { Registro } from "./views/Registro";
import { RegistroF } from "./views/RegistroF";
import { Solicitud } from "./views/Solicitud";
import { Mapa } from "./views/Mapa";
import { Logout } from "./components/Logout";
import { AdminRe } from "./views/AdminRe";
import { AdminRe2 } from "./views/AdminRe2";
import { AdminSol } from "./views/AdminSol";
import { AsigGrupo } from "./views/AsigGrupo";
import { Asignados } from "./views/Asignados";
import{SaludDatos} from "./views/SaludDatos";
import{ReSalud} from "./views/ReSalud";
import ProtectedRoute from "./PreotectedRote";
import Unauthorized from "./views/Unauthorized"; 
import{Evidencias} from "./views/Evidencias";
import{Agenda} from "./views/Agenda";
import {Examen } from "./views/Examen"; 
 
import { CambiosEvidencia } from "./views/CambiosEvidencia";
import { RezagoAcademico } from "./views/RezagoAcademico";
import { ModificarEliminarRegistros } from "./views/CambiosRezago";

import { Entregados } from "./views/Entregados";
import ReRezago from "./views/ReRezago";


import Comments from "./views/examenesForo/examenesScreen";
import ExamCatalog from "./views/examenesForo/ExamenCatalog";


import Valoracion from "./views/Valoracion";


// Componente ScrollToTop
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />, //ya
  },
  {
    path: "/Login",
    element: <Login />, //ya
  },
  {
    path: "/Terminos",
    element: <Terminos />, //ya
  },
  {
    path: "/Quien",
    element: <Quien />, //ya
  },
  {
    path: "/Politicas",
    element: <Politicas />, //ya
  },
  {
    path: "/Cookies",
    element: <Cookies />, //ya
  },
  {
    path: "/RegA",
    element: <Regalu />, //ya
  },
  {
    path: "/MiLista",
    element: <SearchComponent />, //ya
  },
  {
    path: "/Salud",
    element: <Salud />, //falta
  },
  {
    path: "/Preguntas",
    element: <Preguntas />, //falta
  } ,
  {
    path: "/Historial",
    element: <Historial />, //falta
  },
  {
    path: "/modal",
    element: (
      <ProtectedRoute
        element={<ModA />}
        allowedRoles={["1"]}
      />
    ), //falta
  },
  {
    path: "*",
    element: <NotFound />, //falta
  },
  {
    path: "/ReContraseña",
    element: <ReContraseña />, //falta
  },
  {
    path: "/Re2Contraseña",
    element: <Re2Contraseña />, //falta
  },
  {
    path: "/Solicitud",
    element: <Solicitud />, //falta
  },
  {
    path: "/Mapa",
    element: <Mapa />, //falta
  },
  {
    path: "/Logout",
    element: <Logout />,
  },
  {
    path: "/AdminRe",
    element: (
      <ProtectedRoute
        element={<AdminRe />}
        allowedRoles={["1"]}//se debe especificar que tipo de rol tendra acceso
        
      />
    ),
  },{
    path: "/AdminRe2",
    element: (
      <ProtectedRoute
        element={<AdminRe2 />}
        allowedRoles={["1"]}
      />
    ), //falta
  },
  {
    path: "/AdminSol",
    element: <AdminSol />, //falta
  },
  {
    path: "/RegistroF",
    element: <RegistroF />, //falta
  },
  {
    path: "/Inicio",
    element: <Home />, //ya
  },
  {
    path: "/AsigGrupo",
    element: <AsigGrupo />,
  }, 
  {
    path: "/Asignados",
    element: <Asignados />,
  },
  {
    path: "/SaludDatos",
    element: <SaludDatos/>
  }
  ,
  {
    path: "/ReSalud",
    element: <ReSalud/>
  }
  ,
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/Evidencias",
    element: <Evidencias />,
     
  },
  {
    path: "/Agenda",
    element: <Agenda />,
     
  },
  {
    path: "/Examen",
    element: <Examen />,
     
  }, {
    path: "/CambiosEvidencia",
    element: <CambiosEvidencia />,
     
  },
  {
    path: "/RezagoAcademico",
    element: <RezagoAcademico />,
  },
  {
    path: "/CambiosRezago",
    element: <ModificarEliminarRegistros />,
  },
  {
    path: "/Entregados",
    element: <Entregados />,
  },
  {
    path: "/Pilin",
    element: <ReRezago />,
  },
  {
    path: "/ExamenesPrueba/:id",
    element: <Comments />,
  },
  {
    path: "/ExamenesPrueba",
    element: <ExamCatalog />,
  },{
    path: "/Valoracion",
    element: <Valoracion/>
  }
   
   
   
]);

const root = ReactDOM.createRoot(document.getElementById("root"));



root.render(
  <>
    <RouterProvider router={router}>
      <ScrollToTop />
    </RouterProvider>
  </>

  
);

 
