import { useState, useMemo, useEffect  } from "react";
import {
  Box, Tabs, Tab, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Pagination, Typography
} from '@mui/material';
import { supabase } from '../../supabaseClient'
import LogoS from '../assets/logo-vento.png'

const VerMerma = () => {

    const [mermaData, setMermaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedSubtab, setSelectedSubtab] = useState(0);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const tabs = ["Todos", "Turno", "Componente", "Linea"];


    useEffect(() => {
        const fetchMerma = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('Merma').select('*, C_Linea(linea), C_Turno(Turno), Motos(modelo), Componentes(componente), Subcomponentes(subcomponente),Defectos(defecto), Recuperado(recuperado), Usuarios(nombre)');
            if (error) {
                console.error("Error al cargar Merma:", error.message);
                setMermaData([]);
            } else {
                setMermaData(data);
            }
            setLoading(false);
        };
        fetchMerma();
    }, []);

    const getSubtabOptions = () => {
        if (tabs[selectedTab] === "Turno") {
            return [...new Set(mermaData.map(d => d.C_Turno.Turno))];
        } else if (tabs[selectedTab] === "Componente") {
            return [...new Set(mermaData.map(d => d.Componentes.componente))];
        }else if (tabs[selectedTab] === "Linea"){
            return [...new Set(mermaData.map(d => d.C_Linea.linea))];
        }
        return [];
    };

    const subtabOptions = useMemo(() => {
        if (!mermaData || mermaData.length === 0) return [];
        if (tabs[selectedTab] === "Turno") {
            return [...new Set(mermaData.map(d => d.C_Turno.Turno))];
        } else if (tabs[selectedTab] === "Componente") {
            return [...new Set(mermaData.map(d => d.Componentes.componente))];
        } else if (tabs[selectedTab] === "Linea") {
            return [...new Set(mermaData.map(d => d.C_Linea.linea))];
        }
        return [];
    }, [mermaData, selectedTab]);

const filteredData = useMemo(() => {
    if (!mermaData || mermaData.length === 0) return [];

    let result = [...mermaData];

    if (tabs[selectedTab] === "Turno" && subtabOptions.length > 0) {
        result = result.filter(d => d.C_Turno.Turno === subtabOptions[selectedSubtab]);
    } else if (tabs[selectedTab] === "Componente" && subtabOptions.length > 0) {
        result = result.filter(d => d.Componentes.componente === subtabOptions[selectedSubtab]);
    } else if (tabs[selectedTab] === "Linea" && subtabOptions.length > 0) {
        result = result.filter(d => d.C_Linea.linea === subtabOptions[selectedSubtab]);
    }

    return result.filter((d) =>
        d.fecha_merma.toLowerCase().includes(search.toLowerCase())
    );
}, [selectedTab, selectedSubtab, search, mermaData, subtabOptions]);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, page]);

    const formatFecha = (fechaISO) => {
        if (!fechaISO) return '';
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return(
        <Box sx={{ width: '100%', mt: 1, px: 2 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                Merma
                </Typography>
                
                <Tabs value={selectedTab} onChange={(e, val) => {
                    setSelectedTab(val);
                    setSelectedSubtab(0); // Reset subtabs al cambiar tab
                    }}>
                    {tabs.map((label, i) => (
                        <Tab key={i} label={label} />
                    ))}
                </Tabs>

                {subtabOptions.length > 0 && (
                    <Tabs value={selectedSubtab} onChange={(e, val) => setSelectedSubtab(val)} sx={{ mt: 2 }}>
                        {subtabOptions.map((label, i) => (
                        <Tab key={i} label={label} />
                        ))}
                    </Tabs>
                )}


                <Box sx={{ my: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <div className="p-5 overflow-hidden w-[60px] h-[60px] hover:w-[270px] bg-[#4070f4] shadow-[2px_2px_20px_rgba(0,0,0,0.08)] rounded-full flex group items-center hover:duration-300 duration-300">
                    <div className="flex items-center justify-center fill-white">
                        <svg xmlns="http://www.w3.org/2000/svg" id="Isolation_Mode" data-name="Isolation Mode" viewBox="0 0 24 24" width={22} height={22}>
                        <path d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z" />
                        </svg>
                    </div>
                    <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="outline-none text-[20px] bg-transparent w-full text-white font-normal px-4" />
                </div>
                </Box>

                <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Turno</TableCell>
                        <TableCell>Linea</TableCell>
                        <TableCell>Modelo</TableCell>
                        <TableCell>Componente</TableCell>
                        <TableCell>Defecto</TableCell>
                        <TableCell>Piezas</TableCell>
                        <TableCell>Cargo</TableCell>
                        <TableCell>Disposición</TableCell>
                        <TableCell>Recuperado</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {paginatedData.map((item, idx) => (
                        <TableRow key={idx}>
                        <TableCell>{formatFecha(item.fecha_merma)}</TableCell>
                        <TableCell>{item.C_Turno.Turno}</TableCell>
                        <TableCell>{item.C_Linea.linea}</TableCell>
                        <TableCell>{item.Motos.modelo}</TableCell>
                        <TableCell>{item.Componentes.componente}</TableCell>
                        <TableCell>{item.Defectos.defecto}</TableCell>
                        <TableCell>{item.no_piezas}</TableCell>
                        <TableCell>{item.cargo}</TableCell>
                        <TableCell>{item.disposicion}</TableCell>
                        <TableCell>{(item.Recuperado === null  ? 'N/A' : item.Recuperado.recuperado)}</TableCell>
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
                    Página {page} de {Math.ceil(filteredData.length / rowsPerPage)}
                </Typography>
                <Pagination
                    count={Math.ceil(filteredData.length / rowsPerPage)}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    siblingCount={2}   // Cuántas páginas mostrar a los lados de la actual
                    boundaryCount={2}  // Cuántas páginas mostrar al inicio y al final
                    showFirstButton    // (opcional) muestra el botón "Primera página"
                    showLastButton 
                />
                </Box>
            </Paper>
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
        </Box>
    )
}
export default VerMerma