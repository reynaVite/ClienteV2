import "../css/Login.css";
import "../css/botones.css";
import { DownOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Form, Select, message, Spin, Button, Modal, Row, Col, Card, Pagination } from 'antd';
import { IdcardOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
import { Titulo, Notificacion, Contenido } from "../components/Titulos";
import axios from "axios";
import { CSPMetaTag } from "../components/CSPMetaTag";

const { Option } = Select;

export function Asignados() {
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paginaActual, setPaginaActual] = useState(1); // Estado para la página actual
    const registrosPorPagina = 9; // Número de registros por página
    const [modalVisible, setModalVisible] = useState(false); // Estado del modal
    const [borrarModalVisible, setBorrarModalVisible] = useState(false); // Estado para el modal de borrar
    const [selectedUser, setSelectedUser] = useState(null); // Usuario seleccionado
    const [gradoOptions, setGradoOptions] = useState([]); // Opciones de grado
    const [grupoOptions, setGrupoOptions] = useState([]); // Opciones de grupo

    useEffect(() => {
        obtenerRegistros();
        obtenerGrado();
        obtenerGrupo();
    }, []);

    const obtenerRegistros = async () => {
        const userPlantel = localStorage.getItem("userPlantel") || "";
        try {
            const response = await axios.get("https://servidor-zonadoce.vercel.app/asignaciong", {
                params: {
                    plantel: userPlantel
                }
            });
            console.log("Respuesta del servidor:", response);
            if (response.data.success) {
                setRegistros(response.data.docentes);
                setLoading(false);
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            console.error("Error al obtener registros:", error);
            message.error("Error al obtener registros");
        }
    };

    // Separar los registros en dos listas
    const docentesSinAsignacion = registros.filter(docente => !docente.grado_id && !docente.grupo_id);
    const docentesConAsignacion = registros.filter(docente => docente.grado_id && docente.grupo_id);

    const handlePaginationChange = (pageNumber) => {
        setPaginaActual(pageNumber);
    };

    // Calcular índices para mostrar los registros de acuerdo a la página actual
    const indiceInicial = (paginaActual - 1) * registrosPorPagina;
    const indiceFinal = paginaActual * registrosPorPagina;

    // Función para abrir el modal de asignación
    const handleAsignar = (registro) => {
        setSelectedUser(registro);
        setModalVisible(true);
    };

    // Función para abrir el modal de actualización
    const handleActualizar = (registro) => {
        setSelectedUser(registro);
        setModalVisible(true);
    };

    // Función para cerrar el modal
    const handleCancel = () => {
        setModalVisible(false);
    };

    const actualizarFormSubmit = async (values) => {
        try {
            const response = await axios.post("https://servidor-zonadoce.vercel.app/actualizar_asignacion", {
                docenteId: selectedUser.asignacion_id, // Usar CURP del docente seleccionado
                grupo: values.grupo,
                grado: values.grado
            });
            if (response.data.success) {
                message.success("Asignación actualizada correctamente.");
                obtenerRegistros(); // Refrescar registros
                setModalVisible(false); // Cerrar el modal
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            console.error("Error al actualizar la asignación:", error);
            message.error("Error al actualizar la asignación");
        }
    };

    // Función para obtener grados
    const obtenerGrado = async () => {
        try {
            const response = await axios.get("https://servidor-zonadoce.vercel.app/grado");
            setGradoOptions(response.data); // Asignar opciones de grado
        } catch (error) {
            console.error("Error al obtener valores de grados:", error);
        }
    };

    // Función para obtener grupos
    const obtenerGrupo = async () => {
        try {
            const response = await axios.get("https://servidor-zonadoce.vercel.app/grupo");
            setGrupoOptions(response.data); // Asignar opciones de grupo
        } catch (error) {
            console.error("Error al obtener valores de grupos:", error);
        }
    };

    return (
        <>
            <CSPMetaTag />
            <Header />
            <div className="boxAdmin">
                <ScrollToTop />
                <Titulo tit={"Docentes sin asignación"} />
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <Row gutter={[20, 20]}>
                        {docentesSinAsignacion.slice(indiceInicial, indiceFinal).map((registro, index) => (
                            <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
                                <Card title={`${registro.nombre} ${registro.aPaterno} ${registro.aMaterno}`}>
                                    <p><strong>CURP:</strong> {registro.curp}</p>
                                    <Button type="primary" onClick={() => handleAsignar(registro)}>Asignar grupo y grado</Button>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
                {/* Paginación */}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Pagination
                        total={docentesSinAsignacion.length}
                        pageSize={registrosPorPagina}
                        current={paginaActual}
                        onChange={handlePaginationChange}
                    />
                </div>

                <br />

                <Titulo tit={"Docentes con asignación"} />
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <Row gutter={[20, 20]}>
                        {docentesConAsignacion.map((registro, index) => (
                            <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
                                <Card title={`${registro.nombre} ${registro.aPaterno} ${registro.aMaterno}`}>
                                    <p><strong>CURP:</strong> {registro.curp}</p>
                                    <p><strong>Grado:</strong> {registro.grado_id}</p>
                                    <p><strong>Grupo:</strong> {registro.grupo_id}</p>
                                    <Button type="primary" onClick={() => handleActualizar(registro)}>Actualizar asignación</Button>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>

            {/* Modal para asignar grupo y grado */}
            <Modal
                title="Asignar grupo y grado"
                visible={modalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <p>Docente: {selectedUser && `${selectedUser.nombre} ${selectedUser.aPaterno}`}</p>
                <Form onFinish={actualizarFormSubmit}>
                    <Form.Item
                        name="grupo"
                        rules={[{ required: true, message: 'Seleccione un grupo' }]}
                    >
                        <Select placeholder="Seleccione un grupo" suffixIcon={<IdcardOutlined />}>
                            {grupoOptions.map((option) => (
                                <Option key={option.value} value={option.value}>{option.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="grado"
                        rules={[{ required: true, message: 'Seleccione un grado' }]}
                    >
                        <Select placeholder="Seleccione un grado" suffixIcon={<IdcardOutlined />}>
                            {gradoOptions.map((option) => (
                                <Option key={option.value} value={option.value}>{option.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Asignar</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Footer />
        </>
    );
}
