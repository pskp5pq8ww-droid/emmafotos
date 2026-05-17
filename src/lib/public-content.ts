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
    slug: "natalia-renato",
    title: "Natalia & Renato",
    category: "Wedding",
    location: "Colombia",
    year: "2025",
    summary:
      "Una boda íntima y luminosa narrada con atención a los gestos pequeños, la arquitectura y la emoción real del día.",
    cover: "/assets/projects/boda-nr.jpg",
    images: [
      "/assets/projects/boda-nr.jpg",
      "/assets/projects/boda-nr-2.jpg",
      "/assets/projects/portrait-maeve.jpg",
    ],
  },
  {
    slug: "paw-and-co",
    title: "Paw & Co",
    category: "Events",
    location: "Miami",
    year: "2025",
    summary:
      "Cobertura recurrente de una de las noches más concurridas de Miami. Energía, ambiente y retratos en movimiento.",
    cover: "/assets/projects/pawco-event.jpg",
    images: [
      "/assets/projects/pawco-event.jpg",
      "/assets/projects/clubbers.jpg",
      "/assets/projects/miguel-dj.jpg",
    ],
  },
  {
    slug: "cumbre-emprendedores",
    title: "Cumbre de Emprendedores",
    category: "Corporate",
    location: "Colombia",
    year: "2024",
    summary:
      "Documentación visual de un evento de liderazgo empresarial: ponentes, networking y momentos de conexión real.",
    cover: "/assets/projects/cumbre.jpg",
    images: [
      "/assets/projects/cumbre.jpg",
      "/assets/projects/arteria.jpg",
      "/assets/projects/europe.jpg",
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
