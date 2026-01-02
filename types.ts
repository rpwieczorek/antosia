

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  // Dodano kategorię 'Przemyślenia' do unii typów
  category: 'Leczenie' | 'Rehabilitacja' | 'Codzienność' | 'Podziękowania' | 'Przemyślenia';
  image: string;
  seo?: {
    metaTitle: string;
    metaDescription: string;
  };
}

export type View = 'home' | 'history' | 'journal' | 'post' | 'passions' | 'migration' | 'support';