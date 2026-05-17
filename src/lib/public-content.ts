export type Service = {
  title: string;
  kicker: string;
  description: string;
  startingAt: string;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  summary: string;
  cover: string;
  images: string[];
};

export const studio = {
  name: "Emmanuel Rojas",
  tagline: "Lifelong Memory Maker",
  location: "Brisbane, Australia · Worldwide",
  phone: "0412 763 107",
  whatsapp: "https://wa.me/61412763107",
  instagram: "https://www.instagram.com/emmanuel_r0jas_/",
  instagramHandle: "@emmanuel_r0jas_",
  email: "emmanuelrojas-23@hotmail.com",
  stats: {
    years: "4+",
    events: "200+",
  },
};

export const services: Service[] = [
  {
    title: "Wedding Photography",
    kicker: "Emotion & elegance",
    description:
      "Your wedding day told beautifully — from the first look to the last dance. Natural, cinematic and deeply personal coverage that honours every real moment.",
    startingAt: "Enquire for pricing",
  },
  {
    title: "Couple Sessions",
    kicker: "Presence & connection",
    description:
      "Relaxed portrait sessions for couples who want honest, editorial imagery. Styled around you — your light, your story, your way.",
    startingAt: "From $350",
  },
  {
    title: "Event Coverage",
    kicker: "Atmosphere & rhythm",
    description:
      "Corporate launches, private parties and live events documented with energy and clarity. Every atmosphere captured with intention.",
    startingAt: "From $750",
  },
  {
    title: "Drone Photography",
    kicker: "Aerial perspective",
    description:
      "Cinematic aerial stills and footage for weddings, events and brand campaigns. A sweeping view that adds a new dimension to any story.",
    startingAt: "Enquire for pricing",
  },
];

export const projects: Project[] = [
  {
    slug: "natalia-renato",
    title: "Natalia & Renato",
    category: "Boda",
    location: "Colombia",
    year: "2025",
    summary:
      "Una boda íntima y luminosa narrada con atención a los gestos pequeños, la arquitectura y la emoción real del día.",
    cover: "/assets/projects/boda-nr-01.jpg",
    images: [
      "/assets/projects/boda-nr-01.jpg",
      "/assets/projects/boda-nr-02.jpg",
      "/assets/projects/boda-nr-03.jpg",
      "/assets/projects/boda-nr-04.jpg",
      "/assets/projects/boda-nr-05.jpg",
      "/assets/projects/boda-nr-06.jpg",
      "/assets/projects/boda-nr-07.jpg",
      "/assets/projects/boda-nr-08.jpg",
    ],
  },
  {
    slug: "mafe-embarazada",
    title: "Mafe — Maternidad",
    category: "Retratos",
    location: "Colombia",
    year: "2025",
    summary:
      "Sesión de maternidad llena de luz, ternura y presencia. Cada imagen captura la espera con naturalidad y elegancia.",
    cover: "/assets/projects/mafe-01.jpg",
    images: [
      "/assets/projects/mafe-01.jpg",
      "/assets/projects/mafe-02.jpg",
      "/assets/projects/mafe-03.jpg",
      "/assets/projects/mafe-04.jpg",
      "/assets/projects/mafe-05.jpg",
      "/assets/projects/mafe-06.jpg",
    ],
  },
  {
    slug: "tatudor",
    title: "Tatudor — Marca Personal",
    category: "Branding",
    location: "Colombia",
    year: "2025",
    summary:
      "Sesión de marca personal para estudio de tatuajes. Identidad visual construida desde la autenticidad y el oficio.",
    cover: "/assets/projects/tatudor-01.jpg",
    images: [
      "/assets/projects/tatudor-01.jpg",
      "/assets/projects/tatudor-02.jpg",
      "/assets/projects/tatudor-03.jpg",
      "/assets/projects/tatudor-04.jpg",
      "/assets/projects/tatudor-05.jpg",
      "/assets/projects/tatudor-06.jpg",
      "/assets/projects/tatudor-07.jpg",
      "/assets/projects/tatudor-08.jpg",
      "/assets/projects/tatudor-09.jpg",
    ],
  },
];

export const reviews = [
  {
    name: "Natalia V.",
    text: "Emmanuel captured exactly what we felt that day. Every photo brings us straight back to that moment.",
  },
  {
    name: "Paw & Co",
    text: "Working with Emmanuel is effortless and professional. He always delivers beyond what you expect.",
  },
  {
    name: "James T.",
    text: "Professional, present and deeply talented. The results were more than we could have imagined.",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
