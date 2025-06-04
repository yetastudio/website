//! Components
import { Header, Hero, Summary, Footer } from "@/components/layout";

//! Styles
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <Hero />
      <Summary />
    </div>
  );
}