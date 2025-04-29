//! Components
import Image from "next/image";
import { Button } from "@/app/components/ui";

//! Styles
import styles from "./styles.module.css";

function Hero() {
  return (
    <div className={styles.hero}>
      <div
        className={styles.heroContent}>
        <h2 className={styles.subtitle}>
          We are
        </h2>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>
            Yeta
          </h1>
          <Image
            className={styles.logo}
            priority
            width={50}
            height={50}
            quality={100}
            alt={"Yeta Studio Logo Mark"}
            src={"https://res.cloudinary.com/doowhwdzj/image/upload/v1745707536/Variant_Dark_wcqmcg.svg"}
          />
          <h1 className={styles.title}>
            Studio
          </h1>
        </div>
        <h2 className={styles.slogan}>
          ‘Cause <u><b>great</b></u> brands
          aren’t built on <del>luck</del>.
        </h2>
        <div className={styles.heroCTAs}>
          <Button title="Why choose Yeta Studio" radius="rounded" isFullWidth />
          <Button title="Let's build something" radius="rounded" isFullWidth />
        </div>
      </div>
    </div>
  )
}

export default Hero;