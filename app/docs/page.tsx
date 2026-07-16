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
  ["languages", "Languages & runtimes"],
  ["examples", "Examples"],
  ["commands", "Commands"],
  ["flags", "Start flags"],
  ["config", "Configuration"],
  ["env", "Environment & reload"],
  ["triggers", "Restart triggers"],
  ["persistence", "Persistence & boot"],
  ["notifications", "Notifications"],
  ["disk", "Disk-space alerts"],
  ["logrotate", "Log rotation"],
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
  ["set <key> <value>", "Runtime settings: logs.* (log rotation) and disk.* (disk-space alerts). Run bare sm2 set to show current values."],
  ["save", "Snapshot the process list to ~/.sm2/dump.json. Alias: dump."],
  ["resurrect", "Restart the apps from the last save."],
  ["startup", "Generate a launchd/systemd boot service."],
  ["unstartup", "Remove the boot service."],
  ["ping", "Check the agent is up (starts it if not)."],
  ["kill", "Stop the agent and every managed app."],
  ["update", "Update sm2 to the latest release. --check to only check."],
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

// [runtime, start line, note] — every entry is a plain terminal command; sm2
// adds supervision around it, never language-specific behavior.
const RUNTIMES: [string, string, string][] = [
  ["Node.js", "sm2 start web -- npm run start", "npm/yarn/pnpm scripts or node server.js — sm2 signals the whole process tree, so wrappers are fine."],
  ["Bun / Deno", "sm2 start api -- bun run index.ts", "Same story: deno run --allow-net main.ts works too."],
  ["Python", "sm2 start worker -- python3 worker.py", "For a venv, use its interpreter directly: -- /srv/app/venv/bin/python worker.py (no activate needed)."],
  ["Go", "sm2 start api -- ./api", "Supervise the compiled binary. go run works, but see the production tip below."],
  ["Rust", "sm2 start svc -- ./target/release/svc", "Build with --release, run the artifact."],
  ["Java / JVM", "sm2 start app -- java -jar app.jar", "Kotlin, Scala, Spring Boot — anything java launches."],
  ["PHP", "sm2 start site -- php -S 0.0.0.0:8000", "Or a long-running worker: php artisan queue:work."],
  ["Ruby", "sm2 start web -- bundle exec puma", "bundle exec keeps the right gem versions."],
  [".NET", "sm2 start app -- dotnet App.dll", "Publish first; dotnet run is the dev loop."],
  ["Shell / anything", "sm2 start backup -- ./backup.sh", "Any executable file. For pipes or &&, use --cmd \"…\"."],
  ["Docker", "sm2 start cache -- docker run --rm redis", "Run the container in the foreground (no -d) so sm2 owns its lifecycle."],
];

