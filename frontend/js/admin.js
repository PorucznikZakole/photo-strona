const ADMIN_TOKEN_KEY = "photo-admin-token";
const SITE_SETTINGS_STORAGE_KEY = "photo-site-settings";
const AUTO_TRANSLATE_CONTENT_STORAGE_KEY = "photo-admin-auto-translate-content";
const API_BASE = "/api";
const SUPPORTED_LANGUAGES = ["pl", "en"];
const PRIORITY_CONTENT_KEYS = [
  "heroTitle",
  "heroLead",
  "aboutP1",
  "aboutP2",
  "aboutPageText",
  "contactDesc",
  "shopKicker",
  "shopTitle",
  "shopLead",
  "shopFeaturedTitle",
  "shopFeaturedDesc",
  "shopCollectionsTitle",
  "shopCollectionsDesc"
];
const CONTENT_EDITOR_GROUPS = [
  { id: "home", label: "Strona główna" },
  { id: "portfolio", label: "Portfolio" },
  { id: "shop", label: "Sklep" },
  { id: "about", label: "O mnie" },
  { id: "contact", label: "Kontakt" },
  { id: "blog", label: "Blog" },
  { id: "system", label: "System" },
  { id: "other", label: "Inne" }
];
const CONTENT_EDITOR_GROUP_INDEX = Object.fromEntries(
  CONTENT_EDITOR_GROUPS.map((group, index) => [group.id, index])
);
const PHOTO_CATEGORIES = ["bw", "color", "nature", "landscape", "portrait"];
const PHOTO_CATEGORY_FOLDERS = {
  bw: "black-and-white",
  color: "color",
  nature: "nature",
  landscape: "landscape",
  portrait: "portrait"
};
const FEATURED_PHOTOS_FOLDER = "./assets/photos/featured";
const PHOTO_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"];
const ADMIN_BG_ROTATION_MS = 7200;
const ADMIN_BG_CHECK_TIMEOUT_MS = 5000;
const ADMIN_BG_STATIC_FALLBACK = [
  "./assets/photos/DSCF1598.jpg",
  "./assets/photos/DSCF2552.jpg",
  "./assets/photos/DSCF2667.jpg",
  "./assets/photos/DSCF3368.jpg",
  "./assets/photos/DSCF3414.jpg",
  "./assets/photos/DSCF3446.jpg"
];

function createDefaultEnabledCategories() {
  return Object.fromEntries(PHOTO_CATEGORIES.map((category) => [category, true]));
}

const DEFAULT_SITE_SETTINGS = {
  shopEnabled: true,
  blogEnabled: true,
  bookingEnabled: true,
  maintenanceMode: false,
  enabledCategories: createDefaultEnabledCategories(),
  shopCategories: createDefaultEnabledCategories(),
  portfolioCategories: createDefaultEnabledCategories(),
  contentOverrides: {
    pl: {},
    en: {}
  }
};

const loginFormEl = document.getElementById("admin-login-form");
const loginLeadEl = document.getElementById("admin-login-lead");
const panelEl = document.getElementById("admin-panel");
const passwordInputEl = document.getElementById("admin-password");
const feedbackEl = document.getElementById("admin-feedback");
const settingsFormEl = document.getElementById("admin-settings-form");
const shopEnabledInputEl = document.getElementById("setting-shop-enabled");
const blogEnabledInputEl = document.getElementById("setting-blog-enabled");
const bookingEnabledInputEl = document.getElementById("setting-booking-enabled");
const maintenanceModeInputEl = document.getElementById("setting-maintenance-mode");
const portfolioCategoryBwInputEl = document.getElementById("setting-portfolio-category-bw");
const portfolioCategoryColorInputEl = document.getElementById("setting-portfolio-category-color");
const portfolioCategoryNatureInputEl = document.getElementById("setting-portfolio-category-nature");
const portfolioCategoryLandscapeInputEl = document.getElementById("setting-portfolio-category-landscape");
const portfolioCategoryPortraitInputEl = document.getElementById("setting-portfolio-category-portrait");
const shopCategoryBwInputEl = document.getElementById("setting-shop-category-bw");
const shopCategoryColorInputEl = document.getElementById("setting-shop-category-color");
const shopCategoryNatureInputEl = document.getElementById("setting-shop-category-nature");
const shopCategoryLandscapeInputEl = document.getElementById("setting-shop-category-landscape");
const shopCategoryPortraitInputEl = document.getElementById("setting-shop-category-portrait");
const passwordFormEl = document.getElementById("admin-password-form");
const logoutBtnEl = document.getElementById("admin-logout");

const adminTabButtons = Array.from(document.querySelectorAll(".admin-tab[data-admin-tab]"));
const adminTabPanels = Array.from(document.querySelectorAll(".admin-tab-panel[data-admin-panel]"));

const contentFormEl = document.getElementById("admin-content-form");
const contentHeaderEl = document.getElementById("content-header");
const contentAboutEl = document.getElementById("content-about");
const contentAboutPageEl = document.getElementById("content-about-page");
const contentContactEl = document.getElementById("content-contact");
const contentShopKickerEl = document.getElementById("content-shop-kicker");
const contentShopTitleEl = document.getElementById("content-shop-title");
const contentShopLeadEl = document.getElementById("content-shop-lead");
const contentShopFeaturedTitleEl = document.getElementById("content-shop-featured-title");
const contentShopFeaturedDescEl = document.getElementById("content-shop-featured-desc");
const contentShopCollectionsTitleEl = document.getElementById("content-shop-collections-title");
const contentShopCollectionsDescEl = document.getElementById("content-shop-collections-desc");
const contentSearchInputEl = document.getElementById("admin-content-search");
const contentAllFieldsContainerEl = document.getElementById("admin-content-all-fields");
const autoTranslateContentInputEl = document.getElementById("admin-auto-translate-content");
const resetContentBtnEl = document.getElementById("admin-reset-content");
const contentLangButtons = Array.from(document.querySelectorAll(".admin-lang-btn[data-admin-lang]"));

const inboxListEl = document.getElementById("admin-inbox-list");
const inboxEmptyEl = document.getElementById("admin-inbox-empty");
const inboxFilterButtons = Array.from(document.querySelectorAll(".admin-filter-btn[data-inbox-filter]"));
const clearInboxBtnEl = document.getElementById("admin-clear-inbox");

const ordersListEl = document.getElementById("admin-orders-list");
const ordersEmptyEl = document.getElementById("admin-orders-empty");
const clearOrdersBtnEl = document.getElementById("admin-clear-orders");
const usersListEl = document.getElementById("admin-users-list");
const usersEmptyEl = document.getElementById("admin-users-empty");
const usersSourceEl = document.getElementById("admin-users-source");
const adminBgLayers = Array.from(document.querySelectorAll(".bg-stage .bg-layer"));
const portfolioCategorySettingInputs = {
  bw: portfolioCategoryBwInputEl,
  color: portfolioCategoryColorInputEl,
  nature: portfolioCategoryNatureInputEl,
  landscape: portfolioCategoryLandscapeInputEl,
  portrait: portfolioCategoryPortraitInputEl
};
const shopCategorySettingInputs = {
  bw: shopCategoryBwInputEl,
  color: shopCategoryColorInputEl,
  nature: shopCategoryNatureInputEl,
  landscape: shopCategoryLandscapeInputEl,
  portrait: shopCategoryPortraitInputEl
};

