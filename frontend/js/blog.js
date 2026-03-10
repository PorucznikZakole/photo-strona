const BLOG_USER_TOKEN_KEY = "photo-user-token";
const BLOG_API_BASE = "/api";

const FALLBACK_BLOG_POSTS = [
  {
    slug: "street-notes-01",
    date: "2026-03-05",
    readMinutes: 4,
    isPublished: true,
    sortOrder: 0,
    title: {
      pl: "Kiedy ulica gra światłem",
      en: "When the street plays with light"
    },
    lead: {
      pl: "Krótki zapis o tym, kiedy miasto daje najlepsze światło.",
      en: "A short note on when the city gives the best light."
    },
    blocks: [
      {
        type: "text",
        layout: "normal",
        text: {
          pl: "Najlepsze kadry często pojawiają się kilka minut po zachodzie słońca, kiedy asfalt jeszcze trzyma ciepło, a neony dopiero łapią rytm.",
          en: "The best frames often appear a few minutes after sunset, when the asphalt still holds heat and the neon signs start to pulse."
        }
      },
      {
        type: "text",
        layout: "normal",
        text: {
          pl: "W takich momentach nie szukam idealnej geometrii. Szukam napięcia między ciszą a ruchem.",
          en: "In those moments I do not chase perfect geometry. I chase tension between silence and movement."
        }
      },
      {
        type: "text",
        layout: "normal",
        text: {
          pl: "Jeżeli chcesz, mogę zrobić osobny wpis o tym, jak planuję nocny spacer fotograficzny po mieście.",
          en: "If you want, I can publish a dedicated post about how I plan a night photo walk through the city."
        }
      }
    ]
  },
  {
    slug: "night-city-prints",
    date: "2026-02-27",
    readMinutes: 5,
    isPublished: true,
    sortOrder: 1,
    title: {
      pl: "Jak wybieram zdjęcia do wydruku",
      en: "How I select photos for print"
    },
    lead: {
      pl: "Co sprawdzam zanim zdjęcie trafi do oferty wydruków.",
      en: "What I verify before a photo enters the print offer."
    },
    blocks: [
      {
        type: "text",
        layout: "normal",
        text: {
          pl: "Do wydruku wybieram zdjęcia, które bronią się nie tylko tematem, ale i fakturą cieni.",
          en: "For prints, I select photos that hold up not only by subject but also by shadow texture."
        }
      },
      {
        type: "text",
        layout: "normal",
        text: {
          pl: "Czerń musi zostać czernią, a jasne partie nie mogą wyglądać płasko po wydruku.",
          en: "Blacks need to stay deep, and bright areas cannot feel flat once printed."
        }
      },
      {
        type: "text",
        layout: "normal",
        text: {
          pl: "Dlatego każdy kadr testuję na kilku rozmiarach, zanim trafi do kolekcji.",
          en: "That is why I test each frame at multiple sizes before adding it to the collection."
        }
      }
    ]
  },
  {
    slug: "behind-the-frame",
    date: "2026-02-18",
    readMinutes: 3,
    isPublished: true,
    sortOrder: 2,
    title: {
      pl: "Kulisy sesji ulicznej",
      en: "Behind a street session"
    },
    lead: {
      pl: "Jak wygląda praca z modelem w miejskim tempie.",
      en: "How working with a model looks in the city pace."
    },
    blocks: [
      {
        type: "text",
        layout: "normal",
        text: {
          pl: "Najważniejsze na sesji jest zaufanie i tempo, które pasuje do osoby przed obiektywem.",
          en: "The key on a session is trust and a pace that fits the person in front of the lens."
        }
      },
      {
        type: "text",
        layout: "normal",
        text: {
          pl: "Nie ustawiam wszystkiego co do centymetra. Wolę zostawić miejsce na naturalny ruch.",
          en: "I do not over-stage every centimeter. I prefer to leave room for natural movement."
        }
      },
      {
        type: "text",
        layout: "normal",
        text: {
          pl: "To właśnie te mikrosekundy między pozami najczęściej dają najmocniejsze ujęcia.",
          en: "Those micro-seconds between poses often create the strongest shots."
        }
      }
    ]
  }
];

