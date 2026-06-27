"use client";

import { useEffect, useState } from "react";
import styles from "./docs.module.css";

// DocsSidebar highlights the reference link for whichever section is currently
// in view, updating as the reader scrolls.
export default function DocsSidebar({ items }: { items: [string, string][] }) {
  const [active, setActive] = useState(items[0]?.[0] ?? "");

  useEffect(() => {
    const sections = items
      .map(([id]) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Trigger when a heading reaches the upper part of the viewport.
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className={styles.side}>
      <div className={styles.sideTitle}>reference</div>
      {items.map(([id, label]) => (
        <a
          key={id}
          href={`#${id}`}
          className={active === id ? styles.active : undefined}
          aria-current={active === id ? "true" : undefined}
        >
          {label}
        </a>
      ))}
    </aside>
  );
}
