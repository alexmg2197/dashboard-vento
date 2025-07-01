import {React,useState} from 'react';
import Fondo from '../assets/fondo-vento.webp'
import Logo from '../assets/ventologoN.svg'
import LogoS from '../assets/logo-vento.png'
// import LogoS from '../assets/vento-logo.png'
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import { useUser } from '../context/UserContext'

const Login = ({setIsAuthenticated}) => {

    const [loading, setLoading] = useState(false);

      const navigate = useNavigate();
      const { setUserData } = useUser()

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage:`url(${Fondo})` }}>
        <div className="flex justify-center items-center h-full w-full">
            <div className="grid gap-8">
                <section id="back-div" className="bg-gradient-to-r from-blue-900 to-blue-500 rounded-3xl">
                <div className="border-8 border-transparent rounded-xl bg-white dark:bg-gray-900 shadow-xl p-8 m-2">
                    <div className="text-center">
                        <img alt="Vento" src={Logo} className="mx-auto h-12 w-auto" />
                        <h1 className="text-3xl font-bold text-center cursor-default dark:text-gray-300 text-gray-900 pt-5">
                        Iniciar Sesión
                        </h1>
                    </div>
                    <Formik
                        initialValues={{ usuario: '', pass: '' }}
                        validate={values => {
                            const errors = {};

                            if (!values.usuario) {
                            errors.usuario = 'El correo o usuario es requerido';
                            } 

                            if (!values.pass) {
                            errors.pass = 'La contraseña es requerida';
                            }
                            return errors
                        }}
                        onSubmit={async(values, { setSubmitting,resetForm, setErrors }) => {
                            setLoading(true);
                            setSubmitting(true);
                            setErrors({}); // limpia errores previos

                            const { data, error } = await supabase.auth.signInWithPassword({
                                email: values.usuario,  // aquí asumo que usuario es email
                                password: values.pass,
                            });

                            setLoading(false);
                            setSubmitting(false);

                            if (error) {
                                // Puedes mostrar el error en el campo password o general
                                setErrors({ pass: error.message });
                            } else {
                                // Login exitoso
                                // 1. Obtener el token
                                const { data: { session } } = await supabase.auth.getSession();
                                const token = session?.access_token;

                                // 2. (Opcional) Guardarlo en localStorage si lo necesitas más tarde
                                localStorage.setItem("token", token);
                                localStorage.setItem("user", JSON.stringify(data.user));
                                setIsAuthenticated(true);
                                resetForm();
                                const { data: { user }, error: userError } = await supabase.auth.getUser()

                                if (user) {
                                const { data: userInfo, error: userInfoError } = await supabase
                                    .from("Usuarios")
                                    .select(`*,
                                    C_Turno(Turno),
                                    C_Linea(linea),
                                    C_Puesto(puesto),
                                    C_Rol(rol)`)
                                    .eq("auth_user_id", user.id)
                                    .single()

                                if (userInfoError) {
                                    console.error("Error al obtener info del usuario:", userInfoError)
                                } else {
                                    setUserData(userInfo, token)
                                    localStorage.setItem("userData", JSON.stringify({ ...userInfo, token }));
                                }
                                }
                                navigate('/Inicio'); // o a donde quieras redirigir
                            }
                        }}
                        >
                        {({ values, handleChange, handleSubmit,errors, touched  }) => (
                        <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="usuario" className="block mb-2 text-lg dark:text-gray-300">Email</label>
                            <input id="usuario" className={`border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 ${errors.usuario && touched.usuario ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 '} rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300`} type="text" placeholder="Email" value={values.usuario} onChange={handleChange} />
                            {errors.usuario && touched.usuario && <div className="text-red-500">{errors.usuario}</div>}
                        </div>
                        <div>
                            <label htmlFor="pass" className="block mb-2 text-lg dark:text-gray-300">Password</label>
                            <input id="pass" className={`border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 ${errors.pass && touched.pass ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 '} rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300`} type="password" placeholder="Password" value={values.pass} onChange={handleChange} />
                            {errors.pass && touched.pass && <div className="text-red-500">{errors.pass}</div>}
                        </div>
                        <a href="#" className="text-blue-400 text-sm transition hover:underline">Forget your password?</a>
                        <button className="w-full p-3 mt-4 text-white bg-gradient-to-r from-blue-900 to-blue-500 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500" type="submit">
                            LOG IN
                        </button>
                        </form>
                    )}
                    </Formik>
                </div>
                </section>
            </div>
        </div>
        {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <div className="flex flex-col gap-4 w-full items-center justify-center">
    
    {/* Contenedor giratorio con posición relativa */}
    <div className="relative w-28 h-28">
      {/* Círculo giratorio */}
      <div className="w-full h-full border-8 border-gray-300 border-t-blue-900 rounded-full animate-spin" />
      
      {/* Imagen centrada y fija */}
      <img
        src={LogoS}
        alt="Logo"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-23"
      />
    </div>

  </div>
</div>

      )}
    </div>
  );
}

export default Login;
