import React, { useState, useRef } from "react";
import { ArrowLeft, Play, Paperclip, X, Check, HelpCircle } from "lucide-react";
import { RequestType, PdamApplication, ApplicationStatus } from "../types";

interface FormPermohonanProps {
  onBack: () => void;
  onSubmit: (application: Omit<PdamApplication, "id" | "status" | "tanggalPengajuan">) => void;
}

export default function FormPermohonan({ onBack, onSubmit }: FormPermohonanProps) {
  // Form input states
  const [npa, setNpa] = useState("");
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [nomorHp, setNomorHp] = useState("");
  const [jenisPermohonan, setJenisPermohonan] = useState("");
  const [alasanPermohonan, setAlasanPermohonan] = useState("");

  // File names states
  const [selectedType, setSelectedType] = useState<"ktp" | "rekAir" | "ajb" | "berkasLain">("ktp");
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [rekAirFile, setRekAirFile] = useState<File | null>(null);
  const [ajbFile, setAjbFile] = useState<File | null>(null);
  const [berkasLainFile, setBerkasLainFile] = useState<File | null>(null);

  // Validation feedback state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs for hidden inputs
  const ktpInputRef = useRef<HTMLInputElement>(null);
  const rekAirInputRef = useRef<HTMLInputElement>(null);
  const ajbInputRef = useRef<HTMLInputElement>(null);
  const berkasLainInputRef = useRef<HTMLInputElement>(null);

  const handleSelectType = (type: "ktp" | "rekAir" | "ajb" | "berkasLain") => {
    setSelectedType(type);
    
    // Clear other file uploads when type switches to ensure exactly one is chosen
    if (type !== "ktp") setKtpFile(null);
    if (type !== "rekAir") setRekAirFile(null);
    if (type !== "ajb") setAjbFile(null);
    if (type !== "berkasLain") setBerkasLainFile(null);
    
    // Delete any previous error status
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.lampiran;
      return copy;
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
      // clear error too
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.lampiran;
        return copy;
      });
    }
  };

  const clearFile = (
    ref: React.RefObject<HTMLInputElement | null>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (ref.current) ref.current.value = "";
    setter(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!npa.trim()) {
      newErrors.npa = "Nomor Pelanggan (NPA) wajib diisi";
    } else if (!/^\d+$/.test(npa)) {
      newErrors.npa = "NPA hanya boleh berisi angka";
    } else if (npa.length < 8 || npa.length > 15) {
      newErrors.npa = "NPA biasanya terdiri dari 8 hingga 15 digit";
    }

    if (!namaPelanggan.trim()) {
      newErrors.namaPelanggan = "Nama Pelanggan wajib diisi";
    } else if (namaPelanggan.trim().length < 3) {
      newErrors.namaPelanggan = "Nama Pemohon terlalu pendek";
    }

    if (!alamat.trim()) {
      newErrors.alamat = "Alamat Lengkap wajib diisi";
    } else if (alamat.trim().length < 10) {
      newErrors.alamat = "Alamat harus diisi lengkap demi validasi lapangan";
    }

    if (!nomorHp.trim()) {
      newErrors.nomorHp = "Nomor HP wajib diisi";
    } else if (!/^08\d{8,12}$/.test(nomorHp)) {
      newErrors.nomorHp = "Nomor HP tidak valid (Mulai dengan 08, 10-14 digit)";
    }

    if (!jenisPermohonan) {
      newErrors.jenisPermohonan = "Wajib memilih Jenis Permohonan";
    }

    if (!alasanPermohonan.trim()) {
      newErrors.alasanPermohonan = "Silakan tulis alasan singkat pengajuan";
    }

    // Attachments check: Verify that the selected attachment slot has its file uploaded
    let hasUploadedFile = false;
    if (selectedType === "ktp" && ktpFile) hasUploadedFile = true;
    if (selectedType === "rekAir" && rekAirFile) hasUploadedFile = true;
    if (selectedType === "ajb" && ajbFile) hasUploadedFile = true;
    if (selectedType === "berkasLain" && berkasLainFile) hasUploadedFile = true;

    if (!hasUploadedFile) {
      newErrors.lampiran = "Anda wajib memilh salah satu dokumen di atas dan memilih filenya (Choose File)";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      // scroll to error
      const firstError = Object.keys(validationErrors)[0];
      const targetId = firstError === "lampiran" ? "field-lampiran" : `field-${firstError}`;
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Submit payload
    onSubmit({
      npa,
      namaPelanggan,
      alamat,
      nomorHp,
      jenisPermohonan: jenisPermohonan as RequestType,
      alasanPermohonan,
      attachments: {
        ktpName: selectedType === "ktp" && ktpFile ? ktpFile.name : undefined,
        rekeningAirName: selectedType === "rekAir" && rekAirFile ? rekAirFile.name : undefined,
        aktaJualBeliName: selectedType === "ajb" && ajbFile ? ajbFile.name : undefined,
        berkasLainnyaName: selectedType === "berkasLain" && berkasLainFile ? berkasLainFile.name : undefined,
      },
    });
  };

  // Helper values to autocomplete form for quick testing
  const populateWithMockData = () => {
    setNpa("320104118991");
    setNamaPelanggan("Ananda Pratama");
    setAlamat("Perumahan Nusa Dua Lestari Kav. C4, RT 02/RW 11, Kel. Jimbaran");
    setNomorHp("081299884433");
    setJenisPermohonan(RequestType.SAMBUNG_BARU);
    setAlasanPermohonan("Ingin memasang saluran air PDAM baru untuk kediaman pribadi, karena sumur bor sering kering di musim kemarau.");
    
    // Set simulated files
    setSelectedType("ktp");
    setKtpFile(new File(["ktp"], "KTP_Ananda_Pratama.jpeg", { type: "image/jpeg" }));
    
    setErrors({});
  };

  const triggerSelectAndClick = (
    type: "ktp" | "rekAir" | "ajb" | "berkasLain",
    ref: React.RefObject<HTMLInputElement | null>
  ) => {
    handleSelectType(type);
    setTimeout(() => {
      ref.current?.click();
    }, 50);
  };

  return (
    <div className="flex flex-col flex-1 bg-background text-on-background animate-fade-in h-full min-h-0 overflow-hidden">
      {/* Top Bar matching Image 2 */}
      <header id="form-header" className="bg-[#003f87] text-white px-4 py-4 flex items-center shadow-md shrink-0">
        <button 
          id="form-back-btn"
          onClick={onBack} 
          className="mr-4 hover:bg-white/10 p-1.5 rounded-full transition-colors duration-150"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 id="form-title" className="text-xl font-bold tracking-wide">Form Permohonan</h1>
      </header>

      {/* Complete Form wrapper with fixed bottom action footer */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 relative bg-white">
        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-5 py-6 max-w-md mx-auto w-full pb-8">
          <div className="space-y-5">
          {/* NPA */}
          <div id="field-npa" className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#191c1d]" htmlFor="npa">NPA</label>
            <input
              type="text"
              id="npa"
              value={npa}
              onChange={(e) => setNpa(e.target.value)}
              placeholder="Masukkan Nomor Pelanggan"
              className={`w-full h-14 px-4 bg-white border ${errors.npa ? 'border-red-500 ring-1 ring-red-500' : 'border-[#CED4DA]'} rounded-lg text-sm text-[#191c1d] placeholder:text-[#6C757D] focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3] transition-all`}
            />
            {errors.npa && <span className="text-xs text-red-500 font-medium">{errors.npa}</span>}
          </div>

          {/* Nama Pelanggan */}
          <div id="field-namaPelanggan" className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#191c1d]" htmlFor="nama">Nama Pelanggan</label>
            <input
              type="text"
              id="nama"
              value={namaPelanggan}
              onChange={(e) => setNamaPelanggan(e.target.value)}
              placeholder="Masukkan Nama Lengkap"
              className={`w-full h-14 px-4 bg-white border ${errors.namaPelanggan ? 'border-red-500 ring-1 ring-red-500' : 'border-[#CED4DA]'} rounded-lg text-sm text-[#191c1d] placeholder:text-[#6C757D] focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3] transition-all`}
            />
            {errors.namaPelanggan && <span className="text-xs text-red-500 font-medium">{errors.namaPelanggan}</span>}
          </div>

          {/* Alamat */}
          <div id="field-alamat" className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#191c1d]" htmlFor="alamat">Alamat</label>
            <input
              type="text"
              id="alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Masukkan Alamat Lengkap"
              className={`w-full h-14 px-4 bg-white border ${errors.alamat ? 'border-red-500 ring-1 ring-red-500' : 'border-[#CED4DA]'} rounded-lg text-sm text-[#191c1d] placeholder:text-[#6C757D] focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3] transition-all`}
            />
            {errors.alamat && <span className="text-xs text-red-500 font-medium">{errors.alamat}</span>}
          </div>

          {/* Nomor HP */}
          <div id="field-nomorHp" className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#191c1d]" htmlFor="hp">Nomor HP</label>
            <input
              type="text"
              id="hp"
              value={nomorHp}
              onChange={(e) => setNomorHp(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className={`w-full h-14 px-4 bg-white border ${errors.nomorHp ? 'border-red-500 ring-1 ring-red-500' : 'border-[#CED4DA]'} rounded-lg text-sm text-[#191c1d] placeholder:text-[#6C757D] focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3] transition-all`}
            />
            {errors.nomorHp && <span className="text-xs text-red-500 font-medium">{errors.nomorHp}</span>}
          </div>

          {/* Jenis Permohonan */}
          <div id="field-jenisPermohonan" className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#191c1d]" htmlFor="jenis-permohonan">Jenis Permohonan</label>
            <div className="relative">
              <select
                id="jenis-permohonan"
                value={jenisPermohonan}
                onChange={(e) => setJenisPermohonan(e.target.value)}
                className={`w-full h-14 px-4 pr-10 bg-white border ${errors.jenisPermohonan ? 'border-red-500 ring-1 ring-red-500' : 'border-[#CED4DA]'} rounded-lg text-sm text-[#191c1d] focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3] transition-all appearance-none`}
              >
                <option value="">Pilih Jenis Permohonan</option>
                {Object.values(RequestType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-neutral-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {errors.jenisPermohonan && <span className="text-xs text-red-500 font-medium">{errors.jenisPermohonan}</span>}
          </div>

          {/* Alasan Permohonan */}
          <div id="field-alasanPermohonan" className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#191c1d]" htmlFor="alasan">Alasan Permohonan</label>
            <textarea
              id="alasan"
              rows={4}
              value={alasanPermohonan}
              onChange={(e) => setAlasanPermohonan(e.target.value)}
              placeholder="Tuliskan detail alasan permohonan Anda..."
              className={`w-full p-4 bg-white border ${errors.alasanPermohonan ? 'border-red-500 ring-1 ring-red-500' : 'border-[#CED4DA]'} rounded-lg text-sm text-[#191c1d] placeholder:text-[#6C757D] focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3] transition-all resize-none`}
            />
            {errors.alasanPermohonan && <span className="text-xs text-red-500 font-medium">{errors.alasanPermohonan}</span>}
          </div>

          {/* LAMPIRAN (Attachments Card Container matching Image 2) */}
          <div id="field-lampiran" className="flex flex-col gap-1.5 pt-2">
            <span className="text-sm font-extrabold uppercase text-[#424752] tracking-wider mb-1">LAMPIRAN</span>
            
            <div className="bg-[#f8f9fa] border border-[#DEE2E6] rounded-xl p-4.5 space-y-3.5 shadow-sm">
              <p className="text-xs text-neutral-500 font-normal leading-relaxed">
                Silakan unggah dokumen pendukung sesuai kebutuhan permohonan Anda. <span className="font-medium text-[#0056B3]">(Pilih salah satu jenis di bawah)</span>:
              </p>

              {/* Hidden HTML Inputs */}
              <input 
                type="file" 
                ref={ktpInputRef} 
                onChange={(e) => handleFileChange(e, setKtpFile)} 
                className="hidden" 
                id="hidden-ktp" 
              />
              <input 
                type="file" 
                ref={rekAirInputRef} 
                onChange={(e) => handleFileChange(e, setRekAirFile)} 
                className="hidden" 
                id="hidden-rek" 
              />
              <input 
                type="file" 
                ref={ajbInputRef} 
                onChange={(e) => handleFileChange(e, setAjbFile)} 
                className="hidden" 
                id="hidden-ajb" 
              />
              <input 
                type="file" 
                ref={berkasLainInputRef} 
                onChange={(e) => handleFileChange(e, setBerkasLainFile)} 
                className="hidden" 
                id="hidden-lain" 
              />

              {/* Cards stack matching layout of second image */}
              <div className="space-y-3">
                
                {/* Card 1: KTP */}
                <div 
                  onClick={() => handleSelectType("ktp")}
                  className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-4 ${
                    selectedType === "ktp" 
                      ? "bg-white border-[#0056B3] ring-1 ring-[#0056B3] shadow-sm" 
                      : "bg-white/80 border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Radio indicator */}
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      selectedType === "ktp" ? "border-[#0056B3] bg-white" : "border-neutral-300"
                    }`}>
                      {selectedType === "ktp" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0056B3]"></div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#191c1d]">KTP</h4>
                      <p className="text-[11px] text-neutral-500">Wajib diunggah</p>
                    </div>
                  </div>

                  {/* File status / Choose button */}
                  <div className="flex items-center shrink-0" onClick={(e) => e.stopPropagation()}>
                    {selectedType === "ktp" && ktpFile ? (
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-200 max-w-[150px]">
                        <span className="text-[11px] text-green-700 truncate font-mono max-w-[90px]">{ktpFile.name}</span>
                        <button type="button" onClick={() => clearFile(ktpInputRef, setKtpFile)} className="text-red-500 hover:bg-neutral-100 p-0.5 rounded">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => triggerSelectAndClick("ktp", ktpInputRef)}
                        className={`h-9 px-3 bg-[#E9ECEF] hover:bg-neutral-200 text-[#495057] border border-[#CED4DA] font-bold text-[11px] rounded transition-colors active:scale-[0.98] cursor-pointer ${
                          selectedType !== "ktp" ? "opacity-75" : ""
                        }`}
                      >
                        Choose File
                      </button>
                    )}
                  </div>
                </div>

                {/* Card 2: Rekening Air */}
                <div 
                  onClick={() => handleSelectType("rekAir")}
                  className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-4 ${
                    selectedType === "rekAir" 
                      ? "bg-white border-[#0056B3] ring-1 ring-[#0056B3] shadow-sm" 
                      : "bg-white/80 border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Radio indicator */}
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      selectedType === "rekAir" ? "border-[#0056B3] bg-white" : "border-neutral-300"
                    }`}>
                      {selectedType === "rekAir" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0056B3]"></div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#191c1d]">Rekening Air</h4>
                      <p className="text-[11px] text-neutral-500">Bulan terakhir</p>
                    </div>
                  </div>

                  {/* File status / Choose button */}
                  <div className="flex items-center shrink-0" onClick={(e) => e.stopPropagation()}>
                    {selectedType === "rekAir" && rekAirFile ? (
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-200 max-w-[150px]">
                        <span className="text-[11px] text-green-700 truncate font-mono max-w-[90px]">{rekAirFile.name}</span>
                        <button type="button" onClick={() => clearFile(rekAirInputRef, setRekAirFile)} className="text-red-500 hover:bg-neutral-100 p-0.5 rounded">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => triggerSelectAndClick("rekAir", rekAirInputRef)}
                        className={`h-9 px-3 bg-[#E9ECEF] hover:bg-neutral-200 text-[#495057] border border-[#CED4DA] font-bold text-[11px] rounded transition-colors active:scale-[0.98] cursor-pointer ${
                          selectedType !== "rekAir" ? "opacity-75" : ""
                        }`}
                      >
                        Choose File
                      </button>
                    )}
                  </div>
                </div>

                {/* Card 3: Akta Jual Beli */}
                <div 
                  onClick={() => handleSelectType("ajb")}
                  className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-4 ${
                    selectedType === "ajb" 
                      ? "bg-white border-[#0056B3] ring-1 ring-[#0056B3] shadow-sm" 
                      : "bg-white/80 border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Radio indicator */}
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      selectedType === "ajb" ? "border-[#0056B3] bg-white" : "border-neutral-300"
                    }`}>
                      {selectedType === "ajb" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0056B3]"></div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#191c1d]">Akta Jual Beli</h4>
                      <p className="text-[11px] text-neutral-500">Opsional</p>
                    </div>
                  </div>

                  {/* File status / Choose button */}
                  <div className="flex items-center shrink-0" onClick={(e) => e.stopPropagation()}>
                    {selectedType === "ajb" && ajbFile ? (
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-200 max-w-[150px]">
                        <span className="text-[11px] text-green-700 truncate font-mono max-w-[90px]">{ajbFile.name}</span>
                        <button type="button" onClick={() => clearFile(ajbInputRef, setAjbFile)} className="text-red-500 hover:bg-neutral-100 p-0.5 rounded">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => triggerSelectAndClick("ajb", ajbInputRef)}
                        className={`h-9 px-3 bg-[#E9ECEF] hover:bg-neutral-200 text-[#495057] border border-[#CED4DA] font-bold text-[11px] rounded transition-colors active:scale-[0.98] cursor-pointer ${
                          selectedType !== "ajb" ? "opacity-75" : ""
                        }`}
                      >
                        Choose File
                      </button>
                    )}
                  </div>
                </div>

                {/* Card 4: Berkas Lainnya */}
                <div 
                  onClick={() => handleSelectType("berkasLain")}
                  className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-4 ${
                    selectedType === "berkasLain" 
                      ? "bg-white border-[#0056B3] ring-1 ring-[#0056B3] shadow-sm" 
                      : "bg-white/80 border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Radio indicator */}
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      selectedType === "berkasLain" ? "border-[#0056B3] bg-white" : "border-neutral-300"
                    }`}>
                      {selectedType === "berkasLain" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0056B3]"></div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#191c1d]">Berkas Lainnya</h4>
                      <p className="text-[11px] text-neutral-500">Pendukung lainnya</p>
                    </div>
                  </div>

                  {/* File status / Choose button */}
                  <div className="flex items-center shrink-0" onClick={(e) => e.stopPropagation()}>
                    {selectedType === "berkasLain" && berkasLainFile ? (
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-200 max-w-[150px]">
                        <span className="text-[11px] text-green-700 truncate font-mono max-w-[90px]">{berkasLainFile.name}</span>
                        <button type="button" onClick={() => clearFile(berkasLainInputRef, setBerkasLainFile)} className="text-red-500 hover:bg-neutral-100 p-0.5 rounded">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => triggerSelectAndClick("berkasLain", berkasLainInputRef)}
                        className={`h-9 px-3 bg-[#E9ECEF] hover:bg-neutral-200 text-[#495057] border border-[#CED4DA] font-bold text-[11px] rounded transition-colors active:scale-[0.98] cursor-pointer ${
                          selectedType !== "berkasLain" ? "opacity-75" : ""
                        }`}
                      >
                        Choose File
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {errors.lampiran && (
                <div className="p-2.5 bg-red-50 rounded text-xs text-red-600 font-medium border border-red-100 flex items-center gap-1.5 animate-pulse">
                  <span className="text-red-500 text-sm">⚠</span> {errors.lampiran}
                </div>
              )}

            </div>
          </div>

          </div>
        </main>

        {/* Stationary bottom action bar matching second image design exactly */}
        <div id="field-submit-footer" className="bg-[#f8f9fa] border-t border-neutral-200/80 px-5 py-4.5 max-w-md mx-auto w-full shrink-0 shadow-[0_-6px_20px_rgba(0,0,0,0.04)] z-10 flex flex-col gap-2 rounded-b-[24px]">
          <button
            type="submit"
            id="btn-simpan-kirim"
            className="w-full h-14 bg-[#003f87] hover:bg-[#002652] text-white font-extrabold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-md shadow-[0_4px_12px_rgba(0,63,135,0.25)] active:scale-[0.985] cursor-pointer"
          >
            {/* White play icon mirroring mockup */}
            <span className="rotate-0 text-xl font-semibold leading-none flex items-center justify-center -mt-0.5">▷</span>
            <span>Simpan dan Kirim</span>
          </button>
          <p className="text-[10px] text-neutral-500 text-center font-normal leading-normal">
            Pastikan seluruh data dan dokumen pendukung sudah sesuai sebelum dikirim.
          </p>
        </div>
      </form>
    </div>
  );
}
