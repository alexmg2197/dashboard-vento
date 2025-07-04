import {Button,  DialogBody, DialogFooter} from "@material-tailwind/react";
import { Formik } from "formik";
import { useState, useEffect } from "react";
import { supabase } from '../../../supabaseClient'
import LogoS from '../../assets/logo-vento.png'
import Swal from "sweetalert2";

const RecuperadoModal = ({modal, recuperado, isEdit, onRefresh={onRefresh}}) =>{

    const [loading, setLoading] = useState(false);

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
                                {isEdit ? 'Editar Recuperado' : 'Crear Recuperado'}
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
                                idRecuperado : isEdit ? recuperado.id_recuperado : '',
                                recuperado: isEdit ? recuperado.recuperado : '',
                            }}
                            validate={values =>{
                                const errors={};
                                    if(!values.recuperado){
                                        errors.recuperado = 'Recuperado es requerido'
                                    }
                                return errors;
                            }}
                            onSubmit={async(values,{setSubmitting}) => {
                                if(!isEdit){
                                    setLoading(true)
                                    try {
                                        const {data, error } = await supabase
                                        .from('Recuperado')
                                        .insert([
                                            {
                                                recuperado:values.recuperado
                                            },
                                        ]);
                                        Swal.fire({
                                            title: "Recuperado creado con exito!",
                                            icon: "success",
                                            draggable: true
                                        }).then(async (result) => {
                                            if (result.isConfirmed) {
                                                setSubmitting(false);
                                                setLoading(false);
                                                await onRefresh()
                                                Swal.fire("Saved!", "", "success");
                                                handleOpen()
                                            } else if (result.isDenied) {
                                                Swal.fire("Changes are not saved", "", "info");
                                            }       
                                        });
                                    } catch (error) {
                                        Swal.fire({
                                            title: `Error: ${error}`,
                                            icon: "success",
                                            draggable: true
                                        });
                                    } 
                                } else {
                                    setLoading(true);
                                    try {
                                        const {error} = await supabase
                                        .from('Recuperado')
                                        .update({
                                            recuperado: values.recuperado
                                        })
                                        .eq("id_recuperado", values.idRecuperado)

                                        Swal.fire({
                                            title: "Recuperado actualizado con exito!",
                                            icon: "success",
                                            draggable: true
                                        }).then(async (result) => {
                                            if (result.isConfirmed) {
                                                setSubmitting(false);
                                                setLoading(false);
                                                await onRefresh()
                                                Swal.fire("Saved!", "", "success");
                                                handleOpen()
                                            } else if (result.isDenied) {
                                                Swal.fire("Changes are not saved", "", "info");
                                            }       
                                        });;
                                    } catch (error) {
                                        setSubmitting(false);
                                                setLoading(false);
                                        Swal.fire({
                                            title: `Error: ${error}`,
                                            icon: "success",
                                            draggable: true
                                        });
                                    }
                                }
                            }}>
                                {
                                ({
                                    values, errors, handleChange, handleSubmit, touched
                                }) => (
                                <form onSubmit={handleSubmit}>
                                    <DialogBody className="space-y-4 pb-6">
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                            <div>
                                                <div className="relative w-full group">
                                                    <span className={`absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b  ${errors.recuperado && touched.recuperado ? 'from-red-700 to-red-400' : 'from-blue-500 to-cyan-500'} opacity-70 transition-all duration-300 group-focus-within:opacity-100`} />
                                                    <input type="text" id="recuperado" value={values.recuperado} onChange={handleChange} placeholder=" "
                                                        className={`peer w-full pl-6 pr-4 pt-6 pb-2 text-sm text-gray-800 bg-white border rounded-lg shadow-md focus:outline-none transition-all duration-300 placeholder-transparent
                                                        ${(values.recuperado !== '' ? 'border-blue-500 ring-2 ring-indigo-300' : 'border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-transparent') +
                                                            (errors.recuperado && touched.recuperado ? ' border-red-500 ring-2 ring-red-300' : '') 
                                                        } 
                                                        `}
                                                    />
                                                    <label htmlFor="recuperado"
                                                        className={`absolute left-6 transition-all duration-200 ease-in-out cursor-text
                                                        ${(values.recuperado !== ''
                                                            ? 'top-1 text-sm text-blue-500 font-semibold'
                                                            : 'top-3.5 text-base text-gray-500') + (errors.recuperado && touched.recuperado ? ' text-red-500' : '') 
                                                        }
                                                        peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:font-semibold
                                                        `}
                                                    >
                                                        Recuperado
                                                    </label>
                                                </div>
                                                    {errors.recuperado && touched.recuperado && <div className="text-red-500">{errors.recuperado}</div>}
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
                                                        <span className="transition-all duration-500 group-hover:translate-x-1">Agregar</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>
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
export default RecuperadoModal