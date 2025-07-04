import { Formik } from "formik";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { supabase } from '../../supabaseClient'
import LogoS from '../assets/logo-vento.png'
import { useUser } from '../context/UserContext' //importado para mostrar informacion del usuario logueado


const AddMerma = () => {

    const [moto, setMoto] = useState([]);
    const [componente, setComponente] = useState([]);
    const [subcomponente, setSubcomponente] = useState([]);
    const [defecto, setDefecto] = useState([]);
    const [recuperado, setRecuperado] = useState([]);
    const [componenteSeleccionado, setComponenteSeleccionado] = useState('');
    const [loading, setLoading] = useState(false);

    const { userData } = useUser() //Se usa para ver el usuario logueado

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [motoRes, componenteRes, defectoRes, recuperadoRes] = await Promise.all([
                supabase.from('Motos').select('*'),
                supabase.from('Componentes').select('*'),
                supabase.from('Defectos').select('*'),
                supabase.from('Recuperado').select('*'),
                ])
                if (motoRes.error) throw motoRes.error
                if (componenteRes.error) throw componenteRes.error
                if (defectoRes.error) throw defectoRes.error
                if (recuperadoRes.error) throw recuperadoRes.error

                setMoto(motoRes.data)
                setComponente(componenteRes.data)
                setDefecto(defectoRes.data)
                setRecuperado(recuperadoRes.data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchSubcomponentes = async () => {
        if (!componenteSeleccionado) {
            setSubcomponente([]);
            return;
        }

        // Obtener ID del componente seleccionado
        const { data: componenteData, error: compError } = await supabase
            .from('Componentes')
            .select('id_componente')
            .eq('id_componente', componenteSeleccionado)
            .single();

        if (compError || !componenteData) {
            setSubcomponente([]);
            return;
        }

        // Obtener subcomponentes del componente
        const { data: subData, error: subError } = await supabase
            .from('Subcomponentes')
            .select('*')
            .eq('componente_id', componenteData.id_componente);

        if (!subError) setSubcomponente(subData);
        };

        fetchSubcomponentes();
    }, [componenteSeleccionado]);

    return(
        <>
        <div className="flex flex-col items-center justify-center md:pt-8">
            <div className="w-full md:max-w-3xl sm:max-w-md bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl text-center font-bold text-gray-900 mb-4">Merma</h2>
                <Formik
                    initialValues={{ 
                        fecha: '', 
                        modelo: '',
                        componente:'',
                        subcomponente:'',
                        defecto:'',
                        piezas:'',
                        cargo:'',
                        disposicion:'',
                        recuperado:null,
                    }}
                    validate={values => {
                        const errors = {};

                        // if (!values.fecha) {
                        // errors.fecha = 'La fecha es requerida';
                        // } 

                        // if (!values.modelo) {
                        // errors.modelo = 'El modelo es requerido';
                        // }
                        return errors
                    }}
                    onSubmit={async(values, { setSubmitting,resetForm  }) => {
                        setLoading(true);
                        try {
                            const { error: insertError } = await supabase
                                .from("Merma")
                                .insert([
                                    {
                                    fecha_merma: values.fecha,
                                    moto_id: values.modelo,
                                    componente_id: values.componente,
                                    subcomponente_id: values.subcomponente,
                                    defecto_id: values.defecto,
                                    no_piezas: values.piezas,
                                    cargo: values.cargo,
                                    disposicion: values.disposicion,
                                    recuperado_id: values.recuperado,
                                    linea_id: userData?.linea_id,
                                    turno_id: userData?.turno_id,
                                    usuario_id: userData?.id_usuario
                                    },
                            ]);
                            if(insertError){
                                throw insertError;
                                Swal.fire({
                                    title: `Error ${insertError}`,
                                    icon: "error",
                                    draggable: true
                                })
                            }
                            Swal.fire({
                            title: "Merma generada correctamente",
                            icon: "success",
                            draggable: true
                            }).then((result) => {
                                /* Read more about isConfirmed, isDenied below */
                                if (result.isConfirmed) {
                                    setSubmitting(false);
                                    setLoading(false);
                                    window.location.reload();
                                }
                            });
                        } catch (error) {
                            Swal.fire({
                            title: `Error: ${error}`,
                            icon: "error",
                            draggable: true
                            })
                        }
                        
                    }}
                    >
                    {({ values, handleChange, handleSubmit,errors, touched, setFieldValue   }) => (
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <label htmlFor="fecha">Fecha de merma:</label>
                            <input type="date" id="fecha" min={new Date().toLocaleDateString("en-CA")} value={values.fecha} onChange={handleChange} className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="modelo">Modelo:</label>
                            <select id="modelo" name="modelo" value={values.modelo} onChange={handleChange} className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" >
                                <option value=""> --- Seleccione una opción ---</option>
                                {
                                    moto.map((mot) => {
                                        return(
                                            <option key={mot.id_moto} value={mot.id_moto}>{mot.modelo}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="componente">Componente:</label>
                            <select id="componente" name="componente" value={values.componente}  onChange={(e) => {handleChange(e); setComponenteSeleccionado(e.target.value); setFieldValue('subcomponente', '');}} className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" >
                                <option value=""> --- Seleccione una opción ---</option>
                                {
                                    componente.map((com) => {
                                        return(
                                            <option key={com.id_componente} value={com.id_componente}>{com.componente}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="subcomponente">Subcomponente:</label>
                            <select id="subcomponente" name="subcomponente" value={values.subcomponente} onChange={handleChange} className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" >
                                <option value=""> --- Seleccione una opción ---</option>
                                {subcomponente.map((s) => (
                                    <option key={s.id_subcomponente} value={s.id_subcomponente}>{s.subcomponente}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="defecto">Defecto:</label>
                            <select id="defecto" name="defecto" value={values.defecto} onChange={handleChange} className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" >
                                <option value=""> --- Seleccione una opción ---</option>
                                {defecto.map((d) => (
                                    <option key={d.id_defecto} value={d.id_defecto}>{d.defecto}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="piezas">No. de piezas:</label>
                            <input type="number"id="piezas" min={1} max={100} step={1} value={values.piezas} onChange={handleChange} className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"/>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="cargo">Cargo:</label>
                            <select id="cargo" name="cargo" value={values.cargo} onChange={handleChange} className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" >
                                <option value=""> --- Seleccione una opción ---</option>
                                <option value="Produccion">Produccion</option>
                                <option value="Origen">Origen</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="disposicion">Disposición:</label>
                            <select id="disposicion" name="disposicion" value={values.disposicion} onChange={handleChange} className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" >
                                <option value=""> --- Seleccione una opción ---</option>
                                <option value="Scrap">Scrap</option>
                                <option value="Recuperado">Recuperado</option>
                            </select>
                        </div>
                        {values.disposicion == 'Recuperado'?
                        (<div className="flex flex-col">
                            <label htmlFor="recuperado">Recuperado:</label>
                            <select id="recuperado" name="recuperado" value={values.recuperado} onChange={handleChange} className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" >
                                <option value=""> --- Seleccione una opción ---</option>
                                {recuperado.map((r) => (
                                    <option key={r.id_recuperado} value={r.id_recuperado}>{r.recuperado}</option>
                                ))}
                            </select>
                        </div>): ('')
                        }
                        <div className="col-span-1 md:col-span-2 flex justify-center">
                            <button type="submit" className="rounded-lg relative w-46 h-10 cursor-pointer flex items-center border border-blue-900 bg-blue-900 group hover:bg-blue-900 active:bg-blue-900 active:border-blue-900">
                                <span className="text-gray-200 font-semibold ml-8 transform group-hover:translate-x-20 transition-all duration-300">Agregar</span>
                                <span className="absolute right-0 h-full w-10 rounded-lg bg-blue-900 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
                                    <svg className="svg w-8 text-white" fill="none" height={24} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" width={24} xmlns="http://www.w3.org/2000/svg">
                                    <line x1={12} x2={12} y1={5} y2={19} />
                                    <line x1={5} x2={19} y1={12} y2={12} />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </form>
                    )}
                </Formik>
            </div>
        </div>
        </>
    )
}
export default AddMerma