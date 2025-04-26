//! Next Components
import Image from "next/image";

//! Styles
import styles from "./styles.module.css";

function Hero() {
  return (
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
  )
}

export default Hero;