"use client"

//! React Core
import { useState, useEffect, useRef } from "react";

//! React Hooks
import { useTheme } from "@/hooks/useTheme";

//! GSAP
import { Expo, gsap } from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

//! Styles
import styles from "./styles.module.css"

export default function Cursor() {

  const { isDarkMode } = useTheme()

  const cursorRef = useRef<SVGSVGElement | null>(null);
  const mouseRef = useRef<any>({ x: null, y: null, });

  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      return ((window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches));
    };

    setIsMobileDevice(checkIfMobile());

    const handleResize = () => {
      setIsMobileDevice(checkIfMobile());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useGSAP(() => {
    if (isMobileDevice || !cursorRef.current) return;

    const cursor = cursorRef.current;

    mouseRef.current = {
      x: gsap.quickTo(cursor, "x", { duration: 0.1, ease: Expo.easeOut }),
      y: gsap.quickTo(cursor, "y", { duration: 0.1, ease: Expo.easeOut })
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x(e.clientX);
      mouseRef.current.y(e.clientY);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const isInteractive = target.closest("a") || target.closest("link") || target.closest("button");

      if (cursor) {
        cursor.style.display = isInteractive ? 'none' : 'inherit';
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, {
    dependencies: [isMobileDevice],
    scope: cursorRef,
    revertOnUpdate: true,
  });

  if (isMobileDevice) {
    return null;
  }

  return (
    <svg
      ref={cursorRef}
      id="cursor"
      className={styles.cursor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="url(#a)"
        stroke="url(#b)"
        strokeWidth={1.5}
        d="M1.464 2.825c.995 5.4 2.578 10.843 3.997 15.788a1.003 1.003 0 0 0 1.752.343l4.102-5.22a1 1 0 0 1 .47-.33l5.302-1.768a.996.996 0 0 0 .245-1.77C12.854 6.843 8.16 3.822 3.538 1.322a1.41 1.41 0 0 0-2.074 1.502Z"
      />
      <defs>
        <linearGradient
          id="a"
          x1={10}
          x2={10}
          y1={0}
          y2={20.5}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={isDarkMode ? "#111307" : "#C5C7BC"} />
          <stop offset={1} stopColor={isDarkMode ? "#0A0B04" : "#60615C"} />
        </linearGradient>
        <linearGradient
          id="b"
          x1={10}
          x2={10}
          y1={0}
          y2={20.5}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={isDarkMode ? "#C5C7BC" : "#111307"} />
          <stop offset={1} stopColor={isDarkMode ? "#60615C" : "#0A0B04"} />
        </linearGradient>
      </defs>
    </svg >
  );
};