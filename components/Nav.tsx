import Logo from "./Logo";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <header className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <a href="/" className={styles.brand}>
          <span className={styles.mark}>
            <Logo size={22} />
          </span>
          sm2
        </a>
        <nav className={styles.links}>
          <a href="/#features">features</a>
          <a href="/#commands">commands</a>
          <a href="/#config">config</a>
          <a href="/docs">docs</a>
          <a
            className={styles.cta}
            href="https://github.com/abdorizak/sm2"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
