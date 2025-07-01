import { useEffect, useMemo, useState } from "react";
import { Box, Table, TableHead, TableRow,Pagination, TableCell, TableBody, TableContainer, Paper, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { supabase } from "../../../supabaseClient";
import LogoS from '../../assets/logo-vento.png'
import ComponenteModal from "../Modales/ComponenteModal";

const ComponentesTable = ({search, onComponentListChange }) =>{

    const [componente, setComponente] = useState([]);
    const [componentes, setComponentes] = useState([]);
    const [ismodal, setIsModal] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    useEffect(()=>{
        const fetchComponentes = async () =>{
            setLoading(true)
            try {
                const {data, error} = await supabase
                .from('Componentes')
                .select(`*`)

                if(error){
                    setError(error.message)
                } else {
                    setComponentes(data)
                }
            } catch (error) {
               setError(error.message)
            } finally{
                setLoading(false)
            }
        }
        fetchComponentes()
    },[]);
    
    const filtered = componentes.filter(item =>
        item.componente.toLowerCase().includes(search.toLowerCase()) 
    );
    
    const paginatedData = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filtered.slice(start, start + rowsPerPage);
    }, [filtered, page]);

     useEffect(() => {
        const componentes2 = componentes.map(item => item.nombre);
        onComponentListChange(componentes2);
    }, [onComponentListChange]);

    const newComponente = () =>{
        setComponente(null);
        setIsModal(false)
        setModalEdit(true);
    }

    const editComponente = (data) => {
            console.log(data)
            setComponente(data);
            setIsModal(true)
            setModalEdit(true);
    }

    return(
        <>
            {
                modalEdit && <ComponenteModal modal={setModalEdit} componente={componente} isEdit={ismodal}/>
            }
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={()=>{newComponente()}} className="group flex items-center justify-start w-11 h-11 bg-green-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-42 hover:rounded-lg active:translate-x-1 active:translate-y-1">
                        <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>
                        </div>
                        <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                            Componente
                        </div>
                    </button>  
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Componente</TableCell>
                        <TableCell sx={{textAlign:"center"}}>Opciones</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {paginatedData.map((item, i) => (
                        <TableRow key={i}>
                        <TableCell>{i +1}</TableCell>
                        <TableCell>{item.componente}</TableCell>
                        <TableCell>
                             <div className="flex items-center justify-center gap-x-2">
                                <button onClick={() => {editComponente(item)}} className="group relative flex items-center justify-start w-fit px-3 py-1 bg-orange-400 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                                    <div className="flex items-center space-x-1 text-white text-xs font-semibold">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M15.748 2.947a2 2 0 0 1 2.828 0l2.475 2.475a2 2 0 0 1 0 2.829L9.158 20.144l-6.38 1.076l1.077-6.38zm-.229 3.057l2.475 2.475l1.643-1.643l-2.475-2.474zm1.06 3.89l-2.474-2.475l-8.384 8.384l-.503 2.977l2.977-.502z"/>
                                        </svg>
                                        <span>Editar</span>
                                    </div>
                                </button> 
                                <button className="group relative flex items-center justify-start w-15 h-6 bg-red-600 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                                    <div className="ml-2 text-white text-xs font-semibold">
                                        Eliminar
                                    </div>
                                </button> 
                             </div>
                        </TableCell>
                        </TableRow>
                    ))}
                    {paginatedData.length === 0 && (
                        <TableRow>
                        <TableCell colSpan={3} align="center">
                            No hay resultados.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="body2">
                    Página {page} de {Math.ceil(filtered.length / rowsPerPage)}
                </Typography>
                <Pagination
                    count={Math.ceil(filtered.length / rowsPerPage)}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                />
            </Box>
        </>
    )
}
export default ComponentesTable