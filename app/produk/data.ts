export type Product = {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  unit: string;
  category: string;
  icon: string;
  bg: string;
  desc: string;
  longDesc: string;
  benefits: string[];
  nutrition: { label: string; value: string }[];
  minOrder: number;
  weightOptions: string[];
};

export const products: Product[] = [
  {
    id: 'jeruk-pontianak',
    name: 'Jeruk Pontianak',
    price: 45000,
    priceLabel: 'Rp 45.000',
    unit: 'kg',
    category: 'Buah Segar',
    icon: '🍊',
    bg: '#fff7ed',
    desc: '1 kg, manis segar pilihan',
    longDesc: 'Jeruk Pontianak asli dari Kalimantan Barat, dipilih langsung dari kebun terpercaya. Rasanya manis segar dengan tekstur juicy yang menyegarkan. Cocok dikonsumsi langsung atau dijadikan jus.',
    benefits: ['Kaya Vitamin C', 'Meningkatkan imunitas', 'Menyegarkan tubuh', 'Antioksidan tinggi'],
    nutrition: [
      { label: 'Kalori', value: '47 kkal / 100gr' },
      { label: 'Vitamin C', value: '53 mg' },
      { label: 'Serat', value: '2.4 gr' },
      { label: 'Gula Alami', value: '9 gr' },
    ],
    minOrder: 1,
    weightOptions: ['1 kg', '2 kg', '3 kg', '5 kg'],
  },
  {
    id: 'strawberry-premium',
    name: 'Strawberry Premium',
    price: 65000,
    priceLabel: 'Rp 65.000',
    unit: 'pack',
    category: 'Buah Segar',
    icon: '🍓',
    bg: '#fff1f2',
    desc: '500 gr, import Berastagi',
    longDesc: 'Strawberry premium dari dataran tinggi Berastagi, Sumatera Utara. Berwarna merah cerah, manis asam segar, dan aroma yang kuat. Sempurna untuk dessert, smoothie, atau dimakan langsung.',
    benefits: ['Kaya antioksidan', 'Baik untuk kulit', 'Rendah kalori', 'Sumber folat'],
    nutrition: [
      { label: 'Kalori', value: '32 kkal / 100gr' },
      { label: 'Vitamin C', value: '58 mg' },
      { label: 'Serat', value: '2 gr' },
      { label: 'Gula Alami', value: '4.9 gr' },
    ],
    minOrder: 1,
    weightOptions: ['500 gr', '1 kg', '2 kg'],
  },
  {
    id: 'mangga-harum-manis',
    name: 'Mangga Harum Manis',
    price: 55000,
    priceLabel: 'Rp 55.000',
    unit: 'kg',
    category: 'Buah Segar',
    icon: '🥭',
    bg: '#fffbeb',
    desc: '1 kg, manis legit',
    longDesc: 'Mangga Harum Manis pilihan dari petani lokal terbaik. Daging buah tebal, manis legit dengan aroma harum khas yang menggugah selera. Dipanen saat matang sempurna untuk rasa terbaik.',
    benefits: ['Kaya Vitamin A', 'Meningkatkan pencernaan', 'Sumber energi alami', 'Baik untuk mata'],
    nutrition: [
      { label: 'Kalori', value: '60 kkal / 100gr' },
      { label: 'Vitamin A', value: '54 mcg' },
      { label: 'Serat', value: '1.6 gr' },
      { label: 'Gula Alami', value: '14 gr' },
    ],
    minOrder: 1,
    weightOptions: ['1 kg', '2 kg', '3 kg', '5 kg'],
  },
  {
    id: 'shine-muscat-import',
    name: 'Shine Muscat Import',
    price: 120000,
    priceLabel: 'Rp 120.000',
    unit: 'pack',
    category: 'Buah Eksotis',
    icon: '🍇',
    bg: '#faf5ff',
    desc: '500 gr, seedless premium',
    longDesc: 'Anggur Shine Muscat import berkualitas premium, tanpa biji (seedless). Rasanya sangat manis dengan sedikit aroma muscat yang khas. Kulit tipis dan daging buah renyah, cocok sebagai camilan mewah.',
    benefits: ['Kaya resveratrol', 'Antioksidan tinggi', 'Menjaga kesehatan jantung', 'Sumber vitamin K'],
    nutrition: [
      { label: 'Kalori', value: '69 kkal / 100gr' },
      { label: 'Vitamin K', value: '14.6 mcg' },
      { label: 'Serat', value: '0.9 gr' },
      { label: 'Gula Alami', value: '15 gr' },
    ],
    minOrder: 1,
    weightOptions: ['500 gr', '1 kg', '2 kg'],
  },
  {
    id: 'jus-cold-pressed',
    name: 'Jus Cold-Pressed Mix',
    price: 35000,
    priceLabel: 'Rp 35.000',
    unit: 'botol',
    category: 'Jus & Dessert',
    icon: '🧃',
    bg: '#f0fdf4',
    desc: '350 ml, tanpa gula tambahan',
    longDesc: 'Jus cold-pressed dibuat dengan teknik pengepresan dingin yang mempertahankan nutrisi dan enzim alami buah. Tanpa gula tambahan, tanpa pengawet, dan tanpa pewarna buatan. Segar dan menyehatkan.',
    benefits: ['Nutrisi terjaga maksimal', 'Tanpa gula tambahan', 'Kaya enzim alami', 'Detoks tubuh'],
    nutrition: [
      { label: 'Kalori', value: '45 kkal / 100ml' },
      { label: 'Vitamin C', value: '35 mg' },
      { label: 'Serat', value: '1.2 gr' },
      { label: 'Gula Alami', value: '8 gr' },
    ],
    minOrder: 1,
    weightOptions: ['1 botol', '3 botol', '6 botol', '12 botol'],
  },
  {
    id: 'hamper-kesehatan',
    name: 'Hamper Kesehatan M',
    price: 250000,
    priceLabel: 'Rp 250.000',
    unit: 'paket',
    category: 'Parcel',
    icon: '🧺',
    bg: '#fef3c7',
    desc: 'Isi 8 buah + jus, kemasan premium',
    longDesc: 'Hamper kesehatan ukuran Medium berisi 8 jenis buah pilihan dan 1 botol jus cold-pressed. Dikemas dalam keranjang anyaman premium dengan pita elegan. Cocok untuk hadiah ulang tahun, get well soon, atau parsel lebaran.',
    benefits: ['Kemasan premium elegan', 'Buah pilihan quality check', 'Cocok untuk hadiah', 'Bisa custom isi'],
    nutrition: [
      { label: 'Isi', value: '8 buah pilihan + 1 jus' },
      { label: 'Kemasan', value: 'Keranjang anyaman' },
      { label: 'Pita', value: 'Ribbon premium' },
      { label: 'Custom', value: 'Bisa request isi' },
    ],
    minOrder: 1,
    weightOptions: ['1 paket', '2 paket', '3 paket', '5 paket'],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}