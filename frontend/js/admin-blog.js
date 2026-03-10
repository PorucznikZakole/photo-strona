const ADMIN_BLOG_TOKEN_KEY = "photo-admin-token";
const ADMIN_BLOG_API_BASE = "/api";

const adminBlogTabBtnEl = document.querySelector('[data-admin-tab="blog"]');
const adminBlogFeedbackEl = document.getElementById("admin-blog-feedback");
const adminBlogPostsListEl = document.getElementById("admin-blog-posts-list");
const adminBlogEmptyEl = document.getElementById("admin-blog-empty");
const adminBlogFormEl = document.getElementById("admin-blog-form");
const adminBlogIdEl = document.getElementById("admin-blog-id");
const adminBlogSlugEl = document.getElementById("admin-blog-slug");
const adminBlogDateEl = document.getElementById("admin-blog-date");
const adminBlogReadMinutesEl = document.getElementById("admin-blog-read-minutes");
const adminBlogSortOrderEl = document.getElementById("admin-blog-sort-order");
const adminBlogPublishedEl = document.getElementById("admin-blog-published");
const adminBlogTitlePlEl = document.getElementById("admin-blog-title-pl");
const adminBlogTitleEnEl = document.getElementById("admin-blog-title-en");
const adminBlogLeadPlEl = document.getElementById("admin-blog-lead-pl");
const adminBlogLeadEnEl = document.getElementById("admin-blog-lead-en");
const adminBlogBlocksEl = document.getElementById("admin-blog-blocks");
const adminBlogNewBtnEl = document.getElementById("admin-blog-new");
const adminBlogRefreshBtnEl = document.getElementById("admin-blog-refresh");
const adminBlogDeleteBtnEl = document.getElementById("admin-blog-delete");
const adminBlogAddTextBtnEl = document.getElementById("admin-blog-add-text");
const adminBlogAddImageBtnEl = document.getElementById("admin-blog-add-image");
const adminBlogAddVideoBtnEl = document.getElementById("admin-blog-add-video");

const BLOG_BLOCK_TYPE_LABELS = {
  text: "Tekst",
  image: "Zdjęcie",
  video: "Wideo"
};

let adminBlogPosts = [];
let adminBlogSelectedPostId = 0;

