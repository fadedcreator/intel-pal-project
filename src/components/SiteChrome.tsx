import { Link } from "@tanstack/react-router";
import { Radio } from "lucide-react";
import type { ReactNode } from "react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1360px] items-center gap-6 px-6 lg:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <Radio className="size-5 text-wire" strokeWidth={2.2} />
          <span className="font-display text-lg font-bold tracking-tight">AIWire</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1">
          {[
            { to: "/", label: "Wire" },
            { to: "/sources", label: "Sources" },
            { to: "/about", label: "About" },
            { to: "/privacy", label: "Privacy" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              className="label-mono rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "label-mono rounded-full px-3 py-1.5 text-wire" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-[1360px] flex-col items-center gap-6 px-6 lg:px-10">
        <span className="label-mono flex items-center gap-2 text-muted-foreground">
          <Radio className="size-4 text-wire" />
          AIWire
        </span>
        <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
          <nav className="flex items-center gap-5">
            <Link to="/sources" className="label-mono text-muted-foreground hover:text-foreground">
              Sources
            </Link>
            <Link to="/about" className="label-mono text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="/privacy" className="label-mono text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
          </nav>
          <span className="label-mono text-muted-foreground">
            Headlines belong to their publishers
          </span>
          <span className="label-mono text-muted-foreground">
            Questions?{" "}
            <a
              href="https://x.com/fadedcreator"
              target="_blank"
              rel="noreferrer"
              className="text-wire underline-offset-4 hover:underline"
            >
              @fadedcreator on X
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-[1360px] px-6 py-14 lg:px-10 lg:py-20">
        <div className="max-w-3xl">
          <p className="label-mono text-wire">{kicker}</p>
          <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{lede}</p>
        </div>
        <div className="mt-14">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
