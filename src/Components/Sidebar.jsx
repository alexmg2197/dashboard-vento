import {React,useState, useEffect} from "react";
import Logo from '../assets/logo-vento.png'
import LogoS from '../assets/vento-logo.png'

export default function Sidebar({ sidebarOpen,toggleSidebar }) {

    const [mostrarCatalogos, setMostrarCatalogos] = useState(false);

    const toggleVisibilidadCatalogos = () => {
        setMostrarCatalogos(!mostrarCatalogos);
    };

    return (
       <>
            <div className={`relative z-[9999] bg-blue-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-20'} h-screen hidden md:block overflow-visible`}>
                <div className="flex justify-center items-center pt-4">
                    <a href="#Inicio" className="-m-1.5 p-1.5">
                        <span className="sr-only">Vento</span>
                        <img alt="" src={sidebarOpen ? Logo : LogoS} className={`${sidebarOpen ? 'h-10' : 'h-13'} w-auto`} />
                    </a>
                </div>
                <ul className="space-y-2 pt-10">
                    <li>
                        <a href="#Inicio" className={`flex items-center ${!sidebarOpen ? 'justify-center' : ''} p-2 text-white hover:text-blue-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group mx-2 transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 rounded-full`}>
                            {
                                sidebarOpen ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 512 512"><path fill="currentColor" d="M261.56 101.28a8 8 0 0 0-11.06 0L66.4 277.15a8 8 0 0 0-2.47 5.79L63.9 448a32 32 0 0 0 32 32H192a16 16 0 0 0 16-16V328a8 8 0 0 1 8-8h80a8 8 0 0 1 8 8v136a16 16 0 0 0 16 16h96.06a32 32 0 0 0 32-32V282.94a8 8 0 0 0-2.47-5.79Z"/><path fill="currentColor" d="m490.91 244.15l-74.8-71.56V64a16 16 0 0 0-16-16h-48a16 16 0 0 0-16 16v32l-57.92-55.38C272.77 35.14 264.71 32 256 32c-8.68 0-16.72 3.14-22.14 8.63l-212.7 203.5c-6.22 6-7 15.87-1.34 22.37A16 16 0 0 0 43 267.56L250.5 69.28a8 8 0 0 1 11.06 0l207.52 198.28a16 16 0 0 0 22.59-.44c6.14-6.36 5.63-16.86-.76-22.97"/></svg>
                                        <span className="ms-3">Home</span>
                                    </>
                                ) : (
                                        <>
                                            <div className="group relative rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 512 512"><path fill="currentColor" d="M261.56 101.28a8 8 0 0 0-11.06 0L66.4 277.15a8 8 0 0 0-2.47 5.79L63.9 448a32 32 0 0 0 32 32H192a16 16 0 0 0 16-16V328a8 8 0 0 1 8-8h80a8 8 0 0 1 8 8v136a16 16 0 0 0 16 16h96.06a32 32 0 0 0 32-32V282.94a8 8 0 0 0-2.47-5.79Z"/><path fill="currentColor" d="m490.91 244.15l-74.8-71.56V64a16 16 0 0 0-16-16h-48a16 16 0 0 0-16 16v32l-57.92-55.38C272.77 35.14 264.71 32 256 32c-8.68 0-16.72 3.14-22.14 8.63l-212.7 203.5c-6.22 6-7 15.87-1.34 22.37A16 16 0 0 0 43 267.56L250.5 69.28a8 8 0 0 1 11.06 0l207.52 198.28a16 16 0 0 0 22.59-.44c6.14-6.36 5.63-16.86-.76-22.97"/></svg>
                                                <div className="absolute top-1/2 -translate-y-1/2 -right-8 translate-x-full z-[9999] hidden group-hover:flex bg-zinc-800 p-2 rounded-md shadow-lg">
                                                    <span className="text-zinc-400 whitespace-nowrap">Inicio</span>
                                                    <div className="bg-inherit rotate-45 p-1 absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2" />
                                                </div>
                                            </div>
                                        </>
                                )
                            }
                        </a>
                    </li>
                    <li>
                        <a href="#AgregarMerma" className={`flex items-center ${!sidebarOpen ? 'justify-center' : ''} p-2 text-white hover:text-blue-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group mx-2 transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2`}>
                            {
                                sidebarOpen ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20"><path fill="currentColor" d="M6 2.207V4h2.293l-1.94-1.94A.207.207 0 0 0 6 2.208M5 4V2.207a1.207 1.207 0 0 1 2.06-.853L9 3.293V2.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5V4h.999a.5.5 0 0 1 .497.557L15.149 16.23A2 2 0 0 1 13.163 18H6.836a2 2 0 0 1-1.986-1.77L3.502 4.556A.5.5 0 0 1 4 4zm9 0V2.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V4zm-2.701 3.75a1.5 1.5 0 0 0-2.598 0l-.452.782a.5.5 0 1 0 .866.5l.452-.782a.5.5 0 0 1 .866 0l.451.782a.5.5 0 0 0 .867-.5zm.866 3.5a.5.5 0 0 1-.433.75H11a.5.5 0 0 0 0 1h.732a1.5 1.5 0 0 0 1.299-2.25l-.107-.186a.5.5 0 0 0-.867.5zM9 12h-.732a.5.5 0 0 1-.433-.75l.107-.186a.5.5 0 0 0-.866-.5l-.107.186A1.5 1.5 0 0 0 8.268 13H9a.5.5 0 0 0 0-1"/></svg>
                                        <span className="ms-3">Regitro de Merma</span>
                                    </>
                                ) : (
                                        <>
                                        <div className="group relative rounded-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20"><path fill="currentColor" d="M6 2.207V4h2.293l-1.94-1.94A.207.207 0 0 0 6 2.208M5 4V2.207a1.207 1.207 0 0 1 2.06-.853L9 3.293V2.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5V4h.999a.5.5 0 0 1 .497.557L15.149 16.23A2 2 0 0 1 13.163 18H6.836a2 2 0 0 1-1.986-1.77L3.502 4.556A.5.5 0 0 1 4 4zm9 0V2.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V4zm-2.701 3.75a1.5 1.5 0 0 0-2.598 0l-.452.782a.5.5 0 1 0 .866.5l.452-.782a.5.5 0 0 1 .866 0l.451.782a.5.5 0 0 0 .867-.5zm.866 3.5a.5.5 0 0 1-.433.75H11a.5.5 0 0 0 0 1h.732a1.5 1.5 0 0 0 1.299-2.25l-.107-.186a.5.5 0 0 0-.867.5zM9 12h-.732a.5.5 0 0 1-.433-.75l.107-.186a.5.5 0 0 0-.866-.5l-.107.186A1.5 1.5 0 0 0 8.268 13H9a.5.5 0 0 0 0-1"/></svg>
                                           <div className="absolute top-1/2 -translate-y-1/2 -right-8 translate-x-full z-[9999] hidden group-hover:flex bg-zinc-800 p-2 rounded-md shadow-lg">
                                                <span className="text-zinc-400 whitespace-nowrap">Registro de merma</span>
                                                <div className="bg-inherit rotate-45 p-1 absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2" />
                                            </div>

                                        </div>
                                        </>
                                )
                            }
                        </a>
                    </li>
                    <li>
                        <a href="#VerMerma" className={`flex items-center ${!sidebarOpen ? 'justify-center' : ''} p-2 text-white hover:text-blue-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group mx-2 transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2`}>
                            {
                                sidebarOpen ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7H3V3h18zM9.14 19.75c.18.44.4.86.64 1.25H4V8h16v5.55c-.94-.36-1.95-.55-3-.55c-3.5 0-6.57 2.06-7.86 5.25l-.29.75zM9 13h6v-1.5c0-.28-.22-.5-.5-.5h-5c-.28 0-.5.22-.5.5zm8 5c-.56 0-1 .44-1 1s.44 1 1 1s1-.44 1-1s-.44-1-1-1m6 1c-.94 2.34-3.27 4-6 4s-5.06-1.66-6-4c.94-2.34 3.27-4 6-4s5.06 1.66 6 4m-3.5 0a2.5 2.5 0 0 0-5 0a2.5 2.5 0 0 0 5 0"/></svg>
                                        <span className="ms-3">Ver Merma</span>
                                    </>
                                ) : (
                                        <>
                                        <div className="group relative rounded-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7H3V3h18zM9.14 19.75c.18.44.4.86.64 1.25H4V8h16v5.55c-.94-.36-1.95-.55-3-.55c-3.5 0-6.57 2.06-7.86 5.25l-.29.75zM9 13h6v-1.5c0-.28-.22-.5-.5-.5h-5c-.28 0-.5.22-.5.5zm8 5c-.56 0-1 .44-1 1s.44 1 1 1s1-.44 1-1s-.44-1-1-1m6 1c-.94 2.34-3.27 4-6 4s-5.06-1.66-6-4c.94-2.34 3.27-4 6-4s5.06 1.66 6 4m-3.5 0a2.5 2.5 0 0 0-5 0a2.5 2.5 0 0 0 5 0"/></svg>
                                            <div className="absolute top-1/2 -translate-y-1/2 -right-8 translate-x-full z-[9999] hidden group-hover:flex bg-zinc-800 p-2 rounded-md shadow-lg">
                                                    <span className="text-zinc-400 whitespace-nowrap">Ver merma</span>
                                                    <div className="bg-inherit rotate-45 p-1 absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2" />
                                            </div>
                                        </div>
                                        </>
                                )
                            }
                        </a>
                    </li>
                    <li>
                        <a href="#Catalogos" className={`flex items-center ${!sidebarOpen ? 'justify-center' : ''} p-2 text-white hover:text-blue-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group mx-2 transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2`}>
                            {
                                sidebarOpen ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 512 512"><path fill="currentColor" d="M202.24 74C166.11 56.75 115.61 48.3 48 48a31.36 31.36 0 0 0-17.92 5.33A32 32 0 0 0 16 79.9V366c0 19.34 13.76 33.93 32 33.93c71.07 0 142.36 6.64 185.06 47a4.11 4.11 0 0 0 6.94-3V106.82a15.9 15.9 0 0 0-5.46-12A143 143 0 0 0 202.24 74m279.68-20.7A31.33 31.33 0 0 0 464 48c-67.61.3-118.11 8.71-154.24 26a143.3 143.3 0 0 0-32.31 20.78a15.93 15.93 0 0 0-5.45 12v337.13a3.93 3.93 0 0 0 6.68 2.81c25.67-25.5 70.72-46.82 185.36-46.81a32 32 0 0 0 32-32v-288a32 32 0 0 0-14.12-26.61"/></svg>
                                        <span className="ms-3">Catalogos</span>
                                    </>
                                ) : (
                                        <>
                                        <div className="group relative rounded-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 512 512"><path fill="currentColor" d="M202.24 74C166.11 56.75 115.61 48.3 48 48a31.36 31.36 0 0 0-17.92 5.33A32 32 0 0 0 16 79.9V366c0 19.34 13.76 33.93 32 33.93c71.07 0 142.36 6.64 185.06 47a4.11 4.11 0 0 0 6.94-3V106.82a15.9 15.9 0 0 0-5.46-12A143 143 0 0 0 202.24 74m279.68-20.7A31.33 31.33 0 0 0 464 48c-67.61.3-118.11 8.71-154.24 26a143.3 143.3 0 0 0-32.31 20.78a15.93 15.93 0 0 0-5.45 12v337.13a3.93 3.93 0 0 0 6.68 2.81c25.67-25.5 70.72-46.82 185.36-46.81a32 32 0 0 0 32-32v-288a32 32 0 0 0-14.12-26.61"/></svg>
                                            <div className="absolute top-1/2 -translate-y-1/2 -right-8 translate-x-full z-[9999] hidden group-hover:flex bg-zinc-800 p-2 rounded-md shadow-lg">
                                                    <span className="text-zinc-400 whitespace-nowrap">Catalogos</span>
                                                    <div className="bg-inherit rotate-45 p-1 absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2" />
                                            </div>
                                        </div>
                                        </>
                                )
                            }
                        </a>
                    </li>
                </ul>
            </div>

                  
       </>
  );
}