function isPlainObjectValue(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getTodayIsoDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getAdminBlogToken() {
  try {
    return sessionStorage.getItem(ADMIN_BLOG_TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

function isAdminBlogLoggedIn() {
  return Boolean(getAdminBlogToken());
}

function setAdminBlogFeedback(message, isError = false) {
  if (!adminBlogFeedbackEl) {
    return;
  }
  adminBlogFeedbackEl.textContent = message || "";
  adminBlogFeedbackEl.classList.toggle("is-error", Boolean(isError));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function adminBlogApiRequest(path, options = {}) {
  if (window.location.protocol === "file:") {
    return {
      ok: false,
      status: 0,
      error: "Uruchom stronę przez serwer (http://), a nie z pliku."
    };
  }

  const token = getAdminBlogToken();
  if (!token) {
    return {
      ok: false,
      status: 401,
      error: "Najpierw zaloguj się do panelu."
    };
  }

  const method = options.method || "GET";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...(options.headers || {})
  };

  try {
    const response = await fetch(`${ADMIN_BLOG_API_BASE}${path}`, {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: data?.error || `HTTP ${response.status}`,
        data
      };
    }

    return {
      ok: true,
      status: response.status,
      data
    };
  } catch {
    return {
      ok: false,
      status: 0,
      error: "Brak połączenia z API."
    };
  }
}

function createEmptyBlogBlock(type = "text") {
  const safeType = ["text", "image", "video"].includes(type) ? type : "text";
  if (safeType === "text") {
    return {
      type: "text",
      layout: "normal",
      text: {
        pl: "",
        en: ""
      }
    };
  }
  return {
    type: safeType,
    layout: "normal",
    src: "",
    caption: {
      pl: "",
      en: ""
    }
  };
}

function createEmptyBlogPost() {
  return {
    id: 0,
    slug: "",
    date: getTodayIsoDate(),
    readMinutes: 3,
    sortOrder: 0,
    isPublished: true,
    title: {
      pl: "",
      en: ""
    },
    lead: {
      pl: "",
      en: ""
    },
    blocks: [createEmptyBlogBlock("text")]
  };
}

function normalizeBlogPost(raw) {
  const source = isPlainObjectValue(raw) ? raw : {};
  const id = Number.parseInt(source.id, 10);
  const readMinutes = Number.parseInt(source.readMinutes, 10);
  const sortOrder = Number.parseInt(source.sortOrder, 10);
  const blocksRaw = Array.isArray(source.blocks) ? source.blocks : [];

  const blocks = blocksRaw
    .map((rawBlock) => {
      if (!isPlainObjectValue(rawBlock)) {
        return null;
      }
      const blockType = String(rawBlock.type || "").trim().toLowerCase();
      if (!["text", "image", "video"].includes(blockType)) {
        return null;
      }
      const layout = String(rawBlock.layout || "normal").trim().toLowerCase();
      const safeLayout = ["normal", "wide", "compact"].includes(layout) ? layout : "normal";

      if (blockType === "text") {
        const textPayload = isPlainObjectValue(rawBlock.text) ? rawBlock.text : {};
        return {
          type: "text",
          layout: safeLayout,
          text: {
            pl: String(textPayload.pl || ""),
            en: String(textPayload.en || "")
          }
        };
      }

      const captionPayload = isPlainObjectValue(rawBlock.caption) ? rawBlock.caption : {};
      return {
        type: blockType,
        layout: safeLayout,
        src: String(rawBlock.src || ""),
        caption: {
          pl: String(captionPayload.pl || ""),
          en: String(captionPayload.en || "")
        }
      };
    })
    .filter(Boolean);

  return {
    id: Number.isNaN(id) ? 0 : id,
    slug: String(source.slug || ""),
    date: String(source.date || getTodayIsoDate()).slice(0, 10),
    readMinutes: Number.isNaN(readMinutes) ? 3 : Math.max(1, Math.min(readMinutes, 60)),
    sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
    isPublished: source.isPublished !== false,
    title: {
      pl: String(source?.title?.pl || ""),
      en: String(source?.title?.en || "")
    },
    lead: {
      pl: String(source?.lead?.pl || ""),
      en: String(source?.lead?.en || "")
    },
    blocks: blocks.length ? blocks : [createEmptyBlogBlock("text")]
  };
}

function renderAdminBlogPostList() {
  if (!adminBlogPostsListEl || !adminBlogEmptyEl) {
    return;
  }

  adminBlogPostsListEl.innerHTML = "";
  adminBlogEmptyEl.hidden = adminBlogPosts.length > 0;

  if (!adminBlogPosts.length) {
    return;
  }

  const fragment = document.createDocumentFragment();
  adminBlogPosts.forEach((post) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "admin-blog-post-item";
    if (post.id === adminBlogSelectedPostId) {
      button.classList.add("active");
    }
    button.dataset.postId = String(post.id || 0);

    const title = post.title?.pl || post.slug || "Wpis";
    const visibility = post.isPublished ? "Opublikowany" : "Szkic";
    button.innerHTML = `
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(post.date || "-")} · ${escapeHtml(visibility)}</span>
    `;
    fragment.append(button);
  });

  adminBlogPostsListEl.append(fragment);
}

function renderAdminBlogBlocks(blocks) {
  if (!adminBlogBlocksEl) {
    return;
  }

  const safeBlocks = Array.isArray(blocks) && blocks.length ? blocks : [createEmptyBlogBlock("text")];

  adminBlogBlocksEl.innerHTML = "";
  const fragment = document.createDocumentFragment();

  safeBlocks.forEach((block, index) => {
    const type = ["text", "image", "video"].includes(block.type) ? block.type : "text";
    const layout = ["normal", "wide", "compact"].includes(block.layout) ? block.layout : "normal";

    const card = document.createElement("article");
    card.className = "admin-blog-block-card";
    card.dataset.blockIndex = String(index);
    card.innerHTML = `
      <div class="admin-blog-block-top">
        <strong>Blok ${index + 1}</strong>
        <div class="admin-blog-block-actions">
          <button class="shop-btn admin-ghost-btn" type="button" data-block-action="up" data-block-index="${index}">↑</button>
          <button class="shop-btn admin-ghost-btn" type="button" data-block-action="down" data-block-index="${index}">↓</button>
          <button class="shop-btn admin-ghost-btn" type="button" data-block-action="remove" data-block-index="${index}">Usuń</button>
        </div>
      </div>

      <label>Typ bloku</label>
      <select class="admin-blog-block-type" data-block-index="${index}">
        <option value="text" ${type === "text" ? "selected" : ""}>Tekst</option>
        <option value="image" ${type === "image" ? "selected" : ""}>Zdjęcie</option>
        <option value="video" ${type === "video" ? "selected" : ""}>Wideo</option>
      </select>

      <label>Układ</label>
      <select class="admin-blog-block-layout" data-block-index="${index}">
        <option value="normal" ${layout === "normal" ? "selected" : ""}>Normalny</option>
        <option value="wide" ${layout === "wide" ? "selected" : ""}>Szeroki</option>
        <option value="compact" ${layout === "compact" ? "selected" : ""}>Kompakt</option>
      </select>
    `;

    if (type === "text") {
      const textPl = String(block?.text?.pl || "");
      const textEn = String(block?.text?.en || "");
      const textRow = document.createElement("div");
      textRow.className = "admin-blog-block-row";
      textRow.innerHTML = `
        <label>Treść (PL)</label>
        <textarea class="admin-blog-block-text-pl" rows="4" data-block-index="${index}">${escapeHtml(textPl)}</textarea>

        <label>Treść (EN)</label>
        <textarea class="admin-blog-block-text-en" rows="4" data-block-index="${index}">${escapeHtml(textEn)}</textarea>
      `;
      card.append(textRow);
    } else {
      const src = String(block.src || "");
      const captionPl = String(block?.caption?.pl || "");
      const captionEn = String(block?.caption?.en || "");
      const mediaRow = document.createElement("div");
      mediaRow.className = "admin-blog-block-row";
      mediaRow.innerHTML = `
        <label>Ścieżka / URL ${type === "video" ? "wideo" : "zdjęcia"}</label>
        <input class="admin-blog-block-src" type="text" data-block-index="${index}" value="${escapeHtml(src)}" />

        <label>Podpis (PL)</label>
        <input class="admin-blog-block-caption-pl" type="text" data-block-index="${index}" value="${escapeHtml(captionPl)}" />

        <label>Podpis (EN)</label>
        <input class="admin-blog-block-caption-en" type="text" data-block-index="${index}" value="${escapeHtml(captionEn)}" />
      `;
      card.append(mediaRow);
    }

    fragment.append(card);
  });

  adminBlogBlocksEl.append(fragment);
}

function readBlocksFromEditor() {
  if (!adminBlogBlocksEl) {
    return [createEmptyBlogBlock("text")];
  }

  const cards = Array.from(adminBlogBlocksEl.querySelectorAll(".admin-blog-block-card"));
  const blocks = cards
    .map((card) => {
      const type = String(card.querySelector(".admin-blog-block-type")?.value || "text").trim().toLowerCase();
      const layout = String(card.querySelector(".admin-blog-block-layout")?.value || "normal").trim().toLowerCase();
      const safeLayout = ["normal", "wide", "compact"].includes(layout) ? layout : "normal";

      if (type === "text") {
        return {
          type: "text",
          layout: safeLayout,
          text: {
            pl: String(card.querySelector(".admin-blog-block-text-pl")?.value || "").trim(),
            en: String(card.querySelector(".admin-blog-block-text-en")?.value || "").trim()
          }
        };
      }

      const safeType = ["image", "video"].includes(type) ? type : "image";
      return {
        type: safeType,
        layout: safeLayout,
        src: String(card.querySelector(".admin-blog-block-src")?.value || "").trim(),
        caption: {
          pl: String(card.querySelector(".admin-blog-block-caption-pl")?.value || "").trim(),
          en: String(card.querySelector(".admin-blog-block-caption-en")?.value || "").trim()
        }
      };
    })
    .filter((block) => {
      if (block.type === "text") {
        return Boolean(block.text.pl || block.text.en);
      }
      return Boolean(block.src);
    });

  return blocks.length ? blocks : [createEmptyBlogBlock("text")];
}

function loadPostIntoBlogForm(post) {
  if (!adminBlogFormEl) {
    return;
  }

  const normalized = normalizeBlogPost(post);
  adminBlogSelectedPostId = normalized.id || 0;

  if (adminBlogIdEl) {
    adminBlogIdEl.value = normalized.id ? String(normalized.id) : "";
  }
  if (adminBlogSlugEl) {
    adminBlogSlugEl.value = normalized.slug;
  }
  if (adminBlogDateEl) {
    adminBlogDateEl.value = normalized.date || getTodayIsoDate();
  }
  if (adminBlogReadMinutesEl) {
    adminBlogReadMinutesEl.value = String(normalized.readMinutes || 3);
  }
  if (adminBlogSortOrderEl) {
    adminBlogSortOrderEl.value = String(normalized.sortOrder || 0);
  }
  if (adminBlogPublishedEl) {
    adminBlogPublishedEl.checked = normalized.isPublished !== false;
  }
  if (adminBlogTitlePlEl) {
    adminBlogTitlePlEl.value = normalized.title.pl;
  }
  if (adminBlogTitleEnEl) {
    adminBlogTitleEnEl.value = normalized.title.en;
  }
  if (adminBlogLeadPlEl) {
    adminBlogLeadPlEl.value = normalized.lead.pl;
  }
  if (adminBlogLeadEnEl) {
    adminBlogLeadEnEl.value = normalized.lead.en;
  }

  renderAdminBlogBlocks(normalized.blocks);
  renderAdminBlogPostList();
}

function prepareNewBlogPost() {
  loadPostIntoBlogForm(createEmptyBlogPost());
}

function collectBlogPostPayloadFromForm() {
  const postId = Number.parseInt(adminBlogIdEl?.value || "0", 10);
  const readMinutes = Number.parseInt(adminBlogReadMinutesEl?.value || "3", 10);
  const sortOrder = Number.parseInt(adminBlogSortOrderEl?.value || "0", 10);

  return {
    id: Number.isNaN(postId) ? 0 : postId,
    slug: String(adminBlogSlugEl?.value || "")
      .trim()
      .toLowerCase(),
    date: String(adminBlogDateEl?.value || getTodayIsoDate()).slice(0, 10),
    readMinutes: Number.isNaN(readMinutes) ? 3 : readMinutes,
    sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
    isPublished: adminBlogPublishedEl?.checked !== false,
    title: {
      pl: String(adminBlogTitlePlEl?.value || "").trim(),
      en: String(adminBlogTitleEnEl?.value || "").trim()
    },
    lead: {
      pl: String(adminBlogLeadPlEl?.value || "").trim(),
      en: String(adminBlogLeadEnEl?.value || "").trim()
    },
    blocks: readBlocksFromEditor()
  };
}

function isBlogPanelActive() {
  const panel = document.querySelector('[data-admin-panel="blog"]');
  return Boolean(panel && !panel.hidden);
}

async function loadBlogPosts(selectPostId = adminBlogSelectedPostId) {
  if (!isAdminBlogLoggedIn()) {
    return;
  }

  const result = await adminBlogApiRequest("/admin/blog/posts", { method: "GET" });
  if (!result.ok) {
    setAdminBlogFeedback(result.error || "Nie udało się pobrać wpisów bloga.", true);
    return;
  }

  const postsRaw = Array.isArray(result.data?.posts) ? result.data.posts : [];
  adminBlogPosts = postsRaw.map(normalizeBlogPost);

  if (!adminBlogPosts.length) {
    renderAdminBlogPostList();
    prepareNewBlogPost();
    return;
  }

  const safeSelectId = Number.parseInt(selectPostId || "0", 10);
  const selectedPost =
    adminBlogPosts.find((post) => post.id === safeSelectId) ||
    adminBlogPosts.find((post) => post.id === adminBlogSelectedPostId) ||
    adminBlogPosts[0];

  loadPostIntoBlogForm(selectedPost);
  setAdminBlogFeedback("Wpisy bloga zostały załadowane.");
}

async function handleAdminBlogSave(event) {
  event.preventDefault();
  if (!isAdminBlogLoggedIn()) {
    setAdminBlogFeedback("Najpierw zaloguj się do panelu.", true);
    return;
  }

  const payload = collectBlogPostPayloadFromForm();
  if (!payload.slug || !payload.title.pl) {
    setAdminBlogFeedback("Uzupełnij przynajmniej slug i tytuł PL.", true);
    return;
  }

  const result = await adminBlogApiRequest("/admin/blog/posts", {
    method: "POST",
    body: {
      post: payload
    }
  });

  if (!result.ok) {
    setAdminBlogFeedback(result.error || "Nie udało się zapisać wpisu.", true);
    return;
  }

  const savedPost = normalizeBlogPost(result.data?.post || payload);
  setAdminBlogFeedback("Wpis został zapisany.");
  await loadBlogPosts(savedPost.id || payload.id || 0);
}

async function handleAdminBlogDelete() {
  if (!isAdminBlogLoggedIn()) {
    setAdminBlogFeedback("Najpierw zaloguj się do panelu.", true);
    return;
  }

  const postId = Number.parseInt(adminBlogIdEl?.value || "0", 10);
  if (!postId) {
    setAdminBlogFeedback("Najpierw wybierz zapisany wpis do usunięcia.", true);
    return;
  }

  const shouldDelete = window.confirm("Na pewno usunąć ten wpis bloga?");
  if (!shouldDelete) {
    return;
  }

  const result = await adminBlogApiRequest(`/admin/blog/posts?id=${encodeURIComponent(String(postId))}`, {
    method: "DELETE"
  });

  if (!result.ok) {
    setAdminBlogFeedback(result.error || "Nie udało się usunąć wpisu.", true);
    return;
  }

  setAdminBlogFeedback("Wpis został usunięty.");
  adminBlogSelectedPostId = 0;
  await loadBlogPosts(0);
}

function handleAdminBlogPostListClick(event) {
  const target = event.target.closest(".admin-blog-post-item");
  if (!target) {
    return;
  }

  const postId = Number.parseInt(target.dataset.postId || "0", 10);
  if (!postId) {
    return;
  }

  const post = adminBlogPosts.find((entry) => entry.id === postId);
  if (!post) {
    return;
  }

  loadPostIntoBlogForm(post);
}

function handleAdminBlogAddBlock(type) {
  const blocks = readBlocksFromEditor();
  blocks.push(createEmptyBlogBlock(type));
  renderAdminBlogBlocks(blocks);
}

function handleAdminBlogBlocksClick(event) {
  const button = event.target.closest("[data-block-action]");
  if (!button) {
    return;
  }

  const action = String(button.dataset.blockAction || "");
  const index = Number.parseInt(button.dataset.blockIndex || "-1", 10);
  if (Number.isNaN(index) || index < 0) {
    return;
  }

  const blocks = readBlocksFromEditor();
  if (index >= blocks.length) {
    return;
  }

  if (action === "remove") {
    blocks.splice(index, 1);
  } else if (action === "up" && index > 0) {
    const tmp = blocks[index - 1];
    blocks[index - 1] = blocks[index];
    blocks[index] = tmp;
  } else if (action === "down" && index < blocks.length - 1) {
    const tmp = blocks[index + 1];
    blocks[index + 1] = blocks[index];
    blocks[index] = tmp;
  }

  renderAdminBlogBlocks(blocks);
}

function handleAdminBlogBlockTypeChange(event) {
  const typeSelect = event.target.closest(".admin-blog-block-type");
  if (!typeSelect) {
    return;
  }

  const index = Number.parseInt(typeSelect.dataset.blockIndex || "-1", 10);
  if (Number.isNaN(index) || index < 0) {
    return;
  }

  const blocks = readBlocksFromEditor();
  if (!blocks[index]) {
    return;
  }

  const nextType = String(typeSelect.value || "text").trim().toLowerCase();
  if (nextType === "text") {
    const currentText = blocks[index]?.text || { pl: "", en: "" };
    blocks[index] = {
      type: "text",
      layout: blocks[index].layout || "normal",
      text: {
        pl: String(currentText.pl || ""),
        en: String(currentText.en || "")
      }
    };
  } else if (nextType === "image" || nextType === "video") {
    const currentCaption = blocks[index]?.caption || { pl: "", en: "" };
    blocks[index] = {
      type: nextType,
      layout: blocks[index].layout || "normal",
      src: String(blocks[index]?.src || ""),
      caption: {
        pl: String(currentCaption.pl || ""),
        en: String(currentCaption.en || "")
      }
    };
  }

  renderAdminBlogBlocks(blocks);
}

function attachAdminBlogEvents() {
  if (adminBlogTabBtnEl) {
    adminBlogTabBtnEl.addEventListener("click", () => {
      if (!isAdminBlogLoggedIn()) {
        setAdminBlogFeedback("Najpierw zaloguj się do panelu.", true);
        return;
      }
      void loadBlogPosts(adminBlogSelectedPostId);
    });
  }

  if (adminBlogFormEl) {
    adminBlogFormEl.addEventListener("submit", (event) => {
      void handleAdminBlogSave(event);
    });
  }

  if (adminBlogDeleteBtnEl) {
    adminBlogDeleteBtnEl.addEventListener("click", () => {
      void handleAdminBlogDelete();
    });
  }

  if (adminBlogNewBtnEl) {
    adminBlogNewBtnEl.addEventListener("click", () => {
      prepareNewBlogPost();
      setAdminBlogFeedback("Nowy wpis: uzupełnij pola i zapisz.");
    });
  }

  if (adminBlogRefreshBtnEl) {
    adminBlogRefreshBtnEl.addEventListener("click", () => {
      void loadBlogPosts(adminBlogSelectedPostId);
    });
  }

  if (adminBlogPostsListEl) {
    adminBlogPostsListEl.addEventListener("click", handleAdminBlogPostListClick);
  }

  if (adminBlogAddTextBtnEl) {
    adminBlogAddTextBtnEl.addEventListener("click", () => {
      handleAdminBlogAddBlock("text");
    });
  }
  if (adminBlogAddImageBtnEl) {
    adminBlogAddImageBtnEl.addEventListener("click", () => {
      handleAdminBlogAddBlock("image");
    });
  }
  if (adminBlogAddVideoBtnEl) {
    adminBlogAddVideoBtnEl.addEventListener("click", () => {
      handleAdminBlogAddBlock("video");
    });
  }

  if (adminBlogBlocksEl) {
    adminBlogBlocksEl.addEventListener("click", handleAdminBlogBlocksClick);
    adminBlogBlocksEl.addEventListener("change", handleAdminBlogBlockTypeChange);
  }

  window.addEventListener("focus", () => {
    if (!isBlogPanelActive() || !isAdminBlogLoggedIn()) {
      return;
    }
    void loadBlogPosts(adminBlogSelectedPostId);
  });
}

function initAdminBlogModule() {
  if (!adminBlogFormEl) {
    return;
  }
  attachAdminBlogEvents();
  prepareNewBlogPost();
}

initAdminBlogModule();
