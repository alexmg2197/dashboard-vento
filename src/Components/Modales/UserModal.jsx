import {Input, Button, Dialog,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { Formik } from "formik";
import { supabase } from '../../../supabaseClient'
import LogoS from '../../assets/logo-vento.png'

const UserModal = ({modal, usuario, isEdit}) =>{

    // const [value, setValue] = useState("");
    const [turno, setTurno] = useState([])
    const [linea, setLinea] = useState([])
    const [puesto, setPuesto] = useState([])
    const [rol, setRol] = useState([])
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
            const [turnoRes, lineaRes, puestoRes, rolRes] = await Promise.all([
            supabase.from('C_Turno').select('*'),
            supabase.from('C_Linea').select('*'),
            supabase.from('C_Puesto').select('*'),
            supabase.from('C_Rol').select('*'),
            ])

            if (turnoRes.error) throw turnoRes.error
            if (lineaRes.error) throw lineaRes.error
            if (puestoRes.error) throw puestoRes.error
            if (rolRes.error) throw rolRes.error

            setTurno(turnoRes.data)
            setLinea(lineaRes.data)
            setPuesto(puestoRes.data)
            setRol(rolRes.data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
        }
        fetchData()
    }, [])

    const handleOpen = () =>{
        modal(false)
    }
    
    return(
        <>
            <Button onClick={handleOpen} variant="gradient" className="fixed inset-0 bg-black opacity-60 z-40">
            </Button>
            <div className="fixed inset-0 z-50 flex justify-center items-center overflow-y-auto">
                <div className="relative p-4 w-full max-w-3xl max-h-full">
                    <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                        {/* Header */}
                        <div className=" bg-twoo flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600 border-gray-200">
                            <h3 className="text-lg font-semibold text-black">
                                {isEdit ? 'Editar Usuario' : 'Crear Usuario'}
                            </h3>
                            <button
                                onClick={handleOpen}
                                className="text-gray-400 bg-transparent hover:bg-five hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                                >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <Formik
                            initialValues={{
                                id: isEdit ? usuario.id_usuario : '',
                                nombre: isEdit ? usuario.nombre : '',
                                apellido: isEdit ? usuario.apellidos : '',
                                correo: isEdit ? usuario.email : '',
                                pass: isEdit ? usuario.contraseña : '',
                                turno: isEdit ? usuario.turno_id : '',
                                linea: isEdit ? usuario.linea_id : '',
                                puesto: isEdit ? usuario.puesto_id : '',
                                rol: isEdit ? usuario.rol_id : '',
                            }}
                            validate={values =>{
                                const errors={};
                                const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                    if(!values.nombre){
                                        errors.nombre = 'Nombre es requerido'
                                    }
                                    if(!values.apellido){
                                        errors.apellido = 'Apellido es requerido'
                                    }
                                    if(!values.correo && !isEdit){
                                        errors.correo = 'Correo es requerido'
                                    }else if (!correoRegex.test(values.correo) && !isEdit) {
                                        errors.correo = 'Correo no válido'
                                    }
                                    if(!values.pass && !isEdit){
                                        errors.pass = 'Contraseña es requerida'
                                    }
                                    if(!values.turno){
                                        errors.turno = 'Turno es requerido'
                                    }
                                return errors;
                            }}
                            onSubmit={async (values, { setSubmitting, resetForm }) => {
                                if(!isEdit){
                                    setLoading(true);
                                    try {
                                        // 1. Crear usuario en Auth
                                        const { data, error } = await supabase.auth.signUp({
                                        email: values.correo,
                                        password: values.pass,
                                        });

                                        if (error) throw error;
    
                                        // 2. Insertar en tabla Usuarios
                                        const { error: insertError } = await supabase
                                        .from("Usuarios")
                                        .insert([
                                            {
                                            auth_user_id: data.user.id,
                                            nombre: values.nombre,
                                            apellidos: values.apellido,
                                            email: values.correo,
                                            linea_id: values.linea,
                                            turno_id: values.turno,
                                            puesto_id: values.puesto,
                                            rol_id: values.rol,
                                            },
                                        ]);
    
                                        if (insertError) {
                                        // 3. Si falla inserción, eliminar usuario de Auth para revertir
                                        await supabase.auth.admin.deleteUser(data.user.id); // Ojo: este método solo en backend con service_role key
                                        throw insertError;
                                        }
    
                                        alert("Usuario registrado con éxito");
                                        resetForm();
                                    } catch (err) {
                                        console.error("Error:", err.message);
                                        alert("Error: " + err.message);
                                    } finally {
                                        setSubmitting(false);
                                        setLoading(false);
                                        window.location.reload();
                                        handleOpen();
                                    }  
                                } else{
                                    setLoading(true);
                                    try {

                                        // 2. Actualizar en la tabla Usuarios
                                        const { error: updateError } = await supabase
                                            .from("Usuarios")
                                            .update({
                                            nombre: values.nombre,
                                            apellidos: values.apellido,
                                            email: values.correo,
                                            linea_id: values.linea,
                                            turno_id: values.turno,
                                            puesto_id: values.puesto,
                                            rol_id: values.rol,
                                            })
                                            .eq("id_usuario", values.id) // Asegúrate que auth_user_id esté bien guardado

                                        if (updateError) throw updateError
                                        // Puedes mostrar un mensaje, redirigir, cerrar modal, etc.
                                    } catch (error) {
                                        console.error("Error al actualizar usuario:", error.message || error)
                                        // Puedes mostrar un Swal, toast o error visual
                                    } finally {
                                        setSubmitting(false);
                                        setLoading(false);
                                        window.location.reload();
                                        handleOpen();
                                    } 

                                }
                            }}
                            >
                                {
                                ({
                                    values, errors, handleChange, handleSubmit, touched
                                }) => (
                                <form onSubmit={handleSubmit}>
                                    <DialogBody className="space-y-4 pb-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <div className="relative w-full group">
                                                    <span className={`absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b  ${errors.nombre && touched.nombre ? 'from-red-700 to-red-400' : 'from-blue-500 to-cyan-500'} opacity-70 transition-all duration-300 group-focus-within:opacity-100`} />
                                                    <input type="text" id="nombre" value={values.nombre} onChange={handleChange} placeholder=" "
                                                        className={`peer w-full pl-6 pr-4 pt-6 pb-2 text-sm text-gray-800 bg-white border rounded-lg shadow-md focus:outline-none transition-all duration-300 placeholder-transparent
                                                        ${(values.nombre !== '' ? 'border-blue-500 ring-2 ring-indigo-300' : 'border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-transparent') +
                                                            (errors.nombre && touched.nombre ? ' border-red-500 ring-2 ring-red-300' : '') 
                                                        } 
                                                        `}
                                                    />
                                                    <label htmlFor="nombre"
                                                        className={`absolute left-6 transition-all duration-200 ease-in-out cursor-text
                                                        ${(values.nombre !== ''
                                                            ? 'top-1 text-sm text-blue-500 font-semibold'
                                                            : 'top-3.5 text-base text-gray-500') + (errors.nombre && touched.nombre ? ' text-red-500' : '') 
                                                        }
                                                        peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:font-semibold
                                                        `}
                                                    >
                                                        Nombre
                                                    </label>
                                                </div>
                                                    {errors.nombre && touched.nombre && <div className="text-red-500">{errors.nombre}</div>}
                                            </div>
                                            <div>
                                                <div className="relative w-full group">
                                                    <span className={`absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b  ${errors.apellido && touched.apellido ? 'from-red-700 to-red-400' : 'from-blue-500 to-cyan-500'} opacity-70 transition-all duration-300 group-focus-within:opacity-100`} />
                                                    <input type="text" id="apellido" value={values.apellido} onChange={handleChange} placeholder=" "
                                                        className={`peer w-full pl-6 pr-4 pt-6 pb-2 text-sm text-gray-800 bg-white border rounded-lg shadow-md focus:outline-none transition-all duration-300 placeholder-transparent
                                                        ${(values.apellido !== '' ? 'border-blue-500 ring-2 ring-indigo-300' : 'border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-transparent') +
                                                            (errors.apellido && touched.apellido ? ' border-red-500 ring-2 ring-red-300' : '') 
                                                        } 
                                                        `}
                                                    />
                                                    <label htmlFor="apellido"
                                                        className={`absolute left-6 transition-all duration-200 ease-in-out cursor-text
                                                        ${(values.apellido !== ''
                                                            ? 'top-1 text-sm text-blue-500 font-semibold'
                                                            : 'top-3.5 text-base text-gray-500') + (errors.apellido && touched.apellido ? ' text-red-500' : '') 
                                                        }
                                                        peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:font-semibold
                                                        `}
                                                    >
                                                        Apellido
                                                    </label>
                                                </div>
                                                    {errors.apellido && touched.apellido && <div className="text-red-500">{errors.apellido}</div>}
                                            </div>
                                        </div>
                                            {
                                                !isEdit && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <div className="relative w-full group">
                                                    <span className={`absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b  ${errors.correo && touched.correo ? 'from-red-700 to-red-400' : 'from-blue-500 to-cyan-500'} opacity-70 transition-all duration-300 group-focus-within:opacity-100`} />
                                                    <input type="email" id="correo" value={values.correo} onChange={handleChange} placeholder=" "
                                                        className={`peer w-full pl-6 pr-4 pt-6 pb-2 text-sm text-gray-800 bg-white border rounded-lg shadow-md focus:outline-none transition-all duration-300 placeholder-transparent
                                                        ${(values.correo !== '' ? 'border-blue-500 ring-2 ring-indigo-300' : 'border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-transparent') +
                                                            (errors.correo && touched.correo ? ' border-red-500 ring-2 ring-red-300' : '') 
                                                        } 
                                                        `}
                                                    />
                                                    <label htmlFor="correo"
                                                        className={`absolute left-6 transition-all duration-200 ease-in-out cursor-text
                                                        ${(values.correo !== ''
                                                            ? 'top-1 text-sm text-blue-500 font-semibold'
                                                            : 'top-3.5 text-base text-gray-500') + (errors.correo && touched.correo ? ' text-red-500' : '') 
                                                        }
                                                        peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:font-semibold
                                                        `}
                                                    >
                                                        Correo
                                                    </label>
                                                </div>
                                                    {errors.correo && touched.correo && <div className="text-red-500">{errors.correo}</div>}
                                            </div>
                                                    <div>
                                                        <div className="relative w-full group">
                                                            <span className={`absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b  ${errors.pass && touched.pass ? 'from-red-700 to-red-400' : 'from-blue-500 to-cyan-500'} opacity-70 transition-all duration-300 group-focus-within:opacity-100`} />
                                                            <input type={showPassword ? "text" : "password"} id="pass" value={values.pass} onChange={handleChange} placeholder=" "
                                                                className={`peer w-full pl-6 pr-4 pt-6 pb-2 text-sm text-gray-800 bg-white border rounded-lg shadow-md focus:outline-none transition-all duration-300 placeholder-transparent
                                                                ${(values.pass !== '' ? 'border-blue-500 ring-2 ring-indigo-300' : 'border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-transparent') +
                                                                    (errors.pass && touched.pass ? ' border-red-500 ring-2 ring-red-300' : '') 
                                                                } 
                                                                `}
                                                            />
                                                            <label htmlFor="pass"
                                                                className={`absolute left-6 transition-all duration-200 ease-in-out cursor-text
                                                                ${(values.pass !== ''
                                                                    ? 'top-1 text-sm text-blue-500 font-semibold'
                                                                    : 'top-3.5 text-base text-gray-500') + (errors.pass && touched.pass ? ' text-red-500' : '') 
                                                                }
                                                                peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:font-semibold
                                                                `}
                                                            >
                                                                Contraseña
                                                            </label>
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                            >
                                                                {showPassword ? (
                                                                // Ícono ojo tachado
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7"/></svg>
                                                                ) : (
                                                                // Ícono ojo normal
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                                                                    <path
                                                                    fill="currentColor"
                                                                    d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7s12-7 12-7s-4.367-7-12-7zm0 12a5 5 0 1 1 0-10a5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6a3 3 0 0 0 0 6z"
                                                                    />
                                                                </svg>
                                                                )}
                                                            </button>
                                                        </div>
                                                            {errors.pass && touched.pass && <div className="text-red-500">{errors.pass}</div>}
                                                    </div>
                                        </div>
                                                )
                                            }
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <div className="relative w-full group">
                                                    <span
                                                        className={`absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b ${
                                                        errors.turno && touched.turno ? 'from-red-700 to-red-400' : 'from-blue-500 to-cyan-500'
                                                        } opacity-70 transition-all duration-300 group-focus-within:opacity-100`}
                                                    />

                                                    <select
                                                        id="turno"
                                                        name="turno"
                                                        value={values.turno}
                                                        onChange={handleChange}
                                                        className={`peer w-full pl-6 pr-4 pt-6 pb-2 text-sm text-gray-800 bg-white border rounded-lg shadow-md appearance-none focus:outline-none transition-all duration-300
                                                        ${
                                                            values.turno !== ''
                                                            ? 'border-blue-500 ring-2 ring-indigo-300'
                                                            : 'border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-transparent'
                                                        }
                                                        ${errors.turno && touched.turno ? ' border-red-500 ring-2 ring-red-300' : ''}
                                                        `}
                                                    >
                                                        <option value="" disabled></option>
                                                        {
                                                        turno.map((tur) => {
                                                            return(
                                                                <option key={tur.id_turno} value={tur.id_turno}>{tur.Turno}</option>
                                                            )
                                                        }
                                                        )
                                                    }
                                                    </select>

                                                    <label
                                                        htmlFor="turno"
                                                        className={`absolute left-6 transition-all duration-200 ease-in-out cursor-text
                                                        ${
                                                            values.turno !== ''
                                                            ? 'top-1 text-sm text-blue-500 font-semibold'
                                                            : 'top-3.5 text-base text-gray-500'
                                                        }
                                                        ${errors.turno && touched.turno ? ' text-red-500' : ''}
                                                        peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:font-semibold
                                                        `}
                                                    >
                                                        Turno
                                                    </label>
                                                </div>
                                                {errors.turno && touched.turno && (
                                                <div className="text-red-500 mt-1 text-sm">{errors.turno}</div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="relative w-full group">
                                                    <span
                                                        className={`absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b ${
                                                        errors.linea && touched.linea ? 'from-red-700 to-red-400' : 'from-blue-500 to-cyan-500'
                                                        } opacity-70 transition-all duration-300 group-focus-within:opacity-100`}
                                                    />

                                                    <select
                                                        id="linea"
                                                        name="linea"
                                                        value={values.linea}
                                                        onChange={handleChange}
                                                        className={`peer w-full pl-6 pr-4 pt-6 pb-2 text-sm text-gray-800 bg-white border rounded-lg shadow-md appearance-none focus:outline-none transition-all duration-300
                                                        ${
                                                            values.linea !== ''
                                                            ? 'border-blue-500 ring-2 ring-indigo-300'
                                                            : 'border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-transparent'
                                                        }
                                                        ${errors.linea && touched.linea ? ' border-red-500 ring-2 ring-red-300' : ''}
                                                        `}
                                                    >
                                                        <option value="" disabled></option>
                                                        {
                                                            linea.map((lin) =>{
                                                                return(
                                                                    <option key={lin.id_linea} value={lin.id_linea}>{lin.linea}</option>
                                                                )
                                                            }
                                                            )
                                                        }
                                                    </select>

                                                    <label
                                                        htmlFor="linea"
                                                        className={`absolute left-6 transition-all duration-200 ease-in-out cursor-text
                                                        ${
                                                            values.linea !== ''
                                                            ? 'top-1 text-sm text-blue-500 font-semibold'
                                                            : 'top-3.5 text-base text-gray-500'
                                                        }
                                                        ${errors.linea && touched.linea ? ' text-red-500' : ''}
                                                        peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:font-semibold
                                                        `}
                                                    >
                                                        Linea
                                                    </label>
                                                </div>
                                                {errors.linea && touched.linea && (
                                                <div className="text-red-500 mt-1 text-sm">{errors.linea}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <div className="relative w-full group">
                                                    <span
                                                        className={`absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b ${
                                                        errors.puesto && touched.puesto ? 'from-red-700 to-red-400' : 'from-blue-500 to-cyan-500'
                                                        } opacity-70 transition-all duration-300 group-focus-within:opacity-100`}
                                                    />

                                                    <select
                                                        id="puesto"
                                                        name="puesto"
                                                        value={values.puesto}
                                                        onChange={handleChange}
                                                        className={`peer w-full pl-6 pr-4 pt-6 pb-2 text-sm text-gray-800 bg-white border rounded-lg shadow-md appearance-none focus:outline-none transition-all duration-300
                                                        ${
                                                            values.puesto !== ''
                                                            ? 'border-blue-500 ring-2 ring-indigo-300'
                                                            : 'border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-transparent'
                                                        }
                                                        ${errors.puesto && touched.puesto ? ' border-red-500 ring-2 ring-red-300' : ''}
                                                        `}
                                                    >
                                                        <option value="" disabled></option>
                                                        {
                                                            puesto.map((pue) =>{
                                                                return(
                                                                    <option key={pue.id_puesto} value={pue.id_puesto}>{pue.puesto}</option>
                                                                )
                                                            }
                                                            )
                                                        }
                                                    </select>

                                                    <label
                                                        htmlFor="puesto"
                                                        className={`absolute left-6 transition-all duration-200 ease-in-out cursor-text
                                                        ${
                                                            values.puesto !== ''
                                                            ? 'top-1 text-sm text-blue-500 font-semibold'
                                                            : 'top-3.5 text-base text-gray-500'
                                                        }
                                                        ${errors.puesto && touched.puesto ? ' text-red-500' : ''}
                                                        peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:font-semibold
                                                        `}
                                                    >
                                                        Puesto
                                                    </label>
                                                </div>
                                                {errors.puesto && touched.puesto && (
                                                <div className="text-red-500 mt-1 text-sm">{errors.puesto}</div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="relative w-full group">
                                                    <span
                                                        className={`absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b ${
                                                        errors.rol && touched.rol ? 'from-red-700 to-red-400' : 'from-blue-500 to-cyan-500'
                                                        } opacity-70 transition-all duration-300 group-focus-within:opacity-100`}
                                                    />

                                                    <select
                                                        id="rol"
                                                        name="rol"
                                                        value={values.rol}
                                                        onChange={handleChange}
                                                        className={`peer w-full pl-6 pr-4 pt-6 pb-2 text-sm text-gray-800 bg-white border rounded-lg shadow-md appearance-none focus:outline-none transition-all duration-300
                                                        ${
                                                            values.rol !== ''
                                                            ? 'border-blue-500 ring-2 ring-indigo-300'
                                                            : 'border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-transparent'
                                                        }
                                                        ${errors.rol && touched.rol ? ' border-red-500 ring-2 ring-red-300' : ''}
                                                        `}
                                                    >
                                                        <option value="" disabled></option>
                                                        {
                                                            rol.map((rol) =>{
                                                                return(
                                                                    <option key={rol.id_rol} value={rol.id_rol}>{rol.rol}</option>
                                                                )
                                                            }
                                                            )
                                                        }
                                                    </select>

                                                    <label
                                                        htmlFor="rol"
                                                        className={`absolute left-6 transition-all duration-200 ease-in-out cursor-text
                                                        ${
                                                            values.rol !== ''
                                                            ? 'top-1 text-sm text-blue-500 font-semibold'
                                                            : 'top-3.5 text-base text-gray-500'
                                                        }
                                                        ${errors.rol && touched.rol ? ' text-red-500' : ''}
                                                        peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:font-semibold
                                                        `}
                                                    >
                                                        Rol
                                                    </label>
                                                </div>
                                                {errors.rol && touched.rol && (
                                                <div className="text-red-500 mt-1 text-sm">{errors.rol}</div>
                                                )}
                                            </div>
                                        </div>
                                    </DialogBody>
                                    <DialogFooter>
                                        <div className="flex items-end justify-end">
                                            <div className="relative group">
                                                <button type="submit" className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                                                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                                    <span className="relative z-10 block px-6 py-3 rounded-xl bg-blue-600">
                                                        <div className="relative z-10 flex items-center space-x-2">
                                                        <span className="transition-all duration-500 group-hover:translate-x-1">{isEdit ? 'Editar' : 'Agregar'}</span>
                                                        {
                                                            isEdit ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M15.748 2.947a2 2 0 0 1 2.828 0l2.475 2.475a2 2 0 0 1 0 2.829L9.158 20.144l-6.38 1.076l1.077-6.38zm-.229 3.057l2.475 2.475l1.643-1.643l-2.475-2.474zm1.06 3.89l-2.474-2.475l-8.384 8.384l-.503 2.977l2.977-.502z"/></svg>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>
                                                            )
                                                        }
                                                        </div>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>  
                                    </DialogFooter> 
                                </form>
                                )}
                        </Formik>
                    </div>
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
        </>
    )
}
export default UserModal