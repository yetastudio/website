"use client"

//! Hooks
import { useTheme } from "@/hooks/useTheme";

//! Components
import Image from "next/image";
import { ArrowUpRight, Menu } from "lucide-react";
import { NavBar } from "@/components/layout";
import { Button } from "@/components/ui";


//! Styles
import styles from "./styles.module.css";

function Header() {
  const { isDarkMode } = useTheme();

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
          src={isDarkMode ?
            "https://res.cloudinary.com/doowhwdzj/image/upload/v1749262439/dark-brand-mark_twpz8q.svg" :
            "https://res.cloudinary.com/doowhwdzj/image/upload/v1749262439/light-brand-mark_nedclx.svg"}
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
          src={isDarkMode ?
            "https://res.cloudinary.com/doowhwdzj/image/upload/v1749262439/dark-brand-mark_twpz8q.svg" :
            "https://res.cloudinary.com/doowhwdzj/image/upload/v1749262439/light-brand-mark_nedclx.svg"}
        />
        <NavBar />
        <Button title="Get in touch" size="lg" radius={"rounded"} variant={"solid"} icon={ArrowUpRight} iconPosition="right" />
      </div>
    </div>
  )
}

export default Header