// [embed color, event name, when it fires] — colors mirror the Discord embeds.
const EVENTS: [string, string, string][] = [
  ["#57F287", "started", "An app launched — via start, resurrect, or config reload."],
  ["#FEE75C", "restarted", "sm2 brought an app back: auto-restart after an exit (with the attempt count), a manual restart, or a memory / watch / cron trigger (the reason is in the message)."],
  ["#99AAB5", "stopped", "An app was stopped deliberately and exited cleanly."],
  ["#ED4245", "crashed", "An app is down and sm2 will not restart it: the policy forbids it, the retry limit is exhausted, or the relaunch itself failed."],
  ["#5865F2", "log rotated", "A log file crossed its size limit and was rotated (see Log rotation)."],
  ["#E67E22", "disk space low", "Free disk space dropped below your threshold (see Disk-space alerts). Repeats every 6h while it stays low."],
  ["#57F287", "disk space recovered", "Free space climbed back above the threshold (plus a small margin, so it can't flap)."],
  ["#99AAB5", "agent stopping", "The sm2 agent itself received SIGTERM/SIGINT and is shutting down, taking its apps with it."],
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
const INSTALL_GO = "go install github.com/abdorizak/sm2/cmd/sm2@v0.1.0-dev.4";

export default function DocsPage() {
  return (
    <>
      <Nav />
      <div className={styles.wrap}>
        <DocsSidebar items={NAV} />

        <main className={styles.content}>
          <h1 className={styles.lead}>Documentation</h1>
          <p className={styles.leadSub}>
            Everything sm2 can do, explained like a person would. One mental model
            carries you through all of it: every command targets an app by name,{" "}
            <code className="tok">all</code>, or a <code className="tok">--namespace</code> —
            and when in doubt, <code className="tok">sm2 &lt;cmd&gt; --help</code> knows.
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
            <p>
              This is the whole job in five lines — start an app, look at it, tail it,
              bounce it, and make it survive a reboot. Everything else in these docs is
              refinement of these five.
            </p>
            <Code copy={"sm2 start web --restart always -- npm run start"}>
              <span className={styles.prompt}>$ </span>sm2 start web --restart always -- npm run start{"\n"}
              <span className={styles.prompt}>$ </span>sm2 status{"\n"}
              <span className={styles.prompt}>$ </span>sm2 logs web --follow{"\n"}
              <span className={styles.prompt}>$ </span>sm2 restart web{"\n"}
              <span className={styles.prompt}>$ </span>sm2 save{"  "}<span className={styles.cmt}># survive reboots</span>
            </Code>
          </section>

          <section id="languages" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Languages &amp; runtimes</h2>
            <p>
              <strong>sm2 supports every language</strong>, because it never touches your
              code. There is no Node plugin, no Python mode, no language detection: sm2
              takes the command you&apos;d type in a terminal and supervises the process it
              creates. If the line works in your shell, the same line works under sm2.
            </p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Runtime</th>
                  <th>Start line</th>
                  <th>Worth knowing</th>
                </tr>
              </thead>
              <tbody>
                {RUNTIMES.map(([rt, line, note]) => (
                  <tr key={rt}>
                    <td>{rt}</td>
                    <td><code>{line}</code></td>
                    <td>{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>How sm2 actually runs your command</h3>
            <p>Understanding this pipeline resolves almost every &quot;why won&apos;t it start?&quot; question:</p>
            <ol className={styles.list}>
              <li>
                <strong>The CLI captures one shell line.</strong> Everything after{" "}
                <code className="tok">--</code> is joined into a single command string, along
                with your working directory (defaulting to where you ran{" "}
                <code className="tok">sm2 start</code>) and any <code className="tok">-e</code>{" "}
                variables, and hands it to the background agent.
              </li>
              <li>
                <strong>The agent spawns it via the shell.</strong> Your line runs as{" "}
                <code className="tok">sh -c &quot;…&quot;</code> in that working directory, with an
                environment built from the agent&apos;s base env plus your overrides.
              </li>
              <li>
                <strong>It gets its own process group.</strong> Whatever your command spawns —{" "}
                <code className="tok">npm</code> → <code className="tok">node</code> → worker
                threads — is one tree that sm2 owns. Stop, restart, and{" "}
                <code className="tok">signal</code> hit the whole group, so nothing is orphaned.
              </li>
              <li>
                <strong>Output is captured.</strong> stdout and stderr append to{" "}
                <code className="tok">~/.sm2/logs/&lt;name&gt;.stdout.log</code> /{" "}
                <code className="tok">.stderr.log</code> — that&apos;s what{" "}
                <code className="tok">sm2 logs</code> reads.
              </li>
              <li>
                <strong>Shutdown is graceful, then firm.</strong> Stopping sends SIGTERM to the
                group, waits the grace period (default 5s,{" "}
                <code className="tok">--kill-timeout</code>), then SIGKILLs anything still alive.
              </li>
            </ol>

            <h3>The three rules that clear up most confusion</h3>
            <ul className={styles.list}>
              <li>
                <strong>1. Run in the foreground.</strong> sm2 supervises the process it
                started, so the command must <em>keep running</em> — don&apos;t daemonize. No{" "}
                <code className="tok">nohup</code>, no trailing <code className="tok">&amp;</code>,
                no <code className="tok">docker run -d</code>, no{" "}
                <code className="tok">gunicorn --daemon</code>. If your app forks itself into the
                background, sm2 sees an instant exit and reports a crash loop that isn&apos;t
                real. Every server has a foreground mode; use it and let sm2 do the daemonizing.
              </li>
              <li>
                <strong>2. The interpreter must be on the agent&apos;s PATH.</strong> sm2
                doesn&apos;t bundle Node or Python — your server provides them, and the agent
                inherits the environment it was <em>first started</em> with, not your current
                shell profile. Version managers (nvm, pyenv, rbenv) load their shims in{" "}
                <em>interactive</em> shells, so the agent may not see them. If your shell finds{" "}
                <code className="tok">node</code> but sm2 says &quot;command not found&quot;, give
                it the absolute path (<code className="tok">which node</code> tells you), e.g.{" "}
                <code className="tok">sm2 start web -- /home/deploy/.nvm/versions/node/v22.2.0/bin/node server.js</code>{" "}
                — or refresh a running app&apos;s env with{" "}
                <code className="tok">sm2 restart web --update-env</code>.
              </li>
              <li>
                <strong>3. It&apos;s one shell line.</strong> Arguments after{" "}
                <code className="tok">--</code> are joined with spaces and run by{" "}
                <code className="tok">sh</code>. Plain commands and flags pass through exactly as
                typed; for pipes, <code className="tok">&amp;&amp;</code>, or arguments that
                themselves contain spaces, put the whole line in{" "}
                <code className="tok">--cmd &quot;…&quot;</code> so you control the quoting:{" "}
                <code className="tok">sm2 start job --cmd &quot;./gen | gzip &gt; out.gz&quot;</code>.
              </li>
            </ul>

            <h3>Production tip: run binaries, not build tools</h3>
            <p>
              <code className="tok">go run</code>, <code className="tok">cargo run</code> and
              friends work under sm2, but they recompile on every restart and put a build
              tool between sm2 and your real process. On a server, build once and supervise
              the artifact — restarts get faster and memory stats describe your app, not the
              compiler:
            </p>
            <Shell
              lines={[
                "go build -o api . && sm2 start api -- ./api",
                "cargo build --release && sm2 start svc -- ./target/release/svc",
                "npm run build && sm2 start web -- node dist/server.js",
              ]}
            />
          </section>

          <section id="examples" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Examples</h2>
            <p>
              A cookbook of real commands to lift straight into your terminal. One rule holds
              everywhere, and it&apos;s the only syntax worth memorizing: sm2&apos;s own flags go{" "}
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
              title="Disk-space alerts"
              lines={[
                "sm2 set disk.monitor on       # watch free disk space",
                "sm2 set disk.threshold 15     # alert below 15% free (default 10)",
                "sm2 set disk.path /var        # watch a different filesystem",
                "sm2 set                       # show current settings",
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

            <Recipe
              title="Update sm2 itself"
              lines={[
                "sm2 update            # download & install the latest release",
                "sm2 update --check    # just check, don't install",
                "sm2 kill              # restart the agent on the new version",
                "# (use sudo if sm2 lives in a root-owned dir like /usr/local/bin)",
              ]}
            />
          </section>

          <section id="commands" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Commands</h2>
            <p>
              The full set. Each one does a single, guessable thing — and if you&apos;re
              arriving from pm2, your muscle memory mostly still works
              (<code className="tok">ls</code>, <code className="tok">ps</code>,{" "}
              <code className="tok">del</code> and friends are all aliased).
            </p>
            <Table head={["Command", "Description"]} rows={COMMANDS} />
          </section>

          <section id="flags" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Start flags</h2>
            <p>
              Flags tune <em>how an app is supervised</em>, never what it runs — the command
              itself always goes after <code className="tok">--</code>. Durations read
              naturally (<code className="tok">500ms</code>, <code className="tok">10s</code>);
              sizes take <code className="tok">K</code>/<code className="tok">M</code>/
              <code className="tok">G</code>.
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
              The CLI is great for one-off apps; a config file is for when your stack is
              something you want in git. Declare everything in{" "}
              <code className="tok">sm2.yaml</code> or <code className="tok">sm2.toml</code>{" "}
              (sm2 picks the parser by extension), then run{" "}
              <code className="tok">sm2 config reload</code> — sm2 compares the file to
              reality and closes the gap: starts what&apos;s new, stops what&apos;s gone,
              restarts what changed, leaves the rest alone. Lookup order:{" "}
              <code className="tok">--config</code> → <code className="tok">./sm2.toml</code> →{" "}
              <code className="tok">./sm2.yaml</code> → <code className="tok">~/.sm2/</code>.
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
              A supervisor that forgets everything on reboot is just a fancy{" "}
              <code className="tok">&amp;</code>. sm2 remembers.{" "}
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
              sm2 posts a Discord message the moment something happens to an app, to the
              server&apos;s disk, or to the agent itself — so you find out from a ping, not
              from an angry user. Slack, Telegram and email are on the roadmap.
            </p>

            <h3>Setup</h3>
            <p>
              Two ways. <strong>Without a config file</strong>, use the{" "}
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

            <h3>Every event, and exactly when it fires</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>When it fires</th>
                </tr>
              </thead>
              <tbody>
                {EVENTS.map(([color, name, when]) => (
                  <tr key={name}>
                    <td>
                      <span className={styles.chip} style={{ background: color }} />
                      <code>{name}</code>
                    </td>
                    <td>{when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              The distinction that matters on a bad day:{" "}
              <code className="tok">restarted</code> means sm2 caught the exit and{" "}
              <strong>recovery is already done</strong> — the message includes the attempt
              number so a crash-loop is visible at a glance.{" "}
              <code className="tok">crashed</code> means the app is <strong>down and staying
              down</strong>: the restart policy said no (<code className="tok">never</code>, or{" "}
              <code className="tok">on-failure</code> after a clean exit), the retry limit ran
              out, or the relaunch itself failed. A red message is the one that needs a human.
            </p>

            <h3>Delivery you can trust</h3>
            <p>
              Messages are rich, color-coded embeds (app · event · host · details), and
              delivery is <strong>reliable</strong>: sm2 honors Discord&apos;s rate limit
              (<code className="tok">Retry-After</code> on 429) and retries transient failures
              with capped backoff, so important events aren&apos;t silently dropped. Sending
              happens on a background queue that never blocks supervision — a slow webhook
              can&apos;t delay a restart.
            </p>
            <p>
              On shutdown the agent plays fair too: it sends{" "}
              <code className="tok">agent stopping</code> (with the number of apps it&apos;s
              taking down), stops everything, then <strong>flushes the notification queue</strong>{" "}
              before exiting — so the final &quot;stopped&quot; messages actually arrive instead
              of dying with the process.
            </p>
          </section>

          <section id="disk" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Disk-space alerts</h2>
            <p>
              A full disk is the classic silent failure: logs stop writing, databases stop
              accepting, apps crash with confusing errors — and nothing tells you <em>why</em>{" "}
              until you ssh in and run <code className="tok">df</code>. sm2 can watch free disk
              space for you and warn you <strong>before</strong> the server runs out, through
              the same Discord pipeline as every other event:
            </p>
            <Code copy="sm2 set disk.monitor on">
              <span className={styles.prompt}>$ </span>sm2 set disk.monitor on{"      "}<span className={styles.cmt}># start watching (filesystem holding ~/.sm2)</span>{"\n"}
              <span className={styles.prompt}>$ </span>sm2 set disk.threshold 15{"    "}<span className={styles.cmt}># alert when free space drops below 15%</span>{"\n"}
              <span className={styles.prompt}>$ </span>sm2 set disk.path /var{"       "}<span className={styles.cmt}># watch a different filesystem (optional)</span>{"\n"}
              <span className={styles.prompt}>$ </span>sm2 set{"                      "}<span className={styles.cmt}># show current settings</span>{"\n"}
              <span className={styles.prompt}>$ </span>sm2 set disk.monitor off{"     "}<span className={styles.cmt}># stop watching</span>
            </Code>
            <Table
              head={["Key", "Meaning"]}
              rows={[
                ["disk.monitor on|off", "Master switch. Setting any other disk.* key turns it on."],
                ["disk.threshold <percent>", "Free-space percentage that triggers the alert. Default: 10."],
                ["disk.path <path>", "Any path on the filesystem to watch. Default: the one holding ~/.sm2 — usually the disk your logs grow on."],
              ]}
            />
            <h3>How it behaves (designed not to spam you)</h3>
            <p>
              The agent samples the filesystem once a minute — a single{" "}
              <code className="tok">statfs</code> syscall, so the monitor costs effectively
              nothing. The alerting is stateful, not a naive threshold check:
            </p>
            <ul className={styles.list}>
              <li>
                <strong>One alert on crossing.</strong> When free space first drops below the
                threshold you get <code className="tok">⚠ disk space low</code> with the real
                numbers — e.g. <em>&quot;8.3% free (74GB of 926GB) on / — below 10%
                threshold&quot;</em> — not an alert every minute for the same problem.
              </li>
              <li>
                <strong>A reminder every 6 hours</strong> while the disk stays low, so one
                missed message can&apos;t hide an ongoing problem.
              </li>
              <li>
                <strong>Recovery with hysteresis.</strong>{" "}
                <code className="tok">💾 disk space recovered</code> fires only once free space
                climbs 2 points <em>above</em> the threshold. The margin stops the
                low → recovered → low flapping you&apos;d get when a disk hovers exactly at the
                line.
              </li>
            </ul>
            <p>
              Settings persist to <code className="tok">~/.sm2/disk.json</code> and are
              re-applied when the agent starts — and the first check runs at startup, so a
              disk that filled up while the agent was down alerts immediately.
            </p>
          </section>

          <section id="logrotate" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Log rotation</h2>
            <p>
              By default sm2 appends each app&apos;s output to{" "}
              <code className="tok">~/.sm2/logs/&lt;name&gt;.stdout.log</code> and{" "}
              <code className="tok">.stderr.log</code> — forever. A chatty app will
              eventually eat the disk (and then you&apos;ll meet the disk-space alert below).
              Turn on rotation and the files manage themselves:
            </p>
            <Code copy="sm2 set logs.max_size 50M">
              <span className={styles.prompt}>$ </span>sm2 set logs.max_size 50M{"        "}<span className={styles.cmt}># rotate once a log passes 50 MB</span>{"\n"}
              <span className={styles.prompt}>$ </span>sm2 set logs.retain 7{"            "}<span className={styles.cmt}># keep 7 rotated files, prune the rest</span>{"\n"}
              <span className={styles.prompt}>$ </span>sm2 set logs.compress true{"       "}<span className={styles.cmt}># gzip rotated files (web.stdout.log.1.gz)</span>{"\n"}
              <span className={styles.prompt}>$ </span>sm2 set logs.interval &quot;0 0 * * *&quot;{"  "}<span className={styles.cmt}># also rotate daily at midnight (optional)</span>{"\n"}
              {"\n"}
              <span className={styles.prompt}>$ </span>sm2 set{"                        "}<span className={styles.cmt}># show current settings</span>{"\n"}
              <span className={styles.prompt}>$ </span>sm2 set logs.rotate off{"          "}<span className={styles.cmt}># turn rotation back off</span>{"\n"}
              <span className={styles.prompt}>$ </span>sm2 set logs.rotate now{"          "}<span className={styles.cmt}># rotate every log immediately</span>
            </Code>
            <p>
              Setting any <code className="tok">logs.*</code> option turns rotation on.
              Settings persist to <code className="tok">~/.sm2/logrotate.json</code> and
              survive restarts. The agent checks sizes every 30s (and on the cron schedule,
              if set). Rotation is <strong>copy-truncate</strong>, so your apps keep logging
              without a restart — no reopening, no lost process. If Discord notifications are
              enabled, sm2 also pings you when a log is rotated for exceeding its limit.
            </p>
            <p>You can declare the same thing in <strong>config</strong>:</p>
            <Code>
{`logs:
  rotate: true
  max_size: 50M
  retain: 7
  compress: true
  interval: "0 0 * * *"   # optional`}
            </Code>
          </section>

          <section id="output" className={styles.section}>
            <h2><span className={styles.hash}>#</span>Output &amp; color</h2>
            <p>
              sm2 is pretty exactly as long as a human is reading, and plain the moment a
              script is. On a terminal, <code className="tok">status</code> prints a colored box —
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
