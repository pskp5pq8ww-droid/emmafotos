import Image from "next/image";
import { Reveal } from "@/components/public/Reveal";
import styles from "@/components/public/Public.module.css";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main>
      <section className={styles.pageHero}>
        <Reveal>
          <p className={styles.sectionEyebrow}>Sobre mí</p>
          <h1 className={styles.pageTitle}>
            Una mirada serena para personas, espacios y momentos que importan.
          </h1>
        </Reveal>
      </section>
      <section className={`${styles.sectionTight} ${styles.split}`}>
        <Reveal>
          <div>
            <p className={styles.sectionCopy}>
              Soy Emmanuel Rojas, fotógrafo radicado en Brisbane, Australia, con
              más de 4 años de experiencia y más de 200 eventos capturados en
              Colombia, Australia y el resto del mundo.
            </p>
            <p className={styles.sectionCopy}>
              Me especializo en bodas, sesiones de retrato y eventos — siempre
              con una dirección natural, sin forzar momentos. Mi filosofía es
              simple: estar presente, anticipar el instante y contar la historia
              como realmente fue.
            </p>
            <p className={styles.sectionCopy}>
              Cada galería privada se entrega a través de un portal seguro donde
              mis clientes pueden revisar, marcar favoritos y descargar sus
              imágenes. Desde la primera consulta hasta la entrega final, cada
              paso está diseñado para ser tan memorable como las fotos mismas.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className={styles.portrait}>
            <Image
              src="/assets/emmanuel-portrait.jpg"
              alt="Emmanuel Rojas"
              width={791}
              height={1024}
              priority
            />
          </div>
        </Reveal>
      </section>
    </main>
  );
}