let authToken = "";
let siteSettings = { ...DEFAULT_SITE_SETTINGS };
let activeTab = "settings";
let activeContentLanguage = "pl";
let activeInboxFilter = "all";
let autoTranslateContentEnabled = true;
let baseContent = {
  pl: {},
  en: {}
};
let inboxMessages = [];
let orders = [];
let users = [];
let usersSourceFile = "data/users/accounts.json";
let usersSourceFolder = "data/users";
let adminBgSources = [];
let adminBgTimer = null;
let adminBgVisibleLayer = 0;
let adminBgIndex = 0;
const staticContentFieldBindings = {
  heroTitle: contentHeaderEl,
  aboutP1: contentAboutEl,
  aboutPageText: contentAboutPageEl,
  contactDesc: contentContactEl,
  shopKicker: contentShopKickerEl,
  shopTitle: contentShopTitleEl,
  shopLead: contentShopLeadEl,
  shopFeaturedTitle: contentShopFeaturedTitleEl,
  shopFeaturedDesc: contentShopFeaturedDescEl,
  shopCollectionsTitle: contentShopCollectionsTitleEl,
  shopCollectionsDesc: contentShopCollectionsDescEl
};
const staticContentFieldKeys = Object.keys(staticContentFieldBindings);
const contentFieldElements = new Map();
let currentContentFieldKeys = [];

function setFeedback(message, isError = false) {
  if (!feedbackEl) {
    return;
  }
  feedbackEl.textContent = message;
  feedbackEl.classList.toggle("is-error", isError);
}

function readAutoTranslateContentSetting() {
  try {
    const raw = localStorage.getItem(AUTO_TRANSLATE_CONTENT_STORAGE_KEY);
    if (raw === "0") {
      return false;
    }
    if (raw === "1") {
      return true;
    }
  } catch {
    // ignore
  }
  return true;
}

function saveAutoTranslateContentSetting() {
  try {
    localStorage.setItem(
      AUTO_TRANSLATE_CONTENT_STORAGE_KEY,
      autoTranslateContentEnabled ? "1" : "0"
    );
  } catch {
    // ignore
  }
}

function initializeAutoTranslateContentSetting() {
  autoTranslateContentEnabled = readAutoTranslateContentSetting();
  if (autoTranslateContentInputEl) {
    autoTranslateContentInputEl.checked = autoTranslateContentEnabled;
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizePhotoDirectoryPath(directoryPath = "./assets/photos") {
  if (typeof directoryPath !== "string" || !directoryPath.trim()) {
    return "./assets/photos";
  }
  return directoryPath.replace(/\/+$/, "");
}

function normalizePhotoEntry(entry, directoryPath = "./assets/photos") {
  if (typeof entry !== "string") {
    return null;
  }

  const trimmed = entry.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  if (trimmed.startsWith("./") || trimmed.startsWith("../")) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return `.${trimmed}`;
  }

  const basePath = normalizePhotoDirectoryPath(directoryPath);
  return `${basePath}/${trimmed}`;
}

function normalizePhotoList(entries, directoryPath = "./assets/photos") {
  if (!Array.isArray(entries)) {
    return [];
  }
  return entries
    .map((entry) => normalizePhotoEntry(entry, directoryPath))
    .filter((entry) => typeof entry === "string" && entry.length > 0);
}

async function loadManifestJson(filePath) {
  try {
    const response = await fetch(filePath, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
}

async function findPhotosFromDirectoryListing(directoryPath = "./assets/photos") {
  const basePath = normalizePhotoDirectoryPath(directoryPath);

  try {
    const response = await fetch(`${basePath}/`, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    const html = await response.text();
    const hrefMatches = [...html.matchAll(/href="([^"]+)"/gi)];
    if (!hrefMatches.length) {
      return [];
    }

    const found = [];
    hrefMatches.forEach((match) => {
      const href = match[1];
      if (!href) {
        return;
      }

      const cleanHref = href.split("?")[0].split("#")[0].trim();
      if (!cleanHref || cleanHref.endsWith("/")) {
        return;
      }

      const decodedName = decodeURIComponent(cleanHref).split("/").pop();
      if (!decodedName) {
        return;
      }

      const ext = decodedName.split(".").pop()?.toLowerCase();
      if (!ext || !PHOTO_EXTENSIONS.includes(ext)) {
        return;
      }

      found.push(`${basePath}/${encodeURIComponent(decodedName)}`);
    });

    return [...new Set(found)];
  } catch {
    return [];
  }
}

function getCategoryFolderPath(category) {
  const folderName = PHOTO_CATEGORY_FOLDERS[category];
  if (!folderName) {
    return null;
  }
  return `./assets/photos/${folderName}`;
}

async function findCategoryPhotoSources(category) {
  const folderPath = getCategoryFolderPath(category);
  if (!folderPath) {
    return [];
  }

  const manifestData = await loadManifestJson(`${folderPath}/photos.json`);
  if (Array.isArray(manifestData)) {
    const normalized = normalizePhotoList(manifestData, folderPath);
    if (normalized.length) {
      return [...new Set(normalized)];
    }
  }

  return findPhotosFromDirectoryListing(folderPath);
}

async function findFeaturedPhotoSources() {
  const manifestData = await loadManifestJson(`${FEATURED_PHOTOS_FOLDER}/photos.json`);
  if (Array.isArray(manifestData)) {
    const normalized = normalizePhotoList(manifestData, FEATURED_PHOTOS_FOLDER);
    if (normalized.length) {
      return [...new Set(normalized)];
    }
  }
  return findPhotosFromDirectoryListing(FEATURED_PHOTOS_FOLDER);
}

function checkImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    let settled = false;
    const timeout = setTimeout(() => done(null), ADMIN_BG_CHECK_TIMEOUT_MS);

    function done(result) {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      image.src = "";
      resolve(result);
    }

    image.onload = () => done(src);
    image.onerror = () => done(null);
    image.src = src;
  });
}

function toEncodedAssetPath(src) {
  if (typeof src !== "string" || !src.trim()) {
    return null;
  }
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) {
    return src;
  }

  const hashIndex = src.indexOf("#");
  const queryIndex = src.indexOf("?");
  const cutIndex =
    hashIndex === -1 && queryIndex === -1
      ? src.length
      : Math.min(hashIndex === -1 ? src.length : hashIndex, queryIndex === -1 ? src.length : queryIndex);
  const pathOnly = src.slice(0, cutIndex);
  const suffix = src.slice(cutIndex);
  const parts = pathOnly.split("/");
  const encodedPath = parts
    .map((part) => {
      let decoded = part;
      try {
        decoded = decodeURIComponent(part);
      } catch {
        decoded = part;
      }
      return encodeURIComponent(decoded);
    })
    .join("/");
  return `${encodedPath}${suffix}`;
}

function buildAdminBackgroundFallbackSources(rootManifestData, existingSources = []) {
  const fallback = [];
  const addUnique = (value) => {
    if (typeof value !== "string" || !value.trim()) {
      return;
    }
    if (!fallback.includes(value)) {
      fallback.push(value);
    }
  };

  existingSources.forEach((src) => {
    addUnique(src);
    const encoded = toEncodedAssetPath(src);
    if (encoded) {
      addUnique(encoded);
    }
  });

  if (Array.isArray(rootManifestData)) {
    rootManifestData.forEach((entry) => {
      if (typeof entry !== "string" || !entry.trim()) {
        return;
      }
      const normalized = normalizePhotoEntry(entry, "./assets/photos");
      if (!normalized) {
        return;
      }
      addUnique(normalized);
      const encoded = toEncodedAssetPath(normalized);
      if (encoded) {
        addUnique(encoded);
      }
    });
  }

  ADMIN_BG_STATIC_FALLBACK.forEach((src) => addUnique(src));
  return fallback;
}

