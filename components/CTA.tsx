import CopyButton from "./CopyButton";
import styles from "./CTA.module.css";

const INSTALL = "curl -fsSL https://raw.githubusercontent.com/abdorizak/sm2/main/install.sh | bash";

export default function CTA() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.box}>
          <h2 className={styles.title}>
            Stop babysitting processes.
          </h2>
          <p className={styles.sub}>
            Install sm2, point it at your apps, and let the agent handle the
            3am restarts.
          </p>

          <div className={styles.install}>
            <span className={styles.prompt}>$</span>
            <code>{INSTALL}</code>
            <CopyButton text={INSTALL} />
          </div>

          <a
            className={styles.button}
            href="https://github.com/abdorizak/sm2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get started on GitHub ↗
          </a>
        </div>
      </div>
    </section>
  );
}
