import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyButton from "@/components/CopyButton";
import styles from "./docs.module.css";

export const metadata: Metadata = {
  title: "Runix docs — command & config reference",
  description:
    "Reference for the Runix CLI: every command, start flag, the runix.yaml schema, restart triggers, reboot survival, notifications, and output options.",
};

const NAV = [
  ["install", "Install"],
  ["quickstart", "Quick start"],
  ["commands", "Commands"],
  ["flags", "Start flags"],
  ["config", "Configuration"],
  ["triggers", "Restart triggers"],
  ["persistence", "Persistence & boot"],
  ["notifications", "Notifications"],
  ["output", "Output & color"],
];

const COMMANDS: [string, string][] = [
  ["start <name>", "Start and supervise an app (see start flags below)."],
  ["stop <name|all>", "Stop one app, all apps, or a --namespace."],
  ["restart <name|all>", "Restart targets, resetting their backoff."],
  ["delete <name|all>", "Stop and remove from the list. Aliases: del, rm."],
  ["reset <name|all>", "Zero the restart counter."],
  ["signal <sig> <name|all>", "Send a signal (HUP, USR1, TERM, …). Alias: sendSignal."],
  ["status", "Boxed status table. Aliases: ls, ps, list. Flag: --json."],
  ["describe <name>", "Every parameter of an app. Aliases: info, desc, show."],
  ["logs <name>", "Stream logs. Flags: -f/--follow, --stderr, -n/--lines."],
  ["flush [name]", "Empty log files for one app or all."],
  ["config <sub>", "init · show · validate · reload (see Configuration)."],
  ["save", "Snapshot the process list to ~/.runix/dump.json. Alias: dump."],
  ["resurrect", "Restart the apps from the last save."],
  ["startup", "Generate a launchd/systemd boot service."],
  ["unstartup", "Remove the boot service."],
  ["ping", "Check the agent is up (starts it if not)."],
  ["kill", "Stop the agent and every managed app."],
  ["version", "Print the Runix version."],
];

const FLAGS: [string, string][] = [
  ["--cmd <cmd>", "Command to run (required)."],
  ["--dir, --cwd <path>", "Working directory."],
  ["-e, --env KEY=VALUE", "Environment variable (repeatable)."],
  ["--restart <policy>", "always | on-failure | never. Default: on-failure."],
  ["--max-retries <n>", "Cap auto-restarts (0 = unlimited). Alias: --max-restarts."],
  ["-i, --instances <n>", "Launch N copies as <name>-0 … <name>-(N-1)."],
  ["--namespace <ns>", "Group the app for bulk targeting."],
  ["--no-autorestart", "Never restart automatically (= --restart never)."],
  ["--no-autostart", "Register the app without starting it."],
  ["--kill-timeout <dur>", "Grace before SIGKILL, e.g. 10s. Default: 5s."],
  ["--restart-delay <dur>", "Fixed delay between restarts, e.g. 500ms."],
  ["--exp-backoff-restart-delay <dur>", "Exponential backoff base (capped at 30s)."],
  ["--max-memory-restart <size>", "Restart over a memory limit, e.g. 150M, 1G."],
  ["--watch", "Restart when files change."],
  ["--ignore-watch <frag>", "Path fragment to ignore while watching (repeatable)."],
  ["--cron-restart <expr>", "Restart on a 5-field cron schedule."],
];

function Code({ children, copy }: { children: React.ReactNode; copy?: string }) {
  return (
    <div className={styles.code}>
      {copy && (
        <span className={styles.copy}>
          <CopyButton text={copy} />
        </span>
      )}
      <pre>{children}</pre>
    </div>
  );
}

