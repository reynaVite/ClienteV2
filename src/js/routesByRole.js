export const routesByRole = {
  "guest": [
    { name: "PreRegistro", path: "/Solicitud" },
    { name: "Registro", path: "/RegistroF" },
    { name: "Iniciar Sesion", path: "/Login" },
    { name: "¿Quiénes somos?", path: "/Quien" },
    { name: "Preguntas", path: "/Preguntas" },
    { name: "Mapa", path: "/Mapa" },

  ],
  "1": [
    { name: "Inicio", path: "/Inicio" },
    { name: "Usuarios", path: "/AdminRe" }, 
     

    {
      name: "Agenda",
      submenu: [
        { name: "Asignar", path: "/Agenda" }, 
        { name: "Entregados", path: "/Entregados" }, 
      ],
    },
    


    {
      name: "Examen",
      submenu: [
        { name: "Elaboración", path: "/Examen" },
        { name: "Foro", path: "/ExamenesPrueba" },  
      ],
    } ,


    { name: "Solicitudes", path: "/AdminSol" }, 
    { name: "Preguntas", path: "/Preguntas" },
    { name: "Valoracion", path: "/Valoracion" },
    { name:"Salir", path:"/Logout"}

  ],
  "2": [
    { name: "Inicio", path: "/Inicio" },
    ,

    
  { name: "Asignados", path: "/Asignados" },
  
    


    {
      name: "Examen",
      submenu: [
        { name: "Elaboración", path: "/Examen" },
        { name: "Foro", path: "/ExamenesPrueba" },  
      ],
    } ,
    { name: "Evidencias", path: "/Evidencias" },
    { name: "¿Quiénes somos?", path: "/Quien" },
    { name: "Preguntas", path: "/Preguntas" },
    { name: "Mapa", path: "/Mapa" },
    { name:"Salir", path:"/Logout"}

  ],
  "3": [
    { name: "Inicio", path: "/Inicio" },
    {
      name: "Salud",
      submenu: [
        { name: "Registro", path: "/Salud" },
        { name: "Datos de salud", path: "/SaludDatos" }, 
        { name:"Reportes", path:"/ReSalud"},
      ],
    },

    {
      name: "Rezago",
      submenu: [
        { name: "Registro", path: "/RezagoAcademico" },
        { name: "Cambios", path: "/CambiosRezago" }, 
        
      ],
    } ,


    {
      name: "Examen",
      submenu: [
        { name: "Elaboración", path: "/Examen" },
        { name: "Foro", path: "/ExamenesPrueba" },  
      ],
    } ,
    {
      name: "Evidencias",
      submenu: [
        { name: "Entrega", path: "/Evidencias" },
        { name: "Cambios", path: "/CambiosEvidencia" },  
      ],
    } ,
 
    {
      name: "Alumnos",
      submenu: [
        { name: "Registrar", path: "/RegA" },
        { name: "Lista de alumnos", path: "/MiLista" }, 
      ],
    },
    { name: "¿Quiénes somos?", path: "/Quien" },
    { name:"Salir", path:"/Logout"}
  ],
};