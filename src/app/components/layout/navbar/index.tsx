//! Types
import { ReactNode } from "react";

//! Components
import Link from "next/link";

//! Styles
import styles from "./styles.module.css";

type NavItemProps = {
  href: string;
  children: ReactNode;
  isActive?: boolean;
};

function NavItem({ href, children, isActive = false }: NavItemProps) {
  return (
    <Link href={href} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
      {children}
    </Link>
  );
}

function NavBar() {
  return (
    <nav className={styles.navBar}>
      <NavItem href="/#about">Why Yeta?</NavItem>
      <NavItem href="/#services">Our Craft</NavItem>
      <NavItem href="/#work">Our Work</NavItem>
      <NavItem href="/#process">Our Process</NavItem>
      <NavItem href="/#stories">Success Stories</NavItem>
      <NavItem href="/#testimonials">Testimonials</NavItem>
    </nav>
  );
}

export default NavBar;