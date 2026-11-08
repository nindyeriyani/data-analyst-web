// Perender materi kursus. Server Component; hanya tombol salin yang interaktif.
// Konten berasal dari repo sendiri, jadi HTML mentah (misalnya <details>) dianggap tepercaya.

import ReactMarkdown, { type Components, type ExtraProps } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import CopyButton from "@/components/CopyButton";
import remarkCallouts, {
  CALLOUT_DEFAULT_TITLES,
  CALLOUT_KINDS,
  type CalloutKind,
} from "@/lib/remark-callouts";

type HastNode = NonNullable<ExtraProps["node"]>;
type HastChild = HastNode["children"][number];

/** Teks mentah dari node hast, untuk isi tombol salin. */
function toText(node: HastNode | HastChild): string {
  if (node.type === "text") return node.value;
  if ("children" in node) return node.children.map(toText).join("");
  return "";
}

// ---------------------------------------------------------------------------
// Callout

const CALLOUT_STYLES: Record<CalloutKind, string> = {
  tip: "border-callout-tip-line bg-callout-tip-bg [--callout-accent:var(--callout-tip-text)]",
  warning:
    "border-callout-warning-line bg-callout-warning-bg [--callout-accent:var(--callout-warning-text)]",
};

const CALLOUT_ICONS: Record<CalloutKind, string> = {
  tip: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z",
  warning: "M12 3l10 18H2zM12 10v4M12 17.5v.01",
};

function isCalloutKind(value: unknown): value is CalloutKind {
  return typeof value === "string" && (CALLOUT_KINDS as readonly string[]).includes(value);
}

const Aside: Components["aside"] = (props) => {
  const { children } = props;
  const data = props as Record<string, unknown>;
  const kind = data["data-callout"];
  if (!isCalloutKind(kind)) return <aside>{children}</aside>;

  const title = typeof data["data-title"] === "string" ? data["data-title"] : CALLOUT_DEFAULT_TITLES[kind];

  return (
    <aside className={`callout my-6 rounded-xl border-l-4 border px-4 py-3 sm:px-5 ${CALLOUT_STYLES[kind]}`}>
      <p className="mb-1 flex items-center gap-2 font-semibold text-[var(--callout-accent)]">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <path d={CALLOUT_ICONS[kind]} />
        </svg>
        {title}
      </p>
      <div className="callout-body">{children}</div>
    </aside>
  );
};

// ---------------------------------------------------------------------------
// Blok kode

const Pre: Components["pre"] = ({ node, children }) => {
  const code = node?.children.find(
    (child): child is HastNode => child.type === "element" && child.tagName === "code",
  );
  const classNames = code?.properties.className;
  const language = Array.isArray(classNames)
    ? classNames.map(String).find((name) => name.startsWith("language-"))?.slice("language-".length)
    : undefined;
  const isCsv = language === "csv";

  return (
    <div className="code-block my-5 overflow-hidden rounded-xl border border-line bg-surface-2">
      {language && (
        <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-1.5">
          <span className="font-mono text-xs text-muted">{language}</span>
          {isCsv && code && <CopyButton text={toText(code).replace(/\n$/, "")} />}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[0.85rem] leading-relaxed">{children}</pre>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Elemen lain

const Anchor: Components["a"] = ({ href, title, children }) => {
  const external = typeof href === "string" && /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      title={title}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {external && <span className="sr-only"> (membuka tab baru)</span>}
    </a>
  );
};

const Table: Components["table"] = ({ children }) => (
  <div className="table-wrap my-5 overflow-x-auto rounded-xl border border-line">
    <table>{children}</table>
  </div>
);

const COMPONENTS: Components = { aside: Aside, pre: Pre, a: Anchor, table: Table };

export default function Markdown({ source }: { source: string }) {
  return (
    <div className="materi">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkCallouts]}
        rehypePlugins={[rehypeRaw]}
        components={COMPONENTS}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