const blogPostTabsEl = document.getElementById("blog-post-tabs");
const blogPostTitleEl = document.getElementById("blog-post-title");
const blogPostMetaEl = document.getElementById("blog-post-meta");
const blogPostContentEl = document.getElementById("blog-post-content");
const blogPostsTitleEl = document.getElementById("blog-posts-title");
const blogPageTitleEl = document.getElementById("blog-page-title");
const blogPageLeadEl = document.getElementById("blog-page-lead");
const blogCommunityTitleEl = document.getElementById("blog-community-title");

const blogAuthFeedbackEl = document.getElementById("blog-auth-feedback");
const blogUserPanelEl = document.getElementById("blog-user-panel");
const blogUserWelcomeEl = document.getElementById("blog-user-welcome");
const blogLogoutBtnEl = document.getElementById("blog-logout-btn");
const blogAuthActionsEl = document.getElementById("blog-auth-actions");
const blogOpenLoginBtnEl = document.getElementById("blog-open-login");
const blogOpenRegisterBtnEl = document.getElementById("blog-open-register");
const blogAuthModalEl = document.getElementById("blog-auth-modal");
const blogAuthCloseBtnEl = document.getElementById("blog-auth-close");
const blogSwitchLoginBtnEl = document.getElementById("blog-switch-login");
const blogSwitchRegisterBtnEl = document.getElementById("blog-switch-register");
const blogRegisterFormEl = document.getElementById("blog-register-form");
const blogLoginFormEl = document.getElementById("blog-login-form");
const blogLoginTitleEl = document.getElementById("blog-login-title");
const blogRegisterTitleEl = document.getElementById("blog-register-title");
const blogLoginEmailLabelEl = document.getElementById("blog-login-email-label");
const blogLoginPasswordLabelEl = document.getElementById("blog-login-password-label");
const blogLoginSubmitEl = document.getElementById("blog-login-submit");
const blogRegisterNameLabelEl = document.getElementById("blog-register-name-label");
const blogRegisterEmailLabelEl = document.getElementById("blog-register-email-label");
const blogRegisterPasswordLabelEl = document.getElementById("blog-register-password-label");
const blogRegisterSubmitEl = document.getElementById("blog-register-submit");
const blogCommentFormEl = document.getElementById("blog-comment-form");
const blogCommentLabelEl = document.getElementById("blog-comment-label");
const blogCommentInputEl = document.getElementById("blog-comment-input");
const blogCommentSubmitEl = document.getElementById("blog-comment-submit");
const blogCommentsListEl = document.getElementById("blog-comments-list");
const blogCommentsEmptyEl = document.getElementById("blog-comments-empty");
const blogCommentTargetEl = document.getElementById("blog-comment-target");

let blogPosts = [];
let activePostSlug = "";
let blogUserToken = localStorage.getItem(BLOG_USER_TOKEN_KEY) || "";
let currentUser = null;
let activeLanguage = getActiveLanguage();
let authMode = "login";

