
import { Post } from './types';

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    slug: 'pierwsze-kroki-po-operacji',
    title: 'Wielki dzień - pierwsze kroki po operacji!',
    excerpt: 'Dziś stało się coś, na co czekaliśmy miesiącami. Antosia z pomocą ortez stanęła na własnych nogach...',
    content: 'Emocje wciąż nie opadły. Po trudnym zabiegu w ubiegłym miesiącu i intensywnej rehabilitacji, nasza dzielna dziewczynka pokazała, że nie ma dla niej rzeczy niemożliwych. Dziękujemy każdemu z Was, bo to dzięki Waszym wpłatom mogliśmy opłacić ten turnus.',
    date: '2024-06-10',
    category: 'Rehabilitacja',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800',
    seo: {
      metaTitle: 'Postępy Antosi: Pierwsze kroki po operacji',
      metaDescription: 'Relacja z postępów rehabilitacji Antosi Wieczorek po ważnym zabiegu.'
    }
  },
  {
    id: '2',
    slug: 'jak-przekazac-1-5-procent',
    title: 'Twój 1.5% ma wielką moc',
    excerpt: 'Okres rozliczeń podatkowych to dla nas szansa na zebranie środków na kolejny rok ćwiczeń...',
    content: 'Wiele osób pyta nas, jak mogą pomóc bez angażowania własnych oszczędności. Przekazanie 1.5% podatku nic nie kosztuje, a dla nas oznacza regularne lekcje z fizjoterapeutami i dostęp do specjalistycznego sprzętu.',
    date: '2024-02-15',
    category: 'Podziękowania',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800',
    seo: {
      metaTitle: 'Jak przekazać 1.5% dla Antosi Wieczorek',
      metaDescription: 'Instrukcja przekazania podatku dla Antosi. Numer KRS i cel szczegółowy.'
    }
  }
];
