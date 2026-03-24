"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Settings, Shield, DatabaseZap, Clock, FileText, AlertTriangle, Save, CalendarDays, Activity, MessageSquareWarning } from "lucide-react";
import { toast } from "sonner";
import { SettingsService, SystemSetting } from "@/services/settings.service";

export default function AjustesGlobalesPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState<string | null>(null); // Realiza toggle de botones
    
    // State Maps para las configuraciones locales antes de inyectarlas
    const [bookingRules, setBookingRules] = useState({ max_days_advance: 14, max_hours_week: 10 });
    const [opsPolicies, setOpsPolicies] = useState({ opening_time: "07:00", closing_time: "21:00", emergency_lockdown: false });
    const [banners, setBanners] = useState({ global_message: "", is_active: false });

    const fetchConfig = async () => {
        try {
            setIsLoading(true);
            const settingsData = await SettingsService.getSettings();
            
            settingsData.forEach(setting => {
                if (setting.key === "booking_rules" && setting.value) setBookingRules(setting.value);
                if (setting.key === "operational_policies" && setting.value) setOpsPolicies(setting.value);
                if (setting.key === "communication_banners" && setting.value) setBanners(setting.value);
            });
        } catch (error: any) {
            console.error("Error al obtener Ajustes Globales", error);
            toast.error("Error crítico de conectividad al extraer las reglas maestras de la base de datos.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleUpdate = async (key: string, data: any) => {
        try {
            setIsSaving(key);
            await SettingsService.updateSetting(key, data);
            toast.success(`La directiva "${key}" fue acoplada a la matriz exitosamente.`);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Desconexión de API, los cambios no se guardaron.");
        } finally {
            setIsSaving(null);
        }
    };

    const handlePurge = async () => {
        if (!window.confirm("🔴 ADVERTENCIA CRÍTICA: Estás a punto de invocar la 'Purga de Data Fría'. Todas las reservaciones obsoletas (> 6 meses) o canceladas desaparecerán totalmente de la interfaz. ¿Deseas ejecutar este comando Maestro?")) return;
        
        try {
            setIsSaving('purge_history');
            const result = await SettingsService.purgeHistory();
            toast.success(`Purga Sistémica completada: Se liberaron ${result.deleted_rows || 0} registros fantasma del servidor central.`);
        } catch (error: any) {
            toast.error("Fallo durante la Directiva de Limpieza Profunda.");
        } finally {
            setIsSaving(null);
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const childVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-full overflow-hidden p-8 justify-center items-center">
                 <span className="relative flex h-16 w-16 mb-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D3FB52] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-16 w-16 bg-[#D3FB52]"></span>
                </span>
                <p className="text-zinc-500 font-mono tracking-widest text-sm uppercase">Cargando Regulaciones del Sistema</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar pb-12">
            {/* Cabecera del Módulo */}
            <header className="w-full flex justify-between items-end mb-8 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Settings className="w-8 h-8 text-[#D3FB52]" />
                        Panel de Control Global
                    </h1>
                    <p className="text-zinc-400 mt-2">Personaliza las directivas del motor de reservas, inyecta alertas masivas, y estabiliza el comportamiento del entorno universitario completo.</p>
                </div>
            </header>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
                {/* Modulo 1: Parámetros Numéricos de Reglas */}
                <motion.div variants={childVariants} className="bg-[#0D1310] border border-[#1C2721] rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-4 mb-6 relative">
                            <div className="w-12 h-12 rounded-xl bg-[#D3FB52]/10 flex items-center justify-center border border-[#D3FB52]/20 shadow-[0_0_20px_rgba(211,251,82,0.1)]">
                                <CalendarDays className="w-6 h-6 text-[#D3FB52]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Límites de Agendamiento</h3>
                                <p className="text-sm font-medium text-zinc-400">Restricciones lógicas anti-monopolización.</p>
                            </div>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-zinc-300">Días de Anticipación (Límite visual calendario)</label>
                                <div className="flex items-center gap-4 bg-[#141C18] border border-[#2A3B32] p-2 rounded-xl">
                                    <input 
                                        type="range" min="1" max="90" 
                                        value={bookingRules.max_days_advance} 
                                        onChange={(e) => setBookingRules({ ...bookingRules, max_days_advance: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-[#2A3B32] rounded-lg appearance-none cursor-pointer accent-[#D3FB52]"
                                    />
                                    <span className="text-[#D3FB52] font-mono font-bold w-12 text-center">{bookingRules.max_days_advance} <span className="text-zinc-600 text-xs text-left">días</span></span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-zinc-300">Límite de Consumo Semanal (Total Horas por cuenta)</label>
                                <div className="flex items-center gap-4 bg-[#141C18] border border-[#2A3B32] p-2 rounded-xl">
                                    <input 
                                        type="range" min="1" max="40" 
                                        value={bookingRules.max_hours_week} 
                                        onChange={(e) => setBookingRules({ ...bookingRules, max_hours_week: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-[#2A3B32] rounded-lg appearance-none cursor-pointer accent-[#D3FB52]"
                                    />
                                    <span className="text-[#D3FB52] font-mono font-bold w-12 text-center">{bookingRules.max_hours_week} <span className="text-zinc-600 text-xs text-left">hrs</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => handleUpdate('booking_rules', bookingRules)}
                        disabled={isSaving === 'booking_rules'}
                        className="w-full py-4 rounded-xl items-center justify-center flex gap-2 font-bold bg-[#1C2721] text-zinc-300 hover:text-[#D3FB52] border border-[#2A3B32] hover:bg-[#D3FB52]/5 hover:border-[#D3FB52]/30 transition-all"
                    >
                        {isSaving === 'booking_rules' ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> : <Save className="w-5 h-5" />}
                        Salvar Límites Matemáticos
                    </button>
                </motion.div>

                {/* Modulo 2: Politicas Operativas y Kill-Switch */}
                <motion.div variants={childVariants} className="bg-[#0D1310] border border-[#1C2721] rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${opsPolicies.emergency_lockdown ? 'bg-red-500/20 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-[#D3FB52]/10 border-[#D3FB52]/20'}`}>
                                <Activity className={`w-6 h-6 ${opsPolicies.emergency_lockdown ? 'text-red-500' : 'text-[#D3FB52]'}`} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Políticas de Operación Local</h3>
                                <p className="text-sm font-medium text-zinc-400">Válvula horaria de la facultad y estado del edificio.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 mb-6">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-400" /> Hora Apertura</label>
                                <input 
                                    type="time" 
                                    value={opsPolicies.opening_time}
                                    onChange={(e) => setOpsPolicies({ ...opsPolicies, opening_time: e.target.value })}
                                    className="w-full bg-[#141C18] border border-[#2A3B32] p-3 text-lg rounded-xl text-white outline-none focus:border-[#D3FB52] transition-colors"
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2"><Clock className="w-4 h-4 text-red-400" /> Hora Cierre</label>
                                <input 
                                    type="time" 
                                    value={opsPolicies.closing_time}
                                    onChange={(e) => setOpsPolicies({ ...opsPolicies, closing_time: e.target.value })}
                                    className="w-full bg-[#141C18] border border-[#2A3B32] p-3 text-lg rounded-xl text-white outline-none focus:border-[#D3FB52] transition-colors"
                                />
                            </div>
                        </div>

                        <div className={`p-5 rounded-2xl border mb-8 transition-colors ${opsPolicies.emergency_lockdown ? 'bg-red-950/30 border-red-900/50' : 'bg-[#141C18] border-[#2A3B32]'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`font-bold flex items-center gap-2 ${opsPolicies.emergency_lockdown ? 'text-red-400' : 'text-zinc-300'}`}>
                                    <Shield className="w-5 h-5" /> Protocolo de Cuarentena (Kill-Switch)
                                </span>
                                <button
                                    onClick={() => setOpsPolicies({ ...opsPolicies, emergency_lockdown: !opsPolicies.emergency_lockdown })}
                                    className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${opsPolicies.emergency_lockdown ? 'bg-red-600' : 'bg-[#2A3B32]'}`}
                                >
                                    <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${opsPolicies.emergency_lockdown ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            <p className="text-xs text-zinc-500">Al encender esto, el sistema cancelará en cascada todas las reservaciones en curso y bloqueará instantáneamente toda la plataforma para los estudiantes por Emergencias o mantenimiento.</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => handleUpdate('operational_policies', opsPolicies)}
                        disabled={isSaving === 'operational_policies'}
                        className={`w-full py-4 rounded-xl items-center justify-center flex gap-2 font-bold transition-all border ${
                            opsPolicies.emergency_lockdown 
                            ? 'bg-red-950 text-red-500 border-red-900/50 hover:bg-red-900/50' 
                            : 'bg-[#1C2721] text-zinc-300 hover:text-[#D3FB52] border-[#2A3B32] hover:bg-[#D3FB52]/5 hover:border-[#D3FB52]/30'
                        }`}
                    >
                        {isSaving === 'operational_policies' ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span> : <Save className="w-5 h-5" />}
                        {opsPolicies.emergency_lockdown ? 'INyectar Apagón a Producción' : 'Actualizar Matrices Operativas'}
                    </button>
                </motion.div>

                {/* Modulo 3: Comunicados Visuales */}
                <motion.div variants={childVariants} className="bg-[#0D1310] border border-[#1C2721] rounded-3xl p-8 flex flex-col justify-between">
                     <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-blue-500/10 border-blue-500/20">
                                <MessageSquareWarning className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Cartelera Digital Informativa</h3>
                                <p className="text-sm font-medium text-zinc-400">Pared masiva de alertas enviada hacia los estudiantes.</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <textarea 
                                rows={3}
                                placeholder="Escribe un anuncio (ej. 'Los laboratorios 12 cerrarán por revisión técnica')"
                                value={banners.global_message}
                                onChange={(e) => setBanners({ ...banners, global_message: e.target.value })}
                                className="w-full bg-[#141C18] border border-[#2A3B32] p-4 rounded-xl text-white outline-none focus:border-blue-500/50 resize-none transition-colors leading-relaxed"
                            />

                            <div className={`p-4 rounded-xl flex items-center justify-between border transition-colors cursor-pointer hover:bg-[#1C2721]/50 ${banners.is_active ? 'border-blue-500/30 bg-blue-900/10' : 'border-[#2A3B32] bg-[#141C18]'}`} onClick={() => setBanners({ ...banners, is_active: !banners.is_active })}>
                                <div>
                                    <h4 className={`font-semibold ${banners.is_active ? 'text-blue-400' : 'text-zinc-300'}`}>Visualizar Cartel Central</h4>
                                    <p className="text-xs text-zinc-500">Activa esta capa para incrustar gráficamente el mensaje escrito dentro de las pantallas y sesiones activas de todos los usuarios.</p>
                                </div>
                                <div className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${banners.is_active ? 'bg-blue-600' : 'bg-[#2A3B32]'}`}>
                                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${banners.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => handleUpdate('communication_banners', banners)}
                        disabled={isSaving === 'communication_banners'}
                        className="w-full py-4 rounded-xl items-center justify-center flex gap-2 font-bold bg-[#1C2721] text-zinc-300 hover:text-blue-400 border border-[#2A3B32] hover:bg-blue-500/5 hover:border-blue-500/30 transition-all"
                    >
                        {isSaving === 'communication_banners' ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> : <FileText className="w-5 h-5" />}
                        Publicar Señalización Inmediata
                    </button>
                </motion.div>

                {/* Modulo 4: Mantenimiento Base de Datos (Zona Peligro) */}
                <motion.div variants={childVariants} className="bg-[#1a1c14] border border-[#3b3a2a] rounded-3xl p-8 flex flex-col justify-between shadow-[inset_0_0_80px_rgba(255,200,0,0.02)]">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-orange-500/10 border-orange-500/20">
                                <DatabaseZap className="w-6 h-6 text-orange-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Mantenimiento Base de Datos</h3>
                                <p className="text-sm font-medium text-orange-400">Alivio de Servidor con optimizador nativo.</p>
                            </div>
                        </div>

                        <div className="flex bg-orange-950/30 p-4 rounded-xl border border-orange-900/50 mb-8 border-l-4 border-l-orange-500">
                             <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0 mr-3 mt-1" />
                             <div>
                                 <h4 className="text-orange-400 font-bold text-sm mb-1">Impacto Estructural Inmediato</h4>
                                 <p className="text-xs text-orange-200/70 leading-relaxed">
                                     Lanzar este script escanea y desintegra permanentemente los historiales viejos y registros marcados como 'cancelados' reduciendo la carga de ancho de banda y renderizado del Dashboard Administrativo para picos masivos.
                                 </p>
                             </div>
                        </div>
                    </div>

                    <button 
                        onClick={handlePurge}
                        disabled={isSaving === 'purge_history'}
                        className="w-full py-4 rounded-xl items-center justify-center flex gap-2 font-bold bg-[#2C2112] text-orange-500 hover:bg-orange-600 hover:text-black border border-orange-900/50 hover:border-orange-500 transition-all shadow-[0_4px_15px_rgba(249,115,22,0.1)]"
                    >
                        {isSaving === 'purge_history' ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span> : <DatabaseZap className="w-5 h-5" />}
                        Invocar Limpieza Profunda
                    </button>
                </motion.div>
                
            </motion.div>
        </div>
    );
}
