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
  ["examples", "Examples"],
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
  ["-- <command…>", "The command to run, passed after --. e.g. -- npm run start"],
  ["--cmd <shell>", "Optional: a shell one-liner instead of -- (for pipes / &&)."],
  ["--dir, --cwd <path>", "Working directory (default: where you ran sm2)."],
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

// Shell renders a block of example commands. Lines starting with "#" are
// comments; everything else gets a $ prompt. Values are auto-escaped by React.
function Shell({ lines }: { lines: string[] }) {
  return (
    <div className={styles.code}>
      <pre>
        {lines.map((l, i) =>
          l.startsWith("#") ? (
            <div key={i} className={styles.cmt}>
              {l}
            </div>
          ) : (
            <div key={i}>
              <span className={styles.prompt}>$ </span>
              {l}
            </div>
          )
        )}
      </pre>
    </div>
  );
}

// Recipe is one titled example block.
function Recipe({ title, lines }: { title: string; lines: string[] }) {
  return (
    <>
      <h3>{title}</h3>
      <Shell lines={lines} />
    </>
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
const INSTALL_GO = "go install github.com/abdorizak/sm2/cmd/sm2@v0.1.0-dev.2";

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
            <Code copy={"sm2 start web --restart always -- npm run start"}>
              <span className={styles.prompt}>$ </span>sm2 start web --restart always -- npm run start{"\n"}
              <span className={styles.prompt}>$ </span>sm2 status{"\n"}
              <span className={styles.prompt}>$ </span>sm2 logs web --follow{"\n"}
              <span className={styles.prompt}>$ </span>sm2 restart web{"\n"}
              <span className={styles.prompt}>$ </span>sm2 save{"  "}<span className={styles.cmt}># survive reboots</span>
            </Code>
          </section>

          <section id="examples" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Examples</h2>
            <p>
              A cookbook of real commands. The rule throughout: sm2&apos;s own flags go{" "}
              <strong>before</strong> <code className="tok">--</code>, and the program to run goes{" "}
              <strong>after</strong> it.
            </p>

            <Recipe
              title="Start any language"
              lines={[
                "sm2 start web -- npm run start",
                "sm2 start dash -- yarn start",
                "sm2 start api -- ./api --port 8080",
                "sm2 start worker -- python worker.py",
                "sm2 start cache -- redis-server --port 6380",
                "sm2 start site -- php -S 0.0.0.0:8000",
                "# any executable works — sm2 doesn't care about the language",
              ]}
            />

            <Recipe
              title="Working directory (no --dir needed)"
              lines={[
                "# sm2 runs in the directory you're standing in",
                "cd /opt/web && sm2 start web -- npm run start",
                "",
                "# or point at it; a relative path resolves against your cwd",
                "sm2 start api --dir /opt/api -- ./api",
                "cd /opt && sm2 start api --dir project/api -- ./api",
              ]}
            />

            <h3>A project with several apps</h3>
            <p>
              Say <code className="tok">/opt/xproject</code> holds an <code className="tok">api</code>{" "}
              and a <code className="tok">web</code>. Start each on its own:
            </p>
            <Shell
              lines={[
                "cd /opt/xproject",
                "sm2 start xapi --dir api -- ./api",
                "sm2 start xweb --dir web -- npm run start",
              ]}
            />
            <p>
              …or declare both in <code className="tok">/opt/xproject/sm2.toml</code> (use absolute
              <code className="tok"> directory</code> paths) and bring the whole project up at once:
            </p>
            <Code>
{`[apps.api]
command = "./api"
directory = "/opt/xproject/api"
namespace = "xproject"
restart = { policy = "always" }

[apps.web]
command = "npm run start"
directory = "/opt/xproject/web"
namespace = "xproject"
restart = { policy = "always" }
environment = { PORT = "3001" }`}
            </Code>
            <Shell
              lines={[
                "cd /opt/xproject",
                "sm2 config reload            # start BOTH api and web",
                "sm2 restart --namespace xproject   # control them as a group",
                "sm2 stop --namespace xproject",
                "sm2 logs xapi --follow",
              ]}
            />

            <Recipe
              title="Run several copies (scale)"
              lines={[
                "sm2 start web -i 4 -- npm run start   # web-0 … web-3",
                "sm2 status                            # all four listed",
                "sm2 delete web-2                      # drop one instance",
              ]}
            />

            <Recipe
              title="Control how it restarts"
              lines={[
                "sm2 start api --restart always -- ./api          # always bring it back",
                "sm2 start job --restart on-failure -- ./job      # only if it errors",
                "sm2 start once --restart never -- ./migrate      # run, don't restart",
                "sm2 start api --max-retries 5 -- ./api           # give up after 5",
                "sm2 start api --restart-delay 2s -- ./api        # wait 2s between tries",
                "sm2 start api --exp-backoff-restart-delay 200ms -- ./api",
                "sm2 start api --kill-timeout 15s -- ./api        # grace before SIGKILL",
              ]}
            />

            <Recipe
              title="Restart on triggers"
              lines={[
                "sm2 start dev --watch -- npm run dev                       # on file change",
                "sm2 start dev --watch --ignore-watch node_modules -- npm run dev",
                'sm2 start nightly --cron-restart "0 3 * * *" -- ./report.sh  # 3am daily',
                "sm2 start svc --max-memory-restart 300M -- ./svc           # over 300MB",
              ]}
            />

            <Recipe
              title="Environment variables"
              lines={[
                "sm2 start api -e PORT=8080 -e NODE_ENV=production -- ./api",
                "sm2 start bot -e TOKEN=xoxb-… -- node bot.js",
                "",
                "# refresh a running app with your current shell env:",
                "export API_KEY=new-secret",
                "sm2 restart api --update-env",
              ]}
            />

            <Recipe
              title="Target one, all, or a namespace"
              lines={[
                "sm2 restart api                 # one app",
                "sm2 stop all                    # everything",
                "sm2 restart --namespace web     # a whole group",
                "sm2 delete all                  # stop & forget everything",
                "sm2 signal HUP api              # send a signal",
              ]}
            />

            <Recipe
              title="Inspect & logs"
              lines={[
                "sm2 status            # colored box (alias: ls, ps)",
                "sm2 status --json     # machine-readable",
                "sm2 describe api      # every parameter of one app",
                "sm2 logs api          # last lines",
                "sm2 logs api --follow # live tail",
                "sm2 logs api --stderr -n 200",
                "sm2 flush api         # empty its logs",
              ]}
            />

            <Recipe
              title="Notifications (Discord)"
              lines={[
                'sm2 notify discord --webhook "https://discord.com/api/webhooks/…"',
                "sm2 notify test       # send a test message",
                "sm2 notify status",
                "sm2 notify discord --disable",
              ]}
            />

            <Recipe
              title="Survive crashes & reboots"
              lines={[
                "sm2 save              # snapshot the process list",
                "sm2 resurrect         # bring the snapshot back",
                "sm2 startup           # generate a boot service (launchd/systemd)",
                "sm2 ping              # is the agent up?",
                "sm2 kill              # stop the agent and all apps",
                "# the agent also auto-saves & self-heals if it restarts",
              ]}
            />
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
                ["Reload an app", "sm2 reload <app>  (alias of restart)"],
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
              brief moment of downtime. It is <em>not</em> a zero-downtime rolling reload —
              true hand-off is language- and socket-specific, so sm2 keeps the behavior simple
              and predictable across every runtime.
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
            <p>
              <strong>Self-healing:</strong> the agent also auto-saves its live process list to{" "}
              <code className="tok">~/.sm2/state.json</code> on every change and resurrects it
              automatically if the agent itself restarts — apps you deliberately{" "}
              <code className="tok">stop</code> stay stopped.
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
            <p>
              Messages are rich, color-coded embeds (app · event · host · details), and
              delivery is <strong>reliable</strong>: sm2 honors Discord&apos;s rate limit
              (<code className="tok">Retry-After</code> on 429) and retries transient failures
              with backoff, so important events aren&apos;t silently dropped.
            </p>
          </section>

          <section id="output" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Output &amp; color</h2>
            <p>
              On a terminal, <code className="tok">status</code> prints a colored box —
              columns: <code className="tok">id · name · namespace · version · mode · pid · uptime ·
              ↺ · status · cpu · mem · user · watching</code> (RUNNING green, FAILED red,
              RESTARTING yellow, STOPPED dim). When piped it falls back to plain tab-separated
              text, so <code className="tok">grep</code> and <code className="tok">awk</code> keep
              working.
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
