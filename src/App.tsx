import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import FormPermohonan from "./components/FormPermohonan";
import RiwayatPermohonan from "./components/RiwayatPermohonan";
import { PdamApplication, ApplicationStatus, RequestType } from "./types";
import { INITIAL_APPLICATIONS } from "./data";
import { ClipboardCheck, Sparkles, Smartphone, Monitor, ChevronRight, Check } from "lucide-react";

type ViewState = "DASHBOARD" | "FORM" | "HISTORY";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>("DASHBOARD");
  const [applications, setApplications] = useState<PdamApplication[]>([]);
  const [recentSubmittedId, setRecentSubmittedId] = useState<string | null>(null);
  const [deviceFrame, setDeviceFrame] = useState(true);

  // Dynamic system clock state for the smartphone mock status bar
  const [systemTime, setSystemTime] = useState("");

  useEffect(() => {
    // Update simple clock
    const updateClock = () => {
      const now = new Date();
      setSystemTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // Hydrate from localStorage on component mount
  useEffect(() => {
    const savedApps = localStorage.getItem("pdam_applications");
    if (savedApps) {
      try {
        const parsed = JSON.parse(savedApps);
        // Clean out legacy legacy boilerplate runs to guarantee a 100% empty initial state in history
        const hasLegacyBoilerplate = parsed.some(
          (app: any) =>
            app.id === "REG-20260618-0021" ||
            app.id === "REG-20260619-0014" ||
            app.id === "REG-20260619-0095"
        );
        if (hasLegacyBoilerplate) {
          setApplications([]);
          localStorage.setItem("pdam_applications", JSON.stringify([]));
        } else {
          setApplications(parsed);
        }
      } catch (err) {
        setApplications([]);
      }
    } else {
      setApplications([]);
      localStorage.setItem("pdam_applications", JSON.stringify([]));
    }
  }, []);

  // Save to localStorage whenever applications alter
  const saveApplications = (updatedList: PdamApplication[]) => {
    setApplications(updatedList);
    localStorage.setItem("pdam_applications", JSON.stringify(updatedList));
  };

  // Submit new form handler
  const handleFormSubmit = (
    newAppData: Omit<PdamApplication, "id" | "status" | "tanggalPengajuan">
  ) => {
    // Generate simple ID, e.g. REG-20260620-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 random digits
    const generatedId = `REG-${dateStr}-${randomSuffix}`;

    const newApplication: PdamApplication = {
      ...newAppData,
      id: generatedId,
      status: ApplicationStatus.PENDING,
      tanggalPengajuan: new Date().toISOString(),
      catatanPetugas: "Permohonan berhasil diterima secara online. Dalam antrean verifikasi berkas administrasi."
    };

    const updated = [newApplication, ...applications];
    saveApplications(updated);
    setRecentSubmittedId(generatedId);
    setCurrentView("DASHBOARD");
  };

  // Cancel past pending application
  const handleCancelApplication = (id: string) => {
    const updated = applications.map((app) => {
      if (app.id === id) {
        return {
          ...app,
          status: ApplicationStatus.REJECTED,
          catatanPetugas: "Dibatalkan oleh Pengaju Permohonan pada tanggal " + new Date().toLocaleDateString("id-ID")
        };
      }
      return app;
    });
    saveApplications(updated);
  };

  // Safe fetch of recently submitted object
  const completedApp = applications.find((a) => a.id === recentSubmittedId);

  return (
    <div id="pdam-app-root" className="min-h-screen bg-[#eceff2] flex flex-col items-center justify-center font-sans">
      
      {/* Desktop Helper & Meta Header */}
      <div className="w-full max-w-4xl mx-auto px-4 pt-6 pb-2 escond-on-mobile hidden lg:flex items-center justify-between text-[#424752] border-b border-neutral-300/40 mb-4">
        <div className="flex flex-col gap-0.5">
          <div className="text-sm font-bold text-[#003f87] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>AI Studio Customer Hub Preview</span>
          </div>
          <h2 className="text-[11px] text-neutral-500 font-medium font-mono">
            Development Mode &bull; Tel: 1500-112 &bull; PDAM Digital Unit
          </h2>
        </div>

        {/* View switcher frame toggle */}
        <div className="flex items-center gap-2 bg-white/85 p-1 rounded-lg border border-neutral-200">
          <button
            type="button"
            onClick={() => setDeviceFrame(true)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              deviceFrame 
                ? "bg-[#003f87] text-white shadow-sm" 
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android View</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceFrame(false)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              !deviceFrame 
                ? "bg-[#003f87] text-white shadow-sm" 
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full Layout</span>
          </button>
        </div>
      </div>

      {/* Main Core Shell wrapper: simulates real device or fills full layout */}
      <div 
        id="app-viewport-wrapper"
        className={`w-full transition-all duration-300 ${
          deviceFrame 
            ? "max-w-[420px] h-[880px] rounded-[38px] border-[12px] border-[#1e293b] shadow-2xl overflow-hidden bg-white flex flex-col relative" 
            : "max-w-md md:max-w-xl mx-auto min-h-screen bg-white shadow-lg flex flex-col"
        }`}
      >
        {/* Device Status Bar if container frame is simulated */}
        {deviceFrame && (
          <div id="device-status-bar" className="bg-[#003f87] h-10 px-6 shrink-0 flex items-center justify-between text-white text-xs select-none border-b border-white/5 font-medium z-10">
            <span className="font-semibold tracking-tight">{systemTime || "07:07"}</span>
            {/* Notch Speaker representation */}
            <div className="w-16 h-4 bg-[#1e293b] rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center">
              <div className="w-8 h-1 bg-neutral-600 rounded-full"></div>
            </div>
            {/* Right indicators */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-teal-300 tracking-wide font-mono bg-teal-950/20 px-1.5 py-0.5 rounded border border-teal-500/10">4G LTE</span>
              {/* Battery indicator */}
              <div className="w-5 h-2.5 bg-neutral-200/20 rounded-xs p-[1px] flex border border-white/40">
                <div className="h-full bg-white w-4 rounded-xs"></div>
              </div>
            </div>
          </div>
        )}

        {/* Inner Content Scaffolding with tab routing */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {currentView === "DASHBOARD" && (
            <Dashboard 
              onNavigateToForm={() => setCurrentView("FORM")}
              onNavigateToHistory={() => setCurrentView("HISTORY")}
              historyCount={applications.length}
            />
          )}

          {currentView === "FORM" && (
            <FormPermohonan 
              onBack={() => setCurrentView("DASHBOARD")}
              onSubmit={handleFormSubmit}
            />
          )}

          {currentView === "HISTORY" && (
            <RiwayatPermohonan 
              applications={applications}
              onBack={() => setCurrentView("DASHBOARD")}
              onCancelApplication={handleCancelApplication}
            />
          )}

        </div>
      </div>

      {/* Tanda Terima / Submission Confirmation Success Modal Overlay */}
      {recentSubmittedId && completedApp && (
        <div id="success-overlay" className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-6 text-center border border-neutral-100 shadow-2xl flex flex-col gap-4 animate-scale-up">
            
            {/* Big Success Check Circle */}
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <ClipboardCheck className="w-8 h-8" />
            </div>

            {/* Header Title */}
            <div>
              <h3 className="text-lg font-extrabold text-neutral-900 leading-tight">
                Permohonan Dikirim!
              </h3>
              <p className="text-xs text-[#565f67] mt-1 pr-1 pl-1">
                Berkas permohonan administrasi Anda telah berhasil diajukan ke sistem pendaftaran pusat PDAM Mobile.
              </p>
            </div>

            {/* Application Receipt Details */}
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/60 text-left space-y-2">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-200/50">
                <span className="text-neutral-400">ID Registrasi</span>
                <strong className="font-mono text-[#003f87] text-[12px]">{completedApp.id}</strong>
              </div>
              <div className="space-y-1.5 pt-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">NPA</span>
                  <span className="text-neutral-800 font-semibold">{completedApp.npa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Pemohon</span>
                  <span className="text-neutral-800 font-medium">{completedApp.namaPelanggan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Jenis Layanan</span>
                  <span className="text-[#0056B3] font-bold text-[11px] truncate max-w-[170px] text-right">
                    {completedApp.jenisPermohonan}
                  </span>
                </div>
              </div>
            </div>

            {/* Milestone Steps indicator */}
            <div className="text-xs text-left p-3 border border-dashed border-teal-200 bg-teal-50/50 rounded-lg space-y-2">
              <div className="font-bold text-teal-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
                <span>Alur Pemrosesan Berkas Anda:</span>
              </div>
              <div className="space-y-1 pl-3.5 text-[11px] text-teal-800 font-medium">
                <div className="flex items-center gap-1.5 text-teal-900">
                  <span className="font-semibold text-green-600">✔</span>
                  <span>1. Masuk di Antrean Verifikasi (Sekarang)</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-60">
                  <span>&bull;</span>
                  <span>2. Penjadwalan Survei Lapangan Petugas</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-60">
                  <span>&bull;</span>
                  <span>3. Penerbitan SPK (Surat Perintah Kerja)</span>
                </div>
              </div>
            </div>

            {/* Primary Dismiss Button */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setRecentSubmittedId(null);
                  setCurrentView("DASHBOARD");
                }}
                className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Ke Beranda
              </button>
              <button
                type="button"
                className="flex-1 py-3 bg-[#0056B3] hover:bg-[#003f87] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                onClick={() => {
                  setRecentSubmittedId(null);
                  setCurrentView("HISTORY");
                }}
              >
                <span>Lihat Riwayat</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Global CSS Transition Animations inside JSX */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { transform: scale(0.94); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        /* Custom scrollbar hiding */
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>

    </div>
  );
}
