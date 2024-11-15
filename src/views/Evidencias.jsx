import React, { useState, useRef, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Presentacion } from "../components/Presntacion";
import { UploadOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Affix, message, Modal, Upload, Radio } from "antd";

import ConnectionStatus from "../components/ConnectionStatus";  
import axios from "axios";
import { Table } from "antd";
import { Titulo } from "../components/Titulos";
import moment from 'moment';
import 'moment/locale/es';
import { ScrollToTop } from "../components/ScrollToTop";
import icono from "../img/evidencia.png";
import "../css/Login.css";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase/config";
import { v4 as uuidv4 } from 'uuid';
import { jsPDF } from "jspdf";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

export function Evidencias() {
  const enviarNotificacion = async () => {
    const curp = localStorage.getItem("userCURP") || "";  // Obtener la CURP del usuario logueado

    if (!curp) {
      return message.error("No se ha encontrado la CURP del usuario.");
    }

    try {
      await axios.post('https://servidor-zonadoce.vercel.app/enviarNotificacionPorCurp', { curp });
      console.log("Notificación enviada correctamente.");
    } catch (error) {
      console.error("Error al enviar la notificación:", error);
      message.error("Error al enviar la notificación.");
    }
  };

  // Función para autenticar al usuario anónimamente
  const loguearse = async () => {
    try {
      const auth = getAuth();
      const usuario = await signInAnonymously(auth);
      console.log("Usuario autenticado:", usuario);
      return usuario;
    } catch (error) {
      console.error("Error de autenticación:", error);
      return null;
    }
  };

  // Función para activar la recepción de mensajes y guardar el token
  const activarMensajes = async (usuario) => {
    try {
      const token = await getToken(messaging, {
        vapidKey: "BGUQaLFE9uIkwN1JxgqkPjcG9gokURPLsQQyX2UiS-9_sintKkxO3cG5TgKnIzZi02VOspT-KJNV4qmIJlhb9e8"
      });
      const curp = localStorage.getItem("userCURP") || ""; // Obtener la CURP del localStorage
      if (token) {
        console.log("Token generado:", token);
        await axios.post('https://servidor-zonadoce.vercel.app/guardarToken', {
          token: token,  // Token FCM
          curp: curp     // CURP del usuario
        });
        console.log("Token guardado correctamente");
      } else {
        console.log("No se pudo generar el token.");
      }
    } catch (error) {
      console.error("Error al generar el token o enviar la notificación:", error);
    }
  };

  // Efecto para manejar la recepción de mensajes y solicitudes iniciales
  useEffect(() => {
    const iniciarAutenticacionYNotificaciones = async () => {
      const usuario = await loguearse(); // Autenticar
      if (usuario) {
        await activarMensajes(usuario); // Solicitar permisos y generar token
      }
    };

    // Manejar recepción de mensajes
    const unsubscribe = onMessage(messaging, message => {
      console.log("Mensaje recibido:", message);
      toast(message.notification.title);
    });

    iniciarAutenticacionYNotificaciones();
    // Intervalo para enviar notificación cada 60 segundos (1 minuto)
    const intervalId = setInterval(() => {
      enviarNotificacion();
    }, 60000); // 60,000 milisegundos = 1 minuto

    return () => {
      clearInterval(intervalId);
      unsubscribe();
    };
  }, []);

  const [actividades, setActividades] = useState([]);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [submitType, setSubmitType] = useState("pdf");
  const [imageSrc, setImageSrc] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Función para detener la cámara
  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    }
  };


  const obtenerActividades = async () => {
    try {
      const userRole = localStorage.getItem("userRole") || "guest";
      const response = await axios.get("https://servidor-zonadoce.vercel.app/consultarActividadesId", {
        params: { role: userRole }
      });
      const actividadesFiltradas = await Promise.all(response.data.map(async (actividad) => {
        const existe = await verificarExistencia(actividad.id);
        return { ...actividad, existe };
      }));
      setActividades(actividadesFiltradas.filter(actividad => !actividad.existe));
    } catch (error) {
      console.error("Error al obtener las actividades:", error);
    }
  };
  useEffect(() => {
    obtenerActividades();
  }, []);

  const handleEntregar = (record) => {
    setActividadSeleccionada(record);
    setSubmitType("pdf");
  };

  const handleCloseModal = () => {
    setActividadSeleccionada(null);
    setFileList([]);
    setImageSrc(null);
    stopCamera();
  };

  const handleFileChange = ({ file, fileList }) => {
    if (fileList.length > 1) {
      message.error('Solo se permite subir un archivo.');
      return false;
    }
    setFileList(fileList);
  };

  // Función para iniciar la cámara
  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error("Error al acceder a la cámara: ", err);
      });
  };

  // Función para capturar la foto
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/png");
    setImageSrc(imageDataUrl);
  };

  // Función para convertir la imagen en PDF
  const convertImageToPDF = () => {
    const pdf = new jsPDF();
    pdf.addImage(imageSrc, "PNG", 10, 10, 180, 160);
    return pdf.output("blob"); // Devuelve el PDF como un Blob
  };

  // Función para subir archivo o imagen convertida a PDF a Firebase Storage
  const uploadFileToFirebase = async (file, isPDF = false) => {
    const uniqueFileName = `${uuidv4()}-${isPDF ? 'captured-image.pdf' : file.name}`;
    const storageRef = ref(storage, `agenda/${uniqueFileName}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      message.error('Error al subir el archivo a Firebase.');
      return null;
    }
  };

  const handleSubmit = async () => {
    let file, url;

    if (submitType === "pdf" && fileList.length === 0) {
      message.error('Por favor, selecciona un archivo PDF para subir.');
      return;
    }

    if (submitType === "pdf") {
      file = fileList[0].originFileObj;
      url = await uploadFileToFirebase(file);
    } else if (submitType === "camera" && imageSrc) {
      const pdfBlob = convertImageToPDF();
      url = await uploadFileToFirebase(pdfBlob, true);
    }

    if (!url) return;
    const formData = {
      actividadId: actividadSeleccionada.id,
      pdfUrl: url,
      curp: localStorage.getItem("userCURP") || ""
    };

    try {
      const response = await axios.post("https://servidor-zonadoce.vercel.app/subirPdf", formData);
      if (response.status === 200) {
        message.success('Evidencia subida exitosamente');
        handleCloseModal();
        obtenerActividades();
      } else {
        message.error('Error al subir la evidencia');
      }
    } catch (error) {
      console.error('Error al enviar los datos al servidor:', error);
      message.error('Error al enviar los datos al servidor');
    }
  };

  const verificarExistencia = async (actividadId) => {
    const userCURP = localStorage.getItem("userCURP") || "";
    try {
      const response = await axios.get(`https://servidor-zonadoce.vercel.app/verificarExistencia/${actividadId}`, {
        params: { curp: userCURP }
      });
      return response.data.existe;
    } catch (error) {
      console.error('Error al verificar la existencia:', error);
      return false;
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Título", dataIndex: "titulo", key: "titulo" },
    { title: "Descripción", dataIndex: "descripcion", key: "descripcion" },
    {
      title: "Fecha Solicitada",
      dataIndex: "fecha_sol",
      key: "fecha_sol",
      render: (text) => moment(text).utc().format('LL') // Mantener la fecha en UTC
    },    
    { title: "Hora Solicitada", dataIndex: "hora_sol", key: "hora_sol" },
    {
      title: "Acciones",
      render: (text, record) => (
        <Button onClick={() => handleEntregar(record)} icon={<EditOutlined />}>Entregar</Button>
      )
    }
  ];

  return (
    <>
      <Affix><Header /></Affix>
      <Presentacion
        tit={"Evidencias"}
        icono={<img src={icono} className="lg:w-[280px] lg:translate-x-32 lg:-translate-y-10 text-white celular:translate-x-2 lg:z-50" />}
      />
      <div className="lg:w-10/12 lg:m-auto">
        <ScrollToTop />
        <ConnectionStatus />
        <section className="basis-3/4 mx-5">
          <Titulo tit={"Lista de actividades"} />
          <Button onClick={enviarNotificacion} icon={<UploadOutlined />}>Enviar Notificación</Button>
          <div className="overflow-x-auto">
            <Table bordered columns={columns} dataSource={actividades} className="snap-x" rowKey="id" />
          </div>
        </section>
      </div>
      <ToastContainer /> {/* Componente para mostrar las notificaciones */}
      <Footer />

      <Modal
        title="Detalles de la actividad"
        open={!!actividadSeleccionada}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>Cerrar</Button>,
          <Button key="submit" onClick={handleSubmit}>Entregar</Button>
        ]}
      >
        {actividadSeleccionada && (
          <div style={{ textAlign: 'left', padding: '5px' }}>
            <div><strong>ID:</strong> {actividadSeleccionada.id}</div>
            <div><strong>{actividadSeleccionada.titulo}</strong></div>
            <div><strong>Descripción:</strong> {actividadSeleccionada.descripcion}</div>
            <div><strong>Fecha y hora solicitada:</strong> {moment(actividadSeleccionada.fecha_sol).format('LL')},  {actividadSeleccionada.hora_sol}</div>

            <Radio.Group onChange={(e) => setSubmitType(e.target.value)} value={submitType} style={{ marginBottom: '10px' }}>
              <Radio value="pdf">Subir PDF</Radio>
              <Radio value="camera">Tomar Foto</Radio>
            </Radio.Group>

            {submitType === "pdf" ? (
              <div style={{ marginTop: '20px' }}>
                <Upload
                  accept="application/pdf"
                  listType="text"
                  fileList={fileList}
                  onChange={handleFileChange}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />} disabled={fileList.length >= 1}>Seleccionar PDF</Button>
                </Upload>
              </div>
            ) : (
              <div>
                <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto' }}></video>
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                <Button onClick={startCamera} style={{ marginTop: '10px' }}>Iniciar Cámara</Button>
                <Button onClick={capturePhoto} style={{ marginLeft: '10px' }}>Capturar Foto</Button>
                {imageSrc && <img src={imageSrc} alt="Captura" style={{ marginTop: '10px' }} />}
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
