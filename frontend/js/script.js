const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const themeToggleBtn = document.getElementById("theme-toggle");
const langButtons = Array.from(
  document.querySelectorAll(".lang-flag[data-lang]")
);
const modalEl = document.getElementById("photo-modal");
const modalImageEl = document.getElementById("modal-image");
const modalCloseBtn = document.getElementById("modal-close");
const modalHintEl = document.getElementById("modal-hint");
const musicToggleBtn = document.getElementById("music-toggle");
const modalAudioEl = document.getElementById("modal-audio");
const brandLogoEl = document.getElementById("brand-logo");
const faviconEl = document.getElementById("site-favicon");
const faviconShortcutEl = document.getElementById("site-favicon-shortcut");
const faviconAppleEl = document.getElementById("site-favicon-apple");
const bgVideoEl = document.getElementById("bg-video");
const shopGridEl = document.getElementById("shop-grid");
const shopFeaturedGridEl = document.getElementById("shop-featured-grid");
const shopEmptyEl = document.getElementById("shop-empty");
const shopCtaEl = document.getElementById("shop-cta");
const shopTabButtons = Array.from(
  document.querySelectorAll(".shop-tab[data-shop-tab]")
);
const portfolioTabButtons = Array.from(
  document.querySelectorAll(".portfolio-tab[data-portfolio-tab]")
);
const inquiryModalEl = document.getElementById("inquiry-modal");
const inquiryFormEl = document.getElementById("inquiry-form");
const inquiryCloseBtn = document.getElementById("inquiry-close");
const inquiryPhotoInput = document.getElementById("inquiry-photo");
const inquirySizeSelect = document.getElementById("inquiry-size");
const inquiryEmailInput = document.getElementById("inquiry-email");
const inquiryMessageInput = document.getElementById("inquiry-message");
const orderModalEl = document.getElementById("order-modal");
const orderFormEl = document.getElementById("order-form");
const orderCloseBtn = document.getElementById("order-close");
const orderPhotoInput = document.getElementById("order-photo");
const orderSizeSelect = document.getElementById("order-size");
const orderPriceValueEl = document.getElementById("order-price-value");
const orderFirstNameInput = document.getElementById("order-first-name");
const orderLastNameInput = document.getElementById("order-last-name");
const orderEmailInput = document.getElementById("order-email");
const orderPhoneInput = document.getElementById("order-phone");
const orderCityInput = document.getElementById("order-city");
const orderPostalCodeInput = document.getElementById("order-postal-code");
const orderStreetAddressInput = document.getElementById("order-street-address");
const orderPaymentMethodSelect = document.getElementById("order-payment-method");
const orderCarrierSelect = document.getElementById("order-carrier");
const orderMessageInput = document.getElementById("order-message");
const bookingModalEl = document.getElementById("booking-modal");
const bookingFormEl = document.getElementById("booking-form");
const bookingCloseBtn = document.getElementById("booking-close");
const bookingNameInput = document.getElementById("booking-name");
const bookingEmailInput = document.getElementById("booking-email");
const bookingMessageInput = document.getElementById("booking-message");
const heroCtaEl = document.getElementById("hero-cta");
const portfolioMoreBtnEl = document.getElementById("portfolio-more-btn");
const homePortfolioSectionEl = document.getElementById("portfolio");
const homePortfolioTabsWrapEl = document.getElementById("home-portfolio-tabs-wrap");
const homePortfolioExpandedEl = document.getElementById("portfolio-expanded");
const homePortfolioGridEl = document.getElementById("home-portfolio-grid");
const homePortfolioEmptyEl = document.getElementById("home-portfolio-empty");
const portfolioCollapseBtnEl = document.getElementById("portfolio-collapse-btn");
const portfolioGridEl = document.getElementById("portfolio-grid");
const portfolioEmptyEl = document.getElementById("portfolio-empty");
const shopMainEl = document.querySelector(".shop-main");
const shopHomeSectionEl = document.getElementById("shop");
const shopDisabledSectionEl = document.getElementById("shop-disabled-state");
const blogMainEl = document.querySelector(".blog-main");
const blogDisabledSectionEl = document.getElementById("blog-disabled-state");
const navContactLinkEl = document.getElementById("nav-contact");
const quickContactModalEl = document.getElementById("quick-contact-modal");
const quickContactCloseBtn = document.getElementById("quick-contact-close");
const contactModalBookingBtn = document.getElementById("contact-modal-booking-btn");
const siteHeaderEl = document.querySelector(".site-header");
const siteMainEl = document.querySelector("main");
const siteFooterEl = document.querySelector(".site-footer");
const isShopPage = Boolean(document.querySelector(".shop-main"));
const isPortfolioPage = Boolean(document.querySelector(".portfolio-main"));
const currentPageName = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
const isAboutPage = currentPageName === "about.html";
const isContactPage = currentPageName === "contact.html";
const isBlogPage = currentPageName === "blog.html";
const LEGACY_PAGE_TAB_HASH = {
  "about.html": "#o-mnie",
  "contact.html": "#kontakt"
};
const redirectedTabHash = LEGACY_PAGE_TAB_HASH[currentPageName];
if (redirectedTabHash) {
  const targetHash = window.location.hash || redirectedTabHash;
  window.location.replace(`./index.html${targetHash}`);
}
const hasShopUi = Boolean(shopMainEl || shopHomeSectionEl || shopGridEl || shopFeaturedGridEl);
const CONTACT_EMAIL = "c4uselove@gmail.com";

