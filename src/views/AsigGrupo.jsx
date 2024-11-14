import "../css/Login.css";
import "../css/botones.css";
import { DownOutlined } from '@ant-design/icons';
import { Form, Select, Alert, message, Spin, Button, Modal, Row, Col, Card, Pagination } from 'antd';
import { IdcardOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
import { Titulo, Notificacion, Contenido } from "../components/Titulos";
import axios from "axios";
import { CSPMetaTag } from "../components/CSPMetaTag";
import { Login } from "./Login"; 
const { Option } = Select;
const { confirm } = Modal;

export function AsigGrupo() {
    const [loading, setLoading] = useState(true); // Definición del estado loading
    const [registros, setRegistros] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);

    useEffect(() => {
        obtenerRegistros(); // Llama a la función para obtener los registros al montar el componente
    }, []);

    const obtenerRegistros = async () => {
        try {
            const response = await axios.get("https://servidor-zonadoce.vercel.app/docentes_asignacion");
            if (response.data.success) {
                setRegistros(response.data.docentes);
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            console.error("Error al obtener registros:", error);
            message.error("Error al obtener registros");
        } finally {
            setLoading(false); // Establece loading a false después de obtener los registros
        }
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page); // Actualiza la página actual
    };

    // Calcular los registros a mostrar en función de la página actual
    const renderRegistros = registros.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((registro, index) => (
        <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card title={`${registro.nombre} ${registro.aPaterno} ${registro.aMaterno}`}>
                <p><strong>CURP:</strong> {registro.curp}</p>
                <Button type="primary">Asignar grupo y grado</Button>
            </Card>
        </Col>
    ));

    return (
        <>
            <CSPMetaTag />
            <Header />
            <div className="boxAdmin">
                <ScrollToTop />
                <Titulo tit={"Maestros del plantel sin asignación"} /> 

                {loading ? (
                    <Spin size="large" />
                ) : (
                    <Row gutter={[20, 20]}>
                        {renderRegistros}
                    </Row>
                )}
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <Pagination
                        current={currentPage}
                        total={registros.length}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </div>
            </div> 
            <Footer />
        </>
    );
}
