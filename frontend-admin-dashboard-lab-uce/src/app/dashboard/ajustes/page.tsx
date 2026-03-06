"use client";

import { TopHeader } from "@/components/dashboard/TopHeader";

export default function AjustesPage() {
    return (
        <div className="flex flex-col h-full">
            <TopHeader />

            <div className="flex flex-1 overflow-hidden pb-4">
                <div className="flex-1 overflow-y-auto h-full rounded-3xl bg-[#0D1310] border border-[#1C2721] p-8 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-white">Ajustes del Sistema</h1>
                    </div>
                    <p className="text-zinc-400 mb-8">Preferencias y ajustes globales de la plataforma (Vista en construcción).</p>

                    {/* Placeholder content area */}
                    <div className="bg-[#1C2721] rounded-2xl border border-[#2A3B32] p-6 text-center text-zinc-500 py-16">
                        Aquí se encontrarán las configuraciones de la aplicación.
                    </div>
                </div>
            </div>
        </div>
    );
}