function isPlainObjectValue(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getActiveLanguage() {
  return document.documentElement.lang === "en" ? "en" : "pl";
}

function text(pl, en) {
  return activeLanguage === "en" ? en : pl;
}

function normalizeBlogBlock(rawBlock) {
  const source = isPlainObjectValue(rawBlock) ? rawBlock : {};
  const typeRaw = String(source.type || "").trim().toLowerCase();
  if (!["text", "image", "video"].includes(typeRaw)) {
    return null;
  }

  const layoutRaw = String(source.layout || "normal").trim().toLowerCase();
  const layout = ["normal", "wide", "compact"].includes(layoutRaw) ? layoutRaw : "normal";

  if (typeRaw === "text") {
    const textPayload = isPlainObjectValue(source.text) ? source.text : {};
    return {
      type: "text",
      layout,
      text: {
        pl: String(textPayload.pl || ""),
        en: String(textPayload.en || "")
      }
    };
  }

  const captionPayload = isPlainObjectValue(source.caption) ? source.caption : {};
  const src = String(source.src || "").trim();
  if (!src) {
    return null;
  }

  return {
    type: typeRaw,
    layout,
    src,
    caption: {
      pl: String(captionPayload.pl || ""),
      en: String(captionPayload.en || "")
    }
  };
}

function normalizeBlogPost(rawPost) {
  const source = isPlainObjectValue(rawPost) ? rawPost : {};
  const slug = String(source.slug || "").trim().toLowerCase();
  if (!slug) {
    return null;
  }

  const readMinutes = Number.parseInt(source.readMinutes, 10);
  const sortOrder = Number.parseInt(source.sortOrder, 10);
  const blocksRaw = Array.isArray(source.blocks) ? source.blocks : [];
  const blocks = blocksRaw.map(normalizeBlogBlock).filter(Boolean);

  return {
    id: Number.parseInt(source.id, 10) || 0,
    slug,
    date: String(source.date || "").slice(0, 10),
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
    blocks
  };
}

function setBlogFeedback(message, isError = false) {
  if (!blogAuthFeedbackEl) {
    return;
  }
  blogAuthFeedbackEl.textContent = message || "";
  blogAuthFeedbackEl.classList.toggle("is-error", Boolean(isError));
}

function setAuthMode(mode) {
  const nextMode = mode === "register" ? "register" : "login";
  authMode = nextMode;

  const isLoginMode = nextMode === "login";
  if (blogLoginFormEl) {
    blogLoginFormEl.hidden = !isLoginMode;
  }
  if (blogRegisterFormEl) {
    blogRegisterFormEl.hidden = isLoginMode;
  }
  if (blogSwitchLoginBtnEl) {
    blogSwitchLoginBtnEl.classList.toggle("active", isLoginMode);
    blogSwitchLoginBtnEl.setAttribute("aria-pressed", String(isLoginMode));
  }
  if (blogSwitchRegisterBtnEl) {
    blogSwitchRegisterBtnEl.classList.toggle("active", !isLoginMode);
    blogSwitchRegisterBtnEl.setAttribute("aria-pressed", String(!isLoginMode));
  }
}

function openAuthModal(mode = "login") {
  if (!blogAuthModalEl) {
    return;
  }
  setAuthMode(mode);
  blogAuthModalEl.hidden = false;
  document.body.classList.add("modal-open");
}

function closeAuthModal() {
  if (!blogAuthModalEl || blogAuthModalEl.hidden) {
    return;
  }
  blogAuthModalEl.hidden = true;
  document.body.classList.remove("modal-open");
}

function getPostBySlug(slug) {
  return blogPosts.find((post) => post.slug === slug) || null;
}

function formatBlogDate(isoDate) {
  const parsed = new Date(String(isoDate || ""));
  if (Number.isNaN(parsed.getTime())) {
    return isoDate || "";
  }
  return parsed.toLocaleDateString(activeLanguage === "en" ? "en-GB" : "pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function getLocalizedText(payload) {
  if (!isPlainObjectValue(payload)) {
    return "";
  }
  return String(payload[activeLanguage] || payload.pl || payload.en || "");
}

function updateCommentTargetLabel() {
  if (!blogCommentTargetEl) {
    return;
  }
  const post = getPostBySlug(activePostSlug);
  const postTitle = post ? getLocalizedText(post.title) : "";
  if (!postTitle) {
    blogCommentTargetEl.textContent = text(
      "Brak aktywnego wpisu do komentowania.",
      "There is no active post to comment on."
    );
    return;
  }
  blogCommentTargetEl.textContent = text(
    `Komentujesz wpis: ${postTitle}`,
    `Commenting on: ${postTitle}`
  );
}

function renderBlogCopy() {
  if (blogPostsTitleEl) {
    blogPostsTitleEl.textContent = text("Wpisy", "Posts");
  }
  if (blogPageTitleEl) {
    blogPageTitleEl.textContent = "Blog";
  }
  if (blogPageLeadEl) {
    blogPageLeadEl.textContent = text(
      "Notatki z miasta, kulisy sesji i miejsce na rozmowę pod wpisami.",
      "Notes from the city, behind-the-scenes stories, and a place for conversation."
    );
  }
  if (blogCommunityTitleEl) {
    blogCommunityTitleEl.textContent = text("Komentarze", "Comments");
  }
  if (blogOpenLoginBtnEl) {
    blogOpenLoginBtnEl.textContent = text("Zaloguj", "Log in");
  }
  if (blogOpenRegisterBtnEl) {
    blogOpenRegisterBtnEl.textContent = text("Załóż konto", "Create account");
  }
  if (blogSwitchLoginBtnEl) {
    blogSwitchLoginBtnEl.textContent = text("Logowanie", "Log in");
  }
  if (blogSwitchRegisterBtnEl) {
    blogSwitchRegisterBtnEl.textContent = text("Rejestracja", "Register");
  }
  if (blogLoginTitleEl) {
    blogLoginTitleEl.textContent = text("Logowanie", "Log in");
  }
  if (blogRegisterTitleEl) {
    blogRegisterTitleEl.textContent = text("Rejestracja", "Register");
  }
  if (blogLoginEmailLabelEl) {
    blogLoginEmailLabelEl.textContent = text("E-mail", "E-mail");
  }
  if (blogLoginPasswordLabelEl) {
    blogLoginPasswordLabelEl.textContent = text("Hasło", "Password");
  }
  if (blogLoginSubmitEl) {
    blogLoginSubmitEl.textContent = text("Zaloguj", "Log in");
  }
  if (blogRegisterNameLabelEl) {
    blogRegisterNameLabelEl.textContent = text("Nazwa użytkownika", "Display name");
  }
  if (blogRegisterEmailLabelEl) {
    blogRegisterEmailLabelEl.textContent = text("E-mail", "E-mail");
  }
  if (blogRegisterPasswordLabelEl) {
    blogRegisterPasswordLabelEl.textContent = text("Hasło", "Password");
  }
  if (blogRegisterSubmitEl) {
    blogRegisterSubmitEl.textContent = text("Załóż konto", "Create account");
  }
  if (blogCommentsEmptyEl) {
    blogCommentsEmptyEl.textContent = text(
      "Brak komentarzy dla tego wpisu.",
      "No comments for this post yet."
    );
  }
  if (blogLogoutBtnEl) {
    blogLogoutBtnEl.textContent = text("Wyloguj", "Log out");
  }
  if (blogCommentInputEl && !currentUser) {
    blogCommentInputEl.placeholder = text(
      "Zaloguj się, aby dodać komentarz do tego wpisu...",
      "Log in to leave a comment for this post..."
    );
  }
  if (blogCommentLabelEl) {
    blogCommentLabelEl.textContent = text("Dodaj komentarz", "Add comment");
  }
  if (blogCommentSubmitEl) {
    blogCommentSubmitEl.textContent = text("Dodaj komentarz", "Add comment");
  }
  updateCommentTargetLabel();
}

function renderBlogPostTabs() {
  if (!blogPostTabsEl) {
    return;
  }

  blogPostTabsEl.innerHTML = "";
  if (!blogPosts.length) {
    return;
  }

  const fragment = document.createDocumentFragment();
  blogPosts.forEach((post) => {
    const button = document.createElement("button");
    button.className = "shop-tab blog-post-tab";
    const isActive = post.slug === activePostSlug;
    if (isActive) {
      button.classList.add("active");
    }
    button.type = "button";
    button.setAttribute("aria-pressed", String(isActive));
    button.dataset.postSlug = post.slug;
    button.textContent = getLocalizedText(post.title) || post.slug;
    fragment.append(button);
  });

  blogPostTabsEl.append(fragment);
}

function renderTextBlock(container, block) {
  const rawText = getLocalizedText(block.text).trim();
  if (!rawText) {
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "blog-text-block";
  const chunks = rawText
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  const paragraphs = chunks.length ? chunks : [rawText];
  paragraphs.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    wrapper.append(p);
  });

  container.append(wrapper);
}

function renderMediaBlock(container, block) {
  const source = String(block.src || "").trim();
  if (!source) {
    return;
  }

  const figure = document.createElement("figure");
  figure.className = `blog-media-block blog-media-${block.layout || "normal"}`;

  if (block.type === "video") {
    const video = document.createElement("video");
    video.src = source;
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    figure.append(video);
  } else {
    const image = document.createElement("img");
    image.src = source;
    image.loading = "lazy";
    image.alt = getLocalizedText(block.caption) || getLocalizedText(block.title) || "Blog image";
    figure.append(image);
  }

  const captionText = getLocalizedText(block.caption).trim();
  if (captionText) {
    const caption = document.createElement("figcaption");
    caption.className = "blog-media-caption";
    caption.textContent = captionText;
    figure.append(caption);
  }

  container.append(figure);
}

function renderActiveBlogPost() {
  if (!blogPostTitleEl || !blogPostMetaEl || !blogPostContentEl) {
    return;
  }

  const post = getPostBySlug(activePostSlug);
  blogPostContentEl.innerHTML = "";

  if (!post) {
    blogPostTitleEl.textContent = text("Brak wpisów", "No posts");
    blogPostMetaEl.textContent = "";

    const empty = document.createElement("p");
    empty.textContent = text(
      "Dodaj pierwszy wpis w panelu administracyjnym, aby uruchomić blog.",
      "Add your first post in the admin panel to publish the blog."
    );
    blogPostContentEl.append(empty);
    updateCommentTargetLabel();
    return;
  }

  const title = getLocalizedText(post.title) || post.slug;
  const lead = getLocalizedText(post.lead).trim();
  blogPostTitleEl.textContent = title;
  blogPostMetaEl.textContent = `${formatBlogDate(post.date)} · ${post.readMinutes} ${text("min czytania", "min read")}`;

  if (lead) {
    const leadNode = document.createElement("p");
    leadNode.className = "blog-post-lead";
    leadNode.textContent = lead;
    blogPostContentEl.append(leadNode);
  }

  const blocks = Array.isArray(post.blocks) ? post.blocks : [];
  blocks.forEach((block) => {
    if (block.type === "text") {
      renderTextBlock(blogPostContentEl, block);
      return;
    }
    if (block.type === "image" || block.type === "video") {
      renderMediaBlock(blogPostContentEl, block);
    }
  });

  updateCommentTargetLabel();
}

function getAuthorizedHeaders(includeJson = true) {
  const headers = {};
  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }
  if (blogUserToken) {
    headers.Authorization = `Bearer ${blogUserToken}`;
  }
  return headers;
}

