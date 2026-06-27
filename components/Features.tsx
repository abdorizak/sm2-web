import styles from "./Features.module.css";

const FEATURES = [
  {
    tag: "rx start",
    title: "Runs anything",
    body: "Go, Node, Python, Rust, a shell one-liner — if it runs in a terminal, Runix supervises it. PID tracking, process groups, and clean shutdown with SIGTERM then SIGKILL.",
  },
  {
    tag: "--restart",
    title: "Brings it back",
    body: "Pick a policy — always, on-failure, or never — and a retry limit. When a process exits unexpectedly, Runix restarts it and counts the attempts.",
  },
  {
    tag: "rx status",
    title: "Shows what's live",
    body: "Per-process state, CPU, memory, uptime, and restart count in one table. No guessing which services are up.",
  },
  {
    tag: "rx config reload",
    title: "Describes the whole stack",
    body: "Declare every app in runix.yaml. Reload reconciles the running set to match — starting what's new, stopping what's gone, restarting what changed.",
  },
  {
    tag: "notifications",
    title: "Tells you when it matters",
    body: "Get a message the moment something starts, stops, crashes, or recovers. Discord today; Slack, Telegram, and email next.",
  },
  {
    tag: "single binary",
    title: "Installs in seconds",
    body: "One static Go binary. The CLI starts a background agent over a local socket on first use — nothing to configure, no runtime to install.",
  },
  {
    tag: "save · resurrect · startup",
    title: "Survives reboots",
    body: "Snapshot the running set, then bring it all back after a restart. Generate a launchd or systemd unit so the machine boots straight back into your apps.",
  },
  {
    tag: "--watch · --cron-restart",
    title: "Restarts on your terms",
    body: "Reload on file changes, recycle on a cron schedule, or restart automatically when a process crosses a memory limit with --max-memory-restart.",
  },
];

export default function Features() {
  return (
    <section className={styles.section} id="features">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">what it does</span>
          <h2>A supervisor, not just a launcher.</h2>
          <p>
            Starting a process is easy. Keeping it healthy, knowing when it
            isn&apos;t, and putting it back is the job. That&apos;s the part Runix owns.
          </p>
        </div>

        <div className={styles.grid}>
          {FEATURES.map((f) => (
            <article className={styles.card} key={f.tag}>
              <span className={styles.tag}>{f.tag}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
