"use client";

import { TopHeader } from "@/components/dashboard/TopHeader";

export default function InicioPage() {
    return (
        <div className="flex flex-col h-full">
            <TopHeader />

            <div className="flex flex-1 overflow-hidden pb-4">
                <div className="flex-1 overflow-y-auto h-full rounded-3xl bg-[#0D1310] border border-[#1C2721] p-8 shadow-xl">
                    <h1 className="text-3xl font-bold text-white mb-6">Bienvenido al Panel de Control</h1>
                    <p className="text-zinc-400">
                        Desde aquí puedes administrar los laboratorios, visualizar reservas y gestionar usuarios del sistema.
                        Selecciona una opción del menú lateral para comenzar.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        {/* Placeholder Cards for Future Stats */}
                        <div className="bg-[#1C2721] p-6 rounded-2xl border border-[#2A3B32]">
                            <h3 className="text-zinc-400 font-medium mb-2">Total Laboratorios</h3>
                            <p className="text-3xl font-bold text-white">--</p>
                        </div>
                        <div className="bg-[#1C2721] p-6 rounded-2xl border border-[#2A3B32]">
                            <h3 className="text-zinc-400 font-medium mb-2">Reservas Activas</h3>
                            <p className="text-3xl font-bold text-[#D3FB52]">--</p>
                        </div>
                        <div className="bg-[#1C2721] p-6 rounded-2xl border border-[#2A3B32]">
                            <h3 className="text-zinc-400 font-medium mb-2">Usuarios Registrados</h3>
                            <p className="text-3xl font-bold text-white">--</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
