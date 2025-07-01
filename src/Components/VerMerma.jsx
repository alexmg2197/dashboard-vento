import { useState, useMemo  } from "react";
import {
  Box, Tabs, Tab, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Pagination, Typography
} from '@mui/material';

const VerMerma = () => {

    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedSubtab, setSelectedSubtab] = useState(0);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const tabs = ["Todos", "Turno", "Componente", "Linea"];

    const data = [
        {
            fecha: "11/06/2025",
            turno: "Primero",
            linea: "Linea 1",
            modelo: "Crossmax",
            componente: "Llanta",
            defecto: "Ponchada",
            piezas:"3",
            cargo:"Origen",
            disposicion: "Scrap",
            recuperado:"N/A"
        },
        {
            fecha: "11/06/2025",
            turno: "Segundo",
            linea: "Linea 2",
            modelo:"Modelo 2",
            componente: "Llanta",
            defecto: "Ponchada",
            piezas:"3",
            cargo:"Origen",
            disposicion: "Recuperado",
            recuperado:"Herreria"
        },
        {
            fecha: "11/06/2025",
            turno: "Primero",
            linea: "Linea 3",
            modelo:'rapid',
            componente: "Llanta",
            defecto: "Ponchada",
            piezas:"3",
            cargo:"Produccion",
            disposicion: "Scrap",
            recuperado:"N/A"
        },
        {
            fecha: "11/06/2025",
            turno: "Primero",
            linea: "Linea 4",
            modelo:"modelo4",
            componente: "Llanta",
            defecto: "Ponchada",
            piezas:"3",
            cargo:"Origen",
            disposicion: "Recuperado",
            recuperado:"Mecanico"
        },
        {
            fecha: "12/06/2025",
            turno: "Primero",
            linea: "Linea 4",
            modelo:"modelo4",
            componente: "Discos",
            defecto: "Ponchada",
            piezas:"3",
            cargo:"Origen",
            disposicion: "Recuperado",
            recuperado:"Mecanico"
        },
    ];

    const getSubtabOptions = () => {
        if (tabs[selectedTab] === "Turno") {
            return ["Primero", "Segundo"];
        } else if (tabs[selectedTab] === "Componente") {
            return [...new Set(data.map(d => d.componente))];
        }else if (tabs[selectedTab] === "Linea"){
            return [...new Set(data.map(d => d.linea))];
        }
        return [];
    };

    const subtabOptions = getSubtabOptions();

    const handleChangeTab = (event, newValue) => {
        setSelectedTab(newValue);
        setSearch('');
        setPage(1);
    };

    const filteredData = useMemo(() => {
        let result = [...data];

        if (tabs[selectedTab] === "Turno") {
            result = result.filter(d => d.turno === subtabOptions[selectedSubtab]);
        } else if (tabs[selectedTab] === "Componente") {
            result = result.filter(d => d.componente === subtabOptions[selectedSubtab]);
        } else if (tabs[selectedTab] === "Linea") {
            result = result.filter(d => d.linea === subtabOptions[selectedSubtab]);
        }

        return result.filter((d) =>
            d.fecha.toLowerCase().includes(search.toLowerCase())
        );
    }, [selectedTab, selectedSubtab, search]);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, page]);

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
                        <TableCell>{item.fecha}</TableCell>
                        <TableCell>{item.turno}</TableCell>
                        <TableCell>{item.linea}</TableCell>
                        <TableCell>{item.modelo}</TableCell>
                        <TableCell>{item.componente}</TableCell>
                        <TableCell>{item.defecto}</TableCell>
                        <TableCell>{item.piezas}</TableCell>
                        <TableCell>{item.cargo}</TableCell>
                        <TableCell>{item.disposicion}</TableCell>
                        <TableCell>{item.recuperado}</TableCell>
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
                />
                </Box>
            </Paper>
        </Box>
    )
}
export default VerMerma