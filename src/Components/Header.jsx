import { useNavigate } from "react-router-dom";
import { useState } from 'react'
import { Dialog, DialogPanel, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import Logo from '../assets/logo-vento.png'
import { supabase } from '../../supabaseClient'
import {useUser} from '../context/UserContext'

export default function Header({  toggleSidebar, setIsAuthenticated,sidebarOpen }) {
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { setUserData } = useUser() //Se usa para ver el usuario logueado

  const navigate = useNavigate();


  const logout = async ()=>{
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    localStorage.removeItem("userData");
    await supabase.auth.signOut();
    setUserData(null);
    // localStorage.removeItem("user");
    // setIsAuthenticated(false);
    // navigate("/Login");
  };

  return (
    <header className="h-16 bg-gray-400 text-one px-4 flex items-center justify-between shadow-md">
      <button onClick={toggleSidebar} className="text-xl text-one hidden md:block">
        <div className="w-9 h-10 cursor-pointer flex flex-col items-center justify-center">
          <div className={`w-[50%] h-[2px] bg-black rounded-sm transition-all duration-300 origin-left translate-y-[0.45rem] ${sidebarOpen ? 'rotate-[-45deg]' : ''}`} />
          <div className={`w-[50%] h-[2px] bg-black rounded-md transition-all duration-300 origin-center ${sidebarOpen ? 'opacity-0' : 'opacity-100'}`} />
          <div className={`w-[50%] h-[2px] bg-black rounded-md transition-all duration-300 origin-left -translate-y-[0.45rem] ${sidebarOpen ? 'rotate-[45deg]' : ''}`} />
        </div>
      </button>
       <div className="flex md:hidden">
          <button type="button" onClick={() => setMobileMenuOpen(true)} className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-50" >
            <span className="sr-only">Open main menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
      <div className="pr-6 ">
        <button onClick={logout} className="group flex items-center justify-start w-11 h-11 bg-blue-900 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1">
          <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
            <svg className="w-4 h-4" viewBox="0 0 512 512" fill="white">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
            </svg>
          </div>
          <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            Logout
          </div>
        </button>
      </div>
      
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="md:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 left-0 z-10 w-65 overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 6h18M3 12h18M3 18h18"/></svg>
              <span className="sr-only">Close menu</span>
            </button> 
            <a href="#Inicio" className="-m-1.5 p-1.5">
              <span className="sr-only">Vento</span>
              <img
                alt=""
                src={Logo}
                className="h-8 w-auto"
              />
            </a>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                    <DisclosureButton as="a" onClick={() => setMobileMenuOpen(false)} href="#Inicio" className=" group flex w-full items-center justify-center rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-50 hover:bg-gray-50 hover:text-black">
                      Inicio
                    </DisclosureButton>
                  </Disclosure>
                <Disclosure as="div" className="-mx-3">
                    <DisclosureButton as="a" onClick={() => setMobileMenuOpen(false)} href="#CrearRegistro" className=" group flex w-full items-center justify-center rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-50 hover:bg-gray-50 hover:text-black">
                      Crear Registro
                    </DisclosureButton>
                  </Disclosure>

              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}