import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sm2.dev"),
  title: "sm2 — keep everything running",
  description:
    "A universal process supervisor written in Go. Run any app in any language with auto-restart, live monitoring, declarative config, and notifications.",
  keywords: ["process manager", "pm2 alternative", "systemd", "go", "supervisor", "devops"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "sm2 — keep everything running",
    description:
      "A universal process supervisor written in Go. Auto-restart, live monitoring, declarative config, notifications.",
    type: "website",
    url: "https://sm2.dev",
    siteName: "sm2",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <div className="crt" aria-hidden="true" />
        <div className="devbar">
          🚧 sm2 is in active development — pre-release.{" "}
          <a href="https://github.com/abdorizak/sm2" target="_blank" rel="noopener noreferrer">
            follow on GitHub ↗
          </a>
        </div>
        {children}
      </body>
    </html>
  );
}
