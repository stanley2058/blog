import DOMPurify from "dompurify";
import { marked } from "marked";

const THEME_KEY = "prismatic-theme";
const MARKDOWN_SELECTOR = "[data-prismatic-markdown]";
const TOGGLE_SELECTOR = "[data-prismatic-theme-toggle]";

marked.use({
  gfm: true,
  breaks: false,
});

function currentTheme() {
  const root = document.documentElement;
  return (
    root.dataset.theme ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
}

function syncThemeControls() {
  const theme = currentTheme();
  for (const button of document.querySelectorAll(TOGGLE_SELECTOR)) {
    const next = theme === "dark" ? "light" : "dark";
    button.textContent =
      button.dataset[`${next}Label`] ||
      `${next[0].toUpperCase()}${next.slice(1)}`;
    button.setAttribute("aria-label", `Switch to ${next} theme`);
  }
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") {
    document.documentElement.dataset.theme = saved;
  }

  for (const button of document.querySelectorAll(TOGGLE_SELECTOR)) {
    button.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem(THEME_KEY, next);
      syncThemeControls();
    });
  }

  syncThemeControls();
}

function slugify(value) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "section"
  );
}

function addHeadingAnchors(container) {
  const used = new Set();

  for (const heading of container.querySelectorAll("h1, h2, h3, h4, h5, h6")) {
    const label = heading.textContent || "section";
    const base = slugify(label);
    let id = base;
    let suffix = 2;
    while (used.has(id) || document.getElementById(id)) {
      id = `${base}-${suffix}`;
      suffix += 1;
    }

    used.add(id);
    heading.id = id;
    heading.setAttribute("aria-label", label);

    const anchor = document.createElement("a");
    anchor.className = "heading-anchor";
    anchor.href = `#${id}`;
    anchor.setAttribute("aria-label", `Link to ${label}`);
    anchor.textContent = "#";
    heading.append(anchor);
  }
}

function wrapTables(container) {
  for (const table of container.querySelectorAll("table")) {
    if (table.parentElement?.classList.contains("table-wrap")) continue;
    const wrapper = document.createElement("div");
    wrapper.className = "table-wrap";
    table.before(wrapper);
    wrapper.append(table);
  }
}

function hardenLinks(container) {
  for (const link of container.querySelectorAll("a[href]")) {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) continue;

    try {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    } catch {
      // Keep malformed links visible. The browser will decline them later.
    }
  }
}

async function readMarkdown(container) {
  const inlineSource = container.querySelector('script[type="text/markdown"]');
  if (inlineSource) {
    return inlineSource.textContent
      .replace(/^\n/, "")
      .replaceAll("<\\/script>", "</script>");
  }

  const sourceUrl = container.dataset.src;
  if (!sourceUrl) {
    throw new Error(
      'Add a nested <script type="text/markdown"> or a data-src URL.',
    );
  }

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Could not load Markdown (${response.status}).`);
  }
  return response.text();
}

function stripFrontmatter(markdown) {
  if (!markdown.startsWith("---")) return markdown;
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
}

export async function renderMarkdown(container) {
  container.setAttribute("aria-busy", "true");

  try {
    const markdown = stripFrontmatter(await readMarkdown(container));
    const rendered = await marked.parse(markdown);
    container.innerHTML = DOMPurify.sanitize(rendered, {
      USE_PROFILES: { html: true },
    });
    container.classList.add("prose");
    addHeadingAnchors(container);
    wrapTables(container);
    hardenLinks(container);

    const firstHeading = container.querySelector("h1, h2");
    if (document.title === "Prismatic document" && firstHeading?.textContent) {
      document.title = firstHeading.textContent.replace(/#$/, "").trim();
    }

    container.dispatchEvent(
      new CustomEvent("prismatic:rendered", { bubbles: true }),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    container.innerHTML = `<div class="prismatic-error"><strong>Markdown did not render.</strong><br>${DOMPurify.sanitize(message)}</div>`;
    container.dispatchEvent(
      new CustomEvent("prismatic:error", {
        bubbles: true,
        detail: { error },
      }),
    );
  } finally {
    container.removeAttribute("aria-busy");
  }
}

export function init() {
  initTheme();
  return Promise.all(
    [...document.querySelectorAll(MARKDOWN_SELECTOR)].map((container) =>
      renderMarkdown(container),
    ),
  );
}

window.PrismaticUI = { init, renderMarkdown };

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
