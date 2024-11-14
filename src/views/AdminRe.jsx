import "../css/Login.css";
import React, { useEffect, useState } from "react";
import { Form, Table, Select, message, Spin, Progress, Button, Row, Col, Card, Modal, Pagination, Input } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined, DownOutlined, UserOutlined, UpOutlined } from '@ant-design/icons';
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
import { Subtitulo, Titulo } from "../components/Titulos";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CSPMetaTag } from "../components/CSPMetaTag";

const { Option } = Select;
const { confirm } = Modal;

export function AdminRe() {
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRecords, setExpandedRecords] = useState({});
    const [paginaActual, setPaginaActual] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [busqueda, setBusqueda] = useState("");

    const registrosPorPagina = 9;

    useEffect(() => {
        obtenerRegistros();
    }, [paginaActual, busqueda]);

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleDarBaja = async (record) => {
        confirm({
            title: '¿Estás seguro de dar de baja esta cuenta?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Dar de baja',
            cancelText: 'Cancelar',
            okButtonProps: { style: { color: 'black' } },
            async onOk() {
                try {
                    const respuesta = await axios.get(`https://servidor-zonadoce.vercel.app/registroBaja?curp=${record.curp}`);
                    const datos = respuesta.data;
                    if (datos.success) {
                        const response = await axios.post("https://servidor-zonadoce.vercel.app/borrar_asignacionAdmin", {
                            curp: record.curp
                        });
                        if (response.data.success) {
                            message.success("La cuenta ha sido dada de baja.");
                            obtenerRegistros();
                        } else {
                            message.error("Error al eliminar la asignación del docente.");
                        }
                    } else {
                        message.error("Error al dar de baja la cuenta.");
                    }
                } catch (error) {
                    message.error("Error al dar de baja la cuenta");
                }
            },
            onCancel() {
                console.log('Cancel');
            },
            content: "Recuerda que se borrará la asignación si el usuario es maestro. Asegúrate de asignarle el grupo y grado del usuario a otro maestro después."
        });
    };

    const handleReactivar = async (record) => {
        confirm({
            title: '¿Estás seguro de reactivar esta cuenta?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Reactivar',
            cancelText: 'Cancelar',
            okButtonProps: { style: { color: 'black' } },
            async onOk() {
                try {
                    const respuesta = await axios.get(`https://servidor-zonadoce.vercel.app/registroActivar?curp=${record.curp}`);
                    const datos = respuesta.data;
                    message.success("Cuenta reactivada exitosamente.");
                    obtenerRegistros();
                } catch (error) {
                    message.error("Error al reactivar la cuenta");
                }
            },
            onCancel() {
                console.log('Cancel');
            },
            content: "Recuerda que se debe volver a asignar un grupo y grado si el usuario es un maestro."
        });
    };

    const obtenerRegistros = async () => {
        try {
            const response = await axios.get("https://servidor-zonadoce.vercel.app/registrosB", {
                params: {
                    pagina: paginaActual,
                    registrosPorPagina: registrosPorPagina,
                    busqueda: busqueda // Enviar texto de búsqueda al servidor
                }
            });
            setRegistros(response.data);
            setLoading(false);
        } catch (error) {
            message.error("Error al obtener registros");
        }
    };

    const toggleRecordExpansion = (recordCurp) => {
        setExpandedRecords(prevState => ({
            ...prevState,
            [recordCurp]: !prevState[recordCurp]
        }));
    };

    const handlePaginationChange = (pageNumber) => {
        setPaginaActual(pageNumber);
    };

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    const handleBuscar = () => {
        obtenerRegistros();
    };
    return (
        <>
            <CSPMetaTag />
            <Header />
            <div className="boxAdmin">
                <ScrollToTop />

                <Titulo tit={"Usuarios de la zona 012"} />
                <br />



                <div className="flex justify-center mb-4">
                    <div className="relative w-1/3"> {/* Ajusta el ancho aquí para que sea más pequeño */}
                        <Input
                            className="border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                            type="text"
                            value={busqueda}
                            onChange={handleBusquedaChange}
                            placeholder="Buscar por plantel"
                        />
                        <SearchOutlined className="absolute left-3 top-2.5 text-gray-500" /> {/* Ícono de búsqueda */}
                    </div>
                </div>




                {loading ? (
                    <Spin size="large" />
                ) : (
                    <Row gutter={[20, 20]}>
                        {registros.map((registro, index) => (
                            <Col key={registro.curp} xs={24} sm={12} md={8} lg={8} xl={8}>
                                <Card
                                    title={
                                        <span>
                                            <UserOutlined className="mr-2" /> {/* Ícono de usuario */}
                                            {`${registro.nombre} ${registro.aPaterno} ${registro.aMaterno}`}
                                        </span>
                                    }
                                    extra={
                                        <Button type="text" onClick={() => toggleRecordExpansion(registro.curp)}>
                                            {expandedRecords[registro.curp] ? <UpOutlined /> : <DownOutlined />}
                                        </Button>
                                    }
                                    className="bg-blue-100 shadow-md hover:shadow-lg transition-shadow duration-300"
                                    style={{ marginBottom: 16 }}
                                >
                                    <p><strong>CURP:</strong> {registro.curp}</p>
                                    {expandedRecords[registro.curp] && (
                                        <div className="text-gray-600">
                                            <p>{registro.tipo_sesion} del plantel {registro.nombre_plantel}</p>
                                            <p>{registro.correo}</p>
                                            <p><strong>Registro:</strong> {new Date(registro.fecha_registro).toLocaleString()}</p>
                                            <p><strong>Inicio de sesión:</strong> {new Date(registro.fecha_inicio_sesion).toLocaleString()}</p>
                                            <p><strong>Cuenta:</strong> {registro.estado_cuenta}</p>
                                            <p><strong>Usuario:</strong> {registro.estado_usuario}</p>
                                        </div>
                                    )}
                                    {registro.estado_usuario === 'Baja' ? (
                                        <div className="acciones ant-space">
                                            <Button className="bg-blue_uno text-white" onClick={() => handleReactivar(registro)}>Reactivar</Button>
                                            <Button className="bg-blue_uno text-white" onClick={() => handleDarBaja(registro)} disabled>Dar de baja</Button>
                                        </div>
                                    ) : (
                                        <div className="acciones ant-space">
                                            <Button className="bg-blue_uno text-white" onClick={() => handleDarBaja(registro)}>Dar de baja</Button>
                                        </div>
                                    )}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Pagination
                        total={registros.length}
                        pageSize={registrosPorPagina}
                        current={paginaActual}
                        onChange={handlePaginationChange}
                    />
                </div>
                <br />
            </div>
            <Footer />
           
        </>
    );
}