async function blogApiRequest(path, options = {}) {
  const method = options.method || "GET";
  const includeJson = method !== "GET";

  try {
    const response = await fetch(`${BLOG_API_BASE}${path}`, {
      method,
      headers: getAuthorizedHeaders(includeJson),
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    const textBody = await response.text();
    let data = null;
    try {
      data = textBody ? JSON.parse(textBody) : null;
    } catch {
      data = null;
    }
    if (!response.ok) {
      let errorMessage = data?.error || `HTTP ${response.status}`;
      if (response.status === 404) {
        errorMessage = text(
          "API nie jest dostępne. Uruchom stronę przez `python3 server.py`, a nie przez sam plik HTML.",
          "API is unavailable. Run the site with `python3 server.py` instead of opening only the HTML file."
        );
      }
      return {
        ok: false,
        error: errorMessage,
        status: response.status,
        data
      };
    }
    return { ok: true, data, status: response.status };
  } catch {
    return { ok: false, status: 0, error: text("Błąd połączenia z serwerem.", "Server connection error.") };
  }
}

function setBlogToken(token) {
  blogUserToken = token || "";
  if (blogUserToken) {
    localStorage.setItem(BLOG_USER_TOKEN_KEY, blogUserToken);
  } else {
    localStorage.removeItem(BLOG_USER_TOKEN_KEY);
  }
}

function updateBlogAuthUi() {
  const isLoggedIn = Boolean(currentUser);
  if (blogUserPanelEl) {
    blogUserPanelEl.hidden = !isLoggedIn;
  }
  if (blogAuthActionsEl) {
    blogAuthActionsEl.hidden = isLoggedIn;
  }
  if (isLoggedIn) {
    closeAuthModal();
  }

  if (blogUserWelcomeEl) {
    blogUserWelcomeEl.textContent = isLoggedIn
      ? text(`Zalogowano jako: ${currentUser.displayName}`, `Logged in as: ${currentUser.displayName}`)
      : "";
  }

  if (blogCommentInputEl) {
    blogCommentInputEl.disabled = !isLoggedIn || !activePostSlug;
    if (!isLoggedIn) {
      blogCommentInputEl.placeholder = text(
        "Zaloguj się, aby dodać komentarz do tego wpisu...",
        "Log in to leave a comment for this post..."
      );
    } else if (!activePostSlug) {
      blogCommentInputEl.placeholder = text(
        "Najpierw dodaj wpis bloga.",
        "Add a blog post first."
      );
    } else {
      blogCommentInputEl.placeholder = text("Napisz komentarz...", "Write a comment...");
    }
  }
  if (blogCommentSubmitEl) {
    blogCommentSubmitEl.disabled = !isLoggedIn || !activePostSlug;
  }
}

function renderComments(comments) {
  if (!blogCommentsListEl || !blogCommentsEmptyEl) {
    return;
  }
  blogCommentsListEl.innerHTML = "";
  const safeComments = Array.isArray(comments) ? comments : [];
  blogCommentsEmptyEl.hidden = safeComments.length > 0;
  if (!safeComments.length) {
    return;
  }

  const fragment = document.createDocumentFragment();
  safeComments.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "admin-message-card blog-comment-card";

    const header = document.createElement("div");
    header.className = "admin-message-header";

    const author = document.createElement("h3");
    author.textContent = entry?.user?.displayName || text("Użytkownik", "User");

    const timeNode = document.createElement("time");
    timeNode.dateTime = entry?.createdAt || "";
    timeNode.textContent = formatBlogDate(entry?.createdAt || "");

    const body = document.createElement("div");
    body.className = "admin-message-body";
    const content = document.createElement("p");
    content.textContent = entry?.content || "";

    body.append(content);
    header.append(author, timeNode);
    card.append(header, body);
    fragment.append(card);
  });

  blogCommentsListEl.append(fragment);
}

