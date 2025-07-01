import { useState, useMemo } from "react";
import {
  Box, Table, TableHead, TableRow, Typography, TableCell, Pagination, TableBody, TableContainer, Paper
} from "@mui/material";

const data = [
    {defecto:"Defecto 1"},
    {defecto:"Defecto 2"},
    {defecto:"Defecto 3"},
    {defecto:"Defecto 4"},
];


const DefectoTable = ({search}) =>{

     const [page, setPage] = useState(1);
    const rowsPerPage = 5;
    
    const filtered = data.filter(item =>
        item.defecto.toLowerCase().includes(search.toLowerCase()) 
    );
    
    const paginatedData = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filtered.slice(start, start + rowsPerPage);
    }, [filtered, page]);
    
    return(
        <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <button className="group flex items-center justify-start w-11 h-11 bg-green-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1">
                    <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>
                    </div>
                    <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                        Defecto
                    </div>
                </button>  
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Defecto</TableCell>
                        <TableCell sx={{textAlign:"center"}}>Opciones</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {paginatedData.map((item, i) => (
                        <TableRow key={i}>
                        <TableCell>{i +1}</TableCell>
                        <TableCell>{item.defecto}</TableCell>
                        <TableCell>
                             <div className="flex items-center justify-center gap-x-2">
                                <button className="group relative flex items-center justify-start w-14 h-6 bg-orange-400 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                                    <div className="ml-3 text-white text-xs font-semibold">
                                        Editar
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
export default DefectoTable