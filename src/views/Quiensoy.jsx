import React from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Presentacion } from "../components/Presntacion";
import url from "../img/imagenDos.jpg";
import icono from "../img/acerca.png";
import { Affix, Divider } from "antd";
import "../css/Quien.css";

export function Quien() {
  return (
    <>
      <Affix>
        <Header />
      </Affix>
      <Presentacion
        tit={"¿Quiénes somos?"}
        icono={
          <img
            src={icono}
            className="lg:w-[280px] text-white celular:translate-x-2"
            alt="Icono de Acerca"
          />
        }
      />

      <Divider className="chiUwu" />
      <div className="flex flex-col lg:flex-row lg:justify-center items-center p-6">
        <div className="lg:basis-1/2 m-6">
          <img src={url} alt="Descripción de la imagen" className="w-full h-auto rounded-lg shadow-lg" />
        </div>

        <div className="lg:basis-1/2 lg:text-lg leading-8 m-10">
          <h2 className="text-4xl font-semibold text-blue-700 py-5">¡Somos Zona 012!</h2>
          <p className="text-gray-700 mb-4">
            Nuestra misión en la Zona Escolar de Escuelas Primarias Indígenas es proporcionar una educación de calidad que sea accesible, inclusiva y equitativa para todos los niños de nuestras comunidades indígenas.
          </p>
          <p className="text-gray-700 mb-4">
            Nos esforzamos por preservar y promover la rica diversidad cultural y lingüística de nuestras comunidades a través de un currículo que refleje sus valores y tradiciones únicas.
          </p>
          <p className="text-gray-700">
            Estamos comprometidos a fomentar un ambiente de aprendizaje seguro, respetuoso y acogedor que permita a cada estudiante alcanzar su máximo potencial.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