async function loadBlogPostsFromApi() {
  const result = await blogApiRequest("/blog/posts", { method: "GET" });
  if (!result.ok) {
    blogPosts = FALLBACK_BLOG_POSTS.map(normalizeBlogPost).filter(Boolean);
    if (result.error) {
      setBlogFeedback(result.error, true);
    }
    return;
  }

  const postsRaw = Array.isArray(result.data?.posts) ? result.data.posts : [];
  const normalized = postsRaw.map(normalizeBlogPost).filter(Boolean);
  blogPosts = normalized.length
    ? normalized
    : FALLBACK_BLOG_POSTS.map(normalizeBlogPost).filter(Boolean);
}

async function loadCommentsForActivePost() {
  const post = getPostBySlug(activePostSlug);
  if (!post) {
    renderComments([]);
    return;
  }
  const result = await blogApiRequest(`/blog/comments?post=${encodeURIComponent(post.slug)}`, {
    method: "GET"
  });
  if (!result.ok) {
    renderComments([]);
    return;
  }
  renderComments(result.data?.comments || []);
}

async function restoreUserSession() {
  if (!blogUserToken) {
    currentUser = null;
    updateBlogAuthUi();
    return;
  }

  const result = await blogApiRequest("/users/me", { method: "GET" });
  if (!result.ok || !result.data?.user) {
    setBlogToken("");
    currentUser = null;
    updateBlogAuthUi();
    return;
  }

  currentUser = result.data.user;
  updateBlogAuthUi();
}

