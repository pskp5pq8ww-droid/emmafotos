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
  phone: "+61 412 763 107",
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
    title: "Bodas",
    kicker: "Emoción y elegancia",
    description:
      "Cobertura completa de tu boda con una mirada natural, discreta y emotiva. Desde la preparación hasta el último baile — cada momento, eternamente tuyo.",
    startingAt: "Consultar",
  },
  {
    title: "Sesiones",
    kicker: "Presencia y carácter",
    description:
      "Retratos editoriales, personales y profesionales con una dirección serena y favorecedora. Para individuos, parejas y equipos que quieren verse auténticos.",
    startingAt: "Desde $350",
  },
  {
    title: "Eventos",
    kicker: "Atmósfera y ritmo",
    description:
      "Documentación visual de lanzamientos, celebraciones, conferencias y fiestas privadas. Energía real, encuadres limpios, recuerdos que duran.",
    startingAt: "Desde $750",
  },
  {
    title: "Video & Drone",
    kicker: "Visión aérea y cinemática",
    description:
      "Producción audiovisual para bodas, marcas y eventos. Tomas aéreas con dron y edición cinematográfica para piezas de alto impacto.",
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
    name: "Natalia V.",
    text: "Emmanuel capturó exactamente lo que sentimos ese día. Las fotos nos hacen revivir cada momento.",
  },
  {
    name: "Paw & Co",
    text: "Trabajar con Emmanuel es fluido y profesional. Siempre entrega más de lo que esperas.",
  },
  {
    name: "James T.",
    text: "Professional, fast and deeply talented. The results were absolutely perfect.",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
