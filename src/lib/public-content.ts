export type Service = {
  title: string;
  kicker: string;
  description: string;
  startingAt: string;
  slug: string;
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
  name: "Emmanuel Rojas Photographer",
  shortName: "Emmanuel Rojas",
  tagline: "Lifelong Memory Maker",
  location: "Brisbane, Australia · Worldwide",
  locationShort: "Brisbane, Australia",
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
      "Your wedding day told with honesty and beauty — from the quiet moments to the celebration. Natural, cinematic and deeply personal coverage designed to honour every real emotion.",
    startingAt: "Enquire for pricing",
    slug: "wedding-photography-brisbane",
  },
  {
    title: "Couple Sessions",
    kicker: "Presence & connection",
    description:
      "Relaxed portrait sessions for couples who want honest, elegant and editorial images. Styled around your story, your energy and your way of being together.",
    startingAt: "From $350",
    slug: "couple-photography-brisbane",
  },
  {
    title: "Event Coverage",
    kicker: "Atmosphere & rhythm",
    description:
      "Corporate launches, private celebrations and live events documented with clarity, energy and intention. Every atmosphere captured with a cinematic eye.",
    startingAt: "From $750",
    slug: "event-photography-brisbane",
  },
  {
    title: "Drone Photography",
    kicker: "Aerial perspective",
    description:
      "Cinematic aerial photography and footage for weddings, events, brands and special projects. A wider perspective that adds depth, scale and emotion to your story.",
    startingAt: "Enquire for pricing",
    slug: "drone-photography-brisbane",
  },
  {
    title: "Personal Branding",
    kicker: "Identity & presence",
    description:
      "Editorial-style imagery for entrepreneurs, creatives and brands who want to present themselves with clarity, confidence and intention.",
    startingAt: "From $450",
    slug: "personal-branding-photography-brisbane",
  },
  {
    title: "Maternity Photography",
    kicker: "Softness & memory",
    description:
      "Natural and emotional maternity sessions designed to preserve one of the most meaningful seasons of your life with elegance and warmth.",
    startingAt: "From $350",
    slug: "maternity-photography-brisbane",
  },
];

export const projects: Project[] = [
  {
    slug: "natalia-renato",
    title: "Natalia & Renato",
    category: "Wedding Photography",
    location: "Colombia",
    year: "2025",
    summary:
      "A warm and intimate wedding story captured with natural light, genuine emotion and cinematic attention to detail.",
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
    title: "Mafe — Maternity",
    category: "Maternity Photography",
    location: "Brisbane, Australia",
    year: "2025",
    summary:
      "A soft and intimate maternity session focused on connection, warmth and the beauty of expecting. Every image preserves the feeling of this meaningful season.",
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
    title: "Tatudor — Personal Branding",
    category: "Personal Branding Photography",
    location: "Brisbane, Australia",
    year: "2025",
    summary:
      "A personal branding session created to communicate presence, identity and professional authenticity for a tattoo studio in Brisbane.",
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
  {
    slug: "paw-co-brisbane",
    title: "Paw & Co — Brisbane",
    category: "Event Photography",
    location: "Brisbane, Australia",
    year: "2025",
    summary:
      "Live event coverage focused on atmosphere, movement, energy and editorial storytelling for one of Brisbane's most vibrant venues.",
    cover: "/assets/projects/pawco-01.jpg",
    images: [
      "/assets/projects/pawco-01.jpg",
      "/assets/projects/pawco-02.jpg",
      "/assets/projects/pawco-03.jpg",
      "/assets/projects/pawco-04.jpg",
      "/assets/projects/pawco-05.jpg",
      "/assets/projects/pawco-06.jpg",
      "/assets/projects/pawco-07.jpg",
      "/assets/projects/pawco-08.jpg",
      "/assets/projects/pawco-09.jpg",
      "/assets/projects/pawco-10.jpg",
      "/assets/projects/pawco-11.jpg",
      "/assets/projects/pawco-12.jpg",
      "/assets/projects/pawco-13.jpg",
      "/assets/projects/pawco-14.jpg",
      "/assets/projects/pawco-15.jpg",
      "/assets/projects/pawco-16.jpg",
    ],
  },
  {
    slug: "rikarena-concert",
    title: "Rikarena — Live",
    category: "Concert Photography",
    location: "Brisbane, Australia",
    year: "2025",
    summary:
      "A live music story captured with rhythm, emotion, stage light and performance energy. Every frame holds the pulse of the night.",
    cover: "/assets/projects/rikarena-01.jpg",
    images: [
      "/assets/projects/rikarena-01.jpg",
      "/assets/projects/rikarena-02.jpg",
      "/assets/projects/rikarena-03.jpg",
      "/assets/projects/rikarena-04.jpg",
      "/assets/projects/rikarena-05.jpg",
      "/assets/projects/rikarena-06.jpg",
      "/assets/projects/rikarena-07.jpg",
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

export const howItWorks = [
  {
    step: "01",
    title: "Enquiry",
    description:
      "Send your date, location and type of session. I'll come back to you with availability and next steps.",
  },
  {
    step: "02",
    title: "Planning",
    description:
      "We define the style, timing, key moments and the feeling you want your images to carry.",
  },
  {
    step: "03",
    title: "Shoot Day",
    description:
      "I guide you naturally while capturing real emotions, details and atmosphere — nothing forced.",
  },
  {
    step: "04",
    title: "Gallery Delivery",
    description:
      "Your private online gallery arrives — ready to view, download and share at your own pace.",
  },
];

export const globalFaq = [
  {
    question: "Where are you based?",
    answer:
      "I'm based in Brisbane, Queensland, Australia, and available for sessions across Queensland, Australia-wide and internationally for selected projects.",
  },
  {
    question: "What type of photography do you offer?",
    answer:
      "I offer wedding photography, couple sessions, event coverage, maternity photography, personal branding, portrait sessions and drone photography.",
  },
  {
    question: "How do I receive my photos?",
    answer:
      "Final images are delivered through a private online gallery, ready to view, download and share at your own pace.",
  },
  {
    question: "Do you travel outside Brisbane?",
    answer:
      "Yes. I'm available for sessions across Brisbane, Gold Coast, Sunshine Coast, Queensland, Australia-wide and selected international projects.",
  },
  {
    question: "Do you offer drone photography?",
    answer:
      "Yes. Drone photography and aerial footage are available for weddings, events, brands and selected outdoor sessions where permitted.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "For weddings and events I recommend enquiring as early as possible to secure your date. Couple, portrait and branding sessions can often be arranged with shorter notice.",
  },
  {
    question: "Do you help with posing?",
    answer:
      "Yes. I guide clients naturally so the session feels relaxed, comfortable and authentic — not stiff or posed.",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
