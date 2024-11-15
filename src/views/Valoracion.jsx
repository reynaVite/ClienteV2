// src/views/Home.jsx
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CSPMetaTag } from "../components/CSPMetaTag";
import "../css/Inicio.css";
import { Affix } from "antd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Valoracion = () => {
  const [totales, setTotales] = useState({ bueno: 0, regular: 0, malo: 0 });
  const [loading, setLoading] = useState(true);

  // Efecto para obtener las calificaciones al cargar el componente
  useEffect(() => {
    const fetchCalificaciones = async () => {
      try {
        const response = await axios.get(
          "https://servidor-zona12-api.vercel.app/recuperarCal"
        );

        // Procesar los datos para contar las calificaciones
        const calificaciones = response.data.calificaciones || [];
        const resumen = {
          bueno: calificaciones.filter((c) => c.calificacion?.toLowerCase() === "bueno").length,
          regular: calificaciones.filter((c) => c.calificacion?.toLowerCase() === "regular").length,
          malo: calificaciones.filter((c) => c.calificacion?.toLowerCase() === "malo").length,
        };

        setTotales(resumen); // Actualizar el estado con los totales
      } catch (error) {
        console.error("Error al obtener calificaciones:", error);
        setTotales({ bueno: 0, regular: 0, malo: 0 }); // Fallback en caso de error
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchCalificaciones();
  }, []);

  return (
    <>
      <CSPMetaTag />
      <Affix>
        <Header />
      </Affix>

      


      <main className="p-8 bg-gray-50 min-h-screen">
       
      <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-center">
      Resumen de valoraciones
          </h2>
        {/* Estado de carga */}
        {loading ? (
          <p className="text-center text-lg">Cargando resumen...</p>
        ) : (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Calificaciones totales</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-700">Bueno:</span>
                <span className="text-lg text-gray-700">{totales.bueno} docentes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-700">Regular:</span>
                <span className="text-lg text-gray-700">{totales.regular} docentes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-700">Malo:</span>
                <span className="text-lg text-gray-700">{totales.malo} docentes</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <ToastContainer />
    </>
  );
};

export default Valoracion;
