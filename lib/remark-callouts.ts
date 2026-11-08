// Plugin remark kecil untuk callout gaya GitHub alert:
//
//   > [!tip] Judul
//   > Isi callout...
//
// Blockquote seperti itu diubah menjadi <aside data-callout="tip" data-title="Judul">.
// Komponen Markdown lalu merendernya sebagai kotak berwarna.

import type { Blockquote, Root, RootContent } from "mdast";

export const CALLOUT_KINDS = ["tip", "warning"] as const;
export type CalloutKind = (typeof CALLOUT_KINDS)[number];

export const CALLOUT_DEFAULT_TITLES: Record<CalloutKind, string> = {
  tip: "Tips",
  warning: "Perhatian",
};

const MARKER = /^\[!(tip|warning)\][ \t]*([^\n]*)(?:\n|$)/i;

function transformBlockquote(node: Blockquote): void {
  const first = node.children[0];
  if (first?.type !== "paragraph") return;
  const text = first.children[0];
  if (text?.type !== "text") return;

  const match = MARKER.exec(text.value);
  if (!match) return;

  const kind = match[1].toLowerCase() as CalloutKind;
  const title = match[2].trim() || CALLOUT_DEFAULT_TITLES[kind];

  // Buang penanda dan baris judul dari isi callout.
  text.value = text.value.slice(match[0].length);
  if (text.value === "") first.children.shift();
  if (first.children.length === 0) node.children.shift();

  node.data = {
    ...node.data,
    hName: "aside",
    hProperties: { dataCallout: kind, dataTitle: title },
  };
}

function walk(node: Root | RootContent): void {
  if (node.type === "blockquote") transformBlockquote(node);
  if ("children" in node) {
    for (const child of node.children) walk(child);
  }
}

export default function remarkCallouts() {
  return (tree: Root) => walk(tree);
}
