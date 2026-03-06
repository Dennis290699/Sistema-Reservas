"use client";

import { useEffect, useState } from "react";
import { Settings, Bell } from "lucide-react";
import { toast } from "sonner";
import { AuthService, AuthResponse } from "@/services/auth.service";

export function TopHeader() {
    const [user, setUser] = useState<AuthResponse['user'] | null>(null);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        // eslint-disable-next-line
        setUser(user as any);
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Buenos días";
        if (hour >= 12 && hour < 19) return "Buenas tardes";
        return "Buenas noches";
    };

    const getInitials = (name?: string) => {
        if (!name) return "AD";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <header className="w-full flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#2A3B32] border-2 border-[#D3FB52] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(211,251,82,0.2)]">
                        <span className="text-[#D3FB52] font-bold text-lg tracking-wider">
                            {getInitials(user?.nombre)}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white whitespace-nowrap">
                            {getGreeting()}, <span className="text-[#D3FB52]">{user ? user.nombre.split(" ")[0] : "Admin"}</span>
                        </h2>
                        <p className="text-sm text-zinc-400 font-medium">Administrador del Sistema</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 text-zinc-400">
                    <button
                        onClick={() => toast.info("Configuraciones rápidas en desarrollo")}
                        className="p-2 hover:bg-[#1C2721] rounded-full hover:text-white transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => toast.info("No tienes notificaciones nuevas")}
                        className="p-2 hover:bg-[#1C2721] rounded-full hover:text-white transition-colors relative"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D3FB52] rounded-full"></span>
                    </button>
                </div>
            </div>
        </header>
    );
}
