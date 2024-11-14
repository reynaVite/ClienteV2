import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Presentacion } from "../components/Presntacion"; 
import axios from "axios";
import { Card, Button } from "antd";
import { ScrollToTop } from "../components/ScrollToTop";
import icono from "../img/calendario.png";
import { Affix } from "antd";
import { FilePdfOutlined, EyeOutlined } from '@ant-design/icons'; // Importa íconos
import "../css/Login.css";

export function Entregados() {
  const [actividadesEntregadas, setActividadesEntregadas] = useState([]);
  const [perfilesUsuarios, setPerfilesUsuarios] = useState({}); // Estado para almacenar los perfiles de usuarios

  useEffect(() => {
    obtenerActEntre();
  }, []);

  const obtenerActEntre = async () => {
    try {
      const response = await axios.get("https://servidor-zonadoce.vercel.app/consultarPDF");
      setActividadesEntregadas(response.data); 
      obtenerPerfiles(response.data); // Llama a la función para obtener perfiles de usuarios
    } catch (error) {
      console.error("Error al obtener actividades entregadas:", error);
    }
  };

  const obtenerPerfiles = async (actividades) => {
    const curps = actividades.map(actividad => actividad.curp); // Extrae todas las CURP
    try {
      const promises = curps.map(curp => 
        axios.get(`https://servidor-zonadoce.vercel.app/perfil?curp=${curp}`)
      );
      const responses = await Promise.all(promises);
      const nuevosPerfiles = {};
      responses.forEach(response => {
        const perfil = response.data[0];
        if (perfil) {
          nuevosPerfiles[perfil.curp] = perfil; // Almacena el perfil por CURP
        }
      });
      setPerfilesUsuarios(nuevosPerfiles); // Actualiza el estado con todos los perfiles
    } catch (error) {
      console.error("Error al obtener perfiles de usuarios:", error);
    }
  };

  const agruparActividadesPorTitulo = () => {
    return actividadesEntregadas.reduce((acc, actividad) => {
      if (!acc[actividad.titulo]) {
        acc[actividad.titulo] = [];
      }
      acc[actividad.titulo].push(actividad);
      return acc;
    }, {});
  };

  const actividadesAgrupadas = agruparActividadesPorTitulo();

  const verPDF = async (id) => {
    try {
      const pdfResponse = await axios.get(`https://servidor-zonadoce.vercel.app/obtenerPDF/${id}`);
      const pdfUrl = pdfResponse.data.pdfUrl; // Obtén la URL del PDF
      window.open(pdfUrl, '_blank'); // Abre el PDF en una nueva pestaña
    } catch (error) {
      console.error("Error al obtener el PDF:", error);
    }
  };

  return (
    <>
      <Affix>
        <Header />
      </Affix>
      <Presentacion
        tit={"Entregables de actividades"}
        icono={<img src={icono} className="lg:w-[280px] text-white celular:translate-x-2 lg:z-50" alt="Icono de calendario" />}
      />
      <ScrollToTop />
      <h2 className="mt-8 text-3xl font-bold text-center text-blue-600">Actividades Entregadas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
        {Object.keys(actividadesAgrupadas).map(titulo => (
          <div key={titulo} className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-xl font-bold flex items-center mb-2">
              <FilePdfOutlined className="mr-2 text-blue-500" />
              {titulo}
            </h3>
            <div className="grid gap-2">
              {actividadesAgrupadas[titulo].map(actividad => {
                const usuarioPerfil = perfilesUsuarios[actividad.curp];
                return (
                  <Card key={actividad.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 p-2" style={{ width: '100%' }}>
                    <div  >
                      {usuarioPerfil ? `${usuarioPerfil.nombre} ${usuarioPerfil.aPaterno} ${usuarioPerfil.aMaterno} (${actividad.curp}) docente de ${usuarioPerfil.grado_id} ${usuarioPerfil.grupo}` : `CURP: ${actividad.curp}`} {/* Muestra datos o CURP */}
                    </div>
                    <Button 
                      className="w-full flex items-center justify-center" 
                      onClick={() => verPDF(actividad.id)} 
                    >
                      <EyeOutlined className="mr-2" />
                      Ver PDF
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}
