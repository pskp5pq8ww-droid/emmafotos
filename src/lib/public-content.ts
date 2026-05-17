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
