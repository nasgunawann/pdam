import React from "react";
import { PlusCircle, RotateCcw, Info, ArrowLeft } from "lucide-react";

interface DashboardProps {
  onNavigateToForm: () => void;
  onNavigateToHistory: () => void;
  historyCount: number;
}

export default function Dashboard({
  onNavigateToForm,
  onNavigateToHistory,
  historyCount
}: DashboardProps) {
  return (
    <div className="flex flex-col flex-1 bg-background text-on-background animate-fade-in">
      {/* Top Bar matching Image 1 */}
      <header id="dashboard-header" className="bg-[#003f87] text-white px-4 py-4 flex items-center shadow-md">
        <button 
          id="dashboard-back-btn"
          onClick={() => alert("Anda berada di halaman utama Layanan Pelanggan PDAM.")} 
          className="mr-4 hover:bg-white/10 p-1.5 rounded-full transition-colors duration-150"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 id="dashboard-title" className="text-xl font-bold tracking-wide">PDAM Mobile</h1>
      </header>

      {/* Main Container */}
      <main className="flex-1 px-6 py-8 flex flex-col items-center max-w-md mx-auto w-full">
        {/* Droplet Card Wrapper */}
        <div id="droplet-card" className="bg-white rounded-[24px] p-8 border border-neutral-200/80 shadow-md/5 flex items-center justify-center w-56 h-56 mt-4 mb-9 transition-transform duration-300 hover:scale-[1.02]">
          <div className="relative flex items-center justify-center w-full h-full">
            <img 
              src="/public/tirta.png" 
              alt="Logo PDAM" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Text Headers */}
        <div className="text-center mb-8 max-w-sm">
          <h2 id="hero-heading" className="text-2xl font-extrabold text-[#191c1d] tracking-tight leading-8 mb-3">
            Layanan Pelanggan<br />PDAM
          </h2>
          <p id="hero-subtext" className="text-sm text-[#424752] leading-released font-normal antialiased">
            Ajukan permohonan administrasi Anda dengan mudah dan cepat melalui aplikasi ini.
          </p>
        </div>

        {/* Call to Actions (Menu Buttons) */}
        <div className="w-full space-y-4 mb-8">
          <button
            id="btn-buat-permohonan"
            onClick={onNavigateToForm}
            className="w-full bg-[#0056B3] hover:bg-[#003f87] text-white font-semibold py-3.5 px-6 rounded-lg transition-colors duration-200 shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 text-[15px]"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Buat Permohonan</span>
          </button>

          <button
            id="btn-riwayat-permohonan"
            onClick={onNavigateToHistory}
            className="w-full bg-white border-2 border-[#0056B3] hover:bg-neutral-50 text-[#0056B3] font-semibold py-3 px-6 rounded-lg transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 text-[15px] relative"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Riwayat Permohonan</span>
            {historyCount > 0 && (
              <span className="absolute right-4 bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>
        </div>

        {/* Info box matches Image 1 */}
        <div id="info-box-layanan" className="w-full bg-[#f1f3f9] border border-neutral-200 rounded-xl p-4 flex gap-4 items-start shadow-sm/5">
          <div className="bg-[#d7e2ff] p-2 rounded-full flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-[#003f87] stroke-[2.5]" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-[14px] font-bold text-[#191c1d]">Informasi Layanan</h4>
            <p className="text-xs text-[#424752] leading-5">
              Layanan kami tersedia 24 jam untuk pengajuan permohonan online.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="py-6 mt-auto text-center border-t border-neutral-100">
        <p className="text-xs text-neutral-400 font-medium">PDAM Mobile Customer Hub &bull; 2026</p>
      </footer>
    </div>
  );
}
