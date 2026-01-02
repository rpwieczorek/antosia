
export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: 'Leczenie' | 'Rehabilitacja' | 'Codzienność' | 'Podziękowania';
  image: string;
  seo?: {
    metaTitle: string;
    metaDescription: string;
  };
}

export type View = 'home' | 'history' | 'journal' | 'post' | 'passions' | 'migration' | 'support';