async function collectAdminBackgroundSources() {
  const [byCategory, rootPhotos, featuredPhotos, rootManifestData] = await Promise.all([
    Promise.all(PHOTO_CATEGORIES.map((category) => findCategoryPhotoSources(category))),
    findPhotosFromDirectoryListing("./assets/photos"),
    findFeaturedPhotoSources(),
    loadManifestJson("./assets/photos/photos.json")
  ]);

  const rootManifestCategoryPhotos = [];
  let rootManifestFlatPhotos = [];
  if (Array.isArray(rootManifestData)) {
    rootManifestFlatPhotos = normalizePhotoList(rootManifestData, "./assets/photos");
  } else if (isPlainObject(rootManifestData)) {
    PHOTO_CATEGORIES.forEach((category) => {
      const folderPath = getCategoryFolderPath(category);
      const entries = rootManifestData[category];
      if (!folderPath || !Array.isArray(entries)) {
        return;
      }
      rootManifestCategoryPhotos.push(...normalizePhotoList(entries, folderPath));
    });
  }

  const combined = [
    ...byCategory.flat(),
    ...rootManifestCategoryPhotos,
    ...rootManifestFlatPhotos,
    ...rootPhotos,
    ...featuredPhotos
  ];
  const uniqueSources = [...new Set(combined)];
  if (!uniqueSources.length) {
    return buildAdminBackgroundFallbackSources(rootManifestData);
  }

  const checked = await Promise.all(uniqueSources.map((src) => checkImage(src)));
  const workingSources = [...new Set(checked.filter(Boolean))];
  if (workingSources.length) {
    return workingSources;
  }
  return buildAdminBackgroundFallbackSources(rootManifestData, uniqueSources);
}

function stopAdminBackgroundSlideshow() {
  if (!adminBgTimer) {
    return;
  }
  clearInterval(adminBgTimer);
  adminBgTimer = null;
}

function applyAdminBackgroundToLayer(layer, src) {
  if (!layer) {
    return;
  }
  layer.style.backgroundImage = `url("${src}")`;
}

function showAdminBackgroundAtIndex(nextIndex, nextLayerIndex) {
  const currentLayer = adminBgLayers[adminBgVisibleLayer];
  const nextLayer = adminBgLayers[nextLayerIndex];
  const safeIndex = ((nextIndex % adminBgSources.length) + adminBgSources.length) % adminBgSources.length;
  const src = adminBgSources[safeIndex];
  if (!src || !nextLayer) {
    return;
  }

  applyAdminBackgroundToLayer(nextLayer, src);
  nextLayer.classList.add("is-visible");
  if (currentLayer && currentLayer !== nextLayer) {
    currentLayer.classList.remove("is-visible");
  }
  adminBgVisibleLayer = nextLayerIndex;
  adminBgIndex = safeIndex;
}

function startAdminBackgroundSlideshow() {
  if (!adminBgLayers.length) {
    return;
  }

  if (!adminBgSources.length) {
    adminBgLayers[0].style.backgroundImage =
      "linear-gradient(135deg, rgba(28, 28, 28, 0.92), rgba(56, 56, 56, 0.88))";
    adminBgLayers[0].classList.add("is-visible");
    adminBgLayers.forEach((layer, index) => {
      if (index !== 0) {
        layer.classList.remove("is-visible");
      }
    });
    return;
  }

  stopAdminBackgroundSlideshow();

  adminBgVisibleLayer = 0;
  adminBgIndex = 0;
  applyAdminBackgroundToLayer(adminBgLayers[0], adminBgSources[0]);
  adminBgLayers[0].classList.add("is-visible");
  adminBgLayers.forEach((layer, index) => {
    if (index !== 0) {
      layer.classList.remove("is-visible");
    }
  });

  if (adminBgSources.length < 2 || adminBgLayers.length < 2) {
    return;
  }

  adminBgTimer = window.setInterval(() => {
    const nextLayerIndex = (adminBgVisibleLayer + 1) % adminBgLayers.length;
    const nextPhotoIndex = (adminBgIndex + 1) % adminBgSources.length;
    showAdminBackgroundAtIndex(nextPhotoIndex, nextLayerIndex);
  }, ADMIN_BG_ROTATION_MS);
}

async function initAdminBackgroundSlideshow() {
  if (!adminBgLayers.length) {
    return;
  }

  try {
    adminBgSources = await collectAdminBackgroundSources();
  } catch {
    adminBgSources = [...ADMIN_BG_STATIC_FALLBACK];
  }
  startAdminBackgroundSlideshow();
}

function sanitizeContentOverrides(rawOverrides) {
  const clean = {
    pl: {},
    en: {}
  };

  if (!isPlainObject(rawOverrides)) {
    return clean;
  }

  SUPPORTED_LANGUAGES.forEach((lang) => {
    const langOverrides = rawOverrides[lang];
    if (!isPlainObject(langOverrides)) {
      return;
    }

    Object.entries(langOverrides).forEach(([key, value]) => {
      if (typeof key !== "string" || !key.trim()) {
        return;
      }
      if (typeof value === "string") {
        clean[lang][key.trim()] = value;
      }
    });
  });

  return clean;
}

function getContentKeyPriority(key) {
  const priorityIndex = PRIORITY_CONTENT_KEYS.indexOf(key);
  return priorityIndex === -1 ? Number.MAX_SAFE_INTEGER : priorityIndex;
}

