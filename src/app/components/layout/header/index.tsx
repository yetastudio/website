//! Components
import Image from "next/image";
import { NavBar } from "@/app/components/layout";
import { Button } from "@/app/components/ui";
import { ArrowUpRight, Menu } from "lucide-react";

//! Styles
import styles from "./styles.module.css";

function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.mobile}>
        <Image
          className={styles.logo}
          priority
          width={40}
          height={40}
          quality={100}
          alt={"Yeta Studio Logo Mark"}
          src={"https://res.cloudinary.com/doowhwdzj/image/upload/v1745585092/Variant_Dark_Background_Transparent_mz2hyt.svg"}
        />
        <Button radius={"squared"} variant={"ghost"} icon={Menu} iconPosition="middle" />
      </div>
      <div className={styles.desktop}>
        <Image
          className={styles.logo}
          priority
          width={60}
          height={60}
          quality={100}
          alt={"Yeta Studio Logo Mark"}
          src={"https://res.cloudinary.com/doowhwdzj/image/upload/v1745585092/Variant_Dark_Background_Transparent_mz2hyt.svg"}
        />
        <NavBar />
        <Button title="Get in touch" size="lg" radius={"rounded"} variant={"solid"} icon={ArrowUpRight} iconPosition="right" />
      </div>
    </div>
  )
}

export default Header