import { Formik } from "formik";
import Swal from "sweetalert2";

const AddMerma = () => {
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
                        recuperado:'',
                    }}
                    validate={values => {
                        const errors = {};

                        // if (!values.usuario) {
                        // errors.usuario = 'El correo o usuario es requerido';
                        // } 

                        // if (!values.pass) {
                        // errors.pass = 'La contraseña es requerida';
                        // }
                        return errors
                    }}
                    onSubmit={async(values, { setSubmitting,resetForm  }) => {
                        // setLoading(true);
                        Swal.fire({
                            title: "Guardado",
                            html: `Fecha de merma: <b>${values.fecha}</b>
                                    <br>Modelo: <b>${values.modelo}</b>
                                    <br>Componente: <b>${values.componente}</b>
                                    <br>Subcomponente: <b>${values.subcomponente}</b>
                                    <br>Defecto: <b>${values.defecto}</b>
                                    <br>No. de piezas: <b>${values.piezas}</b>
                                    <br>Cargo: <b>${values.cargo}</b>
                                    <br>Disposición: <b>${values.disposicion}</b>
                                    ${values.disposicion === 'Recuperado' ? '<br>Recuperado: <b>' + values.recuperado + '</b>' : ''}`,
                                    
                            icon: "success",
                            draggable: true
                        });
                        console.log(values)
                    }}
                    >
                    {({ values, handleChange, handleSubmit,errors, touched  }) => (
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <label htmlFor="fecha">Fecha de merma:</label>
                            <input type="date" id="fecha" min={new Date().toISOString().split("T")[0]} value={values.fecha} onChange={handleChange} className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="modelo">Modelo:</label>
                            <select id="modelo" name="modelo" value={values.modelo} onChange={handleChange} className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" >
                                <option value=""> --- Seleccione una opción ---</option>
                                <option value="Crossmax">Crossmax</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="componente">Componente:</label>
                            <select id="componente" name="componente" value={values.componente} onChange={handleChange} className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" >
                                <option value=""> --- Seleccione una opción ---</option>
                                <option value="Volante">Volante</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="subcomponente">Subcomponente:</label>
                            <select id="subcomponente" name="subcomponente" value={values.subcomponente} onChange={handleChange} className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" >
                                <option value=""> --- Seleccione una opción ---</option>
                                <option value="Acelerador">Acelerador</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="defecto">Defecto:</label>
                            <select id="defecto" name="defecto" value={values.defecto} onChange={handleChange} className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" >
                                <option value=""> --- Seleccione una opción ---</option>
                                <option value="No gira">No gira</option>
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
                                <option value="Hojalateria">Hojalateria</option>
                                <option value="Herreria">Herreria</option>
                                <option value="Proveedor">Proveedor</option>
                                <option value="Mecanico">Mecanico</option>
                                <option value="Kit de emergencia">Kit de emergencia</option>
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