function humanizeContentKey(key) {
  if (typeof key !== "string" || !key.trim()) {
    return "Pole tekstowe";
  }
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function shouldIncludeContentEditorKey(key) {
  if (typeof key !== "string" || !key.trim()) {
    return false;
  }
  const safeKey = key.trim();
  const blockedPattern =
    /(^nav)|(^yt)|(^themeTo)|(^paymentMethod)|(^carrier)|(Btn$)|(Cta$)|(Submit$)|(Tab$)|(Label$)|(Aria$)|(Placeholder$)|(Subject$)|(openPhotoPrefix)/;
  if (blockedPattern.test(safeKey)) {
    return false;
  }
  const allowedPattern = /(Title$)|(Heading$)|(Lead$)|(Desc$)|(Text$)|(Kicker$)|(P1$)|(P2$)|(Hint$)/;
  return allowedPattern.test(safeKey);
}

function getContentEditorGroupId(key) {
  const safeKey = String(key || "").trim();
  if (!safeKey) {
    return "other";
  }
  if (/^hero/i.test(safeKey)) {
    return "home";
  }
  if (/^portfolio/i.test(safeKey)) {
    return "portfolio";
  }
  if (/^shop/i.test(safeKey)) {
    return "shop";
  }
  if (/^about/i.test(safeKey)) {
    return "about";
  }
  if (/^contact/i.test(safeKey)) {
    return "contact";
  }
  if (/^blog/i.test(safeKey)) {
    return "blog";
  }
  if (/^(maintenance|footer)/i.test(safeKey)) {
    return "system";
  }
  return "other";
}

function getContentEditorGroupLabel(groupId) {
  const group = CONTENT_EDITOR_GROUPS.find((entry) => entry.id === groupId);
  return group?.label || "Inne";
}

function getAllEditableContentKeys() {
  const keys = new Set([...PRIORITY_CONTENT_KEYS, ...staticContentFieldKeys]);

  SUPPORTED_LANGUAGES.forEach((lang) => {
    const defaults = isPlainObject(baseContent[lang]) ? baseContent[lang] : {};
    Object.keys(defaults).forEach((key) => {
      if (typeof key === "string" && key.trim()) {
        keys.add(key.trim());
      }
    });

    const overrides = isPlainObject(siteSettings.contentOverrides?.[lang])
      ? siteSettings.contentOverrides[lang]
      : {};
    Object.keys(overrides).forEach((key) => {
      if (typeof key === "string" && key.trim()) {
        keys.add(key.trim());
      }
    });
  });

  return [...keys]
    .filter((key) => shouldIncludeContentEditorKey(key))
    .sort((left, right) => {
      const leftGroup = getContentEditorGroupId(left);
      const rightGroup = getContentEditorGroupId(right);
      const leftGroupIndex = CONTENT_EDITOR_GROUP_INDEX[leftGroup] ?? Number.MAX_SAFE_INTEGER;
      const rightGroupIndex = CONTENT_EDITOR_GROUP_INDEX[rightGroup] ?? Number.MAX_SAFE_INTEGER;
      if (leftGroupIndex !== rightGroupIndex) {
        return leftGroupIndex - rightGroupIndex;
      }
      const priorityDiff = getContentKeyPriority(left) - getContentKeyPriority(right);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      return left.localeCompare(right, "pl", { sensitivity: "base" });
    });
}

function getMergedEditableContent(lang) {
  const language = SUPPORTED_LANGUAGES.includes(lang) ? lang : "pl";
  const defaults = isPlainObject(baseContent[language]) ? baseContent[language] : {};
  const overrides = isPlainObject(siteSettings.contentOverrides?.[language])
    ? siteSettings.contentOverrides[language]
    : {};

  const merged = {};
  Object.entries(defaults).forEach(([key, value]) => {
    if (typeof key === "string" && key.trim() && typeof value === "string") {
      merged[key.trim()] = value;
    }
  });
  Object.entries(overrides).forEach(([key, value]) => {
    if (typeof key === "string" && key.trim() && typeof value === "string") {
      merged[key.trim()] = value;
    }
  });
  return merged;
}

function createDynamicContentField(key) {
  const wrapper = document.createElement("div");
  wrapper.className = "admin-content-field";
  wrapper.dataset.contentKey = key;
  const friendlyLabel = humanizeContentKey(key);
  wrapper.dataset.searchText = `${key} ${friendlyLabel}`.toLowerCase();

  const inputId = `admin-content-dynamic-${key.replace(/[^a-z0-9_-]/gi, "-").toLowerCase()}`;
  const label = document.createElement("label");
  label.setAttribute("for", inputId);
  label.textContent = `${friendlyLabel} (${key})`;

  const textarea = document.createElement("textarea");
  textarea.id = inputId;
  textarea.name = `content-dynamic-${key}`;
  textarea.rows = 3;
  textarea.required = false;

  wrapper.append(label, textarea);
  return { wrapper, input: textarea };
}

function createContentEditorGroupElement(groupId) {
  const section = document.createElement("section");
  section.className = "admin-content-group";
  section.dataset.group = groupId;

  const heading = document.createElement("h3");
  heading.className = "admin-content-group-title";
  heading.textContent = getContentEditorGroupLabel(groupId);

  const fieldsWrap = document.createElement("div");
  fieldsWrap.className = "admin-content-group-fields";

  section.append(heading, fieldsWrap);
  return { section, fieldsWrap };
}

function applyContentSearchFilter() {
  if (!contentAllFieldsContainerEl) {
    return;
  }
  const query = String(contentSearchInputEl?.value || "").trim().toLowerCase();
  const fields = contentAllFieldsContainerEl.querySelectorAll(".admin-content-field");
  fields.forEach((field) => {
    if (!query) {
      field.hidden = false;
      return;
    }
    const haystack = String(field.dataset.searchText || "").toLowerCase();
    field.hidden = !haystack.includes(query);
  });

  const groups = contentAllFieldsContainerEl.querySelectorAll(".admin-content-group");
  groups.forEach((group) => {
    const visibleFields = group.querySelectorAll(".admin-content-field:not([hidden])");
    group.hidden = visibleFields.length === 0;
  });
}

function rebuildContentFieldRegistry() {
  contentFieldElements.clear();

  Object.entries(staticContentFieldBindings).forEach(([key, input]) => {
    if (!input) {
      return;
    }
    input.required = false;
    contentFieldElements.set(key, input);
  });

  if (contentAllFieldsContainerEl) {
    contentAllFieldsContainerEl.innerHTML = "";
  }

  const allKeys = getAllEditableContentKeys();
  const staticKeys = new Set(contentFieldElements.keys());
  const dynamicKeys = allKeys.filter((key) => !staticKeys.has(key));
  const groupMap = new Map();
  dynamicKeys.forEach((key) => {
    if (!contentAllFieldsContainerEl) {
      return;
    }
    const groupId = getContentEditorGroupId(key);
    let groupElements = groupMap.get(groupId);
    if (!groupElements) {
      groupElements = createContentEditorGroupElement(groupId);
      groupMap.set(groupId, groupElements);
      contentAllFieldsContainerEl.append(groupElements.section);
    }
    const { wrapper, input } = createDynamicContentField(key);
    groupElements.fieldsWrap.append(wrapper);
    contentFieldElements.set(key, input);
  });

  currentContentFieldKeys = allKeys.filter((key) => contentFieldElements.has(key));
  applyContentSearchFilter();
}

function readContentEditorValues() {
  const values = {};
  currentContentFieldKeys.forEach((key) => {
    const input = contentFieldElements.get(key);
    if (!input) {
      return;
    }
    values[key] = String(input.value ?? "");
  });
  return values;
}

function sanitizeEnabledCategories(rawEnabledCategories) {
  const defaults = createDefaultEnabledCategories();
  if (!isPlainObject(rawEnabledCategories)) {
    return defaults;
  }

  PHOTO_CATEGORIES.forEach((category) => {
    if (Object.prototype.hasOwnProperty.call(rawEnabledCategories, category)) {
      defaults[category] = Boolean(rawEnabledCategories[category]);
    }
  });
  return defaults;
}

function hasAnyCategoryFlag(rawCategorySettings) {
  if (!isPlainObject(rawCategorySettings)) {
    return false;
  }
  return PHOTO_CATEGORIES.some((category) =>
    Object.prototype.hasOwnProperty.call(rawCategorySettings, category)
  );
}

function normalizeSiteSettings(rawSettings) {
  const fallbackEnabled = sanitizeEnabledCategories(DEFAULT_SITE_SETTINGS.enabledCategories);
  if (!isPlainObject(rawSettings)) {
    return {
      ...DEFAULT_SITE_SETTINGS,
      enabledCategories: fallbackEnabled,
      shopCategories: sanitizeEnabledCategories(DEFAULT_SITE_SETTINGS.shopCategories),
      portfolioCategories: sanitizeEnabledCategories(DEFAULT_SITE_SETTINGS.portfolioCategories),
      contentOverrides: sanitizeContentOverrides(DEFAULT_SITE_SETTINGS.contentOverrides)
    };
  }

  const legacyEnabled = sanitizeEnabledCategories(rawSettings.enabledCategories);
  const shopCategories = hasAnyCategoryFlag(rawSettings.shopCategories)
    ? sanitizeEnabledCategories(rawSettings.shopCategories)
    : sanitizeEnabledCategories(legacyEnabled);
  const portfolioCategories = hasAnyCategoryFlag(rawSettings.portfolioCategories)
    ? sanitizeEnabledCategories(rawSettings.portfolioCategories)
    : sanitizeEnabledCategories(legacyEnabled);

  return {
    ...DEFAULT_SITE_SETTINGS,
    ...rawSettings,
    blogEnabled: rawSettings.blogEnabled !== false,
    bookingEnabled: rawSettings.bookingEnabled !== false,
    maintenanceMode: Boolean(rawSettings.maintenanceMode),
    enabledCategories: legacyEnabled,
    shopCategories,
    portfolioCategories,
    contentOverrides: sanitizeContentOverrides(rawSettings.contentOverrides)
  };
}

function readStoredSiteSettings() {
  try {
    const raw = localStorage.getItem(SITE_SETTINGS_STORAGE_KEY);
    if (!raw) {
      return normalizeSiteSettings(DEFAULT_SITE_SETTINGS);
    }
    return normalizeSiteSettings(JSON.parse(raw));
  } catch {
    return normalizeSiteSettings(DEFAULT_SITE_SETTINGS);
  }
}

function mergeSettingsWithCategoryFallback(rawSettings, categoryFallback) {
  const normalized = normalizeSiteSettings(rawSettings);
  const safeFallback = normalizeSiteSettings(categoryFallback);
  const hasBlogEnabled = isPlainObject(rawSettings)
    && Object.prototype.hasOwnProperty.call(rawSettings, "blogEnabled");
  const hasBookingEnabled = isPlainObject(rawSettings)
    && Object.prototype.hasOwnProperty.call(rawSettings, "bookingEnabled");
  const hasMaintenanceMode = isPlainObject(rawSettings)
    && Object.prototype.hasOwnProperty.call(rawSettings, "maintenanceMode");
  if (!isPlainObject(rawSettings)) {
    normalized.blogEnabled = safeFallback.blogEnabled !== false;
    normalized.bookingEnabled = safeFallback.bookingEnabled !== false;
    normalized.maintenanceMode = Boolean(safeFallback.maintenanceMode);
    normalized.enabledCategories = sanitizeEnabledCategories(safeFallback.enabledCategories);
    normalized.shopCategories = sanitizeEnabledCategories(safeFallback.shopCategories);
    normalized.portfolioCategories = sanitizeEnabledCategories(safeFallback.portfolioCategories);
    return normalized;
  }
  if (!hasBlogEnabled) {
    normalized.blogEnabled = safeFallback.blogEnabled !== false;
  }
  if (!hasBookingEnabled) {
    normalized.bookingEnabled = safeFallback.bookingEnabled !== false;
  }
  if (!hasMaintenanceMode) {
    normalized.maintenanceMode = Boolean(safeFallback.maintenanceMode);
  }

  const hasLegacy = isPlainObject(rawSettings.enabledCategories);
  const hasShop = hasAnyCategoryFlag(rawSettings.shopCategories);
  const hasPortfolio = hasAnyCategoryFlag(rawSettings.portfolioCategories);

  if (!hasLegacy) {
    normalized.enabledCategories = sanitizeEnabledCategories(safeFallback.enabledCategories);
  }
  if (!hasShop) {
    normalized.shopCategories = hasLegacy
      ? sanitizeEnabledCategories(rawSettings.enabledCategories)
      : sanitizeEnabledCategories(safeFallback.shopCategories);
  }
  if (!hasPortfolio) {
    normalized.portfolioCategories = hasLegacy
      ? sanitizeEnabledCategories(rawSettings.enabledCategories)
      : sanitizeEnabledCategories(safeFallback.portfolioCategories);
  }

  if (!hasLegacy && (hasShop || hasPortfolio)) {
    normalized.enabledCategories = sanitizeEnabledCategories(
      hasShop ? normalized.shopCategories : normalized.portfolioCategories
    );
  }

  if (hasShop && hasPortfolio && hasLegacy) {
    return normalized;
  }
  return normalized;
}

function setAuthToken(token) {
  authToken = token || "";
  if (authToken) {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, authToken);
  } else {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  }
}

