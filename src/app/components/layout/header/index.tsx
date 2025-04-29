//! Next Core
import Image from "next/image";

//! Components
import { Menu } from "lucide-react";
import { Button } from "@/app/components/ui";

//! Styles
import styles from "./styles.module.css";

function Header() {
  return (
    <div className={styles.header}>
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
  )
}

export default Header