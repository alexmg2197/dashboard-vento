import { useState, useMemo, useEffect  } from "react";
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
import { useNavigate } from "react-router-dom";

const Catalogos = () =>{

    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedSubtab, setSelectedSubtab] = useState(0);
    const [search, setSearch] = useState('');
    const [componentes, setComponentes] = useState([]);
    const [reloadFlag, setReloadFlag] = useState(false);

    const { userData } = useUser() //Se usa para ver el usuario logueado
    const navigate = useNavigate();
    
    useEffect(() => {
        if (userData && userData.C_Rol.rol !== 'Admin') {
            navigate('/no-autorizado'); // Ruta a la que quieres redirigir si no es admin
        }
    }, [userData, navigate]);

    if (!userData) {
        return <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
    }

    const tabs = ["Usuarios", "Motos", "Componentes", "Subcomponentes", "Defecto" , "Recuperado"];

    const handleRefresh = () => {
      setReloadFlag(prev => !prev); // Cambiar el valor para que se dispare el useEffect de la tabla
    };

    const subtabOptions = useMemo(() => {
        if (tabs[selectedTab] === "Subcomponentes") {
        return componentes;
        }
        return [];
    }, [selectedTab, componentes]);

    const renderCurrentTable = () => {

        const commonProps = {
          search,
          reloadFlag,
          onRefresh: handleRefresh,
        };

    switch (tabs[selectedTab]) {
      case "Usuarios":
        return <UserTable {...commonProps} />;
      case "Motos":
        return <MotoTable {...commonProps} />;
      case "Componentes":
        return <ComponentesTable {...commonProps} onComponentListChange={setComponentes} />;
      case "Subcomponentes":
        return <SubcomponentesTable {...commonProps} componenteSeleccionado={subtabOptions[selectedSubtab]} />;
      case "Defecto":
        return <DefectoTable {...commonProps} />;
      case "Recuperado":
        return <RecuperadoTable {...commonProps} />;
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
                    <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); }} className="outline-none text-[20px] bg-transparent w-full text-white font-normal px-4" />
                </div>
                </Box>
                {renderCurrentTable()}
            </Paper>
        </Box>
    )
}
export default Catalogos