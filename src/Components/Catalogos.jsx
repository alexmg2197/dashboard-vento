import { useState, useMemo  } from "react";
import {
  Box, Tabs, Tab, Paper, Typography
} from '@mui/material';
import UserTable from "./Tablas/UserTable";
import MotoTable from "./Tablas/MotoTable";
import ComponentesTable from "./Tablas/ComponentesTable";
import SubcomponentesTable from "./Tablas/SubcomponentesTable";
import DefectoTable from "./Tablas/DefectoTable";
import RecuperadoTable from "./Tablas/RecuperadoTable";
import { useUser } from '../context/UserContext' //importado para mostrar informacion del usuario logueado

const Catalogos = () =>{

    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedSubtab, setSelectedSubtab] = useState(0);
    const [search, setSearch] = useState('');
    const [componentes, setComponentes] = useState([]);

    const { userData } = useUser() //Se usa para ver el usuario logueado
    // console.log(userData?.token)

    const tabs = ["Usuarios", "Motos", "Componentes", "Subcomponentes", "Defecto" , "Recuperado"];

    const subtabOptions = useMemo(() => {
        if (tabs[selectedTab] === "Subcomponentes") {
        return componentes;
        }
        return [];
    }, [selectedTab, componentes]);

    const renderCurrentTable = () => {
    switch (tabs[selectedTab]) {
      case "Usuarios":
        return <UserTable search={search} />;
      case "Motos":
        return <MotoTable search={search} />;
      case "Componentes":
        return <ComponentesTable search={search} onComponentListChange={setComponentes} />;
      case "Subcomponentes":
        return <SubcomponentesTable search={search} componenteSeleccionado={subtabOptions[selectedSubtab]} />;
      case "Defecto":
        return <DefectoTable search={search} />;
      case "Recuperado":
        return <RecuperadoTable search={search} />;
      default:
        return null;
    }
  };

    return(
        <Box sx={{width: '100%', mt: 1, px: 2}}>
            <Paper elevation={3} sx={{p: 2}}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Catálogos
                </Typography>
                <Tabs value={selectedTab} onChange={(e, val) => {
                    setSelectedTab(val);
                    setSearch('');
                    setSelectedSubtab(0);
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
                <div className="p-5 overflow-hidden w-[60px] h-[30px] hover:w-[270px] bg-[#4070f4] shadow-[2px_2px_20px_rgba(0,0,0,0.08)] rounded-full flex group items-center hover:duration-300 duration-300">
                    <div className="flex items-center justify-center fill-white">
                        <svg xmlns="http://www.w3.org/2000/svg" id="Isolation_Mode" data-name="Isolation Mode" viewBox="0 0 24 24" width={22} height={22}>
                        <path d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z" />
                        </svg>
                    </div>
                    <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="outline-none text-[20px] bg-transparent w-full text-white font-normal px-4" />
                </div>
                </Box>
                {renderCurrentTable()}
            </Paper>
        </Box>
    )
}
export default Catalogos