const THEME_STORAGE_KEY = "photo-theme";
const LANG_STORAGE_KEY = "photo-lang";
const MUSIC_MUTED_STORAGE_KEY = "photo-music-muted";
const SITE_SETTINGS_STORAGE_KEY = "photo-site-settings";
const ADMIN_INBOX_STORAGE_KEY = "photo-admin-inbox";
const ADMIN_ORDERS_STORAGE_KEY = "photo-admin-orders";
const YOUTUBE_SESSION_STATE_KEY = "photo-music-player-state";
const YOUTUBE_AUTOPLAY_UNLOCKED_KEY = "photo-music-autoplay-unlocked";
const YOUTUBE_DOCK_COLLAPSED_KEY = "photo-music-player-collapsed";
const API_BASE = "/api";
const SETTINGS_POLL_INTERVAL_MS = 10000;
const ENABLED_LANGUAGES = new Set(["pl", "en"]);
const EXTERNAL_TRANSLATION_FILES = {
  pl: "./assets/content/pl.json",
  en: "./assets/content/en.json"
};
const MUSIC_TRACKS_FOLDER = "./assets/audio/tracks";
const MUSIC_FILE_EXTENSIONS = ["mp3", "ogg", "wav", "m4a", "webm", "aac", "flac"];
function createDefaultEnabledCategories() {
  return {
    bw: true,
    color: true,
    nature: true,
    landscape: true,
    portrait: true
  };
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
const PHOTO_CATEGORIES = ["bw", "color", "nature", "landscape", "portrait"];
const PHOTO_CATEGORY_FOLDERS = {
  bw: "black-and-white",
  color: "color",
  nature: "nature",
  landscape: "landscape",
  portrait: "portrait"
};
const FEATURED_PHOTOS_FOLDER = "./assets/photos/featured";
const PRINT_SIZE_OPTIONS = [
  { value: "30x45 cm", pricePln: 299 },
  { value: "40x60 cm", pricePln: 449 },
  { value: "50x70 cm", pricePln: 599 },
  { value: "70x100 cm", pricePln: 899 }
];
const ORDER_PAYMENT_METHODS = [
  { value: "card", labelKey: "paymentMethodCard" },
  { value: "apple_pay", labelKey: "paymentMethodApplePay" },
  { value: "google_pay", labelKey: "paymentMethodGooglePay" },
  { value: "paypal", labelKey: "paymentMethodPayPal" },
  { value: "blik", labelKey: "paymentMethodBlik" },
  { value: "bitcoin", labelKey: "paymentMethodBitcoin" },
  { value: "ethereum", labelKey: "paymentMethodEthereum" }
];
const ORDER_COURIERS = [
  { value: "inpost_courier", labelKey: "carrierInpostCourier" },
  { value: "dpd", labelKey: "carrierDpd" },
  { value: "dhl", labelKey: "carrierDhl" },
  { value: "ups", labelKey: "carrierUps" },
  { value: "fedex", labelKey: "carrierFedex" }
];
const ORDER_SHIPPING_METHOD = "courier";

const translations = {
  pl: {
    navPortfolio: "Portfolio",
    navAbout: "O mnie",
    navContact: "Kontakt",
    navShop: "Sklep",
    navBlog: "Blog",
    portfolioMoreBtn: "Zobacz więcej",
    portfolioHideBtn: "Zwiń galerię",
    portfolioPageTitle: "Cause Love Photography | Portfolio",
    blogPageTitle: "Cause Love Photography | Blog",
    blogDisabledTitle: "Blog jest chwilowo wyłączony",
    blogDisabledDesc: "Ta sekcja jest aktualnie ukryta w panelu administracyjnym.",
    blogDisabledBack: "Wróć na stronę główną",
    portfolioPageKicker: "Galeria street art prints",
    portfolioPageHeading: "Pełna kolekcja miejskich kadrów.",
    portfolioPageLead:
      "Kuratorski układ galerii. Kliknij dowolny kadr, aby otworzyć go w podglądzie.",
    portfolioPageBack: "Wróć na stronę główną",
    portfolioGalleryTitle: "Galeria",
    portfolioGalleryDesc:
      "Wybierz kategorie i przeglądaj zdjęcia z folderów assets/photos/<kategoria>.",
    portfolioEmptyMsg:
      "Dodaj zdjęcia do folderów assets/photos/<kategoria>, aby zobaczyć pełną galerię.",
    portfolioTabAll: "Wszystko",
    portfolioTabBw: "Czarno-białe",
    portfolioTabColor: "Kolor",
    portfolioTabNature: "Natura",
    portfolioTabLandscape: "Krajobraz",
    portfolioTabPortrait: "Sesja",
    artFrameLabel: "Kadr",
    shopPageTitle: "Cause Love Photography | Sklep",
    shopKicker: "Street print shop",
    shopTitle: "Wydruki, które wyglądają jak miasto o 3:00 nad ranem.",
    shopLead:
      "Limitowane serie wydruków z ulicznych kadrów. Matowy papier fine art, sygnatura i numer edycji.",
    shopCta: "Zapytaj o zamówienie",
    shopCollectionsTitle: "Kolekcje",
    shopCollectionsDesc:
      "Wybierz dowolny kadr i zapytaj o dostępność wydruku.",
    shopTabAll: "Wszystko",
    shopTabBw: "Czarno-białe",
    shopTabColor: "Kolor",
    shopTabNature: "Natura",
    shopTabLandscape: "Krajobraz",
    shopTabPortrait: "Sesja",
    shopFeaturedTitle: "Wybrane na sprzedaż",
    shopFeaturedDesc:
      "Losowo wybrane kadry, które aktualnie promuję w sklepie.",
    shopAskBtn: "Spytaj o dostępność",
    shopBuyNow: "Kup wydruk",
    shopSizeLabel: "Rozmiar",
    shopPriceLabel: "Cena",
    shopOrderSubject: "Nowe zamówienie wydruku",
    shopEmptyMsg:
      "Dodaj zdjęcia do folderów assets/photos/<kategoria>, aby wyświetlić ofertę wydruków.",
    shopDisabledTitle: "Sklep jest chwilowo wyłączony",
    shopDisabledDesc:
      "Ta sekcja jest aktualnie ukryta w panelu administracyjnym.",
    shopDisabledBack: "Wróć na stronę główną",
    inquiryTitle: "Spytaj o dostępność",
    inquiryPhotoLabel: "Wybrane zdjęcie",
    inquirySizeLabel: "Rozmiar wydruku",
    inquiryEmailLabel: "Twój e-mail",
    inquiryMessageLabel: "Wiadomość",
    inquirySubmit: "Wyślij zapytanie",
    inquiryMessagePlaceholder: "Napisz, czego potrzebujesz...",
    inquiryCloseAria: "Zamknij formularz",
    inquiryCustomSize: "Inny rozmiar",
    inquirySubject: "Zapytanie o dostępność",
    orderTitle: "Kup wydruk",
    orderPhotoLabel: "Wybrane zdjęcie",
    orderSizeLabel: "Rozmiar wydruku",
    orderPriceLabel: "Cena:",
    orderFirstNameLabel: "Imię",
    orderLastNameLabel: "Nazwisko",
    orderEmailLabel: "Twój e-mail",
    orderPhoneLabel: "Telefon",
    orderCityLabel: "Miasto",
    orderPostalCodeLabel: "Kod pocztowy",
    orderStreetAddressLabel: "Ulica / mieszkanie",
    orderPaymentMethodLabel: "Metoda płatności",
    orderShippingMethodLabel: "Wysyłka:",
    orderShippingCourierOnly: "Tylko kurier",
    orderCarrierLabel: "Przewoźnik",
    orderMessageLabel: "Uwagi do zamówienia",
    paymentMethodCard: "Karta kredytowa",
    paymentMethodApplePay: "Apple Pay",
    paymentMethodGooglePay: "Google Pay",
    paymentMethodPayPal: "PayPal",
    paymentMethodBlik: "BLIK",
    paymentMethodBitcoin: "Bitcoin",
    paymentMethodEthereum: "Ethereum",
    carrierInpostCourier: "InPost Kurier",
    carrierDpd: "DPD",
    carrierDhl: "DHL",
    carrierUps: "UPS",
    carrierFedex: "FedEx",
    orderSubmit: "Kupuję",
    orderMessagePlaceholder: "Np. termin realizacji, dodatkowe informacje...",
    orderCloseAria: "Zamknij formularz zamówienia",
    orderSuccess: "Zamówienie zostało zapisane.",
    orderValidationRequired: "Uzupełnij wszystkie wymagane dane, wybierz płatność i kuriera.",
    orderCheckoutError: "Nie udało się rozpocząć płatności. Spróbuj ponownie za chwilę.",
    orderCheckoutServerHint: "Płatności działają tylko po uruchomieniu strony przez serwer (http://).",
    paymentSuccessMessage: "Płatność zakończona. Zamówienie jest zapisane.",
    paymentCancelMessage: "Płatność została anulowana. Możesz spróbować ponownie.",
    paymentFailedMessage: "Płatność nie powiodła się. Spróbuj ponownie lub wybierz inną metodę.",
    shopFramePrefix: "Kadr",
    shopFormatLabel: "Format",
    shopBuyBtn: "Kup wydruk",
    shopItem1Name: "Nocne Przejście",
    shopItem2Name: "Betonowe Echo",
    shopItem3Name: "Puls Metra",
    shopItem4Name: "Neon na Zaułku",
    shopItem5Name: "Deszcz na asfalcie",
    shopItem6Name: "Miasto po godzinach",
    heroKicker: "Street photography",
    heroTitle: "Klatki z miasta. Surowo. Prawdziwie.",
    heroLead:
      "Czarno-białe kadry, ziomalski klimat i miejska energia. Ta strona może żyć Twoimi własnymi zdjęciami jako tło.",
    heroCta: "Umów sesję",
    bookingTitle: "Umów sesję",
    bookingNameLabel: "Imię",
    bookingEmailLabel: "Mail",
    bookingMessageHint: "Napisz mi coś o sesji, która cię interesuje.",
    bookingMessageLabel: "Wiadomość",
    bookingSubmit: "Wyślij wiadomość",
    bookingMessagePlaceholder: "Napisz mi coś o sesji, która cię interesuje...",
    bookingCloseAria: "Zamknij formularz sesji",
    bookingSubject: "Zapytanie o sesję",
    portfolioTitle: "Portfolio",
    portfolioDesc:
      'Wrzuć pliki do folderu <strong>assets/photos</strong>, a strona sama je podepnie jako tło i miniatury.',
    card1: "Blok 01",
    card2: "Blok 02",
    card3: "Blok 03",
    card4: "Blok 04",
    card5: "Blok 05",
    card6: "Blok 06",
    aboutTitle: "O mnie",
    aboutP1:
      "Miejskie sesje, nocne światła, beton i emocje bez pozowania na siłę. Skupiam się na tym, żeby klimat był prawdziwy, a nie wygenerowany.",
    aboutP2:
      "Pracuję głównie w Warszawie, ale mogę dojechać tam, gdzie jest historia.",
    aboutPageText:
      "Miejskie sesje, nocne światła, beton i emocje bez pozowania na siłę. To miejsce jest dedykowane tylko stronie „O mnie”, więc możesz opisać siebie niezależnie od strony głównej.",
    noteTitle: "Jak wrzucić foty",
    noteLi1: "Wrzuć zdjęcia do folderu assets/photos",
    noteLi2: "Nazwy plików mogą być dowolne",
    noteLi3: "Użyj jpg, jpeg, png albo webp",
    contactTitle: "Kontakt",
    contactDesc:
      "Napisz i opisz, czego potrzebujesz. Odpowiem najszybciej, jak się da.",
    contactModalTitle: "Kontakt",
    contactModalLead: "Wybierz najwygodniejszą formę kontaktu.",
    contactModalMailBtn: "Napisz maila",
    contactModalInstagramBtn: "Otwórz Instagram",
    contactModalBookingBtn: "Umów sesję",
    contactModalCloseAria: "Zamknij okno kontaktu",
    footerText: "c4uselove. Wszelkie prawa zastrzeżone.",
    openPhotoPrefix: "Otwórz zdjęcie",
    themeToLight: "Jasny tryb",
    themeToDark: "Ciemny tryb",
    ariaThemeToLight: "Włącz jasny tryb",
    ariaThemeToDark: "Włącz ciemny tryb",
    modalHint: "Kliknij poza zdjęciem albo ESC, aby zamknąć.",
    ariaCloseModal: "Zamknij podgląd",
    ariaMuteMusic: "Wycisz muzykę",
    ariaUnmuteMusic: "Włącz muzykę",
    ariaNoMusic: "Brak muzyki w tle",
    maintenanceTitle: "Przerwa techniczna",
    maintenanceDesc: "Przepraszamy, strona jest chwilowo niedostępna. Spróbuj ponownie za chwilę.",
    ytTitleFallback: "Brak utworu",
    ytLoading: "Ładowanie muzyki...",
    ytPlay: "Play",
    ytPause: "Pauza",
    ytPrev: "Poprzedni",
    ytNext: "Następny",
    ytMute: "Wycisz",
    ytUnmute: "Dźwięk",
    ytOpenOnYoutube: "Losowo",
    ytSeekAria: "Przewijanie utworu",
    ytHidePlayer: "Ukryj odtwarzacz",
    ytShowPlayer: "Pokaż odtwarzacz"
  },
  en: {
    navPortfolio: "Portfolio",
    navAbout: "About",
    navContact: "Contact",
    navShop: "Shop",
    navBlog: "Blog",
    portfolioMoreBtn: "See more",
    portfolioHideBtn: "Hide gallery",
    portfolioPageTitle: "Cause Love Photography | Portfolio",
    blogPageTitle: "Cause Love Photography | Blog",
    blogDisabledTitle: "Blog is temporarily disabled",
    blogDisabledDesc: "This section is currently hidden in the admin panel.",
    blogDisabledBack: "Back to home",
    portfolioPageKicker: "Street art print gallery",
    portfolioPageHeading: "Full collection of urban frames.",
    portfolioPageLead:
      "Curated gallery layout. Click any frame to open it in preview.",
    portfolioPageBack: "Back to home",
    portfolioGalleryTitle: "Gallery",
    portfolioGalleryDesc:
      "Choose a category and browse photos from assets/photos/<category> folders.",
    portfolioEmptyMsg:
      "Add photos to assets/photos/<category> folders to see the full gallery.",
    portfolioTabAll: "All",
    portfolioTabBw: "Black and white",
    portfolioTabColor: "Color",
    portfolioTabNature: "Nature",
    portfolioTabLandscape: "Landscape",
    portfolioTabPortrait: "Session",
    artFrameLabel: "Frame",
    shopPageTitle: "Cause Love Photography | Shop",
    shopKicker: "Street print shop",
    shopTitle: "Prints that look like the city at 3:00 AM.",
    shopLead:
      "Limited-edition street photo prints. Fine art matte paper, signature, and edition number.",
    shopCta: "Ask about an order",
    shopCollectionsTitle: "Collections",
    shopCollectionsDesc:
      "Choose any frame and ask about print availability.",
    shopTabAll: "All",
    shopTabBw: "Black and white",
    shopTabColor: "Color",
    shopTabNature: "Nature",
    shopTabLandscape: "Landscape",
    shopTabPortrait: "Session",
    shopFeaturedTitle: "Featured For Sale",
    shopFeaturedDesc:
      "Randomly selected frames currently highlighted in the shop.",
    shopAskBtn: "Ask availability",
    shopBuyNow: "Buy print",
    shopSizeLabel: "Size",
    shopPriceLabel: "Price",
    shopOrderSubject: "New print order",
    shopEmptyMsg:
      "Add photos to assets/photos/<category> folders to display print offers.",
    shopDisabledTitle: "Shop is temporarily disabled",
    shopDisabledDesc:
      "This section is currently hidden in the admin panel.",
    shopDisabledBack: "Back to home",
    inquiryTitle: "Ask for availability",
    inquiryPhotoLabel: "Selected photo",
    inquirySizeLabel: "Print size",
    inquiryEmailLabel: "Your email",
    inquiryMessageLabel: "Message",
    inquirySubmit: "Send inquiry",
    inquiryMessagePlaceholder: "Write what you need...",
    inquiryCloseAria: "Close form",
    inquiryCustomSize: "Custom size",
    inquirySubject: "Availability inquiry",
    orderTitle: "Buy print",
    orderPhotoLabel: "Selected photo",
    orderSizeLabel: "Print size",
    orderPriceLabel: "Price:",
    orderFirstNameLabel: "First name",
    orderLastNameLabel: "Last name",
    orderEmailLabel: "Your email",
    orderPhoneLabel: "Phone",
    orderCityLabel: "City",
    orderPostalCodeLabel: "Postal code",
    orderStreetAddressLabel: "Street / apartment",
    orderPaymentMethodLabel: "Payment method",
    orderShippingMethodLabel: "Shipping:",
    orderShippingCourierOnly: "Courier only",
    orderCarrierLabel: "Carrier",
    orderMessageLabel: "Order notes",
    paymentMethodCard: "Credit card",
    paymentMethodApplePay: "Apple Pay",
    paymentMethodGooglePay: "Google Pay",
    paymentMethodPayPal: "PayPal",
    paymentMethodBlik: "BLIK",
    paymentMethodBitcoin: "Bitcoin",
    paymentMethodEthereum: "Ethereum",
    carrierInpostCourier: "InPost Courier",
    carrierDpd: "DPD",
    carrierDhl: "DHL",
    carrierUps: "UPS",
    carrierFedex: "FedEx",
    orderSubmit: "Buy now",
    orderMessagePlaceholder: "For example: deadline, extra details...",
    orderCloseAria: "Close order form",
    orderSuccess: "Order has been saved.",
    orderValidationRequired: "Fill in all required details, then choose payment and courier.",
    orderCheckoutError: "Could not start payment. Please try again in a moment.",
    orderCheckoutServerHint: "Payments work only when the site runs via server (http://).",
    paymentSuccessMessage: "Payment completed. Your order has been saved.",
    paymentCancelMessage: "Payment was cancelled. You can try again.",
    paymentFailedMessage: "Payment failed. Try again or choose another method.",
    shopFramePrefix: "Frame",
    shopFormatLabel: "Format",
    shopBuyBtn: "Buy print",
    shopItem1Name: "Night Crosswalk",
    shopItem2Name: "Concrete Echo",
    shopItem3Name: "Metro Pulse",
    shopItem4Name: "Back Alley Neon",
    shopItem5Name: "Rain on Asphalt",
    shopItem6Name: "City After Hours",
    heroKicker: "Street photography",
    heroTitle: "Frames from the city. Raw. Real.",
    heroLead:
      "Black-and-white shots, street energy, and honest moments. This website can run on your own photos as a live background.",
    heroCta: "Book a shoot",
    bookingTitle: "Book a shoot",
    bookingNameLabel: "Name",
    bookingEmailLabel: "Email",
    bookingMessageHint: "Tell me about the shoot you are interested in.",
    bookingMessageLabel: "Message",
    bookingSubmit: "Send message",
    bookingMessagePlaceholder: "Tell me about the shoot you are interested in...",
    bookingCloseAria: "Close booking form",
    bookingSubject: "Shoot inquiry",
    portfolioTitle: "Portfolio",
    portfolioDesc:
      'Drop files into <strong>assets/photos</strong> and the site will auto-use them for the background and gallery cards.',
    card1: "Block 01",
    card2: "Block 02",
    card3: "Block 03",
    card4: "Block 04",
    card5: "Block 05",
    card6: "Block 06",
    aboutTitle: "About",
    aboutP1:
      "Urban sessions, night lights, concrete, and emotion without forced posing. I keep the vibe authentic, not artificial.",
    aboutP2: "I mostly work in Warsaw, but I can travel wherever the story is.",
    aboutPageText:
      "Urban sessions, night lights, concrete, and emotion without forced posing. This text is dedicated only to the About page, independent from the home page section.",
    noteTitle: "How to add photos",
    noteLi1: "Put your photos in the assets/photos folder",
    noteLi2: "File names can be anything",
    noteLi3: "Use jpg, jpeg, png, or webp",
    contactTitle: "Contact",
    contactDesc:
      "Write what you need and I will get back to you as fast as possible.",
    contactModalTitle: "Contact",
    contactModalLead: "Choose your preferred way to reach me.",
    contactModalMailBtn: "Send email",
    contactModalInstagramBtn: "Open Instagram",
    contactModalBookingBtn: "Book a shoot",
    contactModalCloseAria: "Close contact window",
    footerText: "c4uselove. All rights reserved.",
    openPhotoPrefix: "Open photo",
    themeToLight: "Light mode",
    themeToDark: "Dark mode",
    ariaThemeToLight: "Enable light mode",
    ariaThemeToDark: "Enable dark mode",
    modalHint: "Click outside the image or press ESC to close.",
    ariaCloseModal: "Close preview",
    ariaMuteMusic: "Mute music",
    ariaUnmuteMusic: "Unmute music",
    ariaNoMusic: "No background music",
    maintenanceTitle: "Technical break",
    maintenanceDesc: "Sorry, the website is temporarily unavailable. Please check back in a moment.",
    ytTitleFallback: "No track selected",
    ytLoading: "Loading music...",
    ytPlay: "Play",
    ytPause: "Pause",
    ytPrev: "Previous",
    ytNext: "Next",
    ytMute: "Mute",
    ytUnmute: "Sound",
    ytOpenOnYoutube: "Shuffle",
    ytSeekAria: "Track seek",
    ytHidePlayer: "Hide player",
    ytShowPlayer: "Show player"
  },
  nl: {
    navPortfolio: "Portfolio",
    navAbout: "Over mij",
    navContact: "Contact",
    navShop: "Shop",
    portfolioMoreBtn: "Bekijk meer",
    portfolioPageTitle: "Cause Love Photography | Portfolio",
    portfolioPageKicker: "Street art print galerij",
    portfolioPageHeading: "Volledige collectie stedelijke frames.",
    portfolioPageLead:
      "Curatoriale galerij-layout. Klik op een frame om het in preview te openen.",
    portfolioPageBack: "Terug naar home",
    portfolioGalleryTitle: "Galerij",
    portfolioGalleryDesc: "Alle foto's uit de map assets/photos.",
    portfolioEmptyMsg:
      "Voeg foto's toe aan assets/photos om de volledige galerij te zien.",
    artFrameLabel: "Frame",
    shopPageTitle: "Cause Love Photography | Shop",
    shopKicker: "Street print shop",
    shopTitle: "Prints die voelen als de stad om 3:00 uur 's nachts.",
    shopLead:
      "Gelimiteerde street-foto afdrukken. Fine art mat papier, handtekening en editienummer.",
    shopCta: "Vraag naar bestelling",
    shopCollectionsTitle: "Collecties",
    shopCollectionsDesc:
      "Kies een frame en vraag naar de beschikbaarheid van de print.",
    shopTabBw: "Black and white",
    shopTabColor: "Color",
    shopTabNature: "Nature",
    shopFeaturedTitle: "Uitgelicht Te Koop",
    shopFeaturedDesc:
      "Willekeurig gekozen frames die nu in de shop worden uitgelicht.",
    shopAskBtn: "Vraag beschikbaarheid",
    shopEmptyMsg:
      "Voeg foto's toe aan assets/photos om printaanbod te tonen.",
    inquiryTitle: "Vraag beschikbaarheid",
    inquiryPhotoLabel: "Geselecteerde foto",
    inquirySizeLabel: "Printformaat",
    inquiryEmailLabel: "Jouw e-mail",
    inquiryMessageLabel: "Bericht",
    inquirySubmit: "Verstuur aanvraag",
    inquiryMessagePlaceholder: "Schrijf wat je nodig hebt...",
    inquiryCloseAria: "Formulier sluiten",
    inquiryCustomSize: "Aangepast formaat",
    inquirySubject: "Beschikbaarheidsaanvraag",
    shopFramePrefix: "Frame",
    shopFormatLabel: "Formaat",
    shopBuyBtn: "Koop print",
    shopItem1Name: "Night Crosswalk",
    shopItem2Name: "Concrete Echo",
    shopItem3Name: "Metro Pulse",
    shopItem4Name: "Back Alley Neon",
    shopItem5Name: "Rain on Asphalt",
    shopItem6Name: "City After Hours",
    heroKicker: "Straatfotografie",
    heroTitle: "Kaders uit de stad. Rauw. Echt.",
    heroLead:
      "Zwart-wit beelden, straatenergie en eerlijke momenten. Deze site kan draaien op jouw eigen foto's als live achtergrond.",
    heroCta: "Boek een shoot",
    portfolioTitle: "Portfolio",
    portfolioDesc:
      'Zet bestanden in <strong>assets/photos</strong> en de site gebruikt ze automatisch voor de achtergrond en galerij.',
    card1: "Blok 01",
    card2: "Blok 02",
    card3: "Blok 03",
    card4: "Blok 04",
    card5: "Blok 05",
    card6: "Blok 06",
    aboutTitle: "Over mij",
    aboutP1:
      "Stedelijke sessies, nachtlichten, beton en emotie zonder geforceerde poses. Ik houd de vibe authentiek.",
    aboutP2:
      "Ik werk vooral in Warschau, maar ik kan reizen waar het verhaal is.",
    noteTitle: "Foto's toevoegen",
    noteLi1: "Zet je foto's in de map assets/photos",
    noteLi2: "Bestandsnamen mogen willekeurig zijn",
    noteLi3: "Gebruik jpg, jpeg, png of webp",
    contactTitle: "Contact",
    contactDesc: "Stuur wat je nodig hebt en ik reageer zo snel mogelijk.",
    footerText: "c4uselove. Alle rechten voorbehouden.",
    openPhotoPrefix: "Open foto",
    themeToLight: "Lichte modus",
    themeToDark: "Donkere modus",
    ariaThemeToLight: "Schakel lichte modus in",
    ariaThemeToDark: "Schakel donkere modus in",
    modalHint: "Klik buiten de foto of druk op ESC om te sluiten.",
    ariaCloseModal: "Preview sluiten",
    ariaMuteMusic: "Muziek dempen",
    ariaUnmuteMusic: "Muziek aanzetten",
    ariaNoMusic: "Geen achtergrondmuziek"
  },
  de: {
    navPortfolio: "Portfolio",
    navAbout: "Uber mich",
    navContact: "Kontakt",
    navShop: "Shop",
    portfolioMoreBtn: "Mehr sehen",
    portfolioPageTitle: "Cause Love Photography | Portfolio",
    portfolioPageKicker: "Street-Art-Print-Galerie",
    portfolioPageHeading: "Vollstandige Sammlung urbaner Frames.",
    portfolioPageLead:
      "Kuratiertes Galerie-Layout. Klicke auf ein Frame, um es in der Vorschau zu offnen.",
    portfolioPageBack: "Zuruck zur Startseite",
    portfolioGalleryTitle: "Galerie",
    portfolioGalleryDesc: "Alle Fotos aus dem Ordner assets/photos.",
    portfolioEmptyMsg:
      "Fuge Fotos zu assets/photos hinzu, um die volle Galerie zu sehen.",
    artFrameLabel: "Frame",
    shopPageTitle: "Cause Love Photography | Shop",
    shopKicker: "Street print shop",
    shopTitle: "Prints, die sich anfuhlen wie die Stadt um 3:00 Uhr nachts.",
    shopLead:
      "Limitierte Street-Foto-Prints. Fine-Art-Mattpapier, Signatur und Editionsnummer.",
    shopCta: "Bestellung anfragen",
    shopCollectionsTitle: "Kollektionen",
    shopCollectionsDesc:
      "Waehle ein Frame und frage nach der Verfugbarkeit des Prints.",
    shopTabBw: "Black and white",
    shopTabColor: "Color",
    shopTabNature: "Nature",
    shopFeaturedTitle: "Ausgewaehlt Zum Verkauf",
    shopFeaturedDesc:
      "Zufaellig ausgewaehlte Frames, die aktuell im Shop hervorgehoben sind.",
    shopAskBtn: "Verfugbarkeit anfragen",
    shopEmptyMsg:
      "Fuge Fotos zu assets/photos hinzu, um Print-Angebote zu sehen.",
    inquiryTitle: "Verfugbarkeit anfragen",
    inquiryPhotoLabel: "Ausgewahltes Foto",
    inquirySizeLabel: "Druckgroesse",
    inquiryEmailLabel: "Deine E-Mail",
    inquiryMessageLabel: "Nachricht",
    inquirySubmit: "Anfrage senden",
    inquiryMessagePlaceholder: "Schreib, was du brauchst...",
    inquiryCloseAria: "Formular schliessen",
    inquiryCustomSize: "Eigene Groesse",
    inquirySubject: "Anfrage zur Verfugbarkeit",
    shopFramePrefix: "Frame",
    shopFormatLabel: "Format",
    shopBuyBtn: "Print kaufen",
    shopItem1Name: "Night Crosswalk",
    shopItem2Name: "Concrete Echo",
    shopItem3Name: "Metro Pulse",
    shopItem4Name: "Back Alley Neon",
    shopItem5Name: "Rain on Asphalt",
    shopItem6Name: "City After Hours",
    heroKicker: "Street Photography",
    heroTitle: "Frames aus der Stadt. Roh. Echt.",
    heroLead:
      "Schwarz-weisse Bilder, Street-Energie und echte Momente. Diese Seite kann mit deinen eigenen Fotos als Live-Hintergrund laufen.",
    heroCta: "Shooting buchen",
    portfolioTitle: "Portfolio",
    portfolioDesc:
      'Lege Dateien in <strong>assets/photos</strong> ab, dann nutzt die Seite sie automatisch fur Hintergrund und Galerie.',
    card1: "Block 01",
    card2: "Block 02",
    card3: "Block 03",
    card4: "Block 04",
    card5: "Block 05",
    card6: "Block 06",
    aboutTitle: "Uber mich",
    aboutP1:
      "Urbane Sessions, Nachtlichter, Beton und Emotion ohne erzwungene Posen. Ich halte den Vibe authentisch.",
    aboutP2:
      "Ich arbeite meist in Warschau, kann aber dorthin reisen, wo die Story ist.",
    noteTitle: "Fotos hinzufugen",
    noteLi1: "Lege deine Fotos in den Ordner assets/photos",
    noteLi2: "Dateinamen konnen beliebig sein",
    noteLi3: "Nutze jpg, jpeg, png oder webp",
    contactTitle: "Kontakt",
    contactDesc:
      "Schreib kurz, was du brauchst, und ich melde mich so schnell wie moglich.",
    footerText: "c4uselove. Alle Rechte vorbehalten.",
    openPhotoPrefix: "Foto offnen",
    themeToLight: "Heller Modus",
    themeToDark: "Dunkler Modus",
    ariaThemeToLight: "Hellen Modus aktivieren",
    ariaThemeToDark: "Dunklen Modus aktivieren",
    modalHint: "Klicke ausserhalb des Fotos oder drucke ESC zum Schliessen.",
    ariaCloseModal: "Vorschau schliessen",
    ariaMuteMusic: "Musik stummschalten",
    ariaUnmuteMusic: "Musik einschalten",
    ariaNoMusic: "Keine Hintergrundmusik"
  },
  es: {
    navPortfolio: "Portfolio",
    navAbout: "Sobre mi",
    navContact: "Contacto",
    navShop: "Tienda",
    portfolioMoreBtn: "Ver mas",
    portfolioPageTitle: "Cause Love Photography | Portfolio",
    portfolioPageKicker: "Galeria street de prints",
    portfolioPageHeading: "Coleccion completa de cuadros urbanos.",
    portfolioPageLead:
      "Diseno curado de galeria. Haz clic en cualquier cuadro para abrirlo.",
    portfolioPageBack: "Volver al inicio",
    portfolioGalleryTitle: "Galeria",
    portfolioGalleryDesc: "Todas las fotos de la carpeta assets/photos.",
    portfolioEmptyMsg:
      "Agrega fotos en assets/photos para ver la galeria completa.",
    artFrameLabel: "Cuadro",
    shopPageTitle: "Cause Love Photography | Tienda",
    shopKicker: "Tienda street de prints",
    shopTitle: "Impresiones que se ven como la ciudad a las 3:00 de la madrugada.",
    shopLead:
      "Series limitadas de impresiones urbanas. Papel fine art mate, firma y numero de edicion.",
    shopCta: "Preguntar por pedido",
    shopCollectionsTitle: "Colecciones",
    shopCollectionsDesc:
      "Elige cualquier cuadro y consulta la disponibilidad del print.",
    shopTabBw: "Black and white",
    shopTabColor: "Color",
    shopTabNature: "Nature",
    shopFeaturedTitle: "Seleccionadas En Venta",
    shopFeaturedDesc:
      "Cuadros seleccionados al azar que ahora se destacan en la tienda.",
    shopAskBtn: "Consultar disponibilidad",
    shopEmptyMsg:
      "Agrega fotos en assets/photos para mostrar ofertas de impresiones.",
    inquiryTitle: "Consultar disponibilidad",
    inquiryPhotoLabel: "Foto seleccionada",
    inquirySizeLabel: "Tamano de impresion",
    inquiryEmailLabel: "Tu correo",
    inquiryMessageLabel: "Mensaje",
    inquirySubmit: "Enviar consulta",
    inquiryMessagePlaceholder: "Escribe lo que necesitas...",
    inquiryCloseAria: "Cerrar formulario",
    inquiryCustomSize: "Tamano personalizado",
    inquirySubject: "Consulta de disponibilidad",
    shopFramePrefix: "Cuadro",
    shopFormatLabel: "Formato",
    shopBuyBtn: "Comprar print",
    shopItem1Name: "Night Crosswalk",
    shopItem2Name: "Concrete Echo",
    shopItem3Name: "Metro Pulse",
    shopItem4Name: "Back Alley Neon",
    shopItem5Name: "Rain on Asphalt",
    shopItem6Name: "City After Hours",
    heroKicker: "Fotografia callejera",
    heroTitle: "Cuadros de la ciudad. Crudo. Real.",
    heroLead:
      "Fotos en blanco y negro, energia urbana y momentos autenticos. Esta web puede usar tus propias fotos como fondo vivo.",
    heroCta: "Reservar sesion",
    portfolioTitle: "Portfolio",
    portfolioDesc:
      'Pon archivos en <strong>assets/photos</strong> y la pagina los usara automaticamente para el fondo y la galeria.',
    card1: "Bloque 01",
    card2: "Bloque 02",
    card3: "Bloque 03",
    card4: "Bloque 04",
    card5: "Bloque 05",
    card6: "Bloque 06",
    aboutTitle: "Sobre mi",
    aboutP1:
      "Sesiones urbanas, luces nocturnas, hormigon y emocion sin poses forzadas. Mantengo el ambiente autentico.",
    aboutP2:
      "Trabajo sobre todo en Varsovia, pero puedo viajar donde este la historia.",
    noteTitle: "Como anadir fotos",
    noteLi1: "Pon tus fotos en la carpeta assets/photos",
    noteLi2: "Los nombres de archivo pueden ser cualquiera",
    noteLi3: "Usa jpg, jpeg, png o webp",
    contactTitle: "Contacto",
    contactDesc:
      "Escribe lo que necesitas y te respondere lo antes posible.",
    footerText: "c4uselove. Todos los derechos reservados.",
    openPhotoPrefix: "Abrir foto",
    themeToLight: "Modo claro",
    themeToDark: "Modo oscuro",
    ariaThemeToLight: "Activar modo claro",
    ariaThemeToDark: "Activar modo oscuro",
    modalHint: "Haz clic fuera de la foto o pulsa ESC para cerrar.",
    ariaCloseModal: "Cerrar vista previa",
    ariaMuteMusic: "Silenciar musica",
    ariaUnmuteMusic: "Activar musica",
    ariaNoMusic: "Sin musica de fondo"
  },
  fr: {
    navPortfolio: "Portfolio",
    navAbout: "A propos",
    navContact: "Contact",
    navShop: "Boutique",
    portfolioMoreBtn: "Voir plus",
    portfolioPageTitle: "Cause Love Photography | Portfolio",
    portfolioPageKicker: "Galerie de tirages street",
    portfolioPageHeading: "Collection complete de cadres urbains.",
    portfolioPageLead:
      "Mise en page de galerie curation. Clique sur un cadre pour l'ouvrir en apercu.",
    portfolioPageBack: "Retour a l'accueil",
    portfolioGalleryTitle: "Galerie",
    portfolioGalleryDesc: "Toutes les photos du dossier assets/photos.",
    portfolioEmptyMsg:
      "Ajoute des photos dans assets/photos pour voir la galerie complete.",
    artFrameLabel: "Cadre",
    shopPageTitle: "Cause Love Photography | Boutique",
    shopKicker: "Boutique de tirages street",
    shopTitle: "Des tirages qui ressemblent a la ville a 3 h du matin.",
    shopLead:
      "Series limitees de tirages street. Papier fine art mat, signature et numero d'edition.",
    shopCta: "Demander une commande",
    shopCollectionsTitle: "Collections",
    shopCollectionsDesc:
      "Choisis un cadre et demande la disponibilite du tirage.",
    shopTabBw: "Black and white",
    shopTabColor: "Color",
    shopTabNature: "Nature",
    shopFeaturedTitle: "Selection En Vente",
    shopFeaturedDesc:
      "Cadres choisis au hasard actuellement mis en avant dans la boutique.",
    shopAskBtn: "Demander la disponibilite",
    shopEmptyMsg:
      "Ajoute des photos dans assets/photos pour afficher les tirages.",
    inquiryTitle: "Demander la disponibilite",
    inquiryPhotoLabel: "Photo selectionnee",
    inquirySizeLabel: "Format du tirage",
    inquiryEmailLabel: "Ton e-mail",
    inquiryMessageLabel: "Message",
    inquirySubmit: "Envoyer la demande",
    inquiryMessagePlaceholder: "Ecris ce dont tu as besoin...",
    inquiryCloseAria: "Fermer le formulaire",
    inquiryCustomSize: "Format personnalise",
    inquirySubject: "Demande de disponibilite",
    shopFramePrefix: "Cadre",
    shopFormatLabel: "Format",
    shopBuyBtn: "Acheter le tirage",
    shopItem1Name: "Night Crosswalk",
    shopItem2Name: "Concrete Echo",
    shopItem3Name: "Metro Pulse",
    shopItem4Name: "Back Alley Neon",
    shopItem5Name: "Rain on Asphalt",
    shopItem6Name: "City After Hours",
    heroKicker: "Photographie de rue",
    heroTitle: "Cadres de la ville. Brut. Reel.",
    heroLead:
      "Photos en noir et blanc, energie urbaine et moments authentiques. Ce site peut utiliser tes propres photos en fond dynamique.",
    heroCta: "Reserver une seance",
    portfolioTitle: "Portfolio",
    portfolioDesc:
      'Mets des fichiers dans <strong>assets/photos</strong> et le site les utilisera automatiquement pour le fond et la galerie.',
    card1: "Bloc 01",
    card2: "Bloc 02",
    card3: "Bloc 03",
    card4: "Bloc 04",
    card5: "Bloc 05",
    card6: "Bloc 06",
    aboutTitle: "A propos",
    aboutP1:
      "Sessions urbaines, lumieres de nuit, beton et emotion sans poses forcees. Je garde une ambiance authentique.",
    aboutP2:
      "Je travaille surtout a Varsovie, mais je peux me deplacer la ou est l'histoire.",
    noteTitle: "Ajouter des photos",
    noteLi1: "Mets tes photos dans le dossier assets/photos",
    noteLi2: "Les noms de fichiers peuvent etre libres",
    noteLi3: "Utilise jpg, jpeg, png ou webp",
    contactTitle: "Contact",
    contactDesc:
      "Ecris ce dont tu as besoin et je repondrai le plus vite possible.",
    footerText: "c4uselove. Tous droits reserves.",
    openPhotoPrefix: "Ouvrir photo",
    themeToLight: "Mode clair",
    themeToDark: "Mode sombre",
    ariaThemeToLight: "Activer le mode clair",
    ariaThemeToDark: "Activer le mode sombre",
    modalHint: "Clique hors de la photo ou appuie sur ESC pour fermer.",
    ariaCloseModal: "Fermer l'apercu",
    ariaMuteMusic: "Couper la musique",
    ariaUnmuteMusic: "Activer la musique",
    ariaNoMusic: "Pas de musique de fond"
  },
  it: {
    navPortfolio: "Portfolio",
    navAbout: "Chi sono",
    navContact: "Contatto",
    navShop: "Negozio",
    portfolioMoreBtn: "Vedi di piu",
    portfolioPageTitle: "Cause Love Photography | Portfolio",
    portfolioPageKicker: "Galleria street art prints",
    portfolioPageHeading: "Collezione completa di scatti urbani.",
    portfolioPageLead:
      "Layout curato della galleria. Clicca su qualsiasi frame per aprirlo in anteprima.",
    portfolioPageBack: "Torna alla home",
    portfolioGalleryTitle: "Galleria",
    portfolioGalleryDesc: "Tutte le foto aggiunte alla cartella assets/photos.",
    portfolioEmptyMsg:
      "Aggiungi foto in assets/photos per vedere la galleria completa.",
    artFrameLabel: "Scatto",
    shopPageTitle: "Cause Love Photography | Negozio",
    shopKicker: "Street print shop",
    shopTitle: "Stampe che sembrano la citta alle 3:00 di notte.",
    shopLead:
      "Serie limitate di stampe street. Carta fine art opaca, firma e numero di edizione.",
    shopCta: "Chiedi un ordine",
    shopCollectionsTitle: "Collezioni",
    shopCollectionsDesc:
      "Scegli uno scatto e chiedi la disponibilita della stampa.",
    shopTabBw: "Black and white",
    shopTabColor: "Color",
    shopTabNature: "Nature",
    shopFeaturedTitle: "Selezione In Vendita",
    shopFeaturedDesc:
      "Scatti scelti casualmente e messi in evidenza nel negozio.",
    shopAskBtn: "Chiedi disponibilita",
    shopEmptyMsg:
      "Aggiungi foto in assets/photos per mostrare le stampe.",
    inquiryTitle: "Chiedi disponibilita",
    inquiryPhotoLabel: "Foto selezionata",
    inquirySizeLabel: "Formato stampa",
    inquiryEmailLabel: "La tua email",
    inquiryMessageLabel: "Messaggio",
    inquirySubmit: "Invia richiesta",
    inquiryMessagePlaceholder: "Scrivi cosa ti serve...",
    inquiryCloseAria: "Chiudi modulo",
    inquiryCustomSize: "Formato personalizzato",
    inquirySubject: "Richiesta disponibilita",
    shopFramePrefix: "Scatto",
    shopFormatLabel: "Formato",
    shopBuyBtn: "Acquista stampa",
    shopItem1Name: "Night Crosswalk",
    shopItem2Name: "Concrete Echo",
    shopItem3Name: "Metro Pulse",
    shopItem4Name: "Back Alley Neon",
    shopItem5Name: "Rain on Asphalt",
    shopItem6Name: "City After Hours",
    heroKicker: "Street photography",
    heroTitle: "Frame dalla citta. Crudo. Reale.",
    heroLead:
      "Scatti in bianco e nero, energia urbana e momenti autentici. Questo sito puo usare le tue foto come sfondo dinamico.",
    heroCta: "Prenota uno shooting",
    portfolioTitle: "Portfolio",
    portfolioDesc:
      'Metti i file in <strong>assets/photos</strong> e il sito li usera automaticamente per sfondo e galleria.',
    card1: "Blocco 01",
    card2: "Blocco 02",
    card3: "Blocco 03",
    card4: "Blocco 04",
    card5: "Blocco 05",
    card6: "Blocco 06",
    aboutTitle: "Chi sono",
    aboutP1:
      "Sessioni urbane, luci notturne, cemento ed emozione senza pose forzate. Mantengo un vibe autentico.",
    aboutP2:
      "Lavoro soprattutto a Varsavia, ma posso viaggiare dove c'e una storia.",
    noteTitle: "Come aggiungere foto",
    noteLi1: "Metti le tue foto nella cartella assets/photos",
    noteLi2: "I nomi dei file possono essere qualsiasi",
    noteLi3: "Usa jpg, jpeg, png o webp",
    contactTitle: "Contatto",
    contactDesc:
      "Scrivi quello che ti serve e ti rispondero il prima possibile.",
    footerText: "c4uselove. Tutti i diritti riservati.",
    openPhotoPrefix: "Apri foto",
    themeToLight: "Modalita chiara",
    themeToDark: "Modalita scura",
    ariaThemeToLight: "Attiva modalita chiara",
    ariaThemeToDark: "Attiva modalita scura",
    modalHint: "Clicca fuori dalla foto o premi ESC per chiudere.",
    ariaCloseModal: "Chiudi anteprima",
    ariaMuteMusic: "Disattiva musica",
    ariaUnmuteMusic: "Attiva musica",
    ariaNoMusic: "Nessuna musica di sottofondo"
  }
};

const translatableNodes = {
  navPortfolio: document.getElementById("nav-portfolio"),
  navAbout: document.getElementById("nav-about"),
  navContact: document.getElementById("nav-contact"),
  navShop: document.getElementById("nav-shop"),
  navBlog: document.getElementById("nav-blog"),
  portfolioMoreBtn: document.getElementById("portfolio-more-btn"),
  portfolioPageKicker: document.getElementById("portfolio-page-kicker"),
  portfolioPageHeading: document.getElementById("portfolio-page-title"),
  portfolioPageLead: document.getElementById("portfolio-page-lead"),
  portfolioPageBack: document.getElementById("portfolio-page-back"),
  portfolioGalleryTitle: document.getElementById("portfolio-gallery-title"),
  portfolioGalleryDesc: document.getElementById("portfolio-gallery-desc"),
  portfolioEmptyMsg: document.getElementById("portfolio-empty"),
  shopKicker: document.getElementById("shop-kicker"),
  shopTitle: document.getElementById("shop-title"),
  shopLead: document.getElementById("shop-lead"),
  shopCta: document.getElementById("shop-cta"),
  shopCollectionsTitle: document.getElementById("shop-collections-title"),
  shopCollectionsDesc: document.getElementById("shop-collections-desc"),
  shopTabAll: document.getElementById("shop-tab-all"),
  shopTabBw: document.getElementById("shop-tab-bw"),
  shopTabColor: document.getElementById("shop-tab-color"),
  shopTabNature: document.getElementById("shop-tab-nature"),
  shopTabLandscape: document.getElementById("shop-tab-landscape"),
  shopTabPortrait: document.getElementById("shop-tab-portrait"),
  shopFeaturedTitle: document.getElementById("shop-featured-title"),
  shopFeaturedDesc: document.getElementById("shop-featured-desc"),
  shopEmptyMsg: document.getElementById("shop-empty"),
  shopDisabledTitle: document.getElementById("shop-disabled-title"),
  shopDisabledDesc: document.getElementById("shop-disabled-desc"),
  shopDisabledBack: document.getElementById("shop-disabled-back"),
  blogDisabledTitle: document.getElementById("blog-disabled-title"),
  blogDisabledDesc: document.getElementById("blog-disabled-desc"),
  blogDisabledBack: document.getElementById("blog-disabled-back"),
  portfolioTabAll: document.getElementById("portfolio-tab-all"),
  portfolioTabBw: document.getElementById("portfolio-tab-bw"),
  portfolioTabColor: document.getElementById("portfolio-tab-color"),
  portfolioTabNature: document.getElementById("portfolio-tab-nature"),
  portfolioTabLandscape: document.getElementById("portfolio-tab-landscape"),
  portfolioTabPortrait: document.getElementById("portfolio-tab-portrait"),
  inquiryTitle: document.getElementById("inquiry-title"),
  inquiryPhotoLabel: document.getElementById("inquiry-photo-label"),
  inquirySizeLabel: document.getElementById("inquiry-size-label"),
  inquiryEmailLabel: document.getElementById("inquiry-email-label"),
  inquiryMessageLabel: document.getElementById("inquiry-message-label"),
  inquirySubmit: document.getElementById("inquiry-submit"),
  orderTitle: document.getElementById("order-title"),
  orderPhotoLabel: document.getElementById("order-photo-label"),
  orderSizeLabel: document.getElementById("order-size-label"),
  orderPriceLabel: document.getElementById("order-price-label"),
  orderFirstNameLabel: document.getElementById("order-first-name-label"),
  orderLastNameLabel: document.getElementById("order-last-name-label"),
  orderEmailLabel: document.getElementById("order-email-label"),
  orderPhoneLabel: document.getElementById("order-phone-label"),
  orderCityLabel: document.getElementById("order-city-label"),
  orderPostalCodeLabel: document.getElementById("order-postal-code-label"),
  orderStreetAddressLabel: document.getElementById("order-street-address-label"),
  orderPaymentMethodLabel: document.getElementById("order-payment-method-label"),
  orderShippingMethodLabel: document.getElementById("order-shipping-method-label"),
  orderShippingCourierOnly: document.getElementById("order-shipping-courier-only"),
  orderCarrierLabel: document.getElementById("order-carrier-label"),
  orderMessageLabel: document.getElementById("order-message-label"),
  orderSubmit: document.getElementById("order-submit"),
  heroKicker: document.getElementById("hero-kicker"),
  heroTitle: document.getElementById("hero-title"),
  heroLead: document.getElementById("hero-lead"),
  heroCta: document.getElementById("hero-cta"),
  bookingTitle: document.getElementById("booking-title"),
  bookingNameLabel: document.getElementById("booking-name-label"),
  bookingEmailLabel: document.getElementById("booking-email-label"),
  bookingMessageHint: document.getElementById("booking-message-hint"),
  bookingMessageLabel: document.getElementById("booking-message-label"),
  bookingSubmit: document.getElementById("booking-submit"),
  portfolioTitle: document.getElementById("portfolio-title"),
  portfolioDesc: document.getElementById("portfolio-desc"),
  card1: document.getElementById("card-1-label"),
  card2: document.getElementById("card-2-label"),
  card3: document.getElementById("card-3-label"),
  card4: document.getElementById("card-4-label"),
  card5: document.getElementById("card-5-label"),
  card6: document.getElementById("card-6-label"),
  aboutTitle: document.getElementById("about-title"),
  aboutP1: document.getElementById("about-p1"),
  aboutP2: document.getElementById("about-p2"),
  aboutPageText: document.getElementById("about-page-text"),
  noteTitle: document.getElementById("note-title"),
  noteLi1: document.getElementById("note-li-1"),
  noteLi2: document.getElementById("note-li-2"),
  noteLi3: document.getElementById("note-li-3"),
  contactTitle: document.getElementById("contact-title"),
  contactDesc: document.getElementById("contact-desc"),
  contactModalTitle: document.getElementById("contact-modal-title"),
  contactModalLead: document.getElementById("contact-modal-lead"),
  contactModalMailBtn: document.getElementById("contact-modal-mail-btn"),
  contactModalInstagramBtn: document.getElementById("contact-modal-instagram-btn"),
  contactModalBookingBtn: document.getElementById("contact-modal-booking-btn"),
  footerText: document.getElementById("footer-rights")
};

let currentLanguage = "pl";
let loadedGalleryPhotos = [];
let musicTrackSources = [];
let musicTrackQueue = [];
let musicTrackQueuePointer = -1;
let musicCurrentTrackSrc = "";
let musicMutedPreference = false;
let musicShouldResumeAfterUnlock = false;
let homeGalleryRotationTimer = null;
let homeGalleryRotationStep = 0;
let homeGalleryResizeTimer = null;
let featuredSalePhotoIndexes = [];
let featuredSalePhotoSources = [];
let activeShopCategory = "all";
let activePortfolioCategory = "all";
let isHomePortfolioExpanded = false;
let siteSettings = { ...DEFAULT_SITE_SETTINGS };
let paymentStatusMessageShown = false;
let categoryPhotoSources = Object.fromEntries(
  PHOTO_CATEGORIES.map((category) => [category, []])
);
let photoSourceToIndex = new Map();
let youtubePlayer = null;
let youtubePlayerReady = false;
let youtubeProgressTimer = null;
let youtubeIsDraggingSeekbar = false;
let youtubeUiElements = null;
let youtubePlaybackStateRestored = false;
let youtubeLastPlaybackStateSavedAt = 0;
let youtubeAutoplayUnlockBound = false;
let youtubeDockCollapsed = false;
let maintenanceScreenEl = null;

const coverThumbnailCache = new Map();
const containThumbnailCache = new Map();

function normalizeLanguage(lang) {
  if (!lang) {
    return "pl";
  }
  return ENABLED_LANGUAGES.has(lang) && translations[lang] ? lang : "pl";
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function sanitizeContentOverrides(rawOverrides) {
  const safeOverrides = {};
  ENABLED_LANGUAGES.forEach((lang) => {
    safeOverrides[lang] = {};
  });

  if (!isPlainObject(rawOverrides)) {
    return safeOverrides;
  }

  ENABLED_LANGUAGES.forEach((lang) => {
    const languageOverrides = rawOverrides[lang];
    if (!isPlainObject(languageOverrides)) {
      return;
    }

    Object.entries(languageOverrides).forEach(([key, value]) => {
      if (typeof value === "string") {
        safeOverrides[lang][key] = value;
      }
    });
  });

  return safeOverrides;
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

function getContentOverridesForLanguage(lang = currentLanguage) {
  const normalizedLang = normalizeLanguage(lang);
  const contentOverrides = siteSettings?.contentOverrides;
  if (!isPlainObject(contentOverrides)) {
    return {};
  }
  const languageOverrides = contentOverrides[normalizedLang];
  if (!isPlainObject(languageOverrides)) {
    return {};
  }
  return languageOverrides;
}

function getDictionary(lang = currentLanguage) {
  const normalizedLang = normalizeLanguage(lang);
  return {
    ...translations.pl,
    ...(translations[normalizedLang] || {}),
    ...getContentOverridesForLanguage(normalizedLang)
  };
}

async function loadExternalTranslations() {
  const languagesToLoad = Array.from(ENABLED_LANGUAGES).filter(
    (lang) => translations[lang] && EXTERNAL_TRANSLATION_FILES[lang]
  );

  const results = await Promise.all(
    languagesToLoad.map(async (lang) => {
      const filePath = EXTERNAL_TRANSLATION_FILES[lang];
      try {
        const response = await fetch(filePath, { cache: "no-store" });
        if (!response.ok) {
          return false;
        }
        const data = await response.json();
        if (!isPlainObject(data)) {
          return false;
        }
        Object.assign(translations[lang], data);
        return true;
      } catch {
        return false;
      }
    })
  );

  if (results.some(Boolean)) {
    applyLanguage(currentLanguage);
  }
}

function normalizeSiteSettings(rawSettings) {
  const defaultCategoryMap = createDefaultEnabledCategories();
  if (!isPlainObject(rawSettings)) {
    return {
      ...DEFAULT_SITE_SETTINGS,
      enabledCategories: sanitizeEnabledCategories(DEFAULT_SITE_SETTINGS.enabledCategories),
      shopCategories: sanitizeEnabledCategories(defaultCategoryMap),
      portfolioCategories: sanitizeEnabledCategories(defaultCategoryMap),
      contentOverrides: sanitizeContentOverrides(DEFAULT_SITE_SETTINGS.contentOverrides)
    };
  }

  const legacyEnabledCategories = sanitizeEnabledCategories(rawSettings.enabledCategories);
  const shopCategories = hasAnyCategoryFlag(rawSettings.shopCategories)
    ? sanitizeEnabledCategories(rawSettings.shopCategories)
    : sanitizeEnabledCategories(legacyEnabledCategories);
  const portfolioCategories = hasAnyCategoryFlag(rawSettings.portfolioCategories)
    ? sanitizeEnabledCategories(rawSettings.portfolioCategories)
    : sanitizeEnabledCategories(legacyEnabledCategories);

  return {
    ...DEFAULT_SITE_SETTINGS,
    ...rawSettings,
    blogEnabled: rawSettings.blogEnabled !== false,
    bookingEnabled: rawSettings.bookingEnabled !== false,
    maintenanceMode: Boolean(rawSettings.maintenanceMode),
    enabledCategories: legacyEnabledCategories,
    shopCategories,
    portfolioCategories,
    contentOverrides: sanitizeContentOverrides(rawSettings.contentOverrides)
  };
}

function readSiteSettings() {
  try {
    const raw = localStorage.getItem(SITE_SETTINGS_STORAGE_KEY);
    if (!raw) {
      return normalizeSiteSettings(DEFAULT_SITE_SETTINGS);
    }
    const parsed = JSON.parse(raw);
    return normalizeSiteSettings(parsed);
  } catch {
    return normalizeSiteSettings(DEFAULT_SITE_SETTINGS);
  }
}

function writeSiteSettingsToLocalStorage(settings) {
  try {
    const normalized = normalizeSiteSettings(settings);
    localStorage.setItem(SITE_SETTINGS_STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // Ignore localStorage write errors.
  }
}

async function apiJsonRequest(path, options = {}) {
  if (window.location.protocol === "file:") {
    return null;
  }

  const method = options.method || "GET";
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

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
    return null;
  }
}

async function fetchSiteSettingsFromApi() {
  const result = await apiJsonRequest("/settings");
  if (!result?.ok || !isPlainObject(result.data)) {
    return null;
  }

  const rawSettings = isPlainObject(result.data.settings) ? result.data.settings : {};
  const remoteSettings = normalizeSiteSettings(rawSettings);
  if (
    !Object.prototype.hasOwnProperty.call(rawSettings, "blogEnabled") &&
    typeof siteSettings.blogEnabled === "boolean"
  ) {
    remoteSettings.blogEnabled = siteSettings.blogEnabled;
  }
  if (
    !Object.prototype.hasOwnProperty.call(rawSettings, "bookingEnabled") &&
    typeof siteSettings.bookingEnabled === "boolean"
  ) {
    remoteSettings.bookingEnabled = siteSettings.bookingEnabled;
  }
  if (
    !Object.prototype.hasOwnProperty.call(rawSettings, "maintenanceMode") &&
    typeof siteSettings.maintenanceMode === "boolean"
  ) {
    remoteSettings.maintenanceMode = siteSettings.maintenanceMode;
  }
  if (!isPlainObject(rawSettings.enabledCategories) && isPlainObject(siteSettings.enabledCategories)) {
    remoteSettings.enabledCategories = sanitizeEnabledCategories(siteSettings.enabledCategories);
  }
  if (!hasAnyCategoryFlag(rawSettings.shopCategories) && isPlainObject(siteSettings.shopCategories)) {
    remoteSettings.shopCategories = sanitizeEnabledCategories(siteSettings.shopCategories);
  }
  if (
    !hasAnyCategoryFlag(rawSettings.portfolioCategories) &&
    isPlainObject(siteSettings.portfolioCategories)
  ) {
    remoteSettings.portfolioCategories = sanitizeEnabledCategories(siteSettings.portfolioCategories);
  }
  writeSiteSettingsToLocalStorage(remoteSettings);
  return remoteSettings;
}

function readAdminInbox() {
  try {
    const raw = localStorage.getItem(ADMIN_INBOX_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item) => isPlainObject(item));
  } catch {
    return [];
  }
}

function saveAdminInboxMessage(messageData) {
  if (!isPlainObject(messageData)) {
    return;
  }

  const timestamp = new Date().toISOString();
  const nextMessage = {
    ...messageData,
    createdAt: timestamp
  };

  const currentMessages = readAdminInbox();
  const nextMessages = [nextMessage, ...currentMessages].slice(0, 500);
  localStorage.setItem(ADMIN_INBOX_STORAGE_KEY, JSON.stringify(nextMessages));
  void apiJsonRequest("/inbox", {
    method: "POST",
    body: messageData
  });
}

function readAdminOrders() {
  try {
    const raw = localStorage.getItem(ADMIN_ORDERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item) => isPlainObject(item));
  } catch {
    return [];
  }
}

function saveAdminOrder(orderData, options = {}) {
  if (!isPlainObject(orderData)) {
    return;
  }

  const shouldSyncApi = options.syncApi !== false;
  const nextOrder = {
    ...orderData,
    createdAt: new Date().toISOString()
  };
  const currentOrders = readAdminOrders();
  const nextOrders = [nextOrder, ...currentOrders].slice(0, 500);
  localStorage.setItem(ADMIN_ORDERS_STORAGE_KEY, JSON.stringify(nextOrders));
  if (shouldSyncApi) {
    void apiJsonRequest("/orders", {
      method: "POST",
      body: orderData
    });
  }
}

function getPrintSizeOption(sizeValue = PRINT_SIZE_OPTIONS[0].value) {
  return (
    PRINT_SIZE_OPTIONS.find((option) => option.value === sizeValue) ||
    PRINT_SIZE_OPTIONS[0]
  );
}

function formatPricePln(pricePln) {
  const formatter = new Intl.NumberFormat(currentLanguage === "pl" ? "pl-PL" : "en-US");
  return `${formatter.format(pricePln)} PLN`;
}

function getSizeOptionLabel(option) {
  return `${option.value} - ${formatPricePln(option.pricePln)}`;
}

function getPaymentMethodLabel(paymentMethodValue, dictionary = getDictionary()) {
  const entry = ORDER_PAYMENT_METHODS.find((item) => item.value === paymentMethodValue);
  if (!entry) {
    return paymentMethodValue || "-";
  }
  return dictionary[entry.labelKey] || paymentMethodValue;
}

function getCarrierLabel(carrierValue, dictionary = getDictionary()) {
  const entry = ORDER_COURIERS.find((item) => item.value === carrierValue);
  if (!entry) {
    return carrierValue || "-";
  }
  return dictionary[entry.labelKey] || carrierValue;
}

function populateOrderPaymentMethodOptions(selectedMethod = ORDER_PAYMENT_METHODS[0].value) {
  if (!orderPaymentMethodSelect) {
    return;
  }

  const dictionary = getDictionary();
  orderPaymentMethodSelect.innerHTML = "";

  ORDER_PAYMENT_METHODS.forEach((entry) => {
    const option = document.createElement("option");
    option.value = entry.value;
    option.textContent = dictionary[entry.labelKey] || entry.value;
    orderPaymentMethodSelect.append(option);
  });

  const fallbackValue = ORDER_PAYMENT_METHODS[0].value;
  const hasSelected = ORDER_PAYMENT_METHODS.some((entry) => entry.value === selectedMethod);
  orderPaymentMethodSelect.value = hasSelected ? selectedMethod : fallbackValue;
}

function populateOrderCarrierOptions(selectedCarrier = ORDER_COURIERS[0].value) {
  if (!orderCarrierSelect) {
    return;
  }

  const dictionary = getDictionary();
  orderCarrierSelect.innerHTML = "";

  ORDER_COURIERS.forEach((entry) => {
    const option = document.createElement("option");
    option.value = entry.value;
    option.textContent = dictionary[entry.labelKey] || entry.value;
    orderCarrierSelect.append(option);
  });

  const fallbackValue = ORDER_COURIERS[0].value;
  const hasSelected = ORDER_COURIERS.some((entry) => entry.value === selectedCarrier);
  orderCarrierSelect.value = hasSelected ? selectedCarrier : fallbackValue;
}

function serializeSiteSettings(settings) {
  try {
    return JSON.stringify(normalizeSiteSettings(settings));
  } catch {
    return "";
  }
}

function getCategorySettingsForArea(area = "portfolio") {
  if (area === "shop") {
    return sanitizeEnabledCategories(siteSettings?.shopCategories);
  }
  return sanitizeEnabledCategories(siteSettings?.portfolioCategories);
}

function isCategoryEnabled(category, area = "portfolio") {
  if (!PHOTO_CATEGORIES.includes(category)) {
    return false;
  }
  const enabledCategories = getCategorySettingsForArea(area);
  return enabledCategories[category] !== false;
}

function getEnabledCategoryKeys(area = "portfolio") {
  return PHOTO_CATEGORIES.filter((category) => isCategoryEnabled(category, area));
}

function getAllEnabledPhotos(area = "portfolio") {
  const combined = [];
  const seen = new Set();
  getEnabledCategoryKeys(area).forEach((category) => {
    const photos = Array.isArray(categoryPhotoSources[category]) ? categoryPhotoSources[category] : [];
    photos.forEach((src) => {
      if (!src || seen.has(src)) {
        return;
      }
      seen.add(src);
      combined.push(src);
    });
  });

  if (combined.length) {
    return combined;
  }

  const hasAnyCategorizedPhotos = PHOTO_CATEGORIES.some((category) => {
    const entries = categoryPhotoSources[category];
    return Array.isArray(entries) && entries.length > 0;
  });
  if (hasAnyCategorizedPhotos) {
    return [];
  }

  // Fallback for legacy structures where only root list exists.
  const legacy = [];
  loadedGalleryPhotos.forEach((src) => {
    if (!src || seen.has(src)) {
      return;
    }
    seen.add(src);
    legacy.push(src);
  });
  return legacy;
}

function applyCategoryTabVisibility() {
  const updateButtons = (buttons, dataKey, activeCategory) => {
    buttons.forEach((button) => {
      const category = button.dataset[dataKey] || "";
      const area = dataKey === "shopTab" ? "shop" : "portfolio";
      const hide = category !== "all" && !isCategoryEnabled(category, area);
      button.hidden = hide;
      button.disabled = hide;
      button.setAttribute("aria-hidden", String(hide));
      button.tabIndex = hide ? -1 : 0;

      const isActive = !hide && category === activeCategory;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  updateButtons(shopTabButtons, "shopTab", activeShopCategory);
  updateButtons(portfolioTabButtons, "portfolioTab", activePortfolioCategory);
}

function ensureMaintenanceScreenElement() {
  if (maintenanceScreenEl) {
    return maintenanceScreenEl;
  }

  const existing = document.getElementById("maintenance-screen");
  if (existing) {
    maintenanceScreenEl = existing;
    return maintenanceScreenEl;
  }

  if (!document.body) {
    return null;
  }

  const section = document.createElement("section");
  section.id = "maintenance-screen";
  section.className = "section maintenance-screen";
  section.hidden = true;
  section.innerHTML = `
    <p class="kicker">Cause Love Photography</p>
    <h1 data-maintenance-title></h1>
    <p class="lead" data-maintenance-desc></p>
  `;

  if (siteHeaderEl && siteHeaderEl.parentElement) {
    siteHeaderEl.insertAdjacentElement("afterend", section);
  } else {
    document.body.prepend(section);
  }

  maintenanceScreenEl = section;
  return maintenanceScreenEl;
}

function updateMaintenanceScreenText() {
  const screen = ensureMaintenanceScreenElement();
  if (!screen) {
    return;
  }

  const dictionary = getDictionary();
  const titleEl = screen.querySelector("[data-maintenance-title]");
  const descEl = screen.querySelector("[data-maintenance-desc]");

  if (titleEl) {
    titleEl.textContent = dictionary.maintenanceTitle || "Przerwa techniczna";
  }
  if (descEl) {
    descEl.textContent =
      dictionary.maintenanceDesc ||
      "Przepraszamy, strona jest chwilowo niedostępna. Spróbuj ponownie za chwilę.";
  }
}

function hideActiveOverlaysForMaintenance() {
  [modalEl, inquiryModalEl, orderModalEl, bookingModalEl, quickContactModalEl].forEach((overlay) => {
    if (overlay) {
      overlay.hidden = true;
    }
  });

  if (modalAudioEl) {
    modalAudioEl.pause();
    modalAudioEl.currentTime = 0;
  }

  if (youtubePlayer) {
    youtubePlayer.pause();
    saveYouTubePlaybackState(true);
  }

  document.body.style.overflow = "";
}

function applySiteSettings() {
  const maintenanceMode = siteSettings.maintenanceMode === true;
  const shopEnabled = siteSettings.shopEnabled !== false;
  const blogEnabled = siteSettings.blogEnabled !== false;
  const bookingEnabled = siteSettings.bookingEnabled !== false;
  const maintenanceScreen = ensureMaintenanceScreenElement();

  if (maintenanceScreen) {
    updateMaintenanceScreenText();
    maintenanceScreen.hidden = !maintenanceMode;
  }
  if (siteHeaderEl) {
    siteHeaderEl.hidden = maintenanceMode;
  }
  if (siteMainEl) {
    siteMainEl.hidden = maintenanceMode;
  }
  if (siteFooterEl) {
    siteFooterEl.hidden = maintenanceMode;
  }

  document.body.classList.toggle("maintenance-mode", maintenanceMode);

  if (maintenanceMode) {
    stopHomeGalleryRotation();
    hideActiveOverlaysForMaintenance();
  } else if (
    loadedGalleryPhotos.length &&
    !isHomePortfolioExpanded &&
    document.querySelector(".gallery .card")
  ) {
    startHomeGalleryRotation(loadedGalleryPhotos);
  }

  if (translatableNodes.navShop) {
    translatableNodes.navShop.hidden = !shopEnabled;
    translatableNodes.navShop.setAttribute("aria-hidden", String(!shopEnabled));
    translatableNodes.navShop.style.display = shopEnabled ? "" : "none";
    translatableNodes.navShop.tabIndex = shopEnabled ? 0 : -1;
  }
  if (translatableNodes.navBlog) {
    translatableNodes.navBlog.hidden = !blogEnabled;
    translatableNodes.navBlog.setAttribute("aria-hidden", String(!blogEnabled));
    translatableNodes.navBlog.style.display = blogEnabled ? "" : "none";
    translatableNodes.navBlog.tabIndex = blogEnabled ? 0 : -1;
  }

  document.body.classList.toggle("shop-link-hidden", !shopEnabled);
  document.body.classList.toggle("blog-link-hidden", !blogEnabled);

  if (shopMainEl) {
    shopMainEl.hidden = maintenanceMode || !shopEnabled;
  }
  if (shopHomeSectionEl) {
    shopHomeSectionEl.hidden = maintenanceMode || !shopEnabled;
  }
  if (shopDisabledSectionEl) {
    shopDisabledSectionEl.hidden = maintenanceMode || shopEnabled;
  }
  if (blogMainEl) {
    blogMainEl.hidden = maintenanceMode || !blogEnabled;
  }
  if (blogDisabledSectionEl) {
    blogDisabledSectionEl.hidden = maintenanceMode || blogEnabled;
  }

  if (heroCtaEl) {
    heroCtaEl.hidden = !bookingEnabled;
  }
  if (contactModalBookingBtn) {
    contactModalBookingBtn.hidden = !bookingEnabled;
  }
  if (!bookingEnabled && bookingModalEl && !bookingModalEl.hidden) {
    closeBookingModal();
  }

  if (!isCategoryEnabled(activeShopCategory, "shop")) {
    activeShopCategory = "all";
  }
  if (!isCategoryEnabled(activePortfolioCategory, "portfolio")) {
    activePortfolioCategory = "all";
  }
  applyCategoryTabVisibility();
}

async function refreshSiteSettings() {
  const currentSerialized = serializeSiteSettings(siteSettings);
  const localSettings = readSiteSettings();
  const localSerialized = serializeSiteSettings(localSettings);

  if (localSerialized && localSerialized !== currentSerialized) {
    siteSettings = localSettings;
    applySiteSettings();
    applyLanguage(currentLanguage);
  }

  const remoteSettings = await fetchSiteSettingsFromApi();
  if (!remoteSettings) {
    return;
  }

  const remoteSerialized = serializeSiteSettings(remoteSettings);
  const activeSerialized = serializeSiteSettings(siteSettings);
  if (remoteSerialized && remoteSerialized !== activeSerialized) {
    siteSettings = remoteSettings;
    applySiteSettings();
    applyLanguage(currentLanguage);
  }
}

function updateCardAccessibilityLabels() {
  const dictionary = getDictionary();
  const labelPrefix = dictionary.openPhotoPrefix;

  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `${labelPrefix} ${index + 1}`);
  });

  const artFrames = document.querySelectorAll(".art-frame");
  artFrames.forEach((frame, index) => {
    frame.setAttribute("role", "button");
    frame.setAttribute("tabindex", "0");
    frame.setAttribute("aria-label", `${labelPrefix} ${index + 1}`);
  });
}

function updateThemeButtonLabel() {
  if (!themeToggleBtn) {
    return;
  }

  const dictionary = getDictionary();
  const isDark = document.body.dataset.theme === "dark";
  themeToggleBtn.textContent = isDark
    ? dictionary.themeToLight
    : dictionary.themeToDark;
  themeToggleBtn.setAttribute(
    "aria-label",
    isDark ? dictionary.ariaThemeToLight : dictionary.ariaThemeToDark
  );
  themeToggleBtn.setAttribute("aria-pressed", String(!isDark));
}

function updateMusicButtonState() {
  if (!musicToggleBtn) {
    return;
  }

  const dictionary = getDictionary();
  const hasMusic = musicTrackSources.length > 0;
  musicToggleBtn.classList.toggle("is-disabled", !hasMusic);
  musicToggleBtn.disabled = !hasMusic;

  if (!hasMusic) {
    musicToggleBtn.classList.remove("is-muted");
    musicToggleBtn.setAttribute("aria-label", dictionary.ariaNoMusic);
    return;
  }

  const isMuted = youtubePlayer ? youtubePlayer.muted : musicMutedPreference;
  musicToggleBtn.classList.toggle("is-muted", isMuted);
  musicToggleBtn.setAttribute(
    "aria-label",
    isMuted ? dictionary.ariaUnmuteMusic : dictionary.ariaMuteMusic
  );
}

function applyLanguage(lang, saveChoice = false) {
  const nextLang = normalizeLanguage(lang);
  const dictionary = getDictionary(nextLang);
  currentLanguage = nextLang;
  document.documentElement.lang = nextLang;

  if (isShopPage) {
    document.title = dictionary.shopPageTitle;
  } else if (isPortfolioPage) {
    document.title = dictionary.portfolioPageTitle;
  } else if (isBlogPage) {
    document.title = dictionary.blogPageTitle;
  } else if (isAboutPage) {
    document.title = `${dictionary.navAbout} | Cause Love Photography`;
  } else if (isContactPage) {
    document.title = `${dictionary.navContact} | Cause Love Photography`;
  } else {
    document.title = "Cause Love Photography";
  }

  Object.entries(translatableNodes).forEach(([key, node]) => {
    if (!node) {
      return;
    }
    if (key === "portfolioDesc") {
      node.innerHTML = dictionary[key];
    } else {
      node.textContent = dictionary[key];
    }
  });

  updateArtGalleryCaptions();
  if (portfolioMoreBtnEl && homePortfolioExpandedEl) {
    portfolioMoreBtnEl.textContent = isHomePortfolioExpanded
      ? dictionary.portfolioHideBtn
      : dictionary.portfolioMoreBtn;
  }
  if (portfolioCollapseBtnEl) {
    portfolioCollapseBtnEl.textContent = dictionary.portfolioHideBtn;
  }
  updateMaintenanceScreenText();

  if (inquiryMessageInput) {
    inquiryMessageInput.placeholder = dictionary.inquiryMessagePlaceholder;
  }
  if (inquiryCloseBtn) {
    inquiryCloseBtn.setAttribute("aria-label", dictionary.inquiryCloseAria);
  }
  if (orderMessageInput) {
    orderMessageInput.placeholder = dictionary.orderMessagePlaceholder;
  }
  if (orderCloseBtn) {
    orderCloseBtn.setAttribute("aria-label", dictionary.orderCloseAria);
  }
  if (bookingMessageInput) {
    bookingMessageInput.placeholder = dictionary.bookingMessagePlaceholder;
  }
  if (bookingCloseBtn) {
    bookingCloseBtn.setAttribute("aria-label", dictionary.bookingCloseAria);
  }
  if (quickContactCloseBtn) {
    quickContactCloseBtn.setAttribute("aria-label", dictionary.contactModalCloseAria);
  }
  const customSizeOption = document.getElementById("inquiry-size-custom");
  if (customSizeOption) {
    customSizeOption.textContent = dictionary.inquiryCustomSize;
  }
  const currentPaymentMethod =
    orderPaymentMethodSelect?.value || ORDER_PAYMENT_METHODS[0].value;
  const currentCarrier = orderCarrierSelect?.value || ORDER_COURIERS[0].value;
  populateOrderPaymentMethodOptions(currentPaymentMethod);
  populateOrderCarrierOptions(currentCarrier);

  if (hasShopUi) {
    const currentSelectedPhoto = Number.parseInt(
      inquiryPhotoInput?.value || "0",
      10
    );
    const currentOrderSelectedPhoto = Number.parseInt(
      orderPhotoInput?.value || "0",
      10
    );
    const currentOrderSize =
      orderSizeSelect?.value || PRINT_SIZE_OPTIONS[0].value;
    if (loadedGalleryPhotos.length) {
      void buildShopGallery();
      void buildFeaturedSaleGallery(getPhotosByCategory("all", "shop"));
      populateInquiryPhotoOptions(
        Number.isNaN(currentSelectedPhoto) ? 0 : currentSelectedPhoto
      );
      populateOrderPhotoOptions(
        Number.isNaN(currentOrderSelectedPhoto) ? 0 : currentOrderSelectedPhoto
      );
      populateOrderSizeOptions(currentOrderSize);
      updateOrderPriceLabel(currentOrderSize);
    } else if (shopEmptyEl) {
      shopEmptyEl.textContent = dictionary.shopEmptyMsg;
      void buildFeaturedSaleGallery([]);
      populateInquiryPhotoOptions(0);
      populateOrderPhotoOptions(0);
      populateOrderSizeOptions(PRINT_SIZE_OPTIONS[0].value);
      updateOrderPriceLabel(PRINT_SIZE_OPTIONS[0].value);
    }
  }

  if (isPortfolioPage && loadedGalleryPhotos.length) {
    updatePortfolioTabState();
    void buildPortfolioGallery(getPortfolioPhotosByCategory(activePortfolioCategory));
  } else if (!isPortfolioPage && loadedGalleryPhotos.length) {
    if (isHomePortfolioExpanded) {
      void buildHomePortfolioExpandedGallery();
    } else {
      void renderHomeGalleryPhotos(loadedGalleryPhotos, homeGalleryRotationStep);
    }
  }

  langButtons.forEach((button) => {
    const buttonLang = button.dataset.lang || "pl";
    const isActive = buttonLang === nextLang;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (modalHintEl) {
    modalHintEl.textContent = dictionary.modalHint;
  }
  if (modalCloseBtn) {
    modalCloseBtn.setAttribute("aria-label", dictionary.ariaCloseModal);
  }

  updateCardAccessibilityLabels();
  updateThemeButtonLabel();
  updateMusicButtonState();
  updateYouTubePlayerText();

  if (saveChoice) {
    localStorage.setItem(LANG_STORAGE_KEY, nextLang);
  }
}

function setTheme(theme, saveChoice = false) {
  document.body.dataset.theme = theme;
  updateThemeButtonLabel();

  if (saveChoice) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}

function setMusicMuted(shouldMute, saveChoice = false) {
  musicMutedPreference = Boolean(shouldMute);
  if (modalAudioEl) {
    modalAudioEl.muted = musicMutedPreference;
  }
  if (youtubePlayer) {
    youtubePlayer.muted = musicMutedPreference;
  }
  updateMusicButtonState();

  if (saveChoice) {
    localStorage.setItem(
      MUSIC_MUTED_STORAGE_KEY,
      musicMutedPreference ? "1" : "0"
    );
  }
}

function normalizeMusicTrackEntry(entry, directoryPath = MUSIC_TRACKS_FOLDER) {
  if (!entry || typeof entry !== "string") {
    return null;
  }

  const trimmed = entry.trim();
  if (!trimmed) {
    return null;
  }

  if (
    trimmed.startsWith("./") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed;
  }

  const basePath = normalizePhotoDirectoryPath(directoryPath);
  return `${basePath}/${encodeURIComponent(trimmed)}`;
}

function normalizeMusicTrackList(entries, directoryPath = MUSIC_TRACKS_FOLDER) {
  if (!Array.isArray(entries)) {
    return [];
  }
  return entries
    .map((entry) => normalizeMusicTrackEntry(entry, directoryPath))
    .filter(Boolean);
}

async function findMusicTracksFromManifest() {
  const data = await loadManifestJson(`${MUSIC_TRACKS_FOLDER}/tracks.json`);
  if (!Array.isArray(data)) {
    return [];
  }
  return [...new Set(normalizeMusicTrackList(data, MUSIC_TRACKS_FOLDER))];
}

async function findMusicTracksFromDirectoryListing() {
  try {
    const basePath = normalizePhotoDirectoryPath(MUSIC_TRACKS_FOLDER);
    const response = await fetch(`${basePath}/`, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const links = Array.from(doc.querySelectorAll("a[href]")).map((node) =>
      node.getAttribute("href")
    );

    const found = [];
    links.forEach((href) => {
      if (!href) {
        return;
      }

      const cleanHref = href.split("#")[0].split("?")[0];
      if (!cleanHref || cleanHref.endsWith("/")) {
        return;
      }

      const decodedName = decodeURIComponent(cleanHref).split("/").pop();
      if (!decodedName) {
        return;
      }

      const ext = decodedName.split(".").pop()?.toLowerCase();
      if (!ext || !MUSIC_FILE_EXTENSIONS.includes(ext)) {
        return;
      }

      found.push(`${basePath}/${encodeURIComponent(decodedName)}`);
    });

    return [...new Set(found)];
  } catch {
    return [];
  }
}

function decodeTrackLabelFromSource(src = "") {
  const filename = decodeURIComponent(String(src).split("/").pop() || "");
  if (!filename) {
    return "";
  }
  return filename.replace(/\.[^.]+$/, "");
}

function shuffleArrayInPlace(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [items[i], items[randomIndex]] = [items[randomIndex], items[i]];
  }
}

function getCurrentQueuedTrackSource() {
  if (
    musicTrackQueuePointer < 0 ||
    musicTrackQueuePointer >= musicTrackQueue.length
  ) {
    return "";
  }
  return musicTrackQueue[musicTrackQueuePointer] || "";
}

function appendRandomTrackChunk(avoidSrc = "") {
  if (!musicTrackSources.length) {
    return;
  }
  const chunk = [...musicTrackSources];
  shuffleArrayInPlace(chunk);

  if (chunk.length > 1 && avoidSrc && chunk[0] === avoidSrc) {
    const shifted = chunk.shift();
    if (shifted) {
      chunk.push(shifted);
    }
  }

  musicTrackQueue.push(...chunk);
}

function readYouTubePlaybackState() {
  try {
    const raw = sessionStorage.getItem(YOUTUBE_SESSION_STATE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!isPlainObject(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveYouTubePlaybackState(force = false) {
  if (!youtubePlayer) {
    return;
  }

  const now = Date.now();
  if (!force && now - youtubeLastPlaybackStateSavedAt < 900) {
    return;
  }
  youtubeLastPlaybackStateSavedAt = now;

  const queueWindowStart = Math.max(0, musicTrackQueuePointer - 10);
  const queueWindowEnd = Math.min(
    musicTrackQueue.length,
    Math.max(musicTrackQueuePointer + 70, 70)
  );
  const queueSlice = musicTrackQueue.slice(queueWindowStart, queueWindowEnd);

  const payload = {
    queue: queueSlice,
    queuePointer: musicTrackQueuePointer - queueWindowStart,
    trackSrc: musicCurrentTrackSrc || getCurrentQueuedTrackSource(),
    currentTime: Number.isFinite(youtubePlayer.currentTime)
      ? Math.floor(Math.max(0, youtubePlayer.currentTime))
      : 0,
    isPlaying: !youtubePlayer.paused,
    isMuted: Boolean(youtubePlayer.muted),
    updatedAt: now
  };

  try {
    sessionStorage.setItem(YOUTUBE_SESSION_STATE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore sessionStorage write errors.
  }
}

function isYouTubeAutoplayUnlocked() {
  try {
    return localStorage.getItem(YOUTUBE_AUTOPLAY_UNLOCKED_KEY) === "1";
  } catch {
    return false;
  }
}

function markYouTubeAutoplayUnlocked() {
  try {
    localStorage.setItem(YOUTUBE_AUTOPLAY_UNLOCKED_KEY, "1");
  } catch {
    // Ignore localStorage write errors.
  }
}

function shouldYouTubeAutoplayAfterLoad() {
  return true;
}

function readYouTubeDockCollapsedState() {
  try {
    return localStorage.getItem(YOUTUBE_DOCK_COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

function saveYouTubeDockCollapsedState() {
  try {
    localStorage.setItem(
      YOUTUBE_DOCK_COLLAPSED_KEY,
      youtubeDockCollapsed ? "1" : "0"
    );
  } catch {
    // Ignore localStorage write errors.
  }
}

function updateYouTubeDockToggleButtonText() {
  if (!youtubeUiElements?.toggleButton) {
    return;
  }
  const dictionary = getDictionary();
  const label = youtubeDockCollapsed
    ? dictionary.ytShowPlayer || "Show player"
    : dictionary.ytHidePlayer || "Hide player";
  youtubeUiElements.toggleButton.textContent = youtubeDockCollapsed ? "♫" : "×";
  youtubeUiElements.toggleButton.setAttribute("aria-label", label);
  youtubeUiElements.toggleButton.setAttribute("title", label);
}

function setYouTubeDockCollapsed(nextCollapsed, saveChoice = false) {
  youtubeDockCollapsed = Boolean(nextCollapsed);
  if (youtubeUiElements?.dock) {
    youtubeUiElements.dock.classList.toggle("is-collapsed", youtubeDockCollapsed);
  }
  if (youtubeUiElements?.toggleButton) {
    youtubeUiElements.toggleButton.classList.toggle("is-collapsed", youtubeDockCollapsed);
  }
  updateYouTubeDockToggleButtonText();
  if (saveChoice) {
    saveYouTubeDockCollapsedState();
  }
}

function bindYouTubeAutoplayUnlockOnInteraction() {
  if (youtubeAutoplayUnlockBound) {
    return;
  }
  youtubeAutoplayUnlockBound = true;

  const unlockPlayback = () => {
    if (!youtubePlayer || !musicShouldResumeAfterUnlock) {
      return;
    }

    markYouTubeAutoplayUnlocked();
    const playAttempt = youtubePlayer.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {
        musicShouldResumeAfterUnlock = true;
        youtubeAutoplayUnlockBound = false;
        bindYouTubeAutoplayUnlockOnInteraction();
      });
    }
    musicShouldResumeAfterUnlock = false;
    youtubeAutoplayUnlockBound = false;
    saveYouTubePlaybackState(true);
    updateYouTubePlayerText();
  };

  const pointerHandler = () => {
    unlockPlayback();
  };
  const keyHandler = () => {
    unlockPlayback();
  };

  window.addEventListener("pointerdown", pointerHandler, {
    capture: true,
    once: true,
    passive: true
  });
  window.addEventListener("touchstart", pointerHandler, {
    capture: true,
    once: true,
    passive: true
  });
  window.addEventListener("keydown", keyHandler, { capture: true, once: true });
}

function formatMediaTime(totalSeconds) {
  const safeSeconds = Number.isFinite(totalSeconds)
    ? Math.max(0, Math.floor(totalSeconds))
    : 0;
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateYouTubePlayerText() {
  if (!youtubeUiElements) {
    return;
  }

  const dictionary = getDictionary();
  const {
    title,
    prevButton,
    playButton,
    nextButton,
    muteButton,
    openButton,
    seekInput
  } = youtubeUiElements;

  const hasTracks = musicTrackSources.length > 0;
  const isPlaying = Boolean(youtubePlayer && !youtubePlayer.paused);
  const isMuted = youtubePlayer ? youtubePlayer.muted : musicMutedPreference;
  const currentLabel = decodeTrackLabelFromSource(getCurrentQueuedTrackSource());

  if (!currentLabel) {
    title.textContent = hasTracks ? dictionary.ytLoading : dictionary.ytTitleFallback;
    title.dataset.isFallback = "1";
  }

  prevButton.disabled = !hasTracks || musicTrackQueuePointer <= 0;
  nextButton.disabled = !hasTracks;
  playButton.disabled = !hasTracks;
  muteButton.disabled = !hasTracks;
  openButton.disabled = !hasTracks;
  seekInput.disabled = !hasTracks;

  prevButton.setAttribute("aria-label", dictionary.ytPrev);
  prevButton.setAttribute("title", dictionary.ytPrev);
  nextButton.setAttribute("aria-label", dictionary.ytNext);
  nextButton.setAttribute("title", dictionary.ytNext);
  openButton.textContent = dictionary.ytOpenOnYoutube;
  openButton.setAttribute("aria-label", dictionary.ytOpenOnYoutube);
  openButton.setAttribute("title", dictionary.ytOpenOnYoutube);
  seekInput.setAttribute("aria-label", dictionary.ytSeekAria);

  playButton.textContent = isPlaying ? dictionary.ytPause : dictionary.ytPlay;
  playButton.setAttribute("aria-label", isPlaying ? dictionary.ytPause : dictionary.ytPlay);
  playButton.setAttribute("title", isPlaying ? dictionary.ytPause : dictionary.ytPlay);

  const muteLabel = isMuted ? dictionary.ytUnmute : dictionary.ytMute;
  muteButton.textContent = muteLabel;
  muteButton.setAttribute("aria-label", muteLabel);
  muteButton.setAttribute("title", muteLabel);
  updateYouTubeDockToggleButtonText();
}

function updateYouTubeTrackTitle() {
  if (!youtubeUiElements) {
    return;
  }

  const dictionary = getDictionary();
  const currentLabel = decodeTrackLabelFromSource(getCurrentQueuedTrackSource());
  if (currentLabel) {
    youtubeUiElements.title.textContent = currentLabel;
    youtubeUiElements.title.dataset.isFallback = "0";
    return;
  }

  youtubeUiElements.title.textContent = musicTrackSources.length
    ? dictionary.ytLoading
    : dictionary.ytTitleFallback;
  youtubeUiElements.title.dataset.isFallback = "1";
}

function updateYouTubeProgress() {
  if (!youtubeUiElements) {
    return;
  }

  const current = Number(youtubePlayer?.currentTime || 0);
  const duration = Number(youtubePlayer?.duration || 0);
  const safeDuration = Number.isFinite(duration) ? Math.max(0, duration) : 0;
  const safeCurrent = Number.isFinite(current) ? Math.max(0, current) : 0;
  const canSeek = musicTrackSources.length > 0 && safeDuration > 0;

  youtubeUiElements.seekInput.disabled = !canSeek;
  if (canSeek) {
    youtubeUiElements.seekInput.max = String(Math.floor(safeDuration));
    if (!youtubeIsDraggingSeekbar) {
      youtubeUiElements.seekInput.value = String(Math.floor(safeCurrent));
    }
  } else {
    youtubeUiElements.seekInput.max = "0";
    youtubeUiElements.seekInput.value = "0";
  }

  youtubeUiElements.time.textContent = `${formatMediaTime(safeCurrent)} / ${formatMediaTime(
    safeDuration
  )}`;
}

function stopYouTubeProgressUpdates() {
  if (!youtubeProgressTimer) {
    return;
  }
  window.clearInterval(youtubeProgressTimer);
  youtubeProgressTimer = null;
}

function startYouTubeProgressUpdates() {
  stopYouTubeProgressUpdates();
  youtubeProgressTimer = window.setInterval(() => {
    updateYouTubeProgress();
    saveYouTubePlaybackState();
  }, 500);
}

function playCurrentQueuedTrack(options = {}) {
  if (!youtubePlayer || !musicTrackSources.length) {
    return false;
  }

  const { autoPlay = true, seekSeconds = 0, saveState = true } = options;
  const trackSrc = getCurrentQueuedTrackSource();
  if (!trackSrc) {
    return false;
  }

  const shouldChangeTrack = musicCurrentTrackSrc !== trackSrc;
  musicCurrentTrackSrc = trackSrc;

  if (shouldChangeTrack) {
    youtubePlayer.src = trackSrc;
    youtubePlayer.load();
  }

  const safeSeek = Number.isFinite(seekSeconds) ? Math.max(0, seekSeconds) : 0;
  if (safeSeek > 0) {
    const applySeek = () => {
      try {
        youtubePlayer.currentTime = safeSeek;
      } catch {
        // Ignore seek errors for files that are not ready yet.
      }
    };
    if (youtubePlayer.readyState >= 1) {
      applySeek();
    } else {
      youtubePlayer.addEventListener("loadedmetadata", applySeek, { once: true });
    }
  }

  if (autoPlay) {
    const playAttempt = youtubePlayer.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {
        musicShouldResumeAfterUnlock = true;
        bindYouTubeAutoplayUnlockOnInteraction();
      });
    }
  } else {
    youtubePlayer.pause();
  }

  updateYouTubeTrackTitle();
  updateYouTubePlayerText();
  updateYouTubeProgress();
  if (saveState) {
    saveYouTubePlaybackState(true);
  }
  return true;
}

function playPreviousQueuedTrack() {
  if (!musicTrackSources.length || musicTrackQueuePointer <= 0) {
    return false;
  }
  musicTrackQueuePointer -= 1;
  return playCurrentQueuedTrack({ autoPlay: true });
}

function playRandomYouTubeTrack() {
  if (!musicTrackSources.length) {
    return false;
  }

  if (!musicTrackQueue.length) {
    appendRandomTrackChunk("");
    musicTrackQueuePointer = 0;
    return playCurrentQueuedTrack({ autoPlay: true });
  }

  if (musicTrackQueuePointer < musicTrackQueue.length - 1) {
    musicTrackQueuePointer += 1;
    return playCurrentQueuedTrack({ autoPlay: true });
  }

  appendRandomTrackChunk(getCurrentQueuedTrackSource());
  if (musicTrackQueuePointer < musicTrackQueue.length - 1) {
    musicTrackQueuePointer += 1;
  }

  return playCurrentQueuedTrack({ autoPlay: true });
}

function restoreYouTubePlaybackState() {
  if (youtubePlaybackStateRestored || !youtubePlayer || !musicTrackSources.length) {
    return false;
  }
  youtubePlaybackStateRestored = true;

  const savedState = readYouTubePlaybackState();
  if (!savedState) {
    return false;
  }

  const savedQueueRaw = Array.isArray(savedState.queue) ? savedState.queue : [];
  const savedQueue = savedQueueRaw.filter((src) => musicTrackSources.includes(src));
  const savedTrack = String(savedState.trackSrc || "").trim();
  const targetSecond =
    Number.isFinite(savedState.currentTime) && savedState.currentTime >= 0
      ? savedState.currentTime
      : 0;
  const shouldPlay = Boolean(savedState.isPlaying);
  const shouldMute = Boolean(savedState.isMuted);

  if (savedQueue.length) {
    musicTrackQueue = savedQueue;
    const rawPointer = Number(savedState.queuePointer);
    const safePointer = Number.isFinite(rawPointer) ? Math.floor(rawPointer) : 0;
    musicTrackQueuePointer = Math.min(
      Math.max(safePointer, 0),
      musicTrackQueue.length - 1
    );
  } else if (savedTrack && musicTrackSources.includes(savedTrack)) {
    musicTrackQueue = [savedTrack];
    musicTrackQueuePointer = 0;
  } else {
    return false;
  }

  setMusicMuted(shouldMute, false);
  const restored = playCurrentQueuedTrack({
    autoPlay: shouldPlay,
    seekSeconds: targetSecond,
    saveState: false
  });
  if (!shouldPlay && youtubePlayer) {
    youtubePlayer.pause();
  }
  return restored;
}

function ensureYouTubeAutoplay() {
  if (!youtubePlayer || !musicTrackSources.length) {
    return;
  }
  if (!shouldYouTubeAutoplayAfterLoad()) {
    return;
  }
  if (!isYouTubeAutoplayUnlocked()) {
    bindYouTubeAutoplayUnlockOnInteraction();
    return;
  }

  if (!youtubePlayer.paused) {
    return;
  }
  const playAttempt = youtubePlayer.play();
  if (playAttempt && typeof playAttempt.catch === "function") {
    playAttempt.catch(() => {
      musicShouldResumeAfterUnlock = true;
      bindYouTubeAutoplayUnlockOnInteraction();
    });
  }
}

function refreshMusicPlayerAvailability() {
  const hasTracks = musicTrackSources.length > 0;
  youtubePlayerReady = hasTracks;

  if (youtubeUiElements?.dock) {
    youtubeUiElements.dock.hidden = !hasTracks;
  }
  if (youtubeUiElements?.toggleButton) {
    youtubeUiElements.toggleButton.hidden = !hasTracks;
  }

  if (!hasTracks) {
    stopYouTubeProgressUpdates();
    musicTrackQueue = [];
    musicTrackQueuePointer = -1;
    musicCurrentTrackSrc = "";
    if (youtubePlayer) {
      youtubePlayer.pause();
      youtubePlayer.src = "";
    }
  }

  updateYouTubeTrackTitle();
  updateYouTubePlayerText();
  updateYouTubeProgress();
  updateMusicButtonState();
}

function setYouTubeTrackSources(trackSources = []) {
  const deduplicated = [];
  const seen = new Set();
  trackSources.forEach((src) => {
    if (typeof src !== "string" || !src || seen.has(src)) {
      return;
    }
    seen.add(src);
    deduplicated.push(src);
  });

  musicTrackSources = deduplicated;
  youtubePlaybackStateRestored = false;
  refreshMusicPlayerAvailability();
  if (!musicTrackSources.length || !youtubePlayer) {
    return;
  }

  const restored = restoreYouTubePlaybackState();
  if (!restored) {
    musicTrackQueue = [];
    musicTrackQueuePointer = -1;
    appendRandomTrackChunk("");
    musicTrackQueuePointer = musicTrackQueue.length ? 0 : -1;
    if (musicTrackQueuePointer >= 0) {
      playCurrentQueuedTrack({
        autoPlay: true,
        saveState: false
      });
    }
  }

  ensureYouTubeAutoplay();
  saveYouTubePlaybackState(true);
}

function createYouTubePlayerDock() {
  if (youtubeUiElements || currentPageName === "admin.html") {
    return youtubeUiElements;
  }

  const dock = document.createElement("aside");
  dock.id = "yt-player-dock";
  dock.className = "yt-player-dock";
  dock.innerHTML = `
    <div id="yt-player-host" class="yt-player-host" aria-hidden="true"></div>
    <p id="yt-player-title" class="yt-player-title"></p>
    <div class="yt-player-controls">
      <button id="yt-prev-btn" class="yt-player-btn yt-player-btn-small" type="button">&lt;</button>
      <button id="yt-play-btn" class="yt-player-btn" type="button"></button>
      <button id="yt-next-btn" class="yt-player-btn yt-player-btn-small" type="button">&gt;</button>
      <button id="yt-mute-btn" class="yt-player-btn" type="button"></button>
    </div>
    <input id="yt-seek-input" class="yt-player-seek" type="range" min="0" max="0" value="0" step="1" />
    <div class="yt-player-meta">
      <span id="yt-player-time" class="yt-player-time">00:00 / 00:00</span>
      <button id="yt-open-btn" class="yt-open-btn" type="button"></button>
    </div>
  `;

  document.body.append(dock);
  const toggleButton = document.createElement("button");
  toggleButton.id = "yt-dock-toggle";
  toggleButton.className = "yt-dock-toggle";
  toggleButton.type = "button";
  document.body.append(toggleButton);

  const elements = {
    dock,
    host: dock.querySelector("#yt-player-host"),
    title: dock.querySelector("#yt-player-title"),
    prevButton: dock.querySelector("#yt-prev-btn"),
    playButton: dock.querySelector("#yt-play-btn"),
    nextButton: dock.querySelector("#yt-next-btn"),
    muteButton: dock.querySelector("#yt-mute-btn"),
    seekInput: dock.querySelector("#yt-seek-input"),
    time: dock.querySelector("#yt-player-time"),
    openButton: dock.querySelector("#yt-open-btn"),
    toggleButton
  };

  if (
    !elements.host ||
    !elements.title ||
    !elements.prevButton ||
    !elements.playButton ||
    !elements.nextButton ||
    !elements.muteButton ||
    !elements.seekInput ||
    !elements.time ||
    !elements.openButton ||
    !elements.toggleButton
  ) {
    dock.remove();
    toggleButton.remove();
    return null;
  }

  youtubeUiElements = elements;
  youtubeDockCollapsed = readYouTubeDockCollapsedState();
  setYouTubeDockCollapsed(youtubeDockCollapsed, false);

  elements.prevButton.addEventListener("click", () => {
    playPreviousQueuedTrack();
  });

  elements.playButton.addEventListener("click", () => {
    if (!musicTrackSources.length || !youtubePlayer) {
      return;
    }
    markYouTubeAutoplayUnlocked();
    if (!youtubePlayer.paused) {
      youtubePlayer.pause();
      saveYouTubePlaybackState(true);
      return;
    }
    if (!musicCurrentTrackSrc) {
      if (!musicTrackQueue.length) {
        appendRandomTrackChunk("");
        musicTrackQueuePointer = musicTrackQueue.length ? 0 : -1;
      }
      playCurrentQueuedTrack({ autoPlay: true });
      return;
    }
    const playAttempt = youtubePlayer.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {
        musicShouldResumeAfterUnlock = true;
        bindYouTubeAutoplayUnlockOnInteraction();
      });
    }
    saveYouTubePlaybackState(true);
  });

  elements.nextButton.addEventListener("click", () => {
    markYouTubeAutoplayUnlocked();
    playRandomYouTubeTrack();
  });

  elements.muteButton.addEventListener("click", () => {
    if (!musicTrackSources.length) {
      return;
    }
    if (youtubePlayer && youtubePlayer.muted) {
      markYouTubeAutoplayUnlocked();
    }
    setMusicMuted(!(youtubePlayer ? youtubePlayer.muted : musicMutedPreference), true);
    saveYouTubePlaybackState(true);
    updateYouTubePlayerText();
  });

  elements.openButton.addEventListener("click", () => {
    markYouTubeAutoplayUnlocked();
    playRandomYouTubeTrack();
  });

  elements.seekInput.addEventListener("pointerdown", () => {
    youtubeIsDraggingSeekbar = true;
  });
  elements.seekInput.addEventListener("pointerup", () => {
    youtubeIsDraggingSeekbar = false;
    updateYouTubeProgress();
  });
  elements.seekInput.addEventListener("input", () => {
    const previewCurrent = Number(elements.seekInput.value || 0);
    const duration = Number(youtubePlayer?.duration || 0);
    elements.time.textContent = `${formatMediaTime(previewCurrent)} / ${formatMediaTime(duration)}`;
  });
  elements.seekInput.addEventListener("change", () => {
    if (!youtubePlayer) {
      return;
    }
    const targetSecond = Number(elements.seekInput.value || 0);
    try {
      youtubePlayer.currentTime = targetSecond;
    } catch {
      // Ignore seek errors for unsupported sources.
    }
    updateYouTubeProgress();
    saveYouTubePlaybackState(true);
  });

  elements.toggleButton.addEventListener("click", () => {
    setYouTubeDockCollapsed(!youtubeDockCollapsed, true);
  });

  updateYouTubePlayerText();
  updateYouTubeTrackTitle();
  updateYouTubeProgress();

  return elements;
}

function initYouTubePlaylistPlayer() {
  if (currentPageName === "admin.html") {
    return;
  }

  const ui = createYouTubePlayerDock();
  if (!ui) {
    return;
  }

  if (!youtubePlayer) {
    youtubePlayer = new Audio();
    youtubePlayer.preload = "metadata";
    youtubePlayer.muted = musicMutedPreference;

    youtubePlayer.addEventListener("play", () => {
      startYouTubeProgressUpdates();
      updateYouTubePlayerText();
      saveYouTubePlaybackState(true);
    });
    youtubePlayer.addEventListener("pause", () => {
      stopYouTubeProgressUpdates();
      updateYouTubePlayerText();
      saveYouTubePlaybackState(true);
    });
    youtubePlayer.addEventListener("ended", () => {
      const startedNext = playRandomYouTubeTrack();
      if (!startedNext) {
        stopYouTubeProgressUpdates();
      }
    });
    youtubePlayer.addEventListener("loadedmetadata", () => {
      updateYouTubeProgress();
      saveYouTubePlaybackState(true);
    });
    youtubePlayer.addEventListener("timeupdate", () => {
      if (!youtubeIsDraggingSeekbar) {
        updateYouTubeProgress();
      }
    });
    youtubePlayer.addEventListener("error", () => {
      playRandomYouTubeTrack();
    });
  }

  setMusicMuted(musicMutedPreference, false);
  refreshMusicPlayerAvailability();
  if (musicTrackSources.length) {
    setYouTubeTrackSources(musicTrackSources);
  }
}

function showPaymentStatusMessageFromUrl() {
  if (paymentStatusMessageShown || !hasShopUi) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const paymentStatus = params.get("payment");
  if (!paymentStatus) {
    return;
  }

  const dictionary = getDictionary();
  if (paymentStatus === "success") {
    window.alert(dictionary.paymentSuccessMessage);
  } else if (paymentStatus === "cancel") {
    window.alert(dictionary.paymentCancelMessage);
  } else if (paymentStatus === "failed") {
    window.alert(dictionary.paymentFailedMessage);
  }

  paymentStatusMessageShown = true;
  params.delete("payment");
  params.delete("provider");
  params.delete("order");
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash || ""}`;
  window.history.replaceState({}, "", nextUrl);
}

const savedLanguage = localStorage.getItem(LANG_STORAGE_KEY);
const initialLanguage = normalizeLanguage(savedLanguage);
applyLanguage(initialLanguage);

const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
const initialTheme = savedTheme === "light" ? "light" : "dark";
setTheme(initialTheme);

const savedMutedState = localStorage.getItem(MUSIC_MUTED_STORAGE_KEY) === "1";
setMusicMuted(savedMutedState);
void refreshSiteSettings();
void loadExternalTranslations();
showPaymentStatusMessageFromUrl();

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
    setTheme(nextTheme, true);
  });
}

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.lang || "pl", true);
  });
});

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);
reveals.forEach((item) => observer.observe(item));

const photoExtensions = ["jpg", "jpeg", "png", "webp", "avif"];
const legacyPhotoSlots = Array.from({ length: 16 }, (_, index) => `street-${index + 1}`);
const legacyPhotoCandidates = legacyPhotoSlots.flatMap((slot) =>
  photoExtensions.map((ext) => `./assets/photos/${slot}.${ext}`)
);

const logoCandidates = [
  "./assets/logo/logo.png",
  "./assets/logo/logo.webp",
  "./assets/logo/logo.jpg",
  "./assets/logo/logo.jpeg",
  "./assets/logo/logo.svg"
];

const videoCandidates = [
  "./assets/video/background.mp4",
  "./assets/video/background.webm",
  "./assets/video/background.mov",
  "./assets/video/background.m4v"
];
const legacyMusicTrackCandidates = [
  "./assets/audio/background.mp3",
  "./assets/audio/background.ogg",
  "./assets/audio/background.wav",
  "./assets/audio/background.m4a",
  "./assets/audio/background.webm"
];

function checkImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function loadImageForCanvas(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = src;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

async function createCoverThumbnail(src, targetWidth, targetHeight) {
  const safeWidth = Math.max(120, Math.round(targetWidth || 300));
  const safeHeight = Math.max(120, Math.round(targetHeight || 220));
  const image = await loadImageForCanvas(src);

  const canvas = document.createElement("canvas");
  canvas.width = safeWidth;
  canvas.height = safeHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return src;
  }

  const scale = Math.max(safeWidth / image.width, safeHeight / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const dx = (safeWidth - drawWidth) / 2;
  const dy = (safeHeight - drawHeight) / 2;

  ctx.drawImage(image, dx, dy, drawWidth, drawHeight);

  const webpBlob = await canvasToBlob(canvas, "image/webp", 0.78);
  if (webpBlob) {
    return URL.createObjectURL(webpBlob);
  }

  const jpgBlob = await canvasToBlob(canvas, "image/jpeg", 0.82);
  if (jpgBlob) {
    return URL.createObjectURL(jpgBlob);
  }

  return src;
}

async function createProportionalThumbnail(src, targetWidth) {
  const safeWidth = Math.max(320, Math.round(targetWidth || 900));
  const image = await loadImageForCanvas(src);
  const scale = Math.min(1, safeWidth / image.width);
  const outputWidth = Math.max(1, Math.round(image.width * scale));
  const outputHeight = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return src;
  }

  ctx.drawImage(image, 0, 0, outputWidth, outputHeight);

  const webpBlob = await canvasToBlob(canvas, "image/webp", 0.82);
  if (webpBlob) {
    return URL.createObjectURL(webpBlob);
  }

  const jpgBlob = await canvasToBlob(canvas, "image/jpeg", 0.84);
  if (jpgBlob) {
    return URL.createObjectURL(jpgBlob);
  }

  return src;
}

async function applyCompressedBackground(box, src) {
  const rect = box.getBoundingClientRect();
  const width = rect.width || box.clientWidth || 320;
  const height = rect.height || box.clientHeight || 220;
  const pixelRatio = window.devicePixelRatio || 1;
  const cacheWidth = Math.max(120, Math.round((width * pixelRatio) / 80) * 80);
  const cacheHeight = Math.max(120, Math.round((height * pixelRatio) / 80) * 80);
  const cacheKey = `${src}|${cacheWidth}x${cacheHeight}`;

  let optimizedSrc = src;
  if (coverThumbnailCache.has(cacheKey)) {
    optimizedSrc = coverThumbnailCache.get(cacheKey) || src;
  } else {
    try {
      optimizedSrc = await createCoverThumbnail(src, cacheWidth, cacheHeight);
      coverThumbnailCache.set(cacheKey, optimizedSrc);
    } catch {
      optimizedSrc = src;
    }
  }

  box.style.backgroundImage = `linear-gradient(to top, var(--card-photo-overlay-strong), var(--card-photo-overlay-soft)), url("${optimizedSrc}")`;
}

async function applyContainedCardImage(card, src) {
  const rect = card.getBoundingClientRect();
  const width = rect.width || card.clientWidth || 420;
  const pixelRatio = window.devicePixelRatio || 1;
  const cacheWidth = Math.max(260, Math.round((width * pixelRatio) / 120) * 120);
  const cacheKey = `${src}|contain|${cacheWidth}`;

  let optimizedSrc = src;
  if (containThumbnailCache.has(cacheKey)) {
    optimizedSrc = containThumbnailCache.get(cacheKey) || src;
  } else {
    try {
      optimizedSrc = await createProportionalThumbnail(src, cacheWidth);
      containThumbnailCache.set(cacheKey, optimizedSrc);
    } catch {
      optimizedSrc = src;
    }
  }

  if (card.dataset.activeImageSrc === optimizedSrc) {
    return;
  }
  card.dataset.activeImageSrc = optimizedSrc;

  const nextImage = document.createElement("img");
  nextImage.className = "card-photo";
  nextImage.alt = "";
  nextImage.decoding = "async";
  nextImage.src = optimizedSrc;
  card.append(nextImage);

  requestAnimationFrame(() => {
    nextImage.classList.add("is-visible");
  });

  const oldImages = card.querySelectorAll(".card-photo");
  oldImages.forEach((image) => {
    if (image === nextImage) {
      return;
    }
    image.classList.remove("is-visible");
    window.setTimeout(() => {
      if (image.parentElement === card) {
        image.remove();
      }
    }, 900);
  });
}

async function applyCompressedImage(imgElement, src) {
  const rect = imgElement.getBoundingClientRect();
  const width = rect.width || imgElement.clientWidth || 640;

  let optimizedSrc = src;
  try {
    optimizedSrc = await createProportionalThumbnail(
      src,
      width * window.devicePixelRatio
    );
  } catch {
    optimizedSrc = src;
  }

  imgElement.src = optimizedSrc;
}

function createEmptyCategoryPhotoSources() {
  return Object.fromEntries(PHOTO_CATEGORIES.map((category) => [category, []]));
}

function normalizePhotoDirectoryPath(directoryPath = "./assets/photos") {
  const normalizedBase =
    typeof directoryPath === "string" && directoryPath.trim()
      ? directoryPath.trim()
      : "./assets/photos";
  return normalizedBase.replace(/\/+$/, "");
}

function normalizePhotoEntry(entry, directoryPath = "./assets/photos") {
  if (!entry || typeof entry !== "string") {
    return null;
  }

  const trimmed = entry.trim();
  if (!trimmed) {
    return null;
  }

  if (
    trimmed.startsWith("./") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed;
  }

  const basePath = normalizePhotoDirectoryPath(directoryPath);
  return `${basePath}/${encodeURIComponent(trimmed)}`;
}

function normalizePhotoList(entries, directoryPath = "./assets/photos") {
  if (!Array.isArray(entries)) {
    return [];
  }
  return entries
    .map((entry) => normalizePhotoEntry(entry, directoryPath))
    .filter(Boolean);
}

async function loadManifestJson(manifestPath) {
  try {
    const response = await fetch(manifestPath, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
}

async function findPhotosFromManifest() {
  const data = await loadManifestJson("./assets/photos/photos.json");
  if (!Array.isArray(data)) {
    return [];
  }
  return normalizePhotoList(data, "./assets/photos");
}

async function findPhotosFromDirectoryListing(directoryPath = "./assets/photos") {
  try {
    const basePath = normalizePhotoDirectoryPath(directoryPath);
    const response = await fetch(`${basePath}/`, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const links = Array.from(doc.querySelectorAll("a[href]")).map((node) =>
      node.getAttribute("href")
    );

    const found = [];
    links.forEach((href) => {
      if (!href) {
        return;
      }

      const cleanHref = href.split("#")[0].split("?")[0];
      if (!cleanHref || cleanHref.endsWith("/")) {
        return;
      }

      const decodedName = decodeURIComponent(cleanHref).split("/").pop();
      if (!decodedName) {
        return;
      }

      const ext = decodedName.split(".").pop()?.toLowerCase();
      if (!ext || !photoExtensions.includes(ext)) {
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

  const listed = await findPhotosFromDirectoryListing(FEATURED_PHOTOS_FOLDER);
  return [...new Set(listed)];
}

function inferCategoryFromSource(src, index) {
  const fallback = PHOTO_CATEGORIES[index % PHOTO_CATEGORIES.length];
  const filename = decodeURIComponent(src.split("/").pop() || "").toLowerCase();
  if (!filename) {
    return fallback;
  }

  if (
    filename.includes("bw") ||
    filename.includes("black") ||
    filename.includes("mono") ||
    filename.includes("bnw")
  ) {
    return "bw";
  }
  if (
    filename.includes("nature") ||
    filename.includes("forest") ||
    filename.includes("tree") ||
    filename.includes("leaf") ||
    filename.includes("mountain") ||
    filename.includes("sea") ||
    filename.includes("lake")
  ) {
    return "nature";
  }
  if (filename.includes("landscape") || filename.includes("krajobraz")) {
    return "landscape";
  }
  if (
    filename.includes("portrait") ||
    filename.includes("portret") ||
    filename.includes("model")
  ) {
    return "portrait";
  }
  if (
    filename.includes("color") ||
    filename.includes("colour") ||
    filename.includes("kolor")
  ) {
    return "color";
  }

  return fallback;
}

async function findPhotoSources() {
  const manifestPhotos = await findPhotosFromManifest();
  if (manifestPhotos.length) {
    return manifestPhotos;
  }

  const listedPhotos = await findPhotosFromDirectoryListing("./assets/photos");
  if (listedPhotos.length) {
    return listedPhotos;
  }

  return legacyPhotoCandidates;
}

async function findCategorizedPhotoSources() {
  const categorySources = createEmptyCategoryPhotoSources();
  const manifestData = await loadManifestJson("./assets/photos/photos.json");

  if (manifestData && typeof manifestData === "object" && !Array.isArray(manifestData)) {
    PHOTO_CATEGORIES.forEach((category) => {
      const folderPath = getCategoryFolderPath(category);
      const entries = manifestData[category];
      if (!folderPath || !Array.isArray(entries)) {
        return;
      }
      categorySources[category] = normalizePhotoList(entries, folderPath);
    });
  }

  const folderResults = await Promise.all(
    PHOTO_CATEGORIES.map(async (category) => {
      if (categorySources[category].length) {
        return [category, [...new Set(categorySources[category])]];
      }
      const entries = await findCategoryPhotoSources(category);
      return [category, [...new Set(entries)]];
    })
  );

  folderResults.forEach(([category, entries]) => {
    categorySources[category] = entries;
  });

  // Keep backward compatibility: merge legacy root photos with new category folders.
  // This way old photos in assets/photos are still visible even after adding category folders.
  let fallbackPhotos = await findPhotosFromDirectoryListing("./assets/photos");
  if (!fallbackPhotos.length) {
    fallbackPhotos = await findPhotoSources();
  }

  fallbackPhotos.forEach((src, index) => {
    const alreadyAssigned = PHOTO_CATEGORIES.some((category) =>
      categorySources[category].includes(src)
    );
    if (alreadyAssigned) {
      return;
    }

    const category = inferCategoryFromSource(src, index);
    categorySources[category].push(src);
  });

  return categorySources;
}

function checkVideo(src) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    let settled = false;
    const timeout = setTimeout(() => done(null), 2500);

    function done(result) {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      video.src = "";
      resolve(result);
    }

    video.preload = "metadata";
    video.muted = true;
    video.onloadedmetadata = () => done(src);
    video.onerror = () => done(null);
    video.src = src;
    video.load();
  });
}

function setRoundedFavicon(source) {
  const iconLinks = [faviconEl, faviconShortcutEl, faviconAppleEl].filter(Boolean);
  if (!iconLinks.length) {
    return;
  }

  const fallbackSource = `${source}${source.includes("?") ? "&" : "?"}v=4`;
  iconLinks.forEach((link) => {
    link.href = fallbackSource;
    link.type = "image/png";
  });

  const image = new Image();
  image.onerror = () => {
    iconLinks.forEach((link) => {
      link.href = fallbackSource;
      link.type = "image/png";
    });
  };
  image.onload = () => {
    try {
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(image, 0, 0, size, size);
      ctx.restore();

      const roundedDataUrl = canvas.toDataURL("image/png");
      if (!roundedDataUrl) {
        return;
      }

      iconLinks.forEach((link) => {
        link.href = roundedDataUrl;
        link.type = "image/png";
      });
    } catch {
      iconLinks.forEach((link) => {
        link.href = fallbackSource;
        link.type = "image/png";
      });
    }
  };
  image.src = source;
}

async function initLogo() {
  for (const candidate of logoCandidates) {
    const found = await checkImage(candidate);
    if (found) {
      if (brandLogoEl) {
        brandLogoEl.src = found;
        brandLogoEl.hidden = false;
      }
      setRoundedFavicon(found);
      return;
    }
  }
}

async function findVideoSource() {
  for (const candidate of videoCandidates) {
    const found = await checkVideo(candidate);
    if (found) {
      return found;
    }
  }
  return null;
}

function activateBackgroundVideo(videoSource) {
  if (!bgVideoEl) {
    return;
  }

  bgVideoEl.src = videoSource;
  bgVideoEl.hidden = false;
  document.body.classList.add("has-bg-video");

  const playAttempt = bgVideoEl.play();
  if (playAttempt && typeof playAttempt.catch === "function") {
    playAttempt.catch(() => {});
  }
}

function checkAudio(src) {
  return new Promise((resolve) => {
    const audio = new Audio();
    let settled = false;
    const timeout = setTimeout(() => done(null), 2200);

    function done(result) {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      audio.src = "";
      resolve(result);
    }

    audio.preload = "metadata";
    audio.onloadedmetadata = () => done(src);
    audio.onerror = () => done(null);
    audio.src = src;
    audio.load();
  });
}

async function findMusicSource() {
  const manifestTracks = await findMusicTracksFromManifest();
  let listedTracks = manifestTracks.length
    ? manifestTracks
    : await findMusicTracksFromDirectoryListing();
  if (!listedTracks.length) {
    listedTracks = [...legacyMusicTrackCandidates];
  }

  if (!listedTracks.length) {
    return [];
  }

  const checked = await Promise.all(listedTracks.map(checkAudio));
  return [...new Set(checked.filter(Boolean))];
}

function getGridColumnCount(gridElement) {
  if (!gridElement) {
    return 1;
  }
  const template = window.getComputedStyle(gridElement).gridTemplateColumns;
  if (!template) {
    return 1;
  }
  const columns = template.split(" ").filter((token) => token.trim().length > 0);
  return Math.max(1, columns.length);
}

async function renderHomeGalleryPhotos(photos, step = 0) {
  const cards = Array.from(document.querySelectorAll(".card"));
  if (!cards.length || !photos.length) {
    return;
  }

  const gallery = cards[0]?.closest(".gallery");
  const columns = getGridColumnCount(gallery);
  const maxVisibleByData = Math.min(cards.length, photos.length);
  const targetRows = 2;
  const visibleCardCount = Math.min(maxVisibleByData, columns * targetRows);

  const assignments = new Array(cards.length).fill(null);
  for (let i = 0; i < visibleCardCount; i += 1) {
    assignments[i] = (step + i) % photos.length;
  }

  const updates = cards.map(async (card, index) => {
    const photoIndex = assignments[index];
    if (photoIndex === null || typeof photoIndex !== "number") {
      card.hidden = true;
      card.classList.remove("zoomable");
      delete card.dataset.photoIndex;
      return;
    }

    card.hidden = false;
    await new Promise((resolve) => {
      window.setTimeout(resolve, index * 90);
    });
    const src = photos[photoIndex];
    const labelNode = card.querySelector(".card-file-label");
    const filename = getPhotoFileLabel(photoIndex);
    if (labelNode && filename) {
      labelNode.textContent = filename;
      labelNode.setAttribute("title", filename);
    }
    await applyContainedCardImage(card, src);
    card.dataset.photoIndex = String(photoIndex);
    card.classList.add("zoomable");
  });
  await Promise.all(updates);
}

async function applyGalleryPhotos(photos) {
  await renderHomeGalleryPhotos(photos, homeGalleryRotationStep);
}

function stopHomeGalleryRotation() {
  if (!homeGalleryRotationTimer) {
    return;
  }
  clearInterval(homeGalleryRotationTimer);
  homeGalleryRotationTimer = null;
}

function startHomeGalleryRotation(photos) {
  stopHomeGalleryRotation();

  const cards = document.querySelectorAll(".card");
  if (!cards.length || photos.length < 2) {
    return;
  }

  homeGalleryRotationTimer = setInterval(() => {
    homeGalleryRotationStep = (homeGalleryRotationStep + 1) % photos.length;
    void renderHomeGalleryPhotos(photos, homeGalleryRotationStep);
  }, 7200);
}

async function applyShopPhotos(photos) {
  const shopImages = document.querySelectorAll(".shop-image");
  if (!shopImages.length) {
    return;
  }

  const updates = Array.from(shopImages).map(async (box, index) => {
    const src = photos[index % photos.length];
    await applyCompressedBackground(box, src);
  });
  await Promise.all(updates);
}

function getShopFrameLabel(index) {
  const dictionary = getDictionary();
  const prefix = dictionary.shopFramePrefix || dictionary.artFrameLabel || "Frame";
  return `${prefix} ${String(index + 1).padStart(2, "0")}`;
}

function getPhotosByCategory(category, area = "portfolio") {
  if (category === "all") {
    return getAllEnabledPhotos(area);
  }
  if (!isCategoryEnabled(category, area)) {
    return [];
  }
  return categoryPhotoSources[category] || [];
}

function getFirstAvailableCategory(preferredCategory = "all", area = "portfolio") {
  if (preferredCategory === "all") {
    return "all";
  }

  if (
    isCategoryEnabled(preferredCategory, area) &&
    getPhotosByCategory(preferredCategory, area).length
  ) {
    return preferredCategory;
  }

  const fallbackCategory = getEnabledCategoryKeys(area).find(
    (category) => getPhotosByCategory(category, area).length > 0
  );
  return fallbackCategory || "all";
}

function getShopPhotoEntriesByCategory(category = activeShopCategory) {
  return getPhotosByCategory(category, "shop")
    .map((src) => ({
      src,
      photoIndex: photoSourceToIndex.get(src)
    }))
    .filter((entry) => typeof entry.photoIndex === "number");
}

function getPortfolioPhotosByCategory(category = activePortfolioCategory) {
  return getPhotosByCategory(category, "portfolio");
}

function getFirstPhotoIndexForActiveCategory() {
  const entries = getShopPhotoEntriesByCategory(activeShopCategory);
  if (!entries.length) {
    return 0;
  }
  return entries[0].photoIndex;
}

function updateShopTabState() {
  applyCategoryTabVisibility();
}

function updatePortfolioTabState() {
  applyCategoryTabVisibility();
}

function getPhotoFilename(photoIndex) {
  const src = loadedGalleryPhotos[photoIndex];
  if (!src) {
    return "";
  }

  return decodeURIComponent(src.split("/").pop() || "");
}

function getPhotoFileLabel(photoIndex) {
  const filename = getPhotoFilename(photoIndex);
  if (!filename) {
    return "";
  }

  return filename.replace(/\.[^.]+$/, "");
}

function getInquiryPhotoLabel(photoIndex) {
  const frameLabel = getShopFrameLabel(photoIndex);
  const fileLabel = getPhotoFileLabel(photoIndex);
  if (!fileLabel) {
    return frameLabel;
  }
  return `${frameLabel} - ${fileLabel}`;
}

function getSelectablePhotoIndexes() {
  const photos = getPhotosByCategory("all", "shop");
  const mapped = photos
    .map((src) => photoSourceToIndex.get(src))
    .filter((index) => typeof index === "number" && index >= 0);
  return [...new Set(mapped)];
}

function populateInquiryPhotoOptions(selectedPhotoIndex = 0) {
  if (!inquiryPhotoInput) {
    return;
  }

  inquiryPhotoInput.innerHTML = "";
  const selectableIndexes = getSelectablePhotoIndexes();
  if (!selectableIndexes.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "-";
    option.selected = true;
    inquiryPhotoInput.append(option);
    return;
  }

  selectableIndexes.forEach((index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = getInquiryPhotoLabel(index);
    inquiryPhotoInput.append(option);
  });

  const boundedIndex = selectableIndexes.includes(selectedPhotoIndex)
    ? selectedPhotoIndex
    : selectableIndexes[0];
  inquiryPhotoInput.value = String(boundedIndex);
}

function populateOrderPhotoOptions(selectedPhotoIndex = 0) {
  if (!orderPhotoInput) {
    return;
  }

  orderPhotoInput.innerHTML = "";
  const selectableIndexes = getSelectablePhotoIndexes();
  if (!selectableIndexes.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "-";
    option.selected = true;
    orderPhotoInput.append(option);
    return;
  }

  selectableIndexes.forEach((index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = getInquiryPhotoLabel(index);
    orderPhotoInput.append(option);
  });

  const boundedIndex = selectableIndexes.includes(selectedPhotoIndex)
    ? selectedPhotoIndex
    : selectableIndexes[0];
  orderPhotoInput.value = String(boundedIndex);
}

function populateOrderSizeOptions(selectedSize = PRINT_SIZE_OPTIONS[0].value) {
  if (!orderSizeSelect) {
    return;
  }

  orderSizeSelect.innerHTML = "";
  PRINT_SIZE_OPTIONS.forEach((option) => {
    const optionEl = document.createElement("option");
    optionEl.value = option.value;
    optionEl.textContent = getSizeOptionLabel(option);
    orderSizeSelect.append(optionEl);
  });

  orderSizeSelect.value = getPrintSizeOption(selectedSize).value;
}

function updateOrderPriceLabel(selectedSize = orderSizeSelect?.value) {
  if (!orderPriceValueEl) {
    return;
  }
  const selectedOption = getPrintSizeOption(selectedSize);
  orderPriceValueEl.textContent = formatPricePln(selectedOption.pricePln);
}

function pickRandomPhotoIndexes(totalCount, pickCount) {
  const source = Array.from({ length: totalCount }, (_, index) => index);
  for (let i = source.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = source[i];
    source[i] = source[randomIndex];
    source[randomIndex] = temp;
  }
  return source.slice(0, pickCount);
}

async function buildFeaturedSaleGallery(photos = loadedGalleryPhotos) {
  if (!shopFeaturedGridEl) {
    return;
  }

  shopFeaturedGridEl.innerHTML = "";
  if (!photos.length) {
    featuredSalePhotoIndexes = [];
    return;
  }

  const dictionary = getDictionary();
  const availableIndexes = [...new Set(
    photos
      .map((src) => photoSourceToIndex.get(src))
      .filter((index) => typeof index === "number" && index >= 0)
  )];
  if (!availableIndexes.length) {
    featuredSalePhotoIndexes = [];
    return;
  }
  const availableIndexSet = new Set(availableIndexes);
  const preferredIndexes = featuredSalePhotoSources
    .map((src) => photoSourceToIndex.get(src))
    .filter((index) => typeof index === "number" && availableIndexSet.has(index));
  const uniquePreferredIndexes = [...new Set(preferredIndexes)];
  const sourceIndexes = uniquePreferredIndexes.length
    ? uniquePreferredIndexes
    : availableIndexes;
  const sourceIndexSet = new Set(sourceIndexes);
  const targetCount = Math.min(6, sourceIndexes.length);

  if (
    featuredSalePhotoIndexes.length !== targetCount ||
    featuredSalePhotoIndexes.some((index) => !sourceIndexSet.has(index))
  ) {
    const randomPositions = pickRandomPhotoIndexes(sourceIndexes.length, targetCount);
    featuredSalePhotoIndexes = randomPositions.map((position) => sourceIndexes[position]);
  }

  const fragment = document.createDocumentFragment();
  featuredSalePhotoIndexes.forEach((photoIndex) => {
    const card = document.createElement("article");
    card.className = "sale-card";
    card.dataset.photoIndex = String(photoIndex);

    const image = document.createElement("div");
    image.className = "sale-image";
    image.dataset.photoIndex = String(photoIndex);
    image.setAttribute("role", "button");
    image.setAttribute("tabindex", "0");
    image.setAttribute(
      "aria-label",
      `${dictionary.openPhotoPrefix}: ${getInquiryPhotoLabel(photoIndex)}`
    );

    const caption = document.createElement("p");
    caption.className = "sale-caption";
    caption.textContent = getInquiryPhotoLabel(photoIndex);

    const controls = document.createElement("div");
    controls.className = "sale-controls";

    const sizeSelect = document.createElement("select");
    sizeSelect.className = "sale-size-select";
    sizeSelect.dataset.photoIndex = String(photoIndex);
    PRINT_SIZE_OPTIONS.forEach((option, optionIndex) => {
      const sizeOption = document.createElement("option");
      sizeOption.value = option.value;
      sizeOption.textContent = getSizeOptionLabel(option);
      if (optionIndex === 0) {
        sizeOption.selected = true;
      }
      sizeSelect.append(sizeOption);
    });

    const initialOption = PRINT_SIZE_OPTIONS[0];
    const price = document.createElement("p");
    price.className = "sale-price";
    price.dataset.salePrice = "1";
    price.textContent = `${dictionary.shopPriceLabel}: ${formatPricePln(initialOption.pricePln)}`;

    const button = document.createElement("button");
    button.className = "shop-btn sale-buy-btn";
    button.type = "button";
    button.dataset.photoIndex = String(photoIndex);
    button.dataset.defaultSize = initialOption.value;
    button.textContent = dictionary.shopBuyNow;

    controls.append(sizeSelect, price);
    card.append(image, caption, controls, button);
    fragment.append(card);
  });

  shopFeaturedGridEl.append(fragment);

  const featuredImages = shopFeaturedGridEl.querySelectorAll(".sale-image");
  const updates = Array.from(featuredImages).map(async (image) => {
    const photoIndex = Number.parseInt(image.dataset.photoIndex || "0", 10);
    const src = loadedGalleryPhotos[Math.max(0, Math.min(photoIndex, loadedGalleryPhotos.length - 1))];
    if (!src) {
      return;
    }
    await applyCompressedBackground(image, src);
  });
  await Promise.all(updates);
}

function toggleShopEmptyState(showEmpty) {
  if (!shopEmptyEl) {
    return;
  }
  shopEmptyEl.hidden = !showEmpty;
}

async function buildShopGallery() {
  if (!shopGridEl) {
    return;
  }

  const allEnabledPhotos = getPhotosByCategory("all", "shop");
  updateShopTabState();
  shopGridEl.innerHTML = "";
  if (!allEnabledPhotos.length) {
    toggleShopEmptyState(true);
    return;
  }

  let filteredEntries = getShopPhotoEntriesByCategory(activeShopCategory);
  if (!filteredEntries.length && activeShopCategory !== "all") {
    activeShopCategory = "all";
    updateShopTabState();
    filteredEntries = getShopPhotoEntriesByCategory("all");
  }
  if (!filteredEntries.length && allEnabledPhotos.length) {
    filteredEntries = allEnabledPhotos
      .map((src) => ({
        src,
        photoIndex: photoSourceToIndex.get(src)
      }))
      .filter((entry) => typeof entry.photoIndex === "number");
  }

  if (!filteredEntries.length) {
    toggleShopEmptyState(true);
    return;
  }

  toggleShopEmptyState(false);
  const dictionary = getDictionary();
  const sizes = ["30x45 cm", "40x60 cm", "50x70 cm", "70x100 cm"];

  const fragment = document.createDocumentFragment();
  filteredEntries.forEach((entry) => {
    const photoIndex = entry.photoIndex;
    const card = document.createElement("article");
    card.className = "shop-card";

    const image = document.createElement("div");
    image.className = "shop-image";
    image.dataset.photoIndex = String(photoIndex);
    image.setAttribute("role", "button");
    image.setAttribute("tabindex", "0");
    image.setAttribute(
      "aria-label",
      `${dictionary.openPhotoPrefix}: ${getShopFrameLabel(photoIndex)}`
    );

    const title = document.createElement("h3");
    title.className = "shop-item-name";
    title.textContent = getInquiryPhotoLabel(photoIndex);

    const size = sizes[photoIndex % sizes.length];

    const button = document.createElement("button");
    button.className = "shop-btn shop-ask-btn";
    button.type = "button";
    button.dataset.photoIndex = String(photoIndex);
    button.dataset.defaultSize = size;
    button.textContent = dictionary.shopAskBtn;

    card.append(image, title, button);
    fragment.append(card);
  });

  shopGridEl.append(fragment);

  const shopImages = shopGridEl.querySelectorAll(".shop-image");
  const updates = Array.from(shopImages).map(async (box, index) => {
    const src = filteredEntries[index]?.src;
    if (!src) {
      return;
    }
    await applyCompressedBackground(box, src);
  });
  await Promise.all(updates);
}

function openInquiryModal(photoIndex, defaultSize = "30x45 cm") {
  if (!inquiryModalEl || !inquiryPhotoInput) {
    return;
  }

  const selectableIndexes = getSelectablePhotoIndexes();
  if (!selectableIndexes.length) {
    return;
  }
  const safePhotoIndex = selectableIndexes.includes(photoIndex)
    ? photoIndex
    : selectableIndexes[0];
  populateInquiryPhotoOptions(safePhotoIndex);

  if (inquirySizeSelect) {
    inquirySizeSelect.value = defaultSize;
  }
  if (inquiryMessageInput) {
    inquiryMessageInput.value = "";
  }

  inquiryModalEl.hidden = false;
  document.body.style.overflow = "hidden";
  if (inquiryEmailInput) {
    inquiryEmailInput.focus();
  }
}

function closeInquiryModal() {
  if (!inquiryModalEl || inquiryModalEl.hidden) {
    return;
  }

  inquiryModalEl.hidden = true;
  document.body.style.overflow = "";
}

function openOrderModal(photoIndex, preferredSize = PRINT_SIZE_OPTIONS[0].value) {
  if (!orderModalEl || !orderPhotoInput || !orderSizeSelect) {
    return;
  }

  const selectableIndexes = getSelectablePhotoIndexes();
  if (!selectableIndexes.length) {
    return;
  }
  const safePhotoIndex = selectableIndexes.includes(photoIndex)
    ? photoIndex
    : selectableIndexes[0];
  populateOrderPhotoOptions(safePhotoIndex);
  populateOrderSizeOptions(preferredSize);
  updateOrderPriceLabel(preferredSize);

  if (orderFormEl) {
    orderFormEl.reset();
    populateOrderPhotoOptions(safePhotoIndex);
    populateOrderSizeOptions(preferredSize);
    updateOrderPriceLabel(preferredSize);
    populateOrderPaymentMethodOptions(ORDER_PAYMENT_METHODS[0].value);
    populateOrderCarrierOptions(ORDER_COURIERS[0].value);
  }

  orderModalEl.hidden = false;
  document.body.style.overflow = "hidden";
  if (orderFirstNameInput) {
    orderFirstNameInput.focus();
  }
}

function closeOrderModal() {
  if (!orderModalEl || orderModalEl.hidden) {
    return;
  }

  orderModalEl.hidden = true;
  document.body.style.overflow = "";
}

function openQuickContactModal() {
  if (!quickContactModalEl) {
    return false;
  }
  quickContactModalEl.hidden = false;
  document.body.style.overflow = "hidden";
  return true;
}

function closeQuickContactModal() {
  if (!quickContactModalEl || quickContactModalEl.hidden) {
    return;
  }
  quickContactModalEl.hidden = true;
  document.body.style.overflow = "";
}

function openBookingModal() {
  if (!bookingModalEl) {
    return;
  }
  if (siteSettings.bookingEnabled === false) {
    return;
  }

  if (bookingFormEl) {
    bookingFormEl.reset();
  }
  bookingModalEl.hidden = false;
  document.body.style.overflow = "hidden";
  if (bookingNameInput) {
    bookingNameInput.focus();
  }
}

function closeBookingModal() {
  if (!bookingModalEl || bookingModalEl.hidden) {
    return;
  }

  bookingModalEl.hidden = true;
  document.body.style.overflow = "";
}

function updateArtGalleryCaptionsForGrid(gridEl) {
  if (!gridEl) {
    return;
  }

  const dictionary = getDictionary();
  const tiles = gridEl.querySelectorAll(".art-tile");
  tiles.forEach((tile, index) => {
    const caption = tile.querySelector(".art-caption");
    if (!caption) {
      return;
    }
    const frame = tile.querySelector(".art-frame");
    const photoIndex = Number.parseInt(frame?.dataset.photoIndex || "", 10);
    const filename =
      Number.isNaN(photoIndex) || photoIndex < 0
        ? ""
        : getPhotoFileLabel(photoIndex);
    const fallback = `${dictionary.artFrameLabel} ${String(index + 1).padStart(2, "0")}`;
    caption.textContent = filename || fallback;
    caption.setAttribute("title", filename || fallback);
  });
}

function updateArtGalleryCaptions() {
  updateArtGalleryCaptionsForGrid(portfolioGridEl);
  updateArtGalleryCaptionsForGrid(homePortfolioGridEl);
}

function togglePortfolioEmptyState(showEmpty, emptyEl = portfolioEmptyEl) {
  if (!emptyEl) {
    return;
  }
  emptyEl.hidden = !showEmpty;
}

async function buildPortfolioGalleryInto(photos, gridEl, emptyEl) {
  if (!gridEl) {
    return;
  }

  gridEl.innerHTML = "";
  if (!photos.length) {
    togglePortfolioEmptyState(true, emptyEl);
    return;
  }

  const portfolioEntries = photos
    .map((src) => ({
      src,
      photoIndex: photoSourceToIndex.get(src)
    }))
    .filter((entry) => typeof entry.photoIndex === "number");

  if (!portfolioEntries.length) {
    togglePortfolioEmptyState(true, emptyEl);
    return;
  }

  togglePortfolioEmptyState(false, emptyEl);

  const fragments = document.createDocumentFragment();
  portfolioEntries.forEach((entry, index) => {
    const tile = document.createElement("article");
    tile.className = "art-tile";

    const frame = document.createElement("div");
    frame.className = "art-frame zoomable";
    frame.dataset.photoIndex = String(entry.photoIndex);
    frame.setAttribute("role", "button");
    frame.setAttribute("tabindex", "0");
    frame.setAttribute("aria-label", `${getDictionary().openPhotoPrefix} ${index + 1}`);

    const image = document.createElement("img");
    image.className = "art-photo";
    image.alt = `Portfolio ${index + 1}`;
    image.loading = "lazy";

    const caption = document.createElement("p");
    caption.className = "art-caption";

    frame.append(image);
    tile.append(frame, caption);
    fragments.append(tile);
  });

  gridEl.append(fragments);
  updateArtGalleryCaptionsForGrid(gridEl);

  const images = gridEl.querySelectorAll(".art-photo");
  const updates = Array.from(images).map(async (image, index) => {
    const entry = portfolioEntries[index];
    if (!entry) {
      return;
    }
    await applyCompressedImage(image, entry.src);
  });
  await Promise.all(updates);
}

async function buildPortfolioGallery(photos) {
  await buildPortfolioGalleryInto(photos, portfolioGridEl, portfolioEmptyEl);
}

async function buildHomePortfolioExpandedGallery() {
  if (!homePortfolioGridEl) {
    return;
  }
  updatePortfolioTabState();
  await buildPortfolioGalleryInto(
    getPortfolioPhotosByCategory(activePortfolioCategory),
    homePortfolioGridEl,
    homePortfolioEmptyEl
  );
}

async function setHomePortfolioExpanded(nextExpanded, options = {}) {
  if (!homePortfolioExpandedEl || !portfolioMoreBtnEl) {
    return;
  }

  const shouldExpand = Boolean(nextExpanded);
  isHomePortfolioExpanded = shouldExpand;
  homePortfolioExpandedEl.hidden = !shouldExpand;
  if (homePortfolioSectionEl) {
    homePortfolioSectionEl.classList.toggle("is-expanded", shouldExpand);
  }

  const dictionary = getDictionary();
  portfolioMoreBtnEl.textContent = shouldExpand
    ? dictionary.portfolioHideBtn
    : dictionary.portfolioMoreBtn;
  portfolioMoreBtnEl.hidden = shouldExpand;
  if (homePortfolioTabsWrapEl) {
    homePortfolioTabsWrapEl.hidden = !shouldExpand;
  }
  if (portfolioCollapseBtnEl) {
    portfolioCollapseBtnEl.textContent = dictionary.portfolioHideBtn;
  }

  if (shouldExpand) {
    stopHomeGalleryRotation();
    await buildHomePortfolioExpandedGallery();
    if (options.scrollToGallery) {
      homePortfolioExpandedEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return;
  }

  if (loadedGalleryPhotos.length) {
    await renderHomeGalleryPhotos(loadedGalleryPhotos, homeGalleryRotationStep);
    startHomeGalleryRotation(loadedGalleryPhotos);
  }
}

function startBackgroundSlideshow(photos) {
  const layers = document.querySelectorAll(".bg-layer");
  if (layers.length < 2) {
    return;
  }

  let activeLayer = 0;
  let currentPhoto = 0;

  layers[0].style.backgroundImage = `url("${photos[currentPhoto]}")`;
  layers[0].classList.add("is-visible");

  if (photos.length === 1) {
    return;
  }

  setInterval(() => {
    currentPhoto = (currentPhoto + 1) % photos.length;
    const nextLayer = (activeLayer + 1) % layers.length;

    layers[nextLayer].style.backgroundImage = `url("${photos[currentPhoto]}")`;
    layers[nextLayer].classList.add("is-visible");
    layers[activeLayer].classList.remove("is-visible");

    activeLayer = nextLayer;
  }, 6500);
}

function openPhotoModal(photoIndex) {
  if (!modalEl || !modalImageEl || !loadedGalleryPhotos.length) {
    return;
  }

  const boundedIndex = Math.max(
    0,
    Math.min(photoIndex, loadedGalleryPhotos.length - 1)
  );
  modalImageEl.src = loadedGalleryPhotos[boundedIndex];
  modalEl.hidden = false;
  document.body.style.overflow = "hidden";
}

function closePhotoModal() {
  if (!modalEl || modalEl.hidden) {
    return;
  }

  modalEl.hidden = true;
  document.body.style.overflow = "";
}

function bindGalleryPreview() {
  const gallery = document.querySelector(".gallery");
  if (!gallery) {
    return;
  }

  gallery.addEventListener("click", (event) => {
    const target = event.target.closest(".card.zoomable");
    if (!target) {
      return;
    }
    const photoIndex = Number.parseInt(target.dataset.photoIndex || "0", 10);
    openPhotoModal(Number.isNaN(photoIndex) ? 0 : photoIndex);
  });

  gallery.addEventListener("keydown", (event) => {
    const target = event.target.closest(".card.zoomable");
    if (!target) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    const photoIndex = Number.parseInt(target.dataset.photoIndex || "0", 10);
    openPhotoModal(Number.isNaN(photoIndex) ? 0 : photoIndex);
  });
}

function bindArtGalleryPreview(gridEl) {
  if (!gridEl) {
    return;
  }

  gridEl.addEventListener("click", (event) => {
    const target = event.target.closest(".art-frame.zoomable");
    if (!target) {
      return;
    }
    const photoIndex = Number.parseInt(target.dataset.photoIndex || "0", 10);
    openPhotoModal(Number.isNaN(photoIndex) ? 0 : photoIndex);
  });

  gridEl.addEventListener("keydown", (event) => {
    const target = event.target.closest(".art-frame.zoomable");
    if (!target) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    const photoIndex = Number.parseInt(target.dataset.photoIndex || "0", 10);
    openPhotoModal(Number.isNaN(photoIndex) ? 0 : photoIndex);
  });
}

function bindPortfolioPreview() {
  bindArtGalleryPreview(portfolioGridEl);
  bindArtGalleryPreview(homePortfolioGridEl);
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", closePhotoModal);
}

if (musicToggleBtn) {
  musicToggleBtn.addEventListener("click", () => {
    if (!musicTrackSources.length) {
      return;
    }
    const nextMuteState = !(youtubePlayer ? youtubePlayer.muted : musicMutedPreference);
    setMusicMuted(nextMuteState, true);
    saveYouTubePlaybackState(true);
  });
}

if (heroCtaEl && bookingModalEl) {
  heroCtaEl.addEventListener("click", (event) => {
    event.preventDefault();
    openBookingModal();
  });
}

if (portfolioMoreBtnEl && homePortfolioExpandedEl) {
  portfolioMoreBtnEl.addEventListener("click", (event) => {
    event.preventDefault();
    void setHomePortfolioExpanded(!isHomePortfolioExpanded, { scrollToGallery: true });
  });
}

if (portfolioCollapseBtnEl && homePortfolioExpandedEl) {
  portfolioCollapseBtnEl.addEventListener("click", () => {
    void setHomePortfolioExpanded(false);
  });
}

if (shopCtaEl) {
  shopCtaEl.addEventListener("click", (event) => {
    if (getPhotosByCategory("all", "shop").length) {
      event.preventDefault();
      openInquiryModal(getFirstPhotoIndexForActiveCategory(), "30x45 cm");
      return;
    }

    const collectionsSection = document.getElementById("shop-collections");
    if (!collectionsSection) {
      return;
    }
    event.preventDefault();
    collectionsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (shopTabButtons.length) {
  shopTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextCategory = button.dataset.shopTab || "all";
      if (nextCategory !== "all" && !isCategoryEnabled(nextCategory, "shop")) {
        return;
      }
      if (activeShopCategory === nextCategory) {
        return;
      }
      activeShopCategory = nextCategory;
      updateShopTabState();
      if (loadedGalleryPhotos.length) {
        void buildShopGallery();
      }
    });
  });
}

if (portfolioTabButtons.length) {
  portfolioTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextCategory = button.dataset.portfolioTab || "all";
      if (nextCategory !== "all" && !isCategoryEnabled(nextCategory, "portfolio")) {
        return;
      }
      if (activePortfolioCategory === nextCategory) {
        return;
      }
      activePortfolioCategory = nextCategory;
      updatePortfolioTabState();
      if (isPortfolioPage && loadedGalleryPhotos.length) {
        void buildPortfolioGallery(getPortfolioPhotosByCategory(activePortfolioCategory));
      } else if (!isPortfolioPage && isHomePortfolioExpanded && loadedGalleryPhotos.length) {
        void buildHomePortfolioExpandedGallery();
      } else if (isPortfolioPage) {
        void buildPortfolioGallery([]);
      } else {
        void buildHomePortfolioExpandedGallery();
      }
    });
  });
}

if (shopGridEl) {
  shopGridEl.addEventListener("click", (event) => {
    const askButton = event.target.closest(".shop-ask-btn");
    if (askButton) {
      const photoIndex = Number.parseInt(askButton.dataset.photoIndex || "0", 10);
      const defaultSize = askButton.dataset.defaultSize || "30x45 cm";
      openInquiryModal(Number.isNaN(photoIndex) ? 0 : photoIndex, defaultSize);
      return;
    }

    const image = event.target.closest(".shop-image");
    if (image) {
      const photoIndex = Number.parseInt(image.dataset.photoIndex || "0", 10);
      openPhotoModal(Number.isNaN(photoIndex) ? 0 : photoIndex);
    }
  });

  shopGridEl.addEventListener("keydown", (event) => {
    const image = event.target.closest(".shop-image");
    if (!image) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    const photoIndex = Number.parseInt(image.dataset.photoIndex || "0", 10);
    openPhotoModal(Number.isNaN(photoIndex) ? 0 : photoIndex);
  });
}

if (shopFeaturedGridEl) {
  shopFeaturedGridEl.addEventListener("click", (event) => {
    const buyButton = event.target.closest(".sale-buy-btn");
    if (buyButton) {
      const photoIndex = Number.parseInt(buyButton.dataset.photoIndex || "0", 10);
      const defaultSize =
        buyButton.dataset.defaultSize || PRINT_SIZE_OPTIONS[0].value;
      openOrderModal(Number.isNaN(photoIndex) ? 0 : photoIndex, defaultSize);
      return;
    }

    const image = event.target.closest(".sale-image");
    if (image) {
      const photoIndex = Number.parseInt(image.dataset.photoIndex || "0", 10);
      openPhotoModal(Number.isNaN(photoIndex) ? 0 : photoIndex);
    }
  });

  shopFeaturedGridEl.addEventListener("keydown", (event) => {
    const image = event.target.closest(".sale-image");
    if (!image) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    const photoIndex = Number.parseInt(image.dataset.photoIndex || "0", 10);
    openPhotoModal(Number.isNaN(photoIndex) ? 0 : photoIndex);
  });

  shopFeaturedGridEl.addEventListener("change", (event) => {
    const sizeSelect = event.target.closest(".sale-size-select");
    if (!sizeSelect) {
      return;
    }

    const dictionary = getDictionary();
    const card = sizeSelect.closest(".sale-card");
    const sizeValue = sizeSelect.value;
    const option = getPrintSizeOption(sizeValue);
    const priceNode = card?.querySelector("[data-sale-price]");
    if (priceNode) {
      priceNode.textContent = `${dictionary.shopPriceLabel}: ${formatPricePln(option.pricePln)}`;
    }
    const buyButton = card?.querySelector(".sale-buy-btn");
    if (buyButton) {
      buyButton.dataset.defaultSize = option.value;
    }
  });
}

if (inquiryCloseBtn) {
  inquiryCloseBtn.addEventListener("click", closeInquiryModal);
}

if (orderCloseBtn) {
  orderCloseBtn.addEventListener("click", closeOrderModal);
}

if (quickContactCloseBtn) {
  quickContactCloseBtn.addEventListener("click", closeQuickContactModal);
}

if (navContactLinkEl) {
  navContactLinkEl.addEventListener("click", (event) => {
    const href = navContactLinkEl.getAttribute("href") || "#kontakt";
    const shouldOpenModal =
      navContactLinkEl.dataset.contactModal === "1" &&
      href.startsWith("#") &&
      !isContactPage;
    if (!shouldOpenModal) {
      return;
    }
    event.preventDefault();
    const opened = openQuickContactModal();
    if (!opened) {
      window.location.href = "./index.html#kontakt";
    }
  });
}

if (contactModalBookingBtn) {
  contactModalBookingBtn.addEventListener("click", () => {
    closeQuickContactModal();
    openBookingModal();
  });
}

if (bookingCloseBtn) {
  bookingCloseBtn.addEventListener("click", closeBookingModal);
}

if (inquiryModalEl) {
  inquiryModalEl.addEventListener("click", (event) => {
    if (event.target === inquiryModalEl) {
      closeInquiryModal();
    }
  });
}

if (bookingModalEl) {
  bookingModalEl.addEventListener("click", (event) => {
    if (event.target === bookingModalEl) {
      closeBookingModal();
    }
  });
}

if (orderModalEl) {
  orderModalEl.addEventListener("click", (event) => {
    if (event.target === orderModalEl) {
      closeOrderModal();
    }
  });
}

if (quickContactModalEl) {
  quickContactModalEl.addEventListener("click", (event) => {
    if (event.target === quickContactModalEl) {
      closeQuickContactModal();
    }
  });
}

if (orderSizeSelect) {
  orderSizeSelect.addEventListener("change", () => {
    updateOrderPriceLabel(orderSizeSelect.value);
  });
}

if (inquiryFormEl) {
  inquiryFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const dictionary = getDictionary();
    const selectedPhotoIndex = Number.parseInt(inquiryPhotoInput?.value || "0", 10);
    const safePhotoIndex =
      loadedGalleryPhotos.length > 0 && !Number.isNaN(selectedPhotoIndex)
        ? Math.max(0, Math.min(selectedPhotoIndex, loadedGalleryPhotos.length - 1))
        : 0;
    const photoLabel = getInquiryPhotoLabel(safePhotoIndex);
    const email = inquiryEmailInput?.value?.trim() || "";
    const requestedSize = inquirySizeSelect?.value || "30x45 cm";
    const size =
      requestedSize === "custom" ? dictionary.inquiryCustomSize : requestedSize;
    const message = inquiryMessageInput?.value?.trim() || "-";

    const subject = `${dictionary.inquirySubject}: ${photoLabel}`;
    const body = [
      `${dictionary.inquiryPhotoLabel}: ${photoLabel}`,
      `${dictionary.inquirySizeLabel}: ${size}`,
      `${dictionary.inquiryEmailLabel}: ${email}`,
      "",
      `${dictionary.inquiryMessageLabel}:`,
      message
    ].join("\n");

    saveAdminInboxMessage({
      type: "inquiry",
      language: currentLanguage,
      photo: getPhotoFilename(safePhotoIndex),
      photoLabel,
      size,
      email,
      message
    });

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    closeInquiryModal();
  });
}

if (orderFormEl) {
  orderFormEl.addEventListener("submit", async (event) => {
    event.preventDefault();
    const dictionary = getDictionary();

    const selectedPhotoIndex = Number.parseInt(orderPhotoInput?.value || "0", 10);
    const safePhotoIndex =
      loadedGalleryPhotos.length > 0 && !Number.isNaN(selectedPhotoIndex)
        ? Math.max(0, Math.min(selectedPhotoIndex, loadedGalleryPhotos.length - 1))
        : 0;
    const photoLabel = getInquiryPhotoLabel(safePhotoIndex);

    const selectedSizeValue =
      orderSizeSelect?.value || PRINT_SIZE_OPTIONS[0].value;
    const selectedSizeOption = getPrintSizeOption(selectedSizeValue);
    const priceLabel = formatPricePln(selectedSizeOption.pricePln);

    const firstName = orderFirstNameInput?.value?.trim() || "";
    const lastName = orderLastNameInput?.value?.trim() || "";
    const email = orderEmailInput?.value?.trim() || "";
    const phone = orderPhoneInput?.value?.trim() || "";
    const city = orderCityInput?.value?.trim() || "";
    const postalCode = orderPostalCodeInput?.value?.trim() || "";
    const streetAddress = orderStreetAddressInput?.value?.trim() || "";
    const paymentMethod = orderPaymentMethodSelect?.value || "";
    const carrier = orderCarrierSelect?.value || "";
    const shippingMethod = ORDER_SHIPPING_METHOD;
    const paymentMethodLabel = getPaymentMethodLabel(paymentMethod, dictionary);
    const carrierLabel = getCarrierLabel(carrier, dictionary);
    const address = [streetAddress, `${postalCode} ${city}`.trim()]
      .filter(Boolean)
      .join(", ");
    const message = orderMessageInput?.value?.trim() || "-";
    const fullName = `${firstName} ${lastName}`.trim();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !city ||
      !postalCode ||
      !streetAddress ||
      !paymentMethod ||
      !carrier
    ) {
      window.alert(dictionary.orderValidationRequired);
      return;
    }

    const orderData = {
      language: currentLanguage,
      photo: getPhotoFilename(safePhotoIndex),
      photoLabel,
      size: selectedSizeOption.value,
      pricePln: selectedSizeOption.pricePln,
      priceLabel,
      firstName,
      lastName,
      fullName,
      email,
      phone,
      city,
      postalCode,
      streetAddress,
      paymentMethod,
      paymentMethodLabel,
      shippingMethod,
      carrier,
      carrierLabel,
      address,
      message
    };

    const checkoutResult = await apiJsonRequest("/orders/checkout", {
      method: "POST",
      body: orderData
    });

    if (!checkoutResult || !checkoutResult.ok || !checkoutResult.data?.checkoutUrl) {
      const errorMessage =
        checkoutResult?.error ||
        checkoutResult?.data?.error ||
        (window.location.protocol === "file:"
          ? dictionary.orderCheckoutServerHint
          : dictionary.orderCheckoutError);
      window.alert(errorMessage);
      return;
    }

    saveAdminOrder(
      {
        ...orderData,
        orderId: checkoutResult.data.orderId,
        paymentProvider: checkoutResult.data.provider || "",
        paymentStatus: "awaiting_payment"
      },
      { syncApi: false }
    );

    window.location.href = checkoutResult.data.checkoutUrl;
  });
}

if (bookingFormEl) {
  bookingFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const dictionary = getDictionary();
    const name = bookingNameInput?.value?.trim() || "-";
    const email = bookingEmailInput?.value?.trim() || "-";
    const message = bookingMessageInput?.value?.trim() || "-";
    const subject = `${dictionary.bookingSubject}: ${name}`;
    const body = [
      `${dictionary.bookingNameLabel}: ${name}`,
      `${dictionary.bookingEmailLabel}: ${email}`,
      "",
      `${dictionary.bookingMessageLabel}:`,
      message
    ].join("\n");

    saveAdminInboxMessage({
      type: "booking",
      language: currentLanguage,
      name,
      email,
      message
    });

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    closeBookingModal();
  });
}

if (modalEl) {
  modalEl.addEventListener("click", (event) => {
    if (event.target === modalEl) {
      closePhotoModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (modalEl && !modalEl.hidden) {
      closePhotoModal();
    }
    if (inquiryModalEl && !inquiryModalEl.hidden) {
      closeInquiryModal();
    }
    if (bookingModalEl && !bookingModalEl.hidden) {
      closeBookingModal();
    }
    if (orderModalEl && !orderModalEl.hidden) {
      closeOrderModal();
    }
    if (quickContactModalEl && !quickContactModalEl.hidden) {
      closeQuickContactModal();
    }
  }
});

window.addEventListener("resize", () => {
  if (!loadedGalleryPhotos.length) {
    return;
  }
  if (homeGalleryResizeTimer) {
    clearTimeout(homeGalleryResizeTimer);
  }
  homeGalleryResizeTimer = window.setTimeout(() => {
    if (isHomePortfolioExpanded) {
      void buildHomePortfolioExpandedGallery();
      return;
    }
    void renderHomeGalleryPhotos(loadedGalleryPhotos, homeGalleryRotationStep);
  }, 180);
});

window.addEventListener("storage", (event) => {
  if (event.key !== SITE_SETTINGS_STORAGE_KEY) {
    return;
  }
  void refreshSiteSettings();
});

window.addEventListener("focus", () => {
  void refreshSiteSettings();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    saveYouTubePlaybackState(true);
    return;
  }

  if (!document.hidden) {
    void refreshSiteSettings();
  }
});

window.addEventListener("pagehide", () => {
  saveYouTubePlaybackState(true);
});

window.addEventListener("beforeunload", () => {
  saveYouTubePlaybackState(true);
});

if (window.location.protocol !== "file:") {
  window.setInterval(() => {
    void refreshSiteSettings();
  }, SETTINGS_POLL_INTERVAL_MS);
}

bindGalleryPreview();
bindPortfolioPreview();
updateCardAccessibilityLabels();
initLogo();
initYouTubePlaylistPlayer();

async function initMedia() {
  const [categorizedPhotoCandidates, featuredPhotoCandidates, foundMusicTracks, foundVideo] = await Promise.all([
    findCategorizedPhotoSources(),
    findFeaturedPhotoSources(),
    findMusicSource(),
    findVideoSource()
  ]);

  const verifiedCategoryEntries = await Promise.all(
    PHOTO_CATEGORIES.map(async (category) => {
      const candidates = categorizedPhotoCandidates[category] || [];
      const verifiedPhotos = await Promise.all(candidates.map(checkImage));
      const uniquePhotos = [...new Set(verifiedPhotos.filter(Boolean))];
      return [category, uniquePhotos];
    })
  );

  categoryPhotoSources = createEmptyCategoryPhotoSources();
  const uniqueLoadedPhotos = [];
  const seenPhotos = new Set();
  verifiedCategoryEntries.forEach(([category, photos]) => {
    categoryPhotoSources[category] = photos;
    photos.forEach((src) => {
      if (seenPhotos.has(src)) {
        return;
      }
      seenPhotos.add(src);
      uniqueLoadedPhotos.push(src);
    });
  });

  const verifiedFeaturedPhotos = await Promise.all(featuredPhotoCandidates.map(checkImage));
  featuredSalePhotoSources = [...new Set(verifiedFeaturedPhotos.filter(Boolean))];
  featuredSalePhotoSources.forEach((src) => {
    if (seenPhotos.has(src)) {
      return;
    }
    seenPhotos.add(src);
    uniqueLoadedPhotos.push(src);
  });

  loadedGalleryPhotos = uniqueLoadedPhotos;
  photoSourceToIndex = new Map(
    loadedGalleryPhotos.map((src, index) => [src, index])
  );
  activeShopCategory = getFirstAvailableCategory(activeShopCategory, "shop");
  activePortfolioCategory = getFirstAvailableCategory(activePortfolioCategory, "portfolio");
  musicTrackSources = Array.isArray(foundMusicTracks) ? foundMusicTracks : [];
  setYouTubeTrackSources(musicTrackSources);
  updateMusicButtonState();

  if (foundVideo) {
    activateBackgroundVideo(foundVideo);
  }

  if (!loadedGalleryPhotos.length) {
    stopHomeGalleryRotation();
    await buildShopGallery();
    await buildFeaturedSaleGallery([]);
    populateInquiryPhotoOptions(0);
    populateOrderPhotoOptions(0);
    populateOrderSizeOptions(PRINT_SIZE_OPTIONS[0].value);
    populateOrderPaymentMethodOptions(ORDER_PAYMENT_METHODS[0].value);
    populateOrderCarrierOptions(ORDER_COURIERS[0].value);
    updateOrderPriceLabel(PRINT_SIZE_OPTIONS[0].value);
    await buildPortfolioGallery([]);
    if (homePortfolioExpandedEl && window.location.hash === "#portfolio-expanded") {
      await setHomePortfolioExpanded(true);
    }
    return;
  }

  homeGalleryRotationStep = 0;
  await applyGalleryPhotos(loadedGalleryPhotos);
  startHomeGalleryRotation(loadedGalleryPhotos);
  await buildShopGallery();
  await buildFeaturedSaleGallery(getPhotosByCategory("all", "shop"));
  populateInquiryPhotoOptions(0);
  populateOrderPhotoOptions(0);
  populateOrderSizeOptions(PRINT_SIZE_OPTIONS[0].value);
  populateOrderPaymentMethodOptions(ORDER_PAYMENT_METHODS[0].value);
  populateOrderCarrierOptions(ORDER_COURIERS[0].value);
  updateOrderPriceLabel(PRINT_SIZE_OPTIONS[0].value);
  updatePortfolioTabState();
  await buildPortfolioGallery(getPortfolioPhotosByCategory(activePortfolioCategory));
  updateCardAccessibilityLabels();
  if (homePortfolioExpandedEl && window.location.hash === "#portfolio-expanded") {
    await setHomePortfolioExpanded(true);
  }
  if (!foundVideo) {
    startBackgroundSlideshow(loadedGalleryPhotos);
  }
}

initMedia();
