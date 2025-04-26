
//! Components
import { Header, Hero, Footer } from "@/app/components/layout";

//! Styles
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Hero />
    </div>
  );
}
