import "../css/Login.css";
import { Link } from 'react-router-dom';
import { Form, Input, Button, Select, message, Checkbox, Progress } from 'antd';
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
import { UserOutlined, LockOutlined, CheckCircleOutlined, IdcardOutlined } from "@ant-design/icons";
import { Subtitulo, Notificacion, Contenido } from "../components/Titulos";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CSPMetaTag } from "../components/CSPMetaTag";

const { Option } = Select;

export function RegistroF() {
  const [preguntasSecretasOptions, setPreguntasSecretasOptions] = useState([]);
  const [contrasenaFortaleza, setContrasenaFortaleza] = useState(0);
  const [checked, setChecked] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [curp, setCurp] = useState(""); // Estado para almacenar la CURP
  const [showFirstForm, setShowFirstForm] = useState(true);
  const [showSecondForm, setShowSecondForm] = useState(false);
  const hasMinimumLength = (value) => value.length <= 12;
  const hasUpperCase = (value) => /[A-Z]/.test(value);
  const hasLowerCase = (value) => /[a-z]/.test(value);
  const hasNumber = (value) => /\d/.test(value);
  const hasSpecialChar = (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value);

  const handleFormValuesChange = (changedValues, allValues) => {
    setFormValues(allValues);
  };

  const handleFormValuesChange1 = (changedValues, allValues) => {
    setFormValues(allValues);
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (!password) {
      setContrasenaFortaleza({
        score: 0,
        nivelSeguridad: "Baja",
        color: "red"
      });
      return;
    }

    const specialChars = /[!@#$%^&*(),.?":{}|<>]/g;
    const specialCharsCount = (password.match(specialChars) || []).length;
    score += specialCharsCount > 3 ? 3 : specialCharsCount;

    const numbers = /\d/g;
    const numbersCount = (password.match(numbers) || []).length;
    score += numbersCount > 3 ? 3 : numbersCount;

    const upperCaseLetters = /[A-Z]/g;
    const upperCaseCount = (password.match(upperCaseLetters) || []).length;
    score += upperCaseCount > 3 ? 3 : upperCaseCount;

    const lowerCaseLetters = /[a-z]/g;
    const lowerCaseCount = (password.match(lowerCaseLetters) || []).length;
    score += lowerCaseCount > 3 ? 3 : lowerCaseCount;

    let nivelSeguridad = "Baja";
    let color = "red";
    let progressPercentage = 25;
    if (score >= 6) {
      nivelSeguridad = "Medio";
      color = "orange";
      progressPercentage = 50;
    }
    if (score >= 9) {
      nivelSeguridad = "Alto";
      color = "green";
      progressPercentage = 100;
    }

    setContrasenaFortaleza({
      score: progressPercentage,
      nivelSeguridad,
      color
    });
  };

  const getPasswordStrengthText = (nivelSeguridad) => {
    switch (nivelSeguridad) {
      case "Baja":
        return "La fortaleza de la contraseña es baja. Te recomendamos mejorarla.";
      case "Medio":
        return "La fortaleza de la contraseña es media. ¡Sigue mejorando!";
      case "Alto":
        return "La fortaleza de la contraseña es alta. ¡Excelente elección!";
      default:
        return "";
    }
  };

  const mensaje = getPasswordStrengthText(contrasenaFortaleza.nivelSeguridad); // Llamada a la función para obtener el mensaje
  const handleTermsChange = (e) => {
    setChecked(e.target.checked);
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    calculatePasswordStrength(password);
  };

  const obtenerValoresPreguntasSecretas = async () => {
    try {
      const response = await axios.get(
        "https://servidor-zonadoce.vercel.app/preguntas-secretas"
      );
      setPreguntasSecretasOptions(response.data);
    } catch (error) {
      console.error("Error al obtener valores de preguntas secretas:", error);
    }
  };

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordsMatchMessage, setPasswordsMatchMessage] = useState("");

  useEffect(() => {
    obtenerValoresPreguntasSecretas();
  }, []);


  const onFinish = async (values) => {
    try {
      const dataToInsert = {
        curp: values.curp,
      };

      const response = await axios.post('https://servidor-zonadoce.vercel.app/verificar-curp-contra', { curp: values.curp });

      if (response.data.exists) {
        if (response.data.emptyPassword) {
          setCurp(values.curp); // Almacena la CURP en el estado
          setShowFirstForm(false); // Ocultar el primer formulario
          setShowSecondForm(true);
          message.success('El proceso de pre-registro continúa.');
        } else {
          message.info('Su registro ya está completo. Por favor, inicie sesión para acceder a su cuenta existente.');

        }
      } else {
        message.error('CURP no pre-registrada o no aprobada por el supervisor.');
      }
    } catch (error) {
      console.error('Error al insertar datos en la base de datos:', error);
      message.error('Error al mandar la solicitud. Por favor, inténtalo de nuevo.');
    }
  };
  const [showForm, setShowForm] = useState(false);


  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error(
      <Contenido conTit={"Por favor, completa todos los campos."} />
    );
  };


  const onFinish1 = async (values) => {
    try {
      const dataToInsert = {
        pregunta: values.pregunta,
        respuesta: values.respuesta,
        contrasena: values.contrasena,
        curp: curp, // Utiliza la CURP almacenada en el estado como ID
      };

      const response = await axios.post('https://servidor-zonadoce.vercel.app/insertar-dato2', dataToInsert);
      message.success('Registro exitoso');
      navigate('/Login');

    } catch (error) {
      console.error('Error al insertar datos en la base de datos:', error);
      message.error('Error al realizar el registro. Por favor, inténtalo de nuevo.');
    }
  };

  const onFinishFailed1 = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error(
      <Contenido conTit={"Por favor, completa todos los campos."} />
    );
  };

  return (
    <>
      <CSPMetaTag />
      <Header />
      <div className="lg:w-5/12 lg:m-auto p-6">
        <ScrollToTop />
        <h2 className="text-3xl font-bold text-center mb-6">Registro</h2>

        {showFirstForm && (
          <Form
            name="loginForm"
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onValuesChange={handleFormValuesChange}
          >
            <Contenido conTit={"CURP:"} />
            <Form.Item
              name="curp"
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value || typeof value !== "string") {
                      throw new Error("Por favor, ingrese su CURP");
                    }
                    const trimmedValue = value.trim();
                    if (/[a-z]/.test(trimmedValue)) {
                      throw new Error("La CURP solo debe contener mayúsculas");
                    }
                    const uppercasedValue = trimmedValue.toUpperCase();
                    const pattern = /^[A-Z]{4}\d{6}[HM]{1}[A-Z\d]{5}[0-9A-Z]{2}$/;
                    if (uppercasedValue.length !== 18) {
                      throw new Error("La CURP debe tener 18 letras mayúsculas/números)");
                    }
                    if (!pattern.test(uppercasedValue)) {
                      throw new Error("La CURP no es válida");
                    }
                    if (value !== trimmedValue) {
                      throw new Error("La CURP no debe contener espacios al inicio, en medio o al final");
                    }
                  },
                },
              ]}
            >
              <Input
                className="h-[42px] text-base border border-black border-opacity-30 rounded-md shadow-md"
                prefix={<CheckCircleOutlined />}
                placeholder="Ejemplo: MAPA850210MVERXXA1"
              />
            </Form.Item>
            <Form.Item>
              <Button
                className="bg-blue_uno text-white h-11 text-lg w-full
                  hover:text-gray hover:bg-white
                  shadow-md"
                type="primary"
                htmlType="submit"
                disabled={!formValues.curp}
              >
                Continuar
              </Button>
            </Form.Item>
          </Form>
        )}

        {showSecondForm && (
          <Form
            name="loginForm"
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish1}
            onFinishFailed={onFinishFailed1}
            onValuesChange={handleFormValuesChange1}
          >
            <Contenido conTit={"Pregunta secreta:"} />
            <Form.Item
              name="pregunta"
              rules={[
                {
                  required: true,
                  message: (
                    <Notificacion
                      noti={"Seleccione la pregunta secreta para el personal"}
                    />
                  ),
                },
              ]}
            >
              <Select
                placeholder="Ejemplo: ¿En qué escuela primaria...."
                className="h-[42px] text-base border border-black border-opacity-30 rounded-md shadow-md"
                suffixIcon={<IdcardOutlined />}
              >
                {preguntasSecretasOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Contenido conTit={"Respuesta a la pregunta secreta:"} />
            <Form.Item
              name="respuesta"
              rules={[
                {
                  required: true,
                  message: <Notificacion noti={"Ingrese la respuesta a la pregunta"} />,
                },
                {
                  pattern: /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ0-9\s]{3,30}$/,
                  message: "Solo letras, números, longitud entre 3 y 30.",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                className="h-[42px] text-base border border-black border-opacity-30 rounded-md shadow-md"
                placeholder="Ejemplo: Primaria 12..."
              />
            </Form.Item>


            <Contenido conTit={"Contraseña:"} />
            <Form.Item
              name="contra"
              rules={[
                {
                  required: true,
                  message: <Notificacion noti={"Ingrese la contraseña para el personal"} />,
                },
                {
                  validator: async (_, value) => {
                    // Validaciones de contraseña aquí...
                  },
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                className="h-[42px] text-base border border-black border-opacity-30 rounded-md shadow-md"
                placeholder="Ejemplo: Ejemplo00#"
                onChange={handlePasswordChange}
              />
            </Form.Item>
            {mensaje && <div>{mensaje}</div>}
            <Progress percent={contrasenaFortaleza.score} status="active" strokeColor={contrasenaFortaleza.color} />

            <Contenido conTit={"Repite la contraseña:"} />
            <Form.Item
              name="contrasena"
              dependencies={["contra"]}
              rules={[
                {
                  required: true,
                  message: "Confirma la contraseña.",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("contra") === value) {
                      setPasswordMatch(true);
                      return Promise.resolve();
                    }
                    setPasswordMatch(false);
                    return Promise.reject("Las contraseñas no coinciden.");
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                className="h-[42px] text-base border border-black border-opacity-30 rounded-md shadow-md"
                placeholder="Ejemplo: Ejemplo00#"
              />
            </Form.Item>

            <Form.Item
              name="terms"
              valuePropName="checked"
              rules={[
                { validator: (_, value) => value ? Promise.resolve() : Promise.reject('Debe aceptar los términos y condiciones') }
              ]}
            >
              <Checkbox checked={checked} onChange={handleTermsChange} style={{ marginRight: '5px' }}>
                <Link to="/Terminos" target="_blank">
                  <Contenido conTit={"Acepto los términos y condiciones"} />
                </Link>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button className="bg-blue_uno text-white h-11 text-lg w-full
                  hover:text-gray hover:bg-white
                  shadow-md" type="primary" htmlType="submit" disabled={!checked || !formValues.pregunta || !formValues.respuesta || !formValues.contra || !formValues.terms}>
                Registrar
              </Button>
            </Form.Item>

            <Form.Item>
              <Button type="primary" className="bg-blue_uno text-white h-11 text-lg w-full
                  hover:text-gray hover:bg-white
                  shadow-md" onClick={() => {
                setShowFirstForm(true);
                setShowSecondForm(false);
              }}>
                Ir atrás
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
      <Footer />
    </>
  );
}