//! Types
import { NavItemProps } from "@/app/types";

//! Components
import Link from "next/link";

//! Styles
import styles from "./styles.module.css";

function NavItem(props: NavItemProps) {
  const { href, children } = props;

  return (
    <Link href={href} className={styles.navItem}>
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