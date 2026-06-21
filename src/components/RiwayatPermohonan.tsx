import React, { useState } from "react";
import { ArrowLeft, Search, Calendar, Phone, MapPin, User, FileText, CheckCircle, Clock, AlertTriangle, Trash2, ShieldAlert } from "lucide-react";
import { PdamApplication, ApplicationStatus } from "../types";

interface RiwayatPermohonanProps {
  applications: PdamApplication[];
  onBack: () => void;
  onCancelApplication: (id: string) => void;
}

export default function RiwayatPermohonan({
  applications,
  onBack,
  onCancelApplication
}: RiwayatPermohonanProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("Semua");
  const [selectedApp, setSelectedApp] = useState<PdamApplication | null>(null);

  // Filter categories helper
  const filters = ["Semua", "Menunggu Verifikasi", "Dalam Proses", "Disetujui", "Ditolak"];

  // Perform search and filter
  const filteredApps = applications.filter((app) => {
    const matchesSearch = 
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.npa.includes(searchTerm) ||
      app.namaPelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jenisPermohonan.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === "Semua") {
      return matchesSearch;
    }
    return matchesSearch && app.status === activeFilter;
  });

  // Color functions for status badge
  const getStatusBadgeClass = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPROVED:
        return "bg-green-100 text-green-800 border-green-200";
      case ApplicationStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ApplicationStatus.PENDING:
        return "bg-amber-100 text-amber-800 border-amber-200";
      case ApplicationStatus.REJECTED:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPROVED:
        return <CheckCircle className="w-4 h-4 text-green-700" />;
      case ApplicationStatus.IN_PROGRESS:
        return <Clock className="w-4 h-4 text-blue-700 animate-pulse" />;
      case ApplicationStatus.PENDING:
        return <Clock className="w-4 h-4 text-amber-700" />;
      case ApplicationStatus.REJECTED:
        return <ShieldAlert className="w-4 h-4 text-red-700" />;
    }
  };

  // Date formatter
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="flex flex-col flex-1 bg-background text-on-background animate-fade-in">
      {/* Top Bar */}
      <header className="bg-[#003f87] text-white px-4 py-4 flex items-center shadow-md">
        <button 
          onClick={onBack} 
          className="mr-4 hover:bg-white/10 p-1.5 rounded-full transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold tracking-wide">Riwayat Permohonan</h1>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full pb-10">
        
        {/* Search Input Box */}
        <div className="relative mb-4">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari NPA, Nama Pemohon, atau Registry ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-11 pr-4 bg-white border border-neutral-300 rounded-lg text-sm text-[#191c1d] placeholder:text-neutral-400 focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3] transition-all shadow-sm"
          />
        </div>

        {/* Filter Scrollable Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-4 px-4 scrollbar-none">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeFilter === filter
                  ? "bg-[#0056B3] hover:bg-[#003f87] text-white border-[#0056B3] shadow-sm"
                  : "bg-white hover:bg-neutral-50 text-neutral-600 border-neutral-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Request Items List */}
        <div className="flex-1 space-y-3">
          {filteredApps.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-neutral-200 p-6">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-neutral-700">Tidak Ada Rekam Data</p>
              <p className="text-xs text-neutral-500 mt-1 max-w-[240px] mx-auto">
                {searchTerm 
                  ? "Pencarian Anda tidak menemukan hasil yang cocok." 
                  : "Belum ada berkas permohonan dengan status pilihan Anda."}
              </p>
            </div>
          ) : (
            filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm hover:border-[#0056B3] transition-all cursor-pointer flex flex-col gap-3 group active:scale-[0.99]"
              >
                {/* ID & Badge row */}
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-neutral-400 font-mono">
                    {app.id}
                  </span>
                  <span className={`text-[11.5px] font-bold px-2.5 py-1 rounded border flex items-center gap-1.5 ${getStatusBadgeClass(app.status)}`}>
                    {getStatusIcon(app.status)}
                    {app.status}
                  </span>
                </div>

                {/* Main description details */}
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-neutral-900 leading-tight group-hover:text-[#0056B3] transition-colors">
                    {app.jenisPermohonan}
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">NPA: <span className="text-neutral-800 font-semibold">{app.npa}</span></p>
                  <p className="text-xs text-neutral-500 truncate">Pemohon: <span className="text-neutral-800 font-medium">{app.namaPelanggan}</span></p>
                </div>

                {/* Date footer */}
                <div className="flex justify-between items-center text-[10.5px] text-neutral-400 border-t border-neutral-100 pt-2 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(app.tanggalPengajuan)}
                  </span>
                  <span className="text-[#0056B3] font-bold group-hover:underline">Lihat Detail &raquo;</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Details Box Drawer/Modal Overlay */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-[20px] sm:rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl transition-all animate-slide-up pb-8">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-neutral-100 px-5 py-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-neutral-400 font-mono uppercase tracking-widest">Detail Dokumen</span>
                <span className="text-sm font-extrabold text-neutral-900 mt-0.5">{selectedApp.id}</span>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="p-1.5 hover:bg-neutral-100 rounded-full text-neutral-500 transition-colors"
                aria-label="Tutup"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-5 py-4 space-y-5">
              
              {/* Dynamic Status Banner */}
              <div className={`p-3.5 rounded-lg border flex items-start gap-3 ${getStatusBadgeClass(selectedApp.status)}`}>
                <div className="mt-0.5">{getStatusIcon(selectedApp.status)}</div>
                <div>
                  <h4 className="text-xs font-bold leading-none">Status: {selectedApp.status}</h4>
                  <p className="text-[11px] opacity-80 mt-1">
                    Diajukan pada {formatDate(selectedApp.tanggalPengajuan)}
                  </p>
                </div>
              </div>

              {/* Subscriber & Request Details */}
              <div className="space-y-3.5">
                <div className="text-xs text-neutral-500 uppercase tracking-widest font-extrabold">Informasi Pemohon</div>
                
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 space-y-3">
                  <div className="flex items-start gap-2 text-xs">
                    <User className="w-4 h-4 text-[#0056B3] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-neutral-400 block">NPA / Nama</span>
                      <strong className="text-neutral-800">{selectedApp.npa}</strong> - <span className="text-neutral-700 font-medium">{selectedApp.namaPelanggan}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs">
                    <Phone className="w-4 h-4 text-[#0056B3] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-neutral-400 block">Kontak Telepon</span>
                      <strong className="text-neutral-700">{selectedApp.nomorHp}</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs">
                    <MapPin className="w-4 h-4 text-[#0056B3] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-neutral-400 block">Alamat Pemasangan/Komplain</span>
                      <span className="text-neutral-700 font-medium leading-relaxed">{selectedApp.alamat}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirement Details */}
              <div className="space-y-2">
                <div className="text-xs text-neutral-500 uppercase tracking-widest font-extrabold">Layanan & Alasan</div>
                <div className="p-4 bg-white border border-neutral-200 rounded-xl">
                  <div className="text-xs font-bold text-[#0056B3] mb-1">{selectedApp.jenisPermohonan}</div>
                  <p className="text-xs text-neutral-600 leading-relaxed italic bg-neutral-50/50 p-2.5 rounded border border-neutral-100 mt-2">
                    &ldquo;{selectedApp.alasanPermohonan}&rdquo;
                  </p>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className="space-y-2">
                <div className="text-xs text-neutral-500 uppercase tracking-widest font-extrabold">Berkas Lampiran</div>
                <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100 overflow-hidden">
                  {selectedApp.attachments.ktpName && (
                    <div className="p-3 flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-700 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-neutral-400" /> KTP
                      </span>
                      <span className="text-neutral-500 text-[10.5px] truncate max-w-[180px] font-mono">
                        {selectedApp.attachments.ktpName}
                      </span>
                    </div>
                  )}
                  {selectedApp.attachments.rekeningAirName && (
                    <div className="p-3 flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-700 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-neutral-400" /> Rekening Air
                      </span>
                      <span className="text-neutral-500 text-[10.5px] truncate max-w-[180px] font-mono">
                        {selectedApp.attachments.rekeningAirName}
                      </span>
                    </div>
                  )}
                  {selectedApp.attachments.aktaJualBeliName && (
                    <div className="p-3 flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-700 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-neutral-400" /> Akta Jual Beli
                      </span>
                      <span className="text-neutral-500 text-[10.5px] truncate max-w-[180px] font-mono">
                        {selectedApp.attachments.aktaJualBeliName}
                      </span>
                    </div>
                  )}
                  {selectedApp.attachments.berkasLainnyaName && (
                    <div className="p-3 flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-700 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-neutral-400" /> Dokumen Lainnya
                      </span>
                      <span className="text-neutral-500 text-[10.5px] truncate max-w-[180px] font-mono">
                        {selectedApp.attachments.berkasLainnyaName}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Operator / Admin Followup Notes */}
              <div className="space-y-2">
                <div className="text-xs text-neutral-500 uppercase tracking-widest font-extrabold">Catatan Tindak Lanjut</div>
                <div className="bg-blue-50/50 border border-blue-200/60 p-4 rounded-xl text-xs">
                  <div className="font-semibold text-blue-900 mb-0.5">Tanggapan Petugas Lapangan:</div>
                  <p className="text-blue-800 leading-relaxed">
                    {selectedApp.catatanPetugas || "Permohonan Anda masuk antrean verifikasi berkas administrasi. Mohon pantau status secara berkala."}
                  </p>
                </div>
              </div>

              {/* Cancel Button if Pending */}
              {selectedApp.status === ApplicationStatus.PENDING && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Apakah Anda yakin ingin membatalkan permohonan ini? Tindakan ini tidak dapat dibatalkan.")) {
                      onCancelApplication(selectedApp.id);
                      setSelectedApp(null);
                    }
                  }}
                  className="w-full mt-4 h-11 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg border border-red-200 text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Batalkan & Tarik Permohonan</span>
                </button>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
