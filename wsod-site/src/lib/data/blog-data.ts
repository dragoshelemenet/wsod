import { BlogPost } from "@/lib/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "videograf-sector-3-bucuresti-proiect-brand",
    title: "Videograf Sector 3 București — proiect video pentru un brand local",
    excerpt:
      "Am lucrat la un proiect video în Sector 3 București, cu focus pe cadre curate, montaj dinamic și material optimizat pentru social media.",
    publishedAt: "2026-04-08",
    seoTitle:
      "Videograf Sector 3 București | Producție video pentru branduri | WSOD.PROD",
    metaDescription:
      "Producție video în Sector 3 București pentru branduri și afaceri locale. Filmare, editare și content optimizat pentru social media.",
    content: `
      <p>Astăzi am lucrat în Sector 3 București la un proiect video pentru un brand local care avea nevoie de conținut modern, clar și adaptat pentru online.</p>

      <p>Am filmat cadre orientate spre social media, cu accent pe imagine curată, ritm bun și detalii care ajută brandul să arate profesional pe Instagram, TikTok și Facebook.</p>

      <p>Pentru astfel de proiecte, focusul nostru este pe producție rapidă, imagine premium și materiale care pot fi reutilizate în mai multe formate.</p>

      <p>Dacă ai nevoie de videograf în Sector 3 București pentru reels, promovare de brand, content comercial sau producție video pentru business, proiectul poate fi organizat rapid și eficient.</p>
    `,
  },
  {
    slug: "productie-video-bucuresti-pentru-social-media",
    title: "Producție video în București pentru social media și brand awareness",
    excerpt:
      "Cum construim conținut video pentru branduri care vor materiale rapide, moderne și optimizate pentru online.",
    publishedAt: "2026-04-05",
    seoTitle:
      "Producție video București pentru social media | WSOD.PROD",
    metaDescription:
      "Servicii de producție video în București pentru businessuri, branduri și campanii social media. Filmare, editare și content modern.",
    content: `
      <p>Producția video pentru social media în București nu înseamnă doar filmare. Contează ritmul, formatul, montajul și felul în care materialul este gândit pentru publicul online.</p>

      <p>La WSOD.PROD, construim materiale video pentru branduri care vor să arate bine online și să folosească același conținut în mai multe contexte: organic, ads, reels, prezentare sau website.</p>

      <p>Un proiect bine făcut începe cu o structură clară, cadre potrivite, lumină bună și editare adaptată platformei.</p>
    `,
  },
  {
    slug: "reels-pentru-barbershop-bucuresti",
    title: "Reels pentru barbershop în București — conținut video scurt care atrage atenția",
    excerpt:
      "Exemplu de structură pentru reels de barbershop și de ce contentul scurt poate ajuta la familiarizarea publicului cu brandul.",
    publishedAt: "2026-04-02",
    seoTitle:
      "Reels pentru barbershop București | Content video pentru Instagram și TikTok | WSOD.PROD",
    metaDescription:
      "Creăm reels pentru barbershopuri din București: filmare, editare, idei de content și materiale orientate spre Instagram și TikTok.",
    content: `
      <p>Un barbershop are nevoie de content care transmite stil, atenție la detalii și personalitate. Reels-urile bine făcute pot ajuta foarte mult la familiarizarea publicului cu brandul.</p>

      <p>Se pot filma cadre din proces, detalii apropiate, reacții, transformări before/after și idei care merg bine pe TikTok și Instagram.</p>

      <p>În București, un astfel de conținut poate ajuta brandurile locale să devină mai recognoscibile și mai ușor de reținut.</p>
    `,
  },
];

export function getAllBlogPosts() {
  return [...blogPosts].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}