async function handleRegisterSubmit(event) {
  event.preventDefault();
  if (!blogRegisterFormEl) {
    return;
  }

  const formData = new FormData(blogRegisterFormEl);
  const payload = {
    displayName: String(formData.get("displayName") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || "")
  };

  const result = await blogApiRequest("/users/register", {
    method: "POST",
    body: payload
  });
  if (!result.ok) {
    setBlogFeedback(result.error || text("Nie udało się utworzyć konta.", "Could not create account."), true);
    return;
  }

  setBlogToken(result.data?.token || "");
  currentUser = result.data?.user || null;
  blogRegisterFormEl.reset();
  if (blogLoginFormEl) {
    blogLoginFormEl.reset();
  }
  updateBlogAuthUi();
  setBlogFeedback(text("Konto utworzone. Jesteś zalogowany.", "Account created. You are now logged in."));
  await loadCommentsForActivePost();
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  if (!blogLoginFormEl) {
    return;
  }

  const formData = new FormData(blogLoginFormEl);
  const payload = {
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || "")
  };

  const result = await blogApiRequest("/users/login", {
    method: "POST",
    body: payload
  });
  if (!result.ok) {
    setBlogFeedback(result.error || text("Nie udało się zalogować.", "Could not log in."), true);
    return;
  }

  setBlogToken(result.data?.token || "");
  currentUser = result.data?.user || null;
  blogLoginFormEl.reset();
  updateBlogAuthUi();
  setBlogFeedback(text("Zalogowano.", "Logged in."));
  await loadCommentsForActivePost();
}

async function handleLogoutClick() {
  await blogApiRequest("/users/logout", { method: "POST" });
  setBlogToken("");
  currentUser = null;
  updateBlogAuthUi();
  setBlogFeedback(text("Wylogowano.", "Logged out."));
}

async function handleCommentSubmit(event) {
  event.preventDefault();
  if (!currentUser || !blogCommentInputEl) {
    setBlogFeedback(text("Zaloguj się, aby komentować.", "Log in to comment."), true);
    return;
  }
  if (!activePostSlug) {
    setBlogFeedback(text("Brak aktywnego wpisu.", "No active post."), true);
    return;
  }

  const content = blogCommentInputEl.value.trim();
  if (!content) {
    setBlogFeedback(text("Wpisz treść komentarza.", "Write a comment first."), true);
    return;
  }

  const result = await blogApiRequest("/blog/comments", {
    method: "POST",
    body: {
      postSlug: activePostSlug,
      content
    }
  });
  if (!result.ok) {
    setBlogFeedback(result.error || text("Nie udało się dodać komentarza.", "Could not add comment."), true);
    return;
  }

  blogCommentInputEl.value = "";
  setBlogFeedback(text("Komentarz dodany.", "Comment added."));
  await loadCommentsForActivePost();
}

function handlePostTabClick(event) {
  const button = event.target.closest(".blog-post-tab");
  if (!button) {
    return;
  }
  const nextSlug = button.dataset.postSlug || "";
  if (!nextSlug || nextSlug === activePostSlug) {
    return;
  }
  activePostSlug = nextSlug;
  renderBlogPostTabs();
  renderActiveBlogPost();
  updateBlogAuthUi();
  void loadCommentsForActivePost();
}

function setupLanguageObserver() {
  window.setInterval(() => {
    const nextLanguage = getActiveLanguage();
    if (nextLanguage === activeLanguage) {
      return;
    }
    activeLanguage = nextLanguage;
    renderBlogCopy();
    renderBlogPostTabs();
    renderActiveBlogPost();
    updateBlogAuthUi();
    void loadCommentsForActivePost();
  }, 600);
}

function attachBlogEvents() {
  if (blogPostTabsEl) {
    blogPostTabsEl.addEventListener("click", handlePostTabClick);
  }
  if (blogOpenLoginBtnEl) {
    blogOpenLoginBtnEl.addEventListener("click", () => {
      openAuthModal("login");
    });
  }
  if (blogOpenRegisterBtnEl) {
    blogOpenRegisterBtnEl.addEventListener("click", () => {
      openAuthModal("register");
    });
  }
  if (blogSwitchLoginBtnEl) {
    blogSwitchLoginBtnEl.addEventListener("click", () => {
      setAuthMode("login");
    });
  }
  if (blogSwitchRegisterBtnEl) {
    blogSwitchRegisterBtnEl.addEventListener("click", () => {
      setAuthMode("register");
    });
  }
  if (blogAuthCloseBtnEl) {
    blogAuthCloseBtnEl.addEventListener("click", closeAuthModal);
  }
  if (blogAuthModalEl) {
    blogAuthModalEl.addEventListener("click", (event) => {
      if (event.target === blogAuthModalEl) {
        closeAuthModal();
      }
    });
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAuthModal();
    }
  });
  if (blogRegisterFormEl) {
    blogRegisterFormEl.addEventListener("submit", (event) => {
      void handleRegisterSubmit(event);
    });
  }
  if (blogLoginFormEl) {
    blogLoginFormEl.addEventListener("submit", (event) => {
      void handleLoginSubmit(event);
    });
  }
  if (blogLogoutBtnEl) {
    blogLogoutBtnEl.addEventListener("click", () => {
      void handleLogoutClick();
    });
  }
  if (blogCommentFormEl) {
    blogCommentFormEl.addEventListener("submit", (event) => {
      void handleCommentSubmit(event);
    });
  }
}

async function initBlogPage() {
  setAuthMode("login");
  renderBlogCopy();
  await loadBlogPostsFromApi();

  activePostSlug = blogPosts[0]?.slug || "";
  renderBlogPostTabs();
  renderActiveBlogPost();
  updateBlogAuthUi();
  attachBlogEvents();
  setupLanguageObserver();
  await restoreUserSession();
  await loadCommentsForActivePost();
}

if (document.body && document.querySelector(".blog-main")) {
  void initBlogPage();
}
