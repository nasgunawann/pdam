export enum ApplicationStatus {
  PENDING = "Menunggu Verifikasi",
  IN_PROGRESS = "Dalam Proses",
  APPROVED = "Disetujui",
  REJECTED = "Ditolak"
}

export enum RequestType {
  SAMBUNG_BARU = "Sambung Baru (Pasang Baru)",
  PERBAIKAN_METER = "Perbaikan Meter Rusak / Macet",
  KELUHAN_TAGIHAN = "Pengaduan Lonjakan Tagihan",
  LAPOR_KEBOCORAN = "Laporan Kebocoran Pipa",
  SAMBUNG_KEMBALI = "Penyambungan Kembali Aliran Air",
  MIGRASI_PELANGGAN = "Migrasi Golongan Tarif Pelanggan"
}

export interface AttachmentFiles {
  ktp: string | null;          // file name or data string
  rekeningAir: string | null;  // file name or data string
  aktaJualBeli: string | null; // file name or data string
  berkasLainnya: string | null; // file name or data string
}

export interface PdamApplication {
  id: string; // REG-YYYYMMDD-XXXX
  npa: string;
  namaPelanggan: string;
  alamat: string;
  nomorHp: string;
  jenisPermohonan: RequestType;
  alasanPermohonan: string;
  tanggalPengajuan: string;
  status: ApplicationStatus;
  attachments: {
    ktpName?: string;
    rekeningAirName?: string;
    aktaJualBeliName?: string;
    berkasLainnyaName?: string;
  };
  catatanPetugas?: string;
}
