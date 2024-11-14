import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExamCard from "./Components/ExamenCard";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Presentacion } from "../../components/Presntacion";
import { Affix } from "antd";
import axios from "axios";
import icono from "./exameeeen.png";

const ExamCatalog = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  const obtenerExamenes = async () => {
    try {
      const response = await axios.get("https://servidor-zonadoce.vercel.app/consultarMaterias");
      setExams(response.data);
    } catch (error) {
      console.error("Error al obtener valores:", error);
    }
  };

  useEffect(() => {
    obtenerExamenes();
  }, []);

  const handleExamClick = (exam) => {
    navigate(`/ExamenesPrueba/${exam.id}`, { state: { exam } });
  };

  const groupedExams = exams.reduce((acc, exam) => {
    if (!acc[exam.materia]) {
      acc[exam.materia] = [];
    }
    acc[exam.materia].push(exam);
    return acc;
  }, {});

  return (
    <>
      <Affix>
        <Header />
      </Affix>
      <Presentacion
        tit={"Exámenes"}
        icono={
          <img
            src={icono}
            className="lg:w-[280px] lg:translate-x-32 lg:-translate-y-10 text-white celular:translate-x-2"
            alt="Exámenes"
          />
        }
      />
      <div className="flex flex-col items-center m-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
          {Object.keys(groupedExams).map((materia) => (
            <div key={materia} className="flex flex-col items-center">
              {groupedExams[materia].map((exam) => (
                <div key={exam.id} onClick={() => handleExamClick(exam)}>
                  <ExamCard
                    title={exam.materia}
                    description={exam.descripcion}
                    docente_curp={exam.docente_curp} // Asegúrate de que esta línea esté correcta
                    hora={exam.hora}
                    fecha={exam.fecha}
                  />

                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ExamCatalog;
