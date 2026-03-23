"use client";

import { useEffect, useState } from "react";
import { TopHeader } from "@/components/dashboard/TopHeader";
import { LabService, Lab, Reservation } from "@/services/lab.service";
import { AuthService } from "@/services/auth.service";
import { motion } from "framer-motion";
import { Calendar, MonitorPlay, Activity, Clock, Layers } from "lucide-react";
import { toast } from "sonner";

export default function InicioPage() {
    const [labs, setLabs] = useState<Lab[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [activeReservations, setActiveReservations] = useState(0);
    const [recentUpcoming, setRecentUpcoming] = useState<Reservation[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [adminName, setAdminName] = useState("Administrador");

    const fetchDashboardData = async (silent = false) => {
        try {
            const [labsData, reservationsData] = await Promise.all([
                LabService.listLabs(),
                LabService.getReservations(),
            ]);

            setLabs(labsData);
            setReservations(reservationsData);

            // Calculate active/upcoming reservations using safe string parsing
            const todayStr = new Date().toLocaleString("en-US", { timeZone: "America/Guayaquil" });
            const today = new Date(todayStr);
            const currentHour = today.getHours();
            const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

            const upcoming = reservationsData.filter((res) => {
                const dateStr = String(res.fecha).split("T")[0];
                const parts = dateStr.split("-");
                const resDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])).getTime();

                if (resDate > todayNormalized) return true;
                if (resDate === todayNormalized && res.hora_inicio >= currentHour) return true;
                return false;
            });

            // Sort upcoming safely
            const sortedUpcoming = [...upcoming].sort((a, b) => {
                const dateAStr = String(a.fecha).split("T")[0];
                const dateBStr = String(b.fecha).split("T")[0];
                if (dateAStr > dateBStr) return 1;
                if (dateAStr < dateBStr) return -1;
                return a.hora_inicio - b.hora_inicio;
            });

            setActiveReservations(upcoming.length);
            setRecentUpcoming(sortedUpcoming.slice(0, 5));

            if (isInitialLoading) {
                setIsInitialLoading(false);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            if (!silent) {
                toast.error("Error al conectar con el servidor", {
                    description: "Verifica tu conexión y los servicios en Render.",
                });
                setIsInitialLoading(false);
            }
        }
    };

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user && user.nombre) {
            setAdminName(user.nombre);
        }

        // Initial fetch showing loaders
        fetchDashboardData(false);

        // Silent background polling every 30 seconds
        const intervalId = setInterval(() => {
            fetchDashboardData(true);
        }, 30000);

        return () => clearInterval(intervalId);
    }, []);

    const currentDate = new Intl.DateTimeFormat('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }).format(new Date());

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="flex flex-col h-full">
            <TopHeader />

            <div className="flex flex-1 overflow-hidden pb-4">
                <div className="flex-1 overflow-y-auto h-full rounded-3xl bg-[#0D1310] border border-[#1C2721] p-8 shadow-xl">
                    
                    {/* Welcome Banner */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b border-[#1C2721]"
                    >
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Hola, {adminName} <span className="text-[#D3FB52]">👋</span></h1>
                            <p className="text-zinc-400 font-light flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-zinc-500" /> 
                                <span className="capitalize">{currentDate}</span>
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 px-4 py-2 bg-[#141C18] border border-[#2A3B32] rounded-full flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D3FB52] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D3FB52]"></span>
                            </span>
                            <span className="text-sm font-medium text-zinc-300">Sistema en Línea</span>
                        </div>
                    </motion.div>

                    {/* Dashboard Content */}
                    {isInitialLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Activity className="w-10 h-10 text-[#D3FB52] animate-pulse mb-4" />
                            <p className="text-zinc-500">Sincronizando sistema...</p>
                        </div>
                    ) : (
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-10"
                        >
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#1C2721] to-[#141C18] p-6 rounded-2xl border border-[#2A3B32] shadow-lg flex flex-col justify-between group hover:border-[#3D5246] transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-zinc-400 font-medium">Lanzamientos</h3>
                                        <MonitorPlay className="text-zinc-600 group-hover:text-white transition-colors w-5 h-5" />
                                    </div>
                                    <p className="text-4xl font-bold text-white flex items-end gap-2">
                                        {labs.length} <span className="text-sm font-normal text-zinc-500 mb-1">Laboratorios</span>
                                    </p>
                                </motion.div>

                                <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#1C2721] to-[#141C18] p-6 rounded-2xl border border-[#2A3B32] shadow-lg flex flex-col justify-between group hover:border-[#D3FB52]/30 transition-colors relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D3FB52]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                                    <div className="flex items-center justify-between mb-4 relative z-10">
                                        <h3 className="text-[#D3FB52] font-medium">Próximas Reservas</h3>
                                        <Activity className="text-[#D3FB52]/70 group-hover:text-[#D3FB52] transition-colors w-5 h-5" />
                                    </div>
                                    <p className="text-4xl font-bold text-[#D3FB52] relative z-10 flex items-end gap-2">
                                        {activeReservations} <span className="text-sm font-normal text-[#D3FB52]/60 mb-1">Activas</span>
                                    </p>
                                </motion.div>

                                <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#1C2721] to-[#141C18] p-6 rounded-2xl border border-[#2A3B32] shadow-lg flex flex-col justify-between group hover:border-[#3D5246] transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-zinc-400 font-medium">Volumen Histórico</h3>
                                        <Layers className="text-zinc-600 group-hover:text-white transition-colors w-5 h-5" />
                                    </div>
                                    <p className="text-4xl font-bold text-white flex items-end gap-2">
                                        {reservations.length} <span className="text-sm font-normal text-zinc-500 mb-1">Totales</span>
                                    </p>
                                </motion.div>
                            </div>

                            {/* Recent Activity Table */}
                            <motion.div variants={itemVariants} className="bg-[#141C18] border border-[#1C2721] rounded-2xl overflow-hidden shadow-2xl">
                                <div className="px-6 py-5 border-b border-[#1C2721] flex justify-between items-center bg-[#0D1310]/50">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-[#D3FB52]" />
                                        Actividad Reciente
                                    </h3>
                                    <span className="text-xs font-medium bg-[#1C2721] text-zinc-400 px-3 py-1 rounded-full border border-[#2A3B32]">
                                        Actualización en tiempo real
                                    </span>
                                </div>
                                
                                {recentUpcoming.length === 0 ? (
                                    <div className="p-12 text-center flex flex-col items-center">
                                        <Calendar className="w-12 h-12 text-zinc-700 mb-4" />
                                        <p className="text-zinc-400 font-medium">No hay reservas programadas próximamente</p>
                                        <p className="text-sm text-zinc-600 mt-1">El sistema está vacío por el momento.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-[#1C2721] bg-[#0A0E0C]">
                                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">Laboratorio</th>
                                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">Materia</th>
                                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">Fecha</th>
                                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest text-right">Horario</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#1C2721]">
                                                {recentUpcoming.map((res, i) => (
                                                    <motion.tr 
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        key={`${res.id}-${i}`} 
                                                        className="hover:bg-[#1C2721]/30 transition-colors group"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-2 h-2 rounded-full bg-[#D3FB52] group-hover:shadow-[0_0_8px_#D3FB52] transition-shadow"></div>
                                                                <span className="text-zinc-300 font-medium">{res.lab_nombre || `Lab #${res.lab_id}`}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-zinc-400">
                                                            {res.materia}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <span className="bg-[#1C2721] text-zinc-300 px-3 py-1 rounded-md border border-[#2A3B32]">
                                                                {(() => {
                                                                    try {
                                                                        const dateStr = String(res.fecha).split('T')[0];
                                                                        const [year, month, day] = dateStr.split('-');
                                                                        return `${day}/${month}/${year}`;
                                                                    } catch {
                                                                        return String(res.fecha);
                                                                    }
                                                                })()}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-zinc-300 font-mono text-right">
                                                            {res.hora_inicio}:00 - {res.hora_inicio + 1}:00
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
