import styles from "./Commands.module.css";

const GROUPS = [
  {
    label: "lifecycle",
    items: [
      ["start", "run & supervise an app"],
      ["stop", "stop one, all, or a namespace"],
      ["restart", "restart targets"],
      ["delete", "stop and forget"],
      ["reset", "zero the restart counter"],
      ["signal", "send HUP, USR1, …"],
    ],
  },
  {
    label: "inspect",
    items: [
      ["status", "boxed table (ls / ps)"],
      ["describe", "every parameter of an app"],
      ["logs", "tail stdout/stderr (-f)"],
      ["flush", "empty log files"],
      ["ping", "is the agent up?"],
    ],
  },
  {
    label: "config & boot",
    items: [
      ["config", "init · show · validate · reload"],
      ["notify", "Discord alerts (test · status)"],
      ["set", "logs.* rotation · disk.* alerts"],
      ["save", "snapshot the process list"],
      ["resurrect", "bring the snapshot back"],
      ["startup", "boot service (launchd/systemd)"],
      ["kill", "stop the agent"],
      ["update", "self-update to the latest release"],
    ],
  },
];

const TRIGGERS = [
  ["--restart", "always · on-failure · never"],
  ["--max-memory-restart", "recycle over a memory limit"],
  ["--watch", "reload on file change"],
  ["--cron-restart", "restart on a schedule"],
  ["--instances", "run N copies"],
  ["--kill-timeout", "grace before SIGKILL"],
];

export default function Commands() {
  return (
    <section className={styles.section} id="commands">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">the full set</span>
          <h2>Every command, one mental model.</h2>
          <p>
            Everything targets an app by name, <code className="tok">all</code>, or a{" "}
            <code className="tok">--namespace</code>. See the{" "}
            <a className={styles.link} href="/docs">
              docs
            </a>{" "}
            for every flag.
          </p>
        </div>

        <div className={styles.grid}>
          {GROUPS.map((g) => (
            <div className={styles.group} key={g.label}>
              <div className={styles.groupLabel}>{g.label}</div>
              <ul>
                {g.items.map(([cmd, desc]) => (
                  <li key={cmd}>
                    <code>{cmd}</code>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={`${styles.group} ${styles.triggers}`}>
            <div className={styles.groupLabel}>restart triggers (start flags)</div>
            <ul>
              {TRIGGERS.map(([flag, desc]) => (
                <li key={flag}>
                  <code>{flag}</code>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