function isLoggedIn() {
  return Boolean(authToken);
}

function requireAdminAuth() {
  if (isLoggedIn()) {
    return true;
  }
  showPanel(false);
  setFeedback("Najpierw zaloguj się do panelu.", true);
  return false;
}

function setPanelControlsEnabled(isEnabled) {
  if (!panelEl) {
    return;
  }
  const controls = panelEl.querySelectorAll("button, input, textarea, select");
  controls.forEach((control) => {
    control.disabled = !isEnabled;
  });
}

function showPanel(isVisible) {
  if (loginFormEl) {
    loginFormEl.hidden = isVisible;
  }
  if (loginLeadEl) {
    loginLeadEl.hidden = isVisible;
  }
  if (panelEl) {
    panelEl.hidden = !isVisible;
  }
  setPanelControlsEnabled(isVisible);
}

function setActiveTab(nextTab) {
  activeTab = nextTab;

  adminTabButtons.forEach((button) => {
    const isActive = button.dataset.adminTab === nextTab;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  adminTabPanels.forEach((panel) => {
    panel.hidden = panel.dataset.adminPanel !== nextTab;
  });
}

function setActiveInboxFilter(nextFilter) {
  activeInboxFilter = ["all", "booking", "inquiry"].includes(nextFilter)
    ? nextFilter
    : "all";

  inboxFilterButtons.forEach((button) => {
    const isActive = button.dataset.inboxFilter === activeInboxFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderInbox();
}

function setActiveContentLanguage(lang) {
  activeContentLanguage = SUPPORTED_LANGUAGES.includes(lang) ? lang : "pl";

  contentLangButtons.forEach((button) => {
    const isActive = button.dataset.adminLang === activeContentLanguage;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  rebuildContentFieldRegistry();
  const merged = getMergedEditableContent(activeContentLanguage);
  currentContentFieldKeys.forEach((key) => {
    const input = contentFieldElements.get(key);
    if (!input) {
      return;
    }
    input.value = String(merged[key] ?? "");
  });
  applyContentSearchFilter();
}

function initializeSettingsForm() {
  if (shopEnabledInputEl) {
    shopEnabledInputEl.checked = siteSettings.shopEnabled !== false;
  }
  if (blogEnabledInputEl) {
    blogEnabledInputEl.checked = siteSettings.blogEnabled !== false;
  }
  if (bookingEnabledInputEl) {
    bookingEnabledInputEl.checked = siteSettings.bookingEnabled !== false;
  }
  if (maintenanceModeInputEl) {
    maintenanceModeInputEl.checked = siteSettings.maintenanceMode === true;
  }

  const portfolioCategories = sanitizeEnabledCategories(siteSettings.portfolioCategories);
  PHOTO_CATEGORIES.forEach((category) => {
    const input = portfolioCategorySettingInputs[category];
    if (!input) {
      return;
    }
    input.checked = portfolioCategories[category] !== false;
  });

  const shopCategories = sanitizeEnabledCategories(siteSettings.shopCategories);
  PHOTO_CATEGORIES.forEach((category) => {
    const input = shopCategorySettingInputs[category];
    if (!input) {
      return;
    }
    input.checked = shopCategories[category] !== false;
  });
}

function formatMessageDate(value) {
  const timestamp = new Date(String(value || ""));
  if (Number.isNaN(timestamp.getTime())) {
    return "Brak daty";
  }
  return timestamp.toLocaleString("pl-PL");
}

function formatAdminPaymentMethod(value) {
  const map = {
    card: "Karta kredytowa",
    apple_pay: "Apple Pay",
    google_pay: "Google Pay",
    paypal: "PayPal",
    blik: "BLIK",
    bitcoin: "Bitcoin",
    ethereum: "Ethereum"
  };
  return map[value] || value || "-";
}

function formatAdminCarrier(value) {
  const map = {
    inpost_courier: "InPost Kurier",
    dpd: "DPD",
    dhl: "DHL",
    ups: "UPS",
    fedex: "FedEx"
  };
  return map[value] || value || "-";
}

function formatAdminShippingMethod(value) {
  if (value === "courier") {
    return "Kurier";
  }
  return value || "Kurier";
}

function formatAdminPaymentStatus(value) {
  const map = {
    paid: "Opłacone",
    awaiting_payment: "Oczekuje na płatność",
    creating_payment: "Tworzenie płatności",
    payment_cancelled: "Anulowane",
    payment_failed: "Płatność nieudana",
    payment_init_failed: "Błąd inicjalizacji",
    manual_pending: "Ręczne / oczekuje"
  };
  return map[value] || value || "-";
}

function renderInbox() {
  if (!inboxListEl || !inboxEmptyEl) {
    return;
  }

  const filtered =
    activeInboxFilter === "all"
      ? inboxMessages
      : inboxMessages.filter((entry) => entry.type === activeInboxFilter);

  inboxListEl.innerHTML = "";
  inboxEmptyEl.hidden = filtered.length > 0;

  if (!filtered.length) {
    return;
  }

  const fragment = document.createDocumentFragment();
  filtered.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "admin-message-card";

    const header = document.createElement("div");
    header.className = "admin-message-header";

    const title = document.createElement("h3");
    title.textContent = entry.type === "booking" ? "Umów sesję" : "Spytaj o dostępność";

    const date = document.createElement("time");
    date.textContent = formatMessageDate(entry.createdAt);

    header.append(title, date);

    const body = document.createElement("div");
    body.className = "admin-message-body";

    const lines = [];
    if (entry.type === "booking") {
      lines.push(["Imię", entry.name || "-"]);
      lines.push(["E-mail", entry.email || "-"]);
      lines.push(["Wiadomość", entry.message || "-"]);
    } else {
      lines.push(["Zdjęcie", entry.photoLabel || entry.photo || "-"]);
      lines.push(["Rozmiar", entry.size || "-"]);
      lines.push(["E-mail", entry.email || "-"]);
      lines.push(["Wiadomość", entry.message || "-"]);
    }

    lines.push(["Język", entry.language || "pl"]);

    lines.forEach(([label, value]) => {
      const row = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = `${label}: `;
      row.append(strong, document.createTextNode(String(value)));
      body.append(row);
    });

    card.append(header, body);
    fragment.append(card);
  });

  inboxListEl.append(fragment);
}

function renderOrders() {
  if (!ordersListEl || !ordersEmptyEl) {
    return;
  }

  ordersListEl.innerHTML = "";
  ordersEmptyEl.hidden = orders.length > 0;

  if (!orders.length) {
    return;
  }

  const fragment = document.createDocumentFragment();
  orders.forEach((order) => {
    const card = document.createElement("article");
    card.className = "admin-message-card";

    const header = document.createElement("div");
    header.className = "admin-message-header";

    const title = document.createElement("h3");
    title.textContent = "Zamówienie";

    const date = document.createElement("time");
    date.textContent = formatMessageDate(order.createdAt);
    header.append(title, date);

    const body = document.createElement("div");
    body.className = "admin-message-body";

    const lines = [
      ["Zdjęcie", order.photoLabel || order.photo || "-"],
      ["Rozmiar", order.size || "-"],
      ["Cena", order.priceLabel || "-"],
      ["Imię", order.firstName || order.name || "-"],
      ["Nazwisko", order.lastName || "-"],
      ["E-mail", order.email || "-"],
      ["Telefon", order.phone || "-"],
      ["Miasto", order.city || "-"],
      ["Kod pocztowy", order.postalCode || "-"],
      ["Ulica / mieszkanie", order.streetAddress || "-"],
      [
        "Płatność",
        order.paymentMethodLabel || formatAdminPaymentMethod(order.paymentMethod)
      ],
      ["Status płatności", formatAdminPaymentStatus(order.paymentStatus)],
      ["Operator płatności", order.paymentProvider || "-"],
      ["ID płatności", order.paymentReference || "-"],
      ["Wysyłka", formatAdminShippingMethod(order.shippingMethod)],
      ["Przewoźnik", order.carrierLabel || formatAdminCarrier(order.carrier)],
      [
        "Adres (całość)",
        order.address ||
          [order.streetAddress || "", `${order.postalCode || ""} ${order.city || ""}`.trim()]
            .filter(Boolean)
            .join(", ") ||
          "-"
      ],
      ["Uwagi", order.message || "-"],
      ["Język", order.language || "pl"]
    ];

    lines.forEach(([label, value]) => {
      const row = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = `${label}: `;
      row.append(strong, document.createTextNode(String(value)));
      body.append(row);
    });

    card.append(header, body);
    fragment.append(card);
  });

  ordersListEl.append(fragment);
}

function renderUsers() {
  if (!usersListEl || !usersEmptyEl) {
    return;
  }

  usersListEl.innerHTML = "";
  usersEmptyEl.hidden = users.length > 0;
  if (usersSourceEl) {
    usersSourceEl.textContent =
      `Konta są zapisywane w folderze ${usersSourceFolder} (plik ${usersSourceFile}).`;
  }

  if (!users.length) {
    return;
  }

  const fragment = document.createDocumentFragment();
  users.forEach((user) => {
    const card = document.createElement("article");
    card.className = "admin-message-card";

    const header = document.createElement("div");
    header.className = "admin-message-header";

    const title = document.createElement("h3");
    title.textContent = user.displayName || "Użytkownik";

    const date = document.createElement("time");
    date.textContent = formatMessageDate(user.createdAt);
    header.append(title, date);

    const body = document.createElement("div");
    body.className = "admin-message-body";

    const lines = [
      ["ID", user.id || "-"],
      ["E-mail", user.email || "-"]
    ];

    lines.forEach(([label, value]) => {
      const row = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = `${label}: `;
      row.append(strong, document.createTextNode(String(value)));
      body.append(row);
    });

    card.append(header, body);
    fragment.append(card);
  });

  usersListEl.append(fragment);
}

async function apiRequest(path, options = {}) {
  if (window.location.protocol === "file:") {
    return {
      ok: false,
      status: 0,
      error: "Uruchom stronę przez serwer (http://), a nie z pliku."
    };
  }

  const method = options.method || "GET";
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (options.auth !== false && authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, {
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

function parseGoogleTranslationResponse(payload) {
  if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
    return "";
  }
  return payload[0]
    .map((part) => (Array.isArray(part) ? String(part[0] || "") : ""))
    .join("")
    .trim();
}

async function translateTextWithGoogleInBrowser(text, sourceLanguage = "pl", targetLanguage = "en") {
  const rawText = String(text ?? "");
  if (!rawText.trim()) {
    return "";
  }

  const params = new URLSearchParams({
    client: "gtx",
    sl: sourceLanguage,
    tl: targetLanguage,
    dt: "t",
    q: rawText
  });

  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?${params.toString()}`,
    { method: "GET" }
  );
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  return parseGoogleTranslationResponse(data);
}

async function translatePolishContentToEnglishInBrowser(contentValues) {
  const payload = {};
  Object.entries(contentValues || {}).forEach(([key, value]) => {
    if (typeof key !== "string" || !key.trim()) {
      return;
    }
    payload[key.trim()] = String(value ?? "");
  });

  const translatedValues = {};
  for (const [key, value] of Object.entries(payload)) {
    translatedValues[key] = await translateTextWithGoogleInBrowser(
      value,
      "pl",
      "en"
    );
  }
  return translatedValues;
}

async function translatePolishContentToEnglish(contentValues) {
  const payload = {};
  Object.entries(contentValues || {}).forEach(([key, value]) => {
    if (typeof key !== "string" || !key.trim()) {
      return;
    }
    payload[key.trim()] = String(value ?? "");
  });

  const result = await apiRequest("/admin/translate-content", {
    method: "POST",
    body: {
      sourceLanguage: "pl",
      targetLanguage: "en",
      content: payload
    }
  });

  if (result.ok) {
    const translatedContent = result.data?.content;
    if (!isPlainObject(translatedContent)) {
      setFeedback("Nie udało się odczytać automatycznego tłumaczenia.", true);
      return null;
    }

    const translatedValues = {};
    Object.keys(payload).forEach((key) => {
      translatedValues[key] = String(translatedContent[key] ?? "");
    });
    return translatedValues;
  }

  const fallbackReason = String(result.error || "").toLowerCase();
  const canUseBrowserFallback = result.status === 404 || fallbackReason.includes("not found");
  if (canUseBrowserFallback) {
    try {
      return await translatePolishContentToEnglishInBrowser(payload);
    } catch {
      setFeedback(
        "Nie udało się automatycznie przetłumaczyć treści (endpoint API nie został znaleziony).",
        true
      );
      return null;
    }
  }

  setFeedback(result.error || "Nie udało się automatycznie przetłumaczyć treści.", true);
  return null;
}

async function loadBaseContent() {
  const requests = SUPPORTED_LANGUAGES.map(async (lang) => {
    try {
      const response = await fetch(`./assets/content/${lang}.json`, { cache: "no-store" });
      if (!response.ok) {
        return [lang, {}];
      }
      const data = await response.json();
      return [lang, isPlainObject(data) ? data : {}];
    } catch {
      return [lang, {}];
    }
  });

  const entries = await Promise.all(requests);
  baseContent = Object.fromEntries(entries);
}

async function loadAdminData() {
  if (!requireAdminAuth()) {
    return {
      ok: false,
      status: 401,
      error: "Brak autoryzacji."
    };
  }

  const [settingsResult, inboxResult, ordersResult, usersResult] = await Promise.all([
    apiRequest("/admin/settings"),
    apiRequest("/admin/inbox"),
    apiRequest("/admin/orders"),
    apiRequest("/admin/users")
  ]);

  if (!settingsResult.ok) {
    return settingsResult;
  }

  const storedSettings = readStoredSiteSettings();
  siteSettings = mergeSettingsWithCategoryFallback(
    settingsResult.data?.settings,
    storedSettings
  );
  try {
    localStorage.setItem(SITE_SETTINGS_STORAGE_KEY, JSON.stringify(siteSettings));
  } catch {
    // ignore
  }

  inboxMessages = Array.isArray(inboxResult.data?.messages)
    ? inboxResult.data.messages
    : [];
  orders = Array.isArray(ordersResult.data?.orders)
    ? ordersResult.data.orders
    : [];
  users = Array.isArray(usersResult.data?.users) ? usersResult.data.users : [];
  usersSourceFile =
    typeof usersResult.data?.sourceFile === "string" && usersResult.data.sourceFile.trim()
      ? usersResult.data.sourceFile.trim()
      : "data/users/accounts.json";
  usersSourceFolder =
    typeof usersResult.data?.sourceFolder === "string" && usersResult.data.sourceFolder.trim()
      ? usersResult.data.sourceFolder.trim()
      : "data/users";

  initializeSettingsForm();
  setActiveContentLanguage(activeContentLanguage);
  renderInbox();
  renderOrders();
  renderUsers();

  return { ok: true };
}

async function handleLoginSubmit(event) {
  event.preventDefault();

  const password = String(passwordInputEl?.value || "").trim();
  if (!password) {
    setFeedback("Podaj hasło.", true);
    return;
  }

  const result = await apiRequest("/admin/login", {
    method: "POST",
    auth: false,
    body: { password }
  });

  if (!result.ok || !result.data?.token) {
    setFeedback(result.error || "Nieprawidłowe hasło.", true);
    return;
  }

  setAuthToken(result.data.token);
  showPanel(true);
  if (passwordInputEl) {
    passwordInputEl.value = "";
  }

  const loadResult = await loadAdminData();
  if (!loadResult.ok) {
    setAuthToken("");
    showPanel(false);
    setFeedback(loadResult.error || "Nie udało się pobrać danych panelu.", true);
    return;
  }

  setActiveTab(activeTab);
  setFeedback("Zalogowano.");
}

async function saveSiteSettings() {
  if (!requireAdminAuth()) {
    return false;
  }

  const requestedCategorySettings = normalizeSiteSettings(siteSettings);
  const result = await apiRequest("/admin/settings", {
    method: "PUT",
    body: siteSettings
  });

  if (!result.ok) {
    setFeedback(result.error || "Nie udało się zapisać ustawień.", true);
    return false;
  }

  siteSettings = mergeSettingsWithCategoryFallback(
    result.data?.settings,
    requestedCategorySettings
  );
  try {
    localStorage.setItem(SITE_SETTINGS_STORAGE_KEY, JSON.stringify(siteSettings));
  } catch {
    // ignore
  }

  initializeSettingsForm();
  setActiveContentLanguage(activeContentLanguage);
  return true;
}

async function handleSettingsSubmit(event) {
  event.preventDefault();
  if (!requireAdminAuth()) {
    return;
  }
  if (!shopEnabledInputEl) {
    return;
  }

  const portfolioCategories = sanitizeEnabledCategories(siteSettings.portfolioCategories);
  PHOTO_CATEGORIES.forEach((category) => {
    const input = portfolioCategorySettingInputs[category];
    if (input) {
      portfolioCategories[category] = input.checked;
    }
  });

  const shopCategories = sanitizeEnabledCategories(siteSettings.shopCategories);
  PHOTO_CATEGORIES.forEach((category) => {
    const input = shopCategorySettingInputs[category];
    if (input) {
      shopCategories[category] = input.checked;
    }
  });

  siteSettings = {
    ...siteSettings,
    shopEnabled: shopEnabledInputEl.checked,
    blogEnabled: blogEnabledInputEl?.checked !== false,
    bookingEnabled: bookingEnabledInputEl?.checked !== false,
    maintenanceMode: maintenanceModeInputEl?.checked === true,
    enabledCategories: sanitizeEnabledCategories(portfolioCategories),
    shopCategories,
    portfolioCategories
  };

  const ok = await saveSiteSettings();
  if (ok) {
    setFeedback("Ustawienia zostały zapisane.");
  }
}

async function handleContentSubmit(event) {
  event.preventDefault();
  if (!requireAdminAuth()) {
    return;
  }

  if (!currentContentFieldKeys.length) {
    rebuildContentFieldRegistry();
  }
  if (!currentContentFieldKeys.length) {
    setFeedback("Brak pól treści do edycji.", true);
    return;
  }

  const values = readContentEditorValues();

  const defaults = isPlainObject(baseContent[activeContentLanguage])
    ? baseContent[activeContentLanguage]
    : {};
  const nextOverrides = sanitizeContentOverrides(siteSettings.contentOverrides);
  const langOverrides = {
    ...nextOverrides[activeContentLanguage]
  };

  Object.keys(values).forEach((key) => {
    const defaultValue = typeof defaults[key] === "string" ? defaults[key] : "";
    const userValue = String(values[key] ?? "");
    if (userValue === defaultValue) {
      delete langOverrides[key];
    } else {
      langOverrides[key] = userValue;
    }
  });
  nextOverrides[activeContentLanguage] = langOverrides;

  let translatedEnApplied = false;
  let translatedEnFailed = false;
  if (activeContentLanguage === "pl" && autoTranslateContentEnabled) {
    const translatedEnValues = await translatePolishContentToEnglish(values);
    if (!translatedEnValues) {
      translatedEnFailed = true;
    } else {
      const defaultsEn = isPlainObject(baseContent.en) ? baseContent.en : {};
      const enOverrides = {
        ...nextOverrides.en
      };

      Object.keys(values).forEach((key) => {
        const translatedValue = String(translatedEnValues[key] ?? "");
        const defaultValueEn = typeof defaultsEn[key] === "string" ? defaultsEn[key] : "";
        if (translatedValue === defaultValueEn) {
          delete enOverrides[key];
        } else {
          enOverrides[key] = translatedValue;
        }
      });

      nextOverrides.en = enOverrides;
      translatedEnApplied = true;
    }
  }

  siteSettings = {
    ...siteSettings,
    contentOverrides: nextOverrides
  };

  const ok = await saveSiteSettings();
  if (ok) {
    if (translatedEnApplied) {
      setFeedback("Treści zostały zapisane. Wersja angielska została zaktualizowana automatycznie.");
    } else if (translatedEnFailed) {
      setFeedback("Treści PL zostały zapisane, ale automatyczne tłumaczenie EN się nie powiodło.", true);
    } else {
      setFeedback("Treści zostały zapisane.");
    }
  }
}

async function handleResetContent() {
  if (!requireAdminAuth()) {
    return;
  }

  const nextOverrides = sanitizeContentOverrides(siteSettings.contentOverrides);
  nextOverrides[activeContentLanguage] = {};
  siteSettings = {
    ...siteSettings,
    contentOverrides: nextOverrides
  };

  const ok = await saveSiteSettings();
  if (ok) {
    setFeedback("Przywrócono domyślne treści dla wybranego języka.");
  }
}

async function handlePasswordChange(event) {
  event.preventDefault();
  if (!requireAdminAuth()) {
    return;
  }
  if (!passwordFormEl) {
    return;
  }

  const formData = new FormData(passwordFormEl);
  const currentPassword = String(formData.get("currentPassword") || "").trim();
  const newPassword = String(formData.get("newPassword") || "").trim();
  const repeatPassword = String(formData.get("repeatPassword") || "").trim();

  if (!currentPassword || !newPassword || !repeatPassword) {
    setFeedback("Uzupełnij wszystkie pola hasła.", true);
    return;
  }
  if (newPassword.length < 6) {
    setFeedback("Nowe hasło musi mieć min. 6 znaków.", true);
    return;
  }
  if (newPassword !== repeatPassword) {
    setFeedback("Nowe hasła nie są takie same.", true);
    return;
  }

  const result = await apiRequest("/admin/password", {
    method: "POST",
    body: {
      currentPassword,
      newPassword
    }
  });

  if (!result.ok) {
    setFeedback(result.error || "Nie udało się zmienić hasła.", true);
    return;
  }

  passwordFormEl.reset();
  setFeedback("Hasło zostało zmienione.");
}

async function handleClearInbox() {
  if (!requireAdminAuth()) {
    return;
  }

  const result = await apiRequest("/admin/inbox", { method: "DELETE" });
  if (!result.ok) {
    setFeedback(result.error || "Nie udało się wyczyścić wiadomości.", true);
    return;
  }

  inboxMessages = [];
  renderInbox();
  setFeedback("Wiadomości zostały wyczyszczone.");
}

async function handleClearOrders() {
  if (!requireAdminAuth()) {
    return;
  }

  const result = await apiRequest("/admin/orders", { method: "DELETE" });
  if (!result.ok) {
    setFeedback(result.error || "Nie udało się wyczyścić zamówień.", true);
    return;
  }

  orders = [];
  renderOrders();
  setFeedback("Zamówienia zostały wyczyszczone.");
}

async function handleLogout() {
  if (!isLoggedIn()) {
    showPanel(false);
    return;
  }

  await apiRequest("/admin/logout", { method: "POST" });
  setAuthToken("");
  showPanel(false);
  setFeedback("Wylogowano.");
}

function attachEventListeners() {
  if (loginFormEl) {
    loginFormEl.addEventListener("submit", (event) => {
      void handleLoginSubmit(event);
    });
  }

  if (settingsFormEl) {
    settingsFormEl.addEventListener("submit", (event) => {
      void handleSettingsSubmit(event);
    });
  }

  if (contentFormEl) {
    contentFormEl.addEventListener("submit", (event) => {
      void handleContentSubmit(event);
    });
  }

  if (autoTranslateContentInputEl) {
    autoTranslateContentInputEl.addEventListener("change", () => {
      autoTranslateContentEnabled = autoTranslateContentInputEl.checked;
      saveAutoTranslateContentSetting();
    });
  }

  if (resetContentBtnEl) {
    resetContentBtnEl.addEventListener("click", () => {
      void handleResetContent();
    });
  }

  if (contentSearchInputEl) {
    contentSearchInputEl.addEventListener("input", () => {
      applyContentSearchFilter();
    });
  }

  if (passwordFormEl) {
    passwordFormEl.addEventListener("submit", (event) => {
      void handlePasswordChange(event);
    });
  }

  if (logoutBtnEl) {
    logoutBtnEl.addEventListener("click", () => {
      void handleLogout();
    });
  }

  adminTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!requireAdminAuth()) {
        return;
      }
      setActiveTab(button.dataset.adminTab || "settings");
    });
  });

  contentLangButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!requireAdminAuth()) {
        return;
      }
      setActiveContentLanguage(button.dataset.adminLang || "pl");
    });
  });

  inboxFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!requireAdminAuth()) {
        return;
      }
      setActiveInboxFilter(button.dataset.inboxFilter || "all");
    });
  });

  if (clearInboxBtnEl) {
    clearInboxBtnEl.addEventListener("click", () => {
      void handleClearInbox();
    });
  }

  if (clearOrdersBtnEl) {
    clearOrdersBtnEl.addEventListener("click", () => {
      void handleClearOrders();
    });
  }

  window.addEventListener("focus", () => {
    if (!isLoggedIn()) {
      return;
    }
    void loadAdminData();
  });
}

async function initAdminPanel() {
  void initAdminBackgroundSlideshow();
  initializeAutoTranslateContentSetting();
  attachEventListeners();
  await loadBaseContent();
  // Always start from login view: admin features stay hidden until explicit login.
  setAuthToken("");
  showPanel(false);
  setActiveTab("settings");
}

void initAdminPanel();
