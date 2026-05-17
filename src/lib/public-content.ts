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

export const services: Service[] = [
  {
    title: "Weddings",
    kicker: "Emotional narrative",
    description:
      "Cobertura elegante para ceremonias, celebraciones íntimas y fines de semana completos con dirección visual discreta.",
    startingAt: "Consultar",
  },
  {
    title: "Portraits",
    kicker: "Presence and character",
    description:
      "Retratos editoriales, personales y profesionales con una dirección serena, precisa y favorecedora.",
    startingAt: "Desde $450",
  },
  {
    title: "Events",
    kicker: "Atmosphere, people, rhythm",
    description:
      "Documentación visual de lanzamientos, cenas, conciertos, fiestas privadas y experiencias de marca.",
    startingAt: "Desde $850",
  },
  {
    title: "Commercial",
    kicker: "Digital identity",
    description:
      "Producción fotográfica para marcas, campañas, contenido social y piezas visuales de alto impacto.",
    startingAt: "Consultar",
  },
];

export const projects: Project[] = [
  {
    slug: "noir-campaign",
    title: "Noir Campaign",
    category: "Fashion",
    location: "Miami",
    year: "2026",
    summary:
      "Una serie visual sobria con luz dura, composición minimalista y un lenguaje editorial para campaña digital.",
    cover: "/assets/studio-hero.png",
    images: [
      "/assets/studio-hero.png",
      "/assets/og-preview.png",
      "/assets/emmanuel-portrait.jpg",
    ],
  },
  {
    slug: "maria-john",
    title: "Maria & John",
    category: "Wedding",
    location: "Florida Keys",
    year: "2026",
    summary:
      "Una boda luminosa, íntima y cinematográfica, narrada con atención a gestos pequeños y arquitectura blanca.",
    cover: "/assets/og-preview.png",
    images: [
      "/assets/og-preview.png",
      "/assets/studio-hero.png",
      "/assets/emmanuel-portrait.jpg",
    ],
  },
  {
    slug: "lumo-studio",
    title: "Lumo Studio",
    category: "Branding",
    location: "Worldwide",
    year: "2026",
    summary:
      "Fotografía de marca para un estudio creativo: producto, ambiente y retratos en una misma identidad visual.",
    cover: "/assets/emmanuel-portrait.jpg",
    images: [
      "/assets/emmanuel-portrait.jpg",
      "/assets/studio-hero.png",
      "/assets/og-preview.png",
    ],
  },
];

export const reviews = [
  {
    name: "Maria G.",
    text: "Incredible experience. The photos and videos exceeded all expectations.",
  },
  {
    name: "Vertice Team",
    text: "The creativity and attention to detail made all the difference.",
  },
  {
    name: "James T.",
    text: "Professional, fast and deeply talented. The results were perfect.",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
