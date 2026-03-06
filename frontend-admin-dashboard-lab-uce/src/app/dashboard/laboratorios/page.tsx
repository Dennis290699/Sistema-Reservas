"use client";

import { TopHeader } from "@/components/dashboard/TopHeader";

export default function LaboratoriosPage() {
    return (
        <div className="flex flex-col h-full">
            <TopHeader />

            <div className="flex flex-1 overflow-hidden pb-4">
                <div className="flex-1 overflow-y-auto h-full rounded-3xl bg-[#0D1310] border border-[#1C2721] p-8 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-white">Laboratorios</h1>
                        <button className="bg-[#D3FB52] text-black px-4 py-2 font-semibold rounded-lg hover:bg-[#b0d836] transition-colors">
                            + Nuevo Laboratorio
                        </button>
                    </div>
                    <p className="text-zinc-400 mb-8">Gestión de laboratorios disponibles (Vista en construcción).</p>

                    {/* Placeholder table/grid area */}
                    <div className="bg-[#1C2721] rounded-2xl border border-[#2A3B32] p-6 text-center text-zinc-500 py-16">
                        Aquí se listarán los laboratorios.
                    </div>
                </div>
            </div>
        </div>
    );
}
