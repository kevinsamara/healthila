import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Produk = {
  id: number;
  nama: string;
  kategori: string;
  harga: number;
  harga_label: string;
  deskripsi: string;
  deskripsi_panjang: string;
  icon: string;
  foto_url: string;
  tersedia: boolean;
  created_at: string;
};

export type Artikel = {
  id: number;
  judul: string;
  slug: string;
  kategori: string;
  isi: string;
  ringkasan: string;
  icon: string;
  tanggal: string;
  dipublish: boolean;
  created_at: string;
};