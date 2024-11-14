import "../css/reg.css";
import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Titulo } from "../components/Titulos";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Button, notification, Table, Divider, Input, Affix } from "antd";
import * as XLSX from "xlsx"; 

import { uploadBytes, ref } from "firebase/storage";
import { storage } from "../firebase/config"; // Importa correctamente tu configuración de Firebase

const { Dragger } = Upload;

const openNotification = () => {
  notification.error({
    message: "Solo archivos Excel permitidos",
    description: "Asegúrate de subir únicamente archivos Excel con la lista completa de alumnos.",
    placement: "bottomRight",
  });
};

export function Regalu() {
  const [tableData, setTableData] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [cicloEscolar, setCicloEscolar] = useState("2024-2025");

  useEffect(() => {
    setIsButtonDisabled(tableData.length === 0);
  }, [tableData]);

  const handleFileUpload = async (file) => {
    const fileRef = ref(storage, `alumnos/${file.name}`);
    
    try {
      await uploadBytes(fileRef, file);
      message.success(`${file.name} subido correctamente`);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setTableData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      message.error("Error al subir el archivo.");
    }
  };

  const registrarAlumnosEnBD = async () => {
    const userCURP = localStorage.getItem("userCURP") || "";
    const plantel = localStorage.getItem("userPlantel") || "";

    console.log('CURP del usuario:', userCURP);
    console.log('Plantel del usuario:', plantel);
    console.log('Ciclo escolar:', cicloEscolar);
    console.log('Datos de alumnos:', tableData);

    if (!validateCicloEscolar(cicloEscolar)) {
        notification.error({
            message: "Ciclo escolar inválido",
            description: "Ingresa un ciclo válido (ej. 2024-2025) con el año actual y próximo.",
            placement: "bottomRight",
        });
        return; 
    }

    const datosValidos = tableData.every(alumno => alumno.length === 4);
    if (!datosValidos) {
        notification.error({
            message: "Datos inválidos",
            description: "Cada fila del archivo debe contener cuatro campos: nombre, apellido paterno, apellido materno y sexo.",
            placement: "bottomRight",
        });
        return; 
    }

    try {
        // Verificar asignación
        const response = await fetch('https://servidor-zonadoce.vercel.app/verificar-asignacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userCURP, plantel })
        });

        console.log('Respuesta de verificar asignación:', response);

        if (!response.ok) {
            const errorResponse = await response.json();
            notification.error({
                message: "Error al verificar asignación",
                description: errorResponse.message || 'No se pudo verificar la asignación. Inténtalo de nuevo más tarde.',
                placement: "bottomRight"
            });
            return;
        }

        const tieneAsignacion = await response.json();
        console.log('Resultado de verificar asignación:', tieneAsignacion);

        if (tieneAsignacion.success) {
            // Preparar datos para enviar
            const dataToSend = {
                alumnos: tableData,
                cicloEscolar: cicloEscolar,
                curp: userCURP 
            };

            // Guardar los datos en la base de datos
            const registroResponse = await fetch('https://servidor-zonadoce.vercel.app/registrar-alumnos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            console.log('Respuesta de registrar alumnos:', registroResponse);

            if (!registroResponse.ok) {
                const errorResponse = await registroResponse.json();
                notification.error({
                    message: "Error al registrar alumnos",
                    description: errorResponse.message || 'Hubo un problema al intentar registrar los alumnos. Por favor, inténtalo de nuevo.',
                    placement: "bottomRight"
                });
                return;
            }

            // Los datos se almacenaron correctamente en la base de datos
            notification.success({
                message: "Alumnos registrados correctamente",
                placement: "bottomRight"
            });
        } else {
            notification.warning({
                message: "No tienes una asignación",
                description: "Debes tener una asignación para registrar alumnos.",
                placement: "bottomRight"
            });
        }
    } catch (error) {
        console.error('Error de red:', error);
        notification.error({
            message: "Error de red",
            description: error.message || 'Se produjo un error inesperado. Por favor, inténtalo de nuevo.',
            placement: "bottomRight"
        });
    } finally {
        setButtonLoading(false); 
    }
};

  const validateCicloEscolar = (cicloEscolar) => {
    const regex = /^\d{4}-\d{4}$/;
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const expectedPattern = `${currentYear}-${nextYear}`;
    return regex.test(cicloEscolar) && cicloEscolar === expectedPattern;
  };

  const props = {
    name: "file",
    maxCount: 1,
    beforeUpload(file) {
      const isExcel =
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      if (!isExcel) {
        openNotification();
        return false; 
      } else {
        handleFileUpload(file); 
        return false; 
      }
    },
  };

  const generateColumnsAndDataSource = (data) => {
    const columns = data[0].map((header, index) => ({
      title: header,
      dataIndex: index.toString(),
      key: `column-${index}`,
    }));

    const dataSource = data.slice(1).map((row, index) => {
      const rowObject = row.reduce((acc, value, i) => {
        acc[i] = value;
        return acc;
      }, {});
      return { key: `row-${index}`, ...rowObject };
    });

    return { columns, dataSource };
  };

  const { columns, dataSource } =
    tableData.length > 0
      ? generateColumnsAndDataSource(tableData)
      : { columns: [], dataSource: [] };
      return (
        <>
          <Affix><Header/></Affix>
          <Titulo tit={"Registrar alumnos"} />
          <div className="container flex flex-row m-auto">
            <div className="basis-2/4 px-6 mb-52">
              <p className="p-5 font-bold text-center text-lg">
                Seleccionar archivo con lista de alumnos
              </p>
              <div className="h-max basis-2/5">
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click aquí para subir su lista de alumnos
                  </p>
                  <p className="ant-upload-hint">
                    Si llega a presentar algún problema con la subida de su
                    documento, no dude en pedir ayuda y soporte; se tratará de dar
                    solución lo antes posible.
                  </p>
                </Dragger>
              </div>
              <div className="mt-4 items-start">
                <label>Ciclo escolar:</label>
                <Input
                  placeholder="Ejemplo 2024-2025"
                  value={cicloEscolar}
                  onChange={(e) => setCicloEscolar(e.target.value)} 
                />
                <Button
                  type="primary"
                  onClick={registrarAlumnosEnBD}
                  disabled={isButtonDisabled} 
                  loading={buttonLoading}
                >
                  Registrar
                </Button>
              </div>
            </div>
            <Divider
              type="vertical"
              className="h-[450px] border border-black opacity-30"
            />
            <div className="container ml-6 basis-3/5">
              <Table columns={columns} dataSource={dataSource} />
            </div>
          </div>
          <Footer />
        </>
      );
    }
