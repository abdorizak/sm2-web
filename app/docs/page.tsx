import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyButton from "@/components/CopyButton";
import DocsSidebar from "./DocsSidebar";
import styles from "./docs.module.css";

export const metadata: Metadata = {
  title: "sm2 docs — command & config reference",
  description:
    "Reference for the sm2 CLI: every command, start flag, the sm2.yaml schema, restart triggers, reboot survival, notifications, and output options.",
};

const NAV: [string, string][] = [
  ["install", "Install"],
  ["quickstart", "Quick start"],
  ["commands", "Commands"],
  ["flags", "Start flags"],
  ["config", "Configuration"],
  ["env", "Environment & reload"],
  ["triggers", "Restart triggers"],
  ["persistence", "Persistence & boot"],
  ["notifications", "Notifications"],
  ["output", "Output & color"],
];

const COMMANDS: [string, string][] = [
  ["start <name>", "Start and supervise an app (see start flags below)."],
  ["stop <name|all>", "Stop one app, all apps, or a --namespace."],
  ["restart <name|all>", "Restart targets. Alias: reload. --update-env re-reads the shell env."],
  ["delete <name|all>", "Stop and remove from the list. Aliases: del, rm."],
  ["reset <name|all>", "Zero the restart counter."],
  ["signal <sig> <name|all>", "Send a signal (HUP, USR1, TERM, …). Alias: sendSignal."],
  ["status", "Boxed status table. Aliases: ls, ps, list. Flag: --json."],
  ["describe <name>", "Every parameter of an app. Aliases: info, desc, show."],
  ["logs <name>", "Stream logs. Flags: -f/--follow, --stderr, -n/--lines."],
  ["flush [name]", "Empty log files for one app or all."],
  ["config <sub>", "init · show · validate · reload (see Configuration)."],
  ["notify <sub>", "discord · test · status — set up notifications without a config file."],
  ["save", "Snapshot the process list to ~/.sm2/dump.json. Alias: dump."],
  ["resurrect", "Restart the apps from the last save."],
  ["startup", "Generate a launchd/systemd boot service."],
  ["unstartup", "Remove the boot service."],
  ["ping", "Check the agent is up (starts it if not)."],
  ["kill", "Stop the agent and every managed app."],
  ["version", "Print the sm2 version."],
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

const INSTALL = "curl -fsSL https://raw.githubusercontent.com/abdorizak/sm2/main/install.sh | bash";
const INSTALL_GO = "go install github.com/abdorizak/sm2/cmd/sm2@v0.1.0-dev.1";

export default function DocsPage() {
  return (
    <>
      <Nav />
      <div className={styles.wrap}>
        <DocsSidebar items={NAV} />

        <main className={styles.content}>
          <h1 className={styles.lead}>Documentation</h1>
          <p className={styles.leadSub}>
            Everything the sm2 CLI can do. Commands target an app by name,{" "}
            <code className="tok">all</code>, or a <code className="tok">--namespace</code>.
          </p>

          <section id="install" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Install</h2>
            <p>
              Quickest — downloads the prebuilt binary for your OS/architecture, verifies
              its checksum, and installs it (Linux &amp; macOS, no Go required):
            </p>
            <Code copy={INSTALL}>
              <span className={styles.prompt}>$ </span>{INSTALL}
            </Code>
            <p>
              The command is <code className="tok">sm2</code>. No daemon to configure — the
              CLI starts a background agent over a Unix socket on first use.
            </p>
            <h3>With Go</h3>
            <Code copy={INSTALL_GO}>
              <span className={styles.prompt}>$ </span>{INSTALL_GO}
            </Code>
            <p>
              Or download an archive from the{" "}
              <a
                href="https://github.com/abdorizak/sm2/releases"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--amber)" }}
              >
                releases page
              </a>
              . Windows isn&apos;t supported (sm2 uses Unix process groups, signals and sockets).
            </p>
          </section>

          <section id="quickstart" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Quick start</h2>
            <Code copy={'sm2 start api --cmd "./api" --restart always'}>
              <span className={styles.prompt}>$ </span>sm2 start api --cmd &quot;./api&quot; --restart always{"\n"}
              <span className={styles.prompt}>$ </span>sm2 status{"\n"}
              <span className={styles.prompt}>$ </span>sm2 logs api --follow{"\n"}
              <span className={styles.prompt}>$ </span>sm2 restart api{"\n"}
              <span className={styles.prompt}>$ </span>sm2 save{"  "}<span className={styles.cmt}># survive reboots</span>
            </Code>
          </section>

          <section id="commands" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Commands</h2>
            <p>Twenty commands. Run <code className="tok">sm2 &lt;cmd&gt; --help</code> for usage.</p>
            <Table head={["Command", "Description"]} rows={COMMANDS} />
          </section>

          <section id="flags" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Start flags</h2>
            <p>
              Flags for <code className="tok">sm2 start</code>. Durations accept Go syntax
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
              Declare your whole stack in <code className="tok">sm2.yaml</code> or{" "}
              <code className="tok">sm2.toml</code> (sm2 picks the parser by extension),
              then run <code className="tok">sm2 config reload</code> — sm2 reconciles the
              running set to match (starts new, stops removed, restarts changed). Lookup
              order: <code className="tok">--config</code> →{" "}
              <code className="tok">./sm2.toml</code> →{" "}
              <code className="tok">./sm2.yaml</code> →{" "}
              <code className="tok">~/.sm2/</code>.
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
            <Code copy="sm2 config validate">
              <span className={styles.prompt}>$ </span>sm2 config init{"      "}<span className={styles.cmt}># write a starter file</span>{"\n"}
              <span className={styles.prompt}>$ </span>sm2 config validate{"  "}<span className={styles.cmt}># check without starting</span>{"\n"}
              <span className={styles.prompt}>$ </span>sm2 config reload{"    "}<span className={styles.cmt}># apply to the agent</span>
            </Code>
          </section>

          <section id="env" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Environment &amp; reload</h2>
            <p>
              Every app runs with an environment built from two layers: a{" "}
              <strong>base</strong> it inherits, plus the{" "}
              <strong>overrides</strong> you set per app (the{" "}
              <code className="tok">environment</code> block in config, or{" "}
              <code className="tok">-e KEY=VALUE</code> on <code className="tok">sm2 start</code>).
              Overrides always win.
            </p>
            <Code>
{`final env  =  base (inherited)  +  per-app overrides   ← overrides win
              └ the agent's environment,
                or your current shell with --update-env`}
            </Code>
            <p>
              The base is captured when the background agent first starts. That has a
              practical consequence: if you <code className="tok">export FOO=bar</code> in your
              shell and then run a plain <code className="tok">sm2 restart</code>, the app{" "}
              <em>won&apos;t</em> see <code className="tok">FOO</code> — the agent&apos;s
              environment is older than your shell. Two ways to refresh:
            </p>
            <Table
              head={["You want to…", "Do this"]}
              rows={[
                ["Change env declared in config", "edit sm2.yaml/toml → sm2 config reload"],
                ["Pull your current shell env into an app", "sm2 restart <app> --update-env"],
                ["Restart (PM2 muscle memory)", "sm2 reload <app>  (alias of restart)"],
              ]}
            />
            <p>
              <strong>How it works:</strong> <code className="tok">sm2 config reload</code>{" "}
              compares each app&apos;s spec — environment included — and restarts only the apps
              that changed. <code className="tok">--update-env</code> sends your shell&apos;s live
              environment to the agent, which uses it as the new base on relaunch (your explicit
              config/<code className="tok">-e</code> values still take precedence).
            </p>
            <p>
              <strong>One honest caveat:</strong> <code className="tok">reload</code> is an alias
              of <code className="tok">restart</code> — sm2 restarts the process, so there is a
              brief moment of downtime. It is <em>not</em> a zero-downtime rolling reload like
              PM2&apos;s cluster mode; true hand-off is language- and socket-specific, so sm2
              keeps the behavior simple and predictable across every runtime.
            </p>
            <Code copy="sm2 restart api --update-env">
              <span className={styles.prompt}>$ </span>export API_KEY=secret{"\n"}
              <span className={styles.prompt}>$ </span>sm2 restart api --update-env{"  "}<span className={styles.cmt}># api now sees API_KEY</span>
            </Code>
          </section>

          <section id="triggers" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Restart triggers</h2>
            <p>Beyond crash recovery, sm2 can restart an app on three signals of its own:</p>
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
              <code className="tok">~/.sm2/dump.json</code>; <code className="tok">resurrect</code>{" "}
              brings it back. <code className="tok">startup</code> generates a launchd agent (macOS)
              or systemd user unit (Linux) that runs <code className="tok">resurrect</code> at boot,
              so the machine returns to your apps after a restart.
            </p>
            <Code copy="sm2 save">
              <span className={styles.prompt}>$ </span>sm2 save{"\n"}
              <span className={styles.prompt}>$ </span>sm2 startup{"    "}<span className={styles.cmt}># prints the enable command</span>{"\n"}
              <span className={styles.prompt}>$ </span>sm2 resurrect{"  "}<span className={styles.cmt}># restore on demand</span>
            </Code>
          </section>

          <section id="notifications" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Notifications</h2>
            <p>
              sm2 posts to Discord on every lifecycle event:{" "}
              <code className="tok">started</code>, <code className="tok">stopped</code>,{" "}
              <code className="tok">crashed</code>, and <code className="tok">restarted</code>{" "}
              (with the restart count). Slack, Telegram and email are on the roadmap.
            </p>
            <p>
              Set it up two ways. <strong>Without a config file</strong>, use the{" "}
              <code className="tok">notify</code> command — it talks to the agent and persists
              to <code className="tok">~/.sm2/notify.json</code>, so it survives restarts:
            </p>
            <Code copy='sm2 notify discord --webhook "https://discord.com/api/webhooks/…"'>
              <span className={styles.prompt}>$ </span>sm2 notify discord --webhook &quot;https://discord.com/api/webhooks/…&quot;{"\n"}
              <span className={styles.prompt}>$ </span>sm2 notify test{"     "}<span className={styles.cmt}># send a test message</span>{"\n"}
              <span className={styles.prompt}>$ </span>sm2 notify status{"\n"}
              <span className={styles.prompt}>$ </span>sm2 notify discord --disable
            </Code>
            <p>
              Or declare it in <strong>config</strong> and apply with{" "}
              <code className="tok">sm2 config reload</code>:
            </p>
            <Code>
{`notifications:
  discord:
    enabled: true
    webhook: "https://discord.com/api/webhooks/…"`}
            </Code>
            <p>Whichever you set last wins.</p>
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
                ["SM2_FORCE_COLOR=1", "Force rich output when piping (e.g. to less -R)."],
              ]}
            />
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