function Table({ head, rows }: { head: [string, string]; rows: [string, string][] }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>{head[0]}</th>
          <th>{head[1]}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([a, b]) => (
          <tr key={a}>
            <td>
              <code>{a}</code>
            </td>
            <td>{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const INSTALL = "go install github.com/abdorizak/runix/cmd/rx@latest";

export default function DocsPage() {
  return (
    <>
      <Nav />
      <div className={styles.wrap}>
        <aside className={styles.side}>
          <div className={styles.sideTitle}>reference</div>
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </aside>

        <main className={styles.content}>
          <h1 className={styles.lead}>Documentation</h1>
          <p className={styles.leadSub}>
            Everything the Runix CLI can do. Commands target an app by name,{" "}
            <code className="tok">all</code>, or a <code className="tok">--namespace</code>.
          </p>

          <section id="install" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Install</h2>
            <p>Runix is a single Go binary. Install with the Go toolchain:</p>
            <Code copy={INSTALL}>
              <span className={styles.prompt}>$ </span>{INSTALL}
            </Code>
            <p>
              The command is <code className="tok">rx</code>. Make sure{" "}
              <code className="tok">$(go env GOPATH)/bin</code> is on your{" "}
              <code className="tok">PATH</code>. No daemon to configure — the CLI starts a
              background agent over a Unix socket on first use.
            </p>
          </section>

          <section id="quickstart" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Quick start</h2>
            <Code copy={'rx start api --cmd "./api" --restart always'}>
              <span className={styles.prompt}>$ </span>rx start api --cmd &quot;./api&quot; --restart always{"\n"}
              <span className={styles.prompt}>$ </span>rx status{"\n"}
              <span className={styles.prompt}>$ </span>rx logs api --follow{"\n"}
              <span className={styles.prompt}>$ </span>rx restart api{"\n"}
              <span className={styles.prompt}>$ </span>rx save{"  "}<span className={styles.cmt}># survive reboots</span>
            </Code>
          </section>

          <section id="commands" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Commands</h2>
            <p>Twenty commands. Run <code className="tok">rx &lt;cmd&gt; --help</code> for usage.</p>
            <Table head={["Command", "Description"]} rows={COMMANDS} />
          </section>

          <section id="flags" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Start flags</h2>
            <p>
              Flags for <code className="tok">rx start</code>. Durations accept Go syntax
              (<code className="tok">500ms</code>, <code className="tok">10s</code>); sizes accept{" "}
              <code className="tok">K</code>/<code className="tok">M</code>/<code className="tok">G</code>.
            </p>
            <Table head={["Flag", "Description"]} rows={FLAGS} />
            <h3>Global flags</h3>
            <Table
              head={["Flag", "Description"]}
              rows={[
                ["--no-color", "Disable colored output."],
                ["--plain", "Plain table output (no box borders)."],
              ]}
            />
          </section>

          <section id="config" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Configuration</h2>
            <p>
              Declare your whole stack in <code className="tok">runix.yaml</code>, then run{" "}
              <code className="tok">rx config reload</code> — Runix reconciles the running
              set to match (starts new, stops removed, restarts changed). Lookup order:{" "}
              <code className="tok">--config</code> → <code className="tok">./runix.yaml</code> →{" "}
              <code className="tok">~/.runix/runix.yaml</code>.
            </p>
            <Code>
{`agent:
  name: production

apps:
  api:
    command: "./api"
    directory: "/srv/api"
    namespace: web
    instances: 2
    restart:
      policy: always
      max_retries: 5
    kill_timeout: 10s
    restart_delay: 500ms
    max_memory_restart: 300M
    watch: true
    ignore_watch: ["tmp", "logs"]
    cron_restart: "0 3 * * *"
    environment:
      PORT: "8080"

notifications:
  discord:
    enabled: true
    webhook: "https://discord.com/api/webhooks/…"

health:
  enabled: true
  interval: 30s`}
            </Code>
            <Code copy="rx config validate">
              <span className={styles.prompt}>$ </span>rx config init{"      "}<span className={styles.cmt}># write a starter file</span>{"\n"}
              <span className={styles.prompt}>$ </span>rx config validate{"  "}<span className={styles.cmt}># check without starting</span>{"\n"}
              <span className={styles.prompt}>$ </span>rx config reload{"    "}<span className={styles.cmt}># apply to the agent</span>
            </Code>
          </section>

          <section id="triggers" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Restart triggers</h2>
            <p>Beyond crash recovery, Runix can restart an app on three signals of its own:</p>
            <h3>Memory</h3>
            <p>
              <code className="tok">--max-memory-restart 300M</code> samples resident memory and
              recycles the process when it crosses the limit — a safety net for slow leaks.
            </p>
            <h3>File changes</h3>
            <p>
              <code className="tok">--watch</code> reloads on any change under the working
              directory; <code className="tok">--ignore-watch</code> skips paths.{" "}
              <code className="tok">.git</code>, <code className="tok">node_modules</code> and friends
              are ignored by default.
            </p>
            <h3>Cron</h3>
            <p>
              <code className="tok">--cron-restart &quot;0 3 * * *&quot;</code> recycles on a 5-field
              schedule (minute, hour, day-of-month, month, day-of-week) with{" "}
              <code className="tok">*</code>, ranges, lists and <code className="tok">*/step</code>.
            </p>
          </section>

          <section id="persistence" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Persistence &amp; boot</h2>
            <p>
              <code className="tok">save</code> writes the current process list to{" "}
              <code className="tok">~/.runix/dump.json</code>; <code className="tok">resurrect</code>{" "}
              brings it back. <code className="tok">startup</code> generates a launchd agent (macOS)
              or systemd user unit (Linux) that runs <code className="tok">resurrect</code> at boot,
              so the machine returns to your apps after a restart.
            </p>
            <Code copy="rx save">
              <span className={styles.prompt}>$ </span>rx save{"\n"}
              <span className={styles.prompt}>$ </span>rx startup{"    "}<span className={styles.cmt}># prints the enable command</span>{"\n"}
              <span className={styles.prompt}>$ </span>rx resurrect{"  "}<span className={styles.cmt}># restore on demand</span>
            </Code>
          </section>

          <section id="notifications" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Notifications</h2>
            <p>
              Enable the Discord webhook in <code className="tok">runix.yaml</code> and Runix posts
              on every lifecycle event: <code className="tok">started</code>,{" "}
              <code className="tok">stopped</code>, <code className="tok">crashed</code>, and{" "}
              <code className="tok">restarted</code> (with the restart count). Slack, Telegram and
              email are on the roadmap.
            </p>
          </section>

          <section id="output" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Output &amp; color</h2>
            <p>
              On a terminal, <code className="tok">status</code> prints a colored box (RUNNING green,
              FAILED red, RESTARTING yellow, STOPPED dim). When piped it falls back to plain
              tab-separated text, so <code className="tok">grep</code> and{" "}
              <code className="tok">awk</code> keep working.
            </p>
            <Table
              head={["Control", "Effect"]}
              rows={[
                ["--json", "Machine-readable status output."],
                ["--plain", "Plain table, no box borders."],
                ["--no-color", "Box without color."],
                ["NO_COLOR=1", "Disable color (cross-tool standard)."],
                ["RUNIX_FORCE_COLOR=1", "Force rich output when piping (e.g. to less -R)."],
              ]}
            />
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
