#!/usr/bin/env python3
import argparse
import base64
import hmac
import hashlib
import json
import os
import secrets
import sqlite3
import threading
import time
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib import error as urllib_error
from urllib import parse as urllib_parse
from urllib import request as urllib_request
from urllib.parse import parse_qs, urlparse

ADMIN_BOOTSTRAP_PASSWORD = os.environ.get("ADMIN_BOOTSTRAP_PASSWORD", "").strip()
SESSION_TTL_SECONDS = 60 * 60 * 24
USER_SESSION_TTL_SECONDS = 60 * 60 * 24 * 14
SUPPORTED_LANGUAGES = ("pl", "en")
PHOTO_CATEGORIES = ("bw", "color", "nature", "landscape", "portrait")
BLOG_BLOCK_TYPES = ("text", "image", "video")
BLOG_BLOCK_LAYOUTS = ("normal", "wide", "compact")
DEFAULT_BLOG_POSTS = (
    {
        "slug": "street-notes-01",
        "date": "2026-03-05",
        "readMinutes": 4,
        "title": {
            "pl": "Kiedy ulica gra światłem",
            "en": "When the street plays with light",
        },
        "lead": {
            "pl": "Krótki zapis o tym, kiedy miasto daje najlepsze światło.",
            "en": "A short note on when the city gives the best light.",
        },
        "blocks": [
            {
                "type": "text",
                "layout": "normal",
                "text": {
                    "pl": "Najlepsze kadry często pojawiają się kilka minut po zachodzie słońca, kiedy asfalt jeszcze trzyma ciepło, a neony dopiero łapią rytm.",
                    "en": "The best frames often appear a few minutes after sunset, when the asphalt still holds heat and the neon signs start to pulse.",
                },
            },
            {
                "type": "text",
                "layout": "normal",
                "text": {
                    "pl": "W takich momentach nie szukam idealnej geometrii. Szukam napięcia między ciszą a ruchem.",
                    "en": "In those moments I do not chase perfect geometry. I chase tension between silence and movement.",
                },
            },
            {
                "type": "text",
                "layout": "normal",
                "text": {
                    "pl": "Jeżeli chcesz, mogę zrobić osobny wpis o tym, jak planuję nocny spacer fotograficzny po mieście.",
                    "en": "If you want, I can publish a dedicated post about how I plan a night photo walk through the city.",
                },
            },
        ],
    },
    {
        "slug": "night-city-prints",
        "date": "2026-02-27",
        "readMinutes": 5,
        "title": {
            "pl": "Jak wybieram zdjęcia do wydruku",
            "en": "How I select photos for print",
        },
        "lead": {
            "pl": "Co sprawdzam zanim zdjęcie trafi do oferty wydruków.",
            "en": "What I verify before a photo enters the print offer.",
        },
        "blocks": [
            {
                "type": "text",
                "layout": "normal",
                "text": {
                    "pl": "Do wydruku wybieram zdjęcia, które bronią się nie tylko tematem, ale i fakturą cieni.",
                    "en": "For prints, I select photos that hold up not only by subject but also by shadow texture.",
                },
            },
            {
                "type": "text",
                "layout": "normal",
                "text": {
                    "pl": "Czerń musi zostać czernią, a jasne partie nie mogą wyglądać płasko po wydruku.",
                    "en": "Blacks need to stay deep, and bright areas cannot feel flat once printed.",
                },
            },
            {
                "type": "text",
                "layout": "normal",
                "text": {
                    "pl": "Dlatego każdy kadr testuję na kilku rozmiarach, zanim trafi do kolekcji.",
                    "en": "That is why I test each frame at multiple sizes before adding it to the collection.",
                },
            },
        ],
    },
    {
        "slug": "behind-the-frame",
        "date": "2026-02-18",
        "readMinutes": 3,
        "title": {
            "pl": "Kulisy sesji ulicznej",
            "en": "Behind a street session",
        },
        "lead": {
            "pl": "Jak wygląda praca z modelem w miejskim tempie.",
            "en": "How working with a model looks in the city pace.",
        },
        "blocks": [
            {
                "type": "text",
                "layout": "normal",
                "text": {
                    "pl": "Najważniejsze na sesji jest zaufanie i tempo, które pasuje do osoby przed obiektywem.",
                    "en": "The key on a session is trust and a pace that fits the person in front of the lens.",
                },
            },
            {
                "type": "text",
                "layout": "normal",
                "text": {
                    "pl": "Nie ustawiam wszystkiego co do centymetra. Wolę zostawić miejsce na naturalny ruch.",
                    "en": "I do not over-stage every centimeter. I prefer to leave room for natural movement.",
                },
            },
            {
                "type": "text",
                "layout": "normal",
                "text": {
                    "pl": "To właśnie te mikrosekundy między pozami najczęściej dają najmocniejsze ujęcia.",
                    "en": "Those micro-seconds between poses often create the strongest shots.",
                },
            },
        ],
    },
)
MAX_BLOG_COMMENT_LENGTH = 1500
MAX_ITEMS = 500
ORDER_SHIPPING_METHOD_COURIER = "courier"
ALLOWED_PAYMENT_METHODS = {
    "card",
    "apple_pay",
    "google_pay",
    "paypal",
    "blik",
    "bitcoin",
    "ethereum",
}
PRINT_SIZE_PRICE_PLN = {
    "30x45 cm": 299,
    "40x60 cm": 449,
    "50x70 cm": 599,
    "70x100 cm": 899,
}

SESSIONS = {}
USER_SESSIONS = {}
DB_PATH = ""
USER_ACCOUNTS_PATH = ""
USER_STORE_LOCK = threading.Lock()
USER_ACCOUNTS_RELATIVE_FOLDER = "data/users"
USER_ACCOUNTS_RELATIVE_FILE = "data/users/accounts.json"
TRANSLATION_TIMEOUT_SECONDS = 12


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def hash_user_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        200_000,
    ).hex()
    return f"pbkdf2_sha256${salt}${digest}"


def verify_user_password(password: str, stored_hash: str) -> bool:
    try:
        algorithm, salt, digest = stored_hash.split("$", 2)
    except ValueError:
        return False

    if algorithm != "pbkdf2_sha256" or not salt or not digest:
        return False

    candidate = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        200_000,
    ).hex()
    return hmac.compare_digest(candidate, digest)


def normalize_email(value: str) -> str:
    return str(value or "").strip().lower()


def normalize_blog_post_slug(value: str) -> str:
    slug = str(value or "").strip().lower()
    if not slug or len(slug) > 80:
        return ""
    for char in slug:
        if not (char.isalnum() or char in "-_"):
            return ""
    return slug


def ensure_data_dir(db_path: str) -> None:
    os.makedirs(os.path.dirname(db_path), exist_ok=True)


def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def normalize_api_path(path: str) -> str:
    normalized = str(path or "/").strip() or "/"
    if normalized != "/":
        normalized = normalized.rstrip("/") or "/"
    return normalized


def _empty_user_store():
    return {"version": 1, "updatedAt": utc_now_iso(), "users": []}


def ensure_user_accounts_store() -> None:
    if not USER_ACCOUNTS_PATH:
        return
    directory = os.path.dirname(USER_ACCOUNTS_PATH)
    if directory:
        os.makedirs(directory, exist_ok=True)
    if os.path.exists(USER_ACCOUNTS_PATH):
        return
    payload = _empty_user_store()
    with open(USER_ACCOUNTS_PATH, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)


def read_user_accounts_store():
    ensure_user_accounts_store()
    with USER_STORE_LOCK:
        try:
            with open(USER_ACCOUNTS_PATH, "r", encoding="utf-8") as handle:
                raw = json.load(handle)
        except Exception:
            return _empty_user_store()

    if not isinstance(raw, dict):
        return _empty_user_store()
    users = raw.get("users")
    if not isinstance(users, list):
        users = []
    return {
        "version": 1,
        "updatedAt": str(raw.get("updatedAt") or utc_now_iso()),
        "users": users,
    }


def write_user_accounts_store(payload: dict) -> None:
    ensure_user_accounts_store()
    safe_payload = payload if isinstance(payload, dict) else _empty_user_store()
    safe_payload["version"] = 1
    safe_payload["updatedAt"] = utc_now_iso()
    if not isinstance(safe_payload.get("users"), list):
        safe_payload["users"] = []

    temp_path = f"{USER_ACCOUNTS_PATH}.tmp"
    with USER_STORE_LOCK:
        with open(temp_path, "w", encoding="utf-8") as handle:
            json.dump(safe_payload, handle, ensure_ascii=False, indent=2)
        os.replace(temp_path, USER_ACCOUNTS_PATH)


def serialize_user_for_store(user_row):
    if not user_row:
        return None
    return {
        "id": int(user_row["id"]),
        "displayName": str(user_row["display_name"] or ""),
        "email": str(user_row["email"] or ""),
        "emailNormalized": str(user_row["email_normalized"] or ""),
        "passwordHash": str(user_row["password_hash"] or ""),
        "createdAt": str(user_row["created_at"] or ""),
    }


def serialize_public_user_store_entry(entry):
    if not isinstance(entry, dict):
        return None
    try:
        user_id = int(entry.get("id") or 0)
    except Exception:
        user_id = 0
    if user_id <= 0:
        return None
    return {
        "id": user_id,
        "displayName": str(entry.get("displayName") or ""),
        "email": str(entry.get("email") or ""),
        "createdAt": str(entry.get("createdAt") or ""),
    }


def sync_user_store_from_db() -> None:
    ensure_user_accounts_store()
    with get_db_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, display_name, email, email_normalized, password_hash, created_at
            FROM users
            ORDER BY id ASC
            """
        ).fetchall()

    users = []
    for row in rows:
        serialized = serialize_user_for_store(row)
        if serialized:
            users.append(serialized)

    write_user_accounts_store({"version": 1, "users": users, "updatedAt": utc_now_iso()})


def sanitize_content_overrides(raw):
    safe = {lang: {} for lang in SUPPORTED_LANGUAGES}
    if not isinstance(raw, dict):
        return safe

    for lang in SUPPORTED_LANGUAGES:
        lang_data = raw.get(lang)
        if not isinstance(lang_data, dict):
            continue
        for key, value in lang_data.items():
            if isinstance(value, str):
                safe[lang][key] = value
    return safe


def sanitize_enabled_categories(raw):
    safe = {category: True for category in PHOTO_CATEGORIES}
    if not isinstance(raw, dict):
        return safe

    for category in PHOTO_CATEGORIES:
        if category in raw:
            safe[category] = bool(raw.get(category))
    return safe


def has_any_category_flag(raw):
    if not isinstance(raw, dict):
        return False
    return any(category in raw for category in PHOTO_CATEGORIES)


def normalize_site_settings(raw):
    if not isinstance(raw, dict):
        raw = {}

    shop_enabled = raw.get("shopEnabled", True)
    shop_enabled = bool(shop_enabled)
    blog_enabled = bool(raw.get("blogEnabled", True))
    maintenance_mode = bool(raw.get("maintenanceMode", False))
    content_overrides = sanitize_content_overrides(raw.get("contentOverrides"))
    legacy_enabled_categories = sanitize_enabled_categories(raw.get("enabledCategories"))
    raw_shop_categories = raw.get("shopCategories")
    raw_portfolio_categories = raw.get("portfolioCategories")
    shop_categories = sanitize_enabled_categories(raw_shop_categories)
    portfolio_categories = sanitize_enabled_categories(raw_portfolio_categories)
    if not has_any_category_flag(raw_shop_categories):
        shop_categories = sanitize_enabled_categories(legacy_enabled_categories)
    if not has_any_category_flag(raw_portfolio_categories):
        portfolio_categories = sanitize_enabled_categories(legacy_enabled_categories)

    return {
        "shopEnabled": shop_enabled,
        "blogEnabled": blog_enabled,
        "maintenanceMode": maintenance_mode,
        "contentOverrides": content_overrides,
        # Legacy key kept for backward compatibility with older frontend bundles.
        "enabledCategories": sanitize_enabled_categories(legacy_enabled_categories),
        "shopCategories": shop_categories,
        "portfolioCategories": portfolio_categories,
    }


def init_db() -> None:
    ensure_data_dir(DB_PATH)
    ensure_user_accounts_store()
    with get_db_connection() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS admin (
              id INTEGER PRIMARY KEY CHECK(id = 1),
              password_hash TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS settings (
              id INTEGER PRIMARY KEY CHECK(id = 1),
              shop_enabled INTEGER NOT NULL DEFAULT 1,
              blog_enabled INTEGER NOT NULL DEFAULT 1,
              maintenance_mode INTEGER NOT NULL DEFAULT 0,
              content_overrides TEXT NOT NULL DEFAULT '{}',
              enabled_categories TEXT NOT NULL DEFAULT '{}',
              shop_categories TEXT NOT NULL DEFAULT '{}',
              portfolio_categories TEXT NOT NULL DEFAULT '{}',
              updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS inbox (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              type TEXT NOT NULL,
              language TEXT,
              payload TEXT NOT NULL,
              created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS orders (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              language TEXT,
              photo TEXT,
              photo_label TEXT,
              size TEXT,
              price_pln INTEGER,
              price_label TEXT,
              first_name TEXT,
              last_name TEXT,
              full_name TEXT,
              email TEXT,
              phone TEXT,
              city TEXT,
              postal_code TEXT,
              street_address TEXT,
              payment_method TEXT,
              shipping_method TEXT,
              carrier TEXT,
              payment_provider TEXT,
              payment_reference TEXT,
              payment_checkout_url TEXT,
              payment_status TEXT,
              payment_updated_at TEXT,
              address TEXT,
              message TEXT,
              created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              display_name TEXT NOT NULL,
              email TEXT NOT NULL,
              email_normalized TEXT NOT NULL UNIQUE,
              password_hash TEXT NOT NULL,
              created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS blog_comments (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              post_slug TEXT NOT NULL,
              user_id INTEGER NOT NULL,
              content TEXT NOT NULL,
              created_at TEXT NOT NULL,
              FOREIGN KEY (user_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS blog_posts (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              slug TEXT NOT NULL UNIQUE,
              title_pl TEXT NOT NULL,
              title_en TEXT NOT NULL,
              lead_pl TEXT NOT NULL DEFAULT '',
              lead_en TEXT NOT NULL DEFAULT '',
              content_blocks TEXT NOT NULL DEFAULT '[]',
              publish_date TEXT NOT NULL,
              read_minutes INTEGER NOT NULL DEFAULT 3,
              is_published INTEGER NOT NULL DEFAULT 1,
              sort_order INTEGER NOT NULL DEFAULT 0,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );
            """
        )

        migration_columns = (
            "city TEXT",
            "postal_code TEXT",
            "street_address TEXT",
            "payment_method TEXT",
            "shipping_method TEXT",
            "carrier TEXT",
            "payment_provider TEXT",
            "payment_reference TEXT",
            "payment_checkout_url TEXT",
            "payment_status TEXT",
            "payment_updated_at TEXT",
        )
        for column_definition in migration_columns:
            try:
                conn.execute(f"ALTER TABLE orders ADD COLUMN {column_definition}")
            except sqlite3.OperationalError:
                # Column already exists in migrated databases.
                pass
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_blog_comments_post_created "
            "ON blog_comments(post_slug, created_at)"
        )
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_blog_posts_public_order "
            "ON blog_posts(is_published, sort_order, publish_date, id)"
        )

        try:
            conn.execute("ALTER TABLE settings ADD COLUMN enabled_categories TEXT NOT NULL DEFAULT '{}'")
        except sqlite3.OperationalError:
            # Column already exists in migrated databases.
            pass
        try:
            conn.execute("ALTER TABLE settings ADD COLUMN shop_categories TEXT NOT NULL DEFAULT '{}'")
        except sqlite3.OperationalError:
            # Column already exists in migrated databases.
            pass
        try:
            conn.execute("ALTER TABLE settings ADD COLUMN portfolio_categories TEXT NOT NULL DEFAULT '{}'")
        except sqlite3.OperationalError:
            # Column already exists in migrated databases.
            pass
        try:
            conn.execute("ALTER TABLE settings ADD COLUMN maintenance_mode INTEGER NOT NULL DEFAULT 0")
        except sqlite3.OperationalError:
            # Column already exists in migrated databases.
            pass
        try:
            conn.execute("ALTER TABLE settings ADD COLUMN blog_enabled INTEGER NOT NULL DEFAULT 1")
        except sqlite3.OperationalError:
            # Column already exists in migrated databases.
            pass

        now = utc_now_iso()
        admin_row = conn.execute("SELECT id, password_hash FROM admin WHERE id = 1").fetchone()
        if not admin_row:
            bootstrap_password = ADMIN_BOOTSTRAP_PASSWORD or secrets.token_urlsafe(10)
            conn.execute(
                "INSERT INTO admin (id, password_hash, updated_at) VALUES (1, ?, ?)",
                (hash_password(bootstrap_password), now),
            )
            if not ADMIN_BOOTSTRAP_PASSWORD:
                print(
                    "[admin] Wygenerowano hasło startowe administratora: "
                    f"{bootstrap_password}"
                )

        settings_row = conn.execute("SELECT id FROM settings WHERE id = 1").fetchone()
        if not settings_row:
            conn.execute(
                """
                INSERT INTO settings (
                  id,
                  shop_enabled,
                  blog_enabled,
                  maintenance_mode,
                  content_overrides,
                  enabled_categories,
                  updated_at
                )
                VALUES (1, 1, 1, 0, ?, ?, ?)
                """,
                (
                    json.dumps({"pl": {}, "en": {}}, ensure_ascii=False),
                    json.dumps(sanitize_enabled_categories({}), ensure_ascii=False),
                    now,
                ),
            )
            conn.execute(
                """
                UPDATE settings
                SET shop_categories = ?, portfolio_categories = ?, updated_at = ?
                WHERE id = 1
                """,
                (
                    json.dumps(sanitize_enabled_categories({}), ensure_ascii=False),
                    json.dumps(sanitize_enabled_categories({}), ensure_ascii=False),
                    now,
                ),
            )
    sync_user_store_from_db()
    seed_default_blog_posts_if_empty()


def read_site_settings_from_db():
    with get_db_connection() as conn:
        row = conn.execute(
            """
            SELECT
              shop_enabled,
              blog_enabled,
              maintenance_mode,
              content_overrides,
              enabled_categories,
              shop_categories,
              portfolio_categories
            FROM settings
            WHERE id = 1
            """
        ).fetchone()
        if not row:
            default_categories = sanitize_enabled_categories({})
            return {
                "shopEnabled": True,
                "blogEnabled": True,
                "maintenanceMode": False,
                "contentOverrides": {"pl": {}, "en": {}},
                "enabledCategories": default_categories,
                "shopCategories": default_categories,
                "portfolioCategories": default_categories,
            }

        try:
            content_overrides = json.loads(row["content_overrides"])
        except Exception:
            content_overrides = {}
        try:
            enabled_categories = json.loads(row["enabled_categories"])
        except Exception:
            enabled_categories = {}
        try:
            shop_categories = json.loads(row["shop_categories"])
        except Exception:
            shop_categories = {}
        try:
            portfolio_categories = json.loads(row["portfolio_categories"])
        except Exception:
            portfolio_categories = {}

        legacy_safe_categories = sanitize_enabled_categories(enabled_categories)
        shop_safe_categories = sanitize_enabled_categories(shop_categories)
        portfolio_safe_categories = sanitize_enabled_categories(portfolio_categories)
        if not has_any_category_flag(shop_categories):
            shop_safe_categories = sanitize_enabled_categories(legacy_safe_categories)
        if not has_any_category_flag(portfolio_categories):
            portfolio_safe_categories = sanitize_enabled_categories(legacy_safe_categories)

        return {
            "shopEnabled": bool(row["shop_enabled"]),
            "blogEnabled": bool(row["blog_enabled"]),
            "maintenanceMode": bool(row["maintenance_mode"]),
            "contentOverrides": sanitize_content_overrides(content_overrides),
            "enabledCategories": legacy_safe_categories,
            "shopCategories": shop_safe_categories,
            "portfolioCategories": portfolio_safe_categories,
        }


def write_site_settings_to_db(settings):
    normalized = normalize_site_settings(settings)
    with get_db_connection() as conn:
        conn.execute(
            """
            UPDATE settings
            SET
              shop_enabled = ?,
              blog_enabled = ?,
              maintenance_mode = ?,
              content_overrides = ?,
              enabled_categories = ?,
              shop_categories = ?,
              portfolio_categories = ?,
              updated_at = ?
            WHERE id = 1
            """,
            (
                1 if normalized["shopEnabled"] else 0,
                1 if normalized["blogEnabled"] else 0,
                1 if normalized["maintenanceMode"] else 0,
                json.dumps(normalized["contentOverrides"], ensure_ascii=False),
                json.dumps(normalized["enabledCategories"], ensure_ascii=False),
                json.dumps(normalized["shopCategories"], ensure_ascii=False),
                json.dumps(normalized["portfolioCategories"], ensure_ascii=False),
                utc_now_iso(),
            ),
        )
    return normalized


def create_session_token() -> str:
    token = secrets.token_urlsafe(32)
    SESSIONS[token] = time.time() + SESSION_TTL_SECONDS
    return token


def cleanup_sessions() -> None:
    now = time.time()
    expired = [token for token, expires_at in SESSIONS.items() if expires_at < now]
    for token in expired:
        SESSIONS.pop(token, None)


def create_user_session_token(user_id: int) -> str:
    token = secrets.token_urlsafe(32)
    USER_SESSIONS[token] = {
        "user_id": int(user_id),
        "expires_at": time.time() + USER_SESSION_TTL_SECONDS,
    }
    return token


def cleanup_user_sessions() -> None:
    now = time.time()
    expired = [
        token
        for token, session in USER_SESSIONS.items()
        if float(session.get("expires_at", 0)) < now
    ]
    for token in expired:
        USER_SESSIONS.pop(token, None)


def get_user_id_from_session_token(token: str):
    cleanup_user_sessions()
    session = USER_SESSIONS.get(token)
    if not isinstance(session, dict):
        return None
    user_id = session.get("user_id")
    if not isinstance(user_id, int) or user_id <= 0:
        USER_SESSIONS.pop(token, None)
        return None
    session["expires_at"] = time.time() + USER_SESSION_TTL_SECONDS
    return user_id


def get_user_by_id(user_id: int):
    with get_db_connection() as conn:
        row = conn.execute(
            """
            SELECT id, display_name, email, email_normalized, password_hash, created_at
            FROM users
            WHERE id = ?
            """,
            (int(user_id),),
        ).fetchone()
    return row


def get_user_by_email(email: str):
    normalized = normalize_email(email)
    if not normalized:
        return None
    with get_db_connection() as conn:
        row = conn.execute(
            """
            SELECT id, display_name, email, email_normalized, password_hash, created_at
            FROM users
            WHERE email_normalized = ?
            """,
            (normalized,),
        ).fetchone()
    return row


def create_user_account(display_name: str, email: str, password: str):
    safe_name = str(display_name or "").strip()
    safe_email = str(email or "").strip()
    normalized_email = normalize_email(safe_email)
    safe_password = str(password or "")

    if len(safe_name) < 2 or len(safe_name) > 60:
        return None, "Nazwa użytkownika musi mieć od 2 do 60 znaków."
    if "@" not in normalized_email or "." not in normalized_email:
        return None, "Podaj poprawny adres e-mail."
    if len(safe_password) < 6:
        return None, "Hasło musi mieć co najmniej 6 znaków."
    if get_user_by_email(safe_email):
        return None, "Konto z tym adresem e-mail już istnieje."

    hashed_password = hash_user_password(safe_password)
    now = utc_now_iso()

    try:
        with get_db_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO users (display_name, email, email_normalized, password_hash, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (safe_name, safe_email, normalized_email, hashed_password, now),
            )
            user_id = int(cursor.lastrowid or 0)
    except sqlite3.IntegrityError:
        return None, "Konto z tym adresem e-mail już istnieje."

    if not user_id:
        return None, "Nie udało się utworzyć konta."

    user_row = get_user_by_id(user_id)
    if not user_row:
        return None, "Nie udało się odczytać nowego konta."
    sync_user_store_from_db()
    return user_row, None


def serialize_public_user(user_row):
    if not user_row:
        return None
    return {
        "id": int(user_row["id"]),
        "displayName": str(user_row["display_name"] or ""),
        "email": str(user_row["email"] or ""),
        "createdAt": str(user_row["created_at"] or ""),
    }


def normalize_blog_date(value: str) -> str:
    raw = str(value or "").strip()
    if len(raw) >= 10:
        candidate = raw[:10]
        try:
            datetime.strptime(candidate, "%Y-%m-%d")
            return candidate
        except ValueError:
            pass
    return utc_now_iso()[:10]


def clamp_int(value, default: int, minimum: int, maximum: int) -> int:
    try:
        parsed = int(value)
    except Exception:
        parsed = int(default)
    return max(minimum, min(maximum, parsed))


def sanitize_blog_localized_text(raw, max_length: int = 6000):
    source = raw if isinstance(raw, dict) else {}
    return {
        "pl": str(source.get("pl") or "").strip()[:max_length],
        "en": str(source.get("en") or "").strip()[:max_length],
    }


def sanitize_blog_blocks(raw_blocks):
    if not isinstance(raw_blocks, list):
        return []

    safe_blocks = []
    for raw in raw_blocks[:200]:
        if not isinstance(raw, dict):
            continue
        block_type = str(raw.get("type") or "").strip().lower()
        if block_type not in BLOG_BLOCK_TYPES:
            continue

        layout = str(raw.get("layout") or "normal").strip().lower()
        if layout not in BLOG_BLOCK_LAYOUTS:
            layout = "normal"

        if block_type == "text":
            text_payload = sanitize_blog_localized_text(raw.get("text"), max_length=12000)
            if not text_payload["pl"] and not text_payload["en"]:
                continue
            safe_blocks.append(
                {
                    "type": "text",
                    "layout": layout,
                    "text": text_payload,
                }
            )
            continue

        source = str(raw.get("src") or "").strip()[:2000]
        if not source:
            continue
        caption_payload = sanitize_blog_localized_text(raw.get("caption"), max_length=1000)
        safe_blocks.append(
            {
                "type": block_type,
                "layout": layout,
                "src": source,
                "caption": caption_payload,
            }
        )
    return safe_blocks


def estimate_blog_read_minutes(blocks, fallback: int = 3) -> int:
    words = 0
    for block in blocks:
        if not isinstance(block, dict):
            continue
        if str(block.get("type") or "").strip().lower() != "text":
            continue
        text_payload = block.get("text")
        if not isinstance(text_payload, dict):
            continue
        sample = str(text_payload.get("pl") or text_payload.get("en") or "")
        words += len(sample.split())

    if words <= 0:
        return clamp_int(fallback, default=3, minimum=1, maximum=60)
    estimated = (words + 179) // 180
    return clamp_int(estimated, default=3, minimum=1, maximum=60)


def normalize_blog_post_payload(raw, existing_post=None):
    payload = raw if isinstance(raw, dict) else {}
    base_slug = str(payload.get("slug") or "").strip().lower()
    safe_slug = normalize_blog_post_slug(base_slug)
    if not safe_slug:
        return None, "Nieprawidłowy slug wpisu."

    title = sanitize_blog_localized_text(payload.get("title"), max_length=220)
    if not title["pl"]:
        return None, "Podaj tytuł wpisu (PL)."
    if not title["en"]:
        title["en"] = title["pl"]

    lead = sanitize_blog_localized_text(payload.get("lead"), max_length=800)
    blocks = sanitize_blog_blocks(payload.get("blocks"))
    if not blocks:
        return None, "Dodaj przynajmniej jeden blok treści."

    publish_date = normalize_blog_date(payload.get("date"))
    requested_minutes = payload.get("readMinutes")
    fallback_minutes = existing_post["readMinutes"] if isinstance(existing_post, dict) else 3
    read_minutes = (
        clamp_int(requested_minutes, default=fallback_minutes, minimum=1, maximum=60)
        if requested_minutes is not None
        else estimate_blog_read_minutes(blocks, fallback=fallback_minutes)
    )

    sort_order_default = existing_post["sortOrder"] if isinstance(existing_post, dict) else 0
    sort_order = clamp_int(payload.get("sortOrder"), default=sort_order_default, minimum=-9999, maximum=9999)
    is_published = bool(payload.get("isPublished", True))

    return (
        {
            "slug": safe_slug,
            "title": title,
            "lead": lead,
            "blocks": blocks,
            "date": publish_date,
            "readMinutes": read_minutes,
            "sortOrder": sort_order,
            "isPublished": is_published,
        },
        None,
    )


def serialize_blog_post_row(row):
    if not row:
        return None
    try:
        blocks_raw = json.loads(str(row["content_blocks"] or "[]"))
    except Exception:
        blocks_raw = []
    blocks = sanitize_blog_blocks(blocks_raw)

    return {
        "id": int(row["id"]),
        "slug": str(row["slug"] or ""),
        "date": normalize_blog_date(row["publish_date"] or ""),
        "readMinutes": clamp_int(row["read_minutes"], default=3, minimum=1, maximum=60),
        "sortOrder": clamp_int(row["sort_order"], default=0, minimum=-9999, maximum=9999),
        "isPublished": bool(row["is_published"]),
        "title": {
            "pl": str(row["title_pl"] or ""),
            "en": str(row["title_en"] or ""),
        },
        "lead": {
            "pl": str(row["lead_pl"] or ""),
            "en": str(row["lead_en"] or ""),
        },
        "blocks": blocks,
        "createdAt": str(row["created_at"] or ""),
        "updatedAt": str(row["updated_at"] or ""),
    }


def list_blog_posts(include_unpublished: bool = False):
    where_clause = "" if include_unpublished else "WHERE is_published = 1"
    with get_db_connection() as conn:
        rows = conn.execute(
            f"""
            SELECT
              id, slug, title_pl, title_en, lead_pl, lead_en,
              content_blocks, publish_date, read_minutes, is_published, sort_order,
              created_at, updated_at
            FROM blog_posts
            {where_clause}
            ORDER BY sort_order ASC, publish_date DESC, id DESC
            """
        ).fetchall()

    serialized = []
    for row in rows:
        item = serialize_blog_post_row(row)
        if item:
            serialized.append(item)
    return serialized


def get_blog_post_by_slug(slug: str, include_unpublished: bool = False):
    safe_slug = normalize_blog_post_slug(slug)
    if not safe_slug:
        return None

    where_clause = "slug = ?" if include_unpublished else "slug = ? AND is_published = 1"
    with get_db_connection() as conn:
        row = conn.execute(
            f"""
            SELECT
              id, slug, title_pl, title_en, lead_pl, lead_en,
              content_blocks, publish_date, read_minutes, is_published, sort_order,
              created_at, updated_at
            FROM blog_posts
            WHERE {where_clause}
            LIMIT 1
            """,
            (safe_slug,),
        ).fetchone()
    return serialize_blog_post_row(row) if row else None


def save_blog_post(raw_payload):
    payload = raw_payload if isinstance(raw_payload, dict) else {}
    post_id = clamp_int(payload.get("id"), default=0, minimum=0, maximum=10**9)

    existing = None
    if post_id > 0:
        with get_db_connection() as conn:
            row = conn.execute(
                """
                SELECT
                  id, slug, title_pl, title_en, lead_pl, lead_en,
                  content_blocks, publish_date, read_minutes, is_published, sort_order,
                  created_at, updated_at
                FROM blog_posts
                WHERE id = ?
                LIMIT 1
                """,
                (post_id,),
            ).fetchone()
        if not row:
            return None, "Nie znaleziono wpisu do edycji.", 404
        existing = serialize_blog_post_row(row)

    normalized, error_message = normalize_blog_post_payload(payload, existing_post=existing)
    if error_message:
        return None, error_message, 400

    now = utc_now_iso()
    try:
        with get_db_connection() as conn:
            if post_id > 0:
                conn.execute(
                    """
                    UPDATE blog_posts
                    SET
                      slug = ?,
                      title_pl = ?,
                      title_en = ?,
                      lead_pl = ?,
                      lead_en = ?,
                      content_blocks = ?,
                      publish_date = ?,
                      read_minutes = ?,
                      is_published = ?,
                      sort_order = ?,
                      updated_at = ?
                    WHERE id = ?
                    """,
                    (
                        normalized["slug"],
                        normalized["title"]["pl"],
                        normalized["title"]["en"],
                        normalized["lead"]["pl"],
                        normalized["lead"]["en"],
                        json.dumps(normalized["blocks"], ensure_ascii=False),
                        normalized["date"],
                        normalized["readMinutes"],
                        1 if normalized["isPublished"] else 0,
                        normalized["sortOrder"],
                        now,
                        post_id,
                    ),
                )
            else:
                cursor = conn.execute(
                    """
                    INSERT INTO blog_posts (
                      slug, title_pl, title_en, lead_pl, lead_en,
                      content_blocks, publish_date, read_minutes, is_published,
                      sort_order, created_at, updated_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        normalized["slug"],
                        normalized["title"]["pl"],
                        normalized["title"]["en"],
                        normalized["lead"]["pl"],
                        normalized["lead"]["en"],
                        json.dumps(normalized["blocks"], ensure_ascii=False),
                        normalized["date"],
                        normalized["readMinutes"],
                        1 if normalized["isPublished"] else 0,
                        normalized["sortOrder"],
                        now,
                        now,
                    ),
                )
                post_id = int(cursor.lastrowid or 0)
    except sqlite3.IntegrityError:
        return None, "Slug wpisu jest już zajęty.", 400

    with get_db_connection() as conn:
        row = conn.execute(
            """
            SELECT
              id, slug, title_pl, title_en, lead_pl, lead_en,
              content_blocks, publish_date, read_minutes, is_published, sort_order,
              created_at, updated_at
            FROM blog_posts
            WHERE id = ?
            LIMIT 1
            """,
            (post_id,),
        ).fetchone()
    saved = serialize_blog_post_row(row)
    if not saved:
        return None, "Nie udało się zapisać wpisu.", 500
    return saved, None, 200


def delete_blog_post(post_id: int):
    safe_id = clamp_int(post_id, default=0, minimum=0, maximum=10**9)
    if safe_id <= 0:
        return False, "Nieprawidłowe ID wpisu.", 400

    with get_db_connection() as conn:
        row = conn.execute("SELECT id FROM blog_posts WHERE id = ? LIMIT 1", (safe_id,)).fetchone()
        if not row:
            return False, "Nie znaleziono wpisu.", 404
        conn.execute("DELETE FROM blog_posts WHERE id = ?", (safe_id,))
        conn.execute("DELETE FROM blog_comments WHERE post_slug NOT IN (SELECT slug FROM blog_posts)")

    return True, None, 200


def seed_default_blog_posts_if_empty():
    with get_db_connection() as conn:
        row = conn.execute("SELECT COUNT(1) AS count FROM blog_posts").fetchone()
        count = int(row["count"]) if row and row["count"] is not None else 0
        if count > 0:
            return

        now = utc_now_iso()
        for order, entry in enumerate(DEFAULT_BLOG_POSTS):
            normalized, error_message = normalize_blog_post_payload(entry)
            if error_message or not normalized:
                continue
            conn.execute(
                """
                INSERT INTO blog_posts (
                  slug, title_pl, title_en, lead_pl, lead_en,
                  content_blocks, publish_date, read_minutes, is_published,
                  sort_order, created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
                """,
                (
                    normalized["slug"],
                    normalized["title"]["pl"],
                    normalized["title"]["en"],
                    normalized["lead"]["pl"],
                    normalized["lead"]["en"],
                    json.dumps(normalized["blocks"], ensure_ascii=False),
                    normalized["date"],
                    normalized["readMinutes"],
                    order,
                    now,
                    now,
                ),
            )


def create_blog_comment(post_slug: str, user_id: int, content: str):
    safe_slug = normalize_blog_post_slug(post_slug)
    if not safe_slug:
        return None, "Nieprawidłowy wpis bloga."
    if not get_blog_post_by_slug(safe_slug, include_unpublished=False):
        return None, "Nieprawidłowy wpis bloga."

    safe_content = str(content or "").strip()
    if len(safe_content) < 2:
        return None, "Komentarz jest za krótki."
    if len(safe_content) > MAX_BLOG_COMMENT_LENGTH:
        return None, "Komentarz jest za długi."

    now = utc_now_iso()
    with get_db_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO blog_comments (post_slug, user_id, content, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (safe_slug, int(user_id), safe_content, now),
        )
        comment_id = int(cursor.lastrowid or 0)

        row = conn.execute(
            """
            SELECT c.id, c.post_slug, c.content, c.created_at, u.id AS user_id, u.display_name
            FROM blog_comments c
            JOIN users u ON u.id = c.user_id
            WHERE c.id = ?
            """,
            (comment_id,),
        ).fetchone()

    if not row:
        return None, "Nie udało się zapisać komentarza."
    return {
        "id": int(row["id"]),
        "postSlug": str(row["post_slug"] or ""),
        "content": str(row["content"] or ""),
        "createdAt": str(row["created_at"] or ""),
        "user": {
            "id": int(row["user_id"]),
            "displayName": str(row["display_name"] or ""),
        },
    }, None


def get_blog_comments(post_slug: str):
    safe_slug = normalize_blog_post_slug(post_slug)
    if not safe_slug:
        return None, "Nieprawidłowy wpis bloga."
    if not get_blog_post_by_slug(safe_slug, include_unpublished=False):
        return None, "Nieprawidłowy wpis bloga."

    with get_db_connection() as conn:
        rows = conn.execute(
            """
            SELECT c.id, c.post_slug, c.content, c.created_at, u.id AS user_id, u.display_name
            FROM blog_comments c
            JOIN users u ON u.id = c.user_id
            WHERE c.post_slug = ?
            ORDER BY c.id DESC
            LIMIT 400
            """,
            (safe_slug,),
        ).fetchall()

    comments = []
    for row in rows:
        comments.append(
            {
                "id": int(row["id"]),
                "postSlug": str(row["post_slug"] or ""),
                "content": str(row["content"] or ""),
                "createdAt": str(row["created_at"] or ""),
                "user": {
                    "id": int(row["user_id"]),
                    "displayName": str(row["display_name"] or ""),
                },
            }
        )
    return comments, None


def parse_price_pln(value) -> int:
    try:
        parsed = int(value)
    except Exception:
        parsed = 0
    return max(0, parsed)


def get_public_base_url(handler) -> str:
    env_base = str(os.environ.get("SITE_BASE_URL") or "").strip().rstrip("/")
    if env_base:
        return env_base

    forwarded_proto = str(handler.headers.get("X-Forwarded-Proto") or "").strip()
    scheme = "https" if forwarded_proto == "https" else "http"
    host = (
        str(handler.headers.get("X-Forwarded-Host") or "").strip()
        or str(handler.headers.get("Host") or "").strip()
        or "localhost:8080"
    )
    return f"{scheme}://{host}"


def hmac_sha256_hex(secret: str, payload: bytes) -> str:
    return hmac.new(secret.encode("utf-8"), payload, hashlib.sha256).hexdigest()


def verify_stripe_signature(raw_body: bytes, signature_header: str, secret: str) -> bool:
    if not signature_header or not secret:
        return False

    parts = [part.strip() for part in signature_header.split(",") if part.strip()]
    timestamp = ""
    signatures = []
    for part in parts:
        if "=" not in part:
            continue
        key, value = part.split("=", 1)
        if key == "t":
            timestamp = value
        elif key == "v1":
            signatures.append(value)

    if not timestamp or not signatures:
        return False

    signed_payload = f"{timestamp}.".encode("utf-8") + raw_body
    expected = hmac_sha256_hex(secret, signed_payload)
    return any(hmac.compare_digest(expected, candidate) for candidate in signatures)


def parse_json_bytes(raw_body: bytes):
    if not raw_body:
        return {}
    try:
        parsed = json.loads(raw_body.decode("utf-8"))
    except Exception:
        return {}
    return parsed if isinstance(parsed, dict) else {}


def form_encode(data: dict) -> bytes:
    return urllib_parse.urlencode(data, doseq=True).encode("utf-8")


def google_translate_text(source_lang: str, target_lang: str, text: str):
    safe_text = str(text or "")
    if not safe_text.strip():
        return "", None

    params = urllib_parse.urlencode(
        {
            "client": "gtx",
            "sl": source_lang,
            "tl": target_lang,
            "dt": "t",
            "q": safe_text,
        }
    )
    url = f"https://translate.googleapis.com/translate_a/single?{params}"
    request = urllib_request.Request(
        url=url,
        method="GET",
        headers={"User-Agent": "Mozilla/5.0"},
    )

    try:
        with urllib_request.urlopen(request, timeout=TRANSLATION_TIMEOUT_SECONDS) as response:
            raw_body = response.read()
    except Exception:
        return None, "Nie udało się połączyć z usługą tłumaczeń."

    try:
        parsed = json.loads(raw_body.decode("utf-8"))
    except Exception:
        return None, "Usługa tłumaczeń zwróciła nieprawidłową odpowiedź."

    if not isinstance(parsed, list) or not parsed:
        return None, "Usługa tłumaczeń zwróciła pustą odpowiedź."

    segments = parsed[0]
    if not isinstance(segments, list):
        return None, "Usługa tłumaczeń zwróciła nieprawidłową strukturę."

    translated_parts = []
    for segment in segments:
        if not isinstance(segment, list) or not segment:
            continue
        translated_fragment = segment[0]
        if isinstance(translated_fragment, str):
            translated_parts.append(translated_fragment)

    translated = "".join(translated_parts).strip()
    if not translated:
        return None, "Usługa tłumaczeń nie zwróciła tekstu."
    return translated, None


def translate_content_payload(source_lang: str, target_lang: str, content):
    safe_source = str(source_lang or "").strip().lower()
    safe_target = str(target_lang or "").strip().lower()
    if safe_source not in SUPPORTED_LANGUAGES or safe_target not in SUPPORTED_LANGUAGES:
        return None, "Nieobsługiwany język tłumaczenia.", 400
    if safe_source == safe_target:
        return None, "Język źródłowy i docelowy nie mogą być takie same.", 400
    if not isinstance(content, dict):
        return None, "Nieprawidłowy format treści do tłumaczenia.", 400

    translated = {}
    for key, value in content.items():
        if not isinstance(key, str):
            continue
        source_text = str(value or "").strip()
        if not source_text:
            translated[key] = ""
            continue
        if len(source_text) > 10000:
            return None, "Jedno z pól jest za długie do tłumaczenia.", 400

        translated_text, error_message = google_translate_text(
            safe_source, safe_target, source_text
        )
        if error_message:
            return None, error_message, 502
        translated[key] = translated_text

    return translated, None, 200


def json_request(url: str, method: str = "GET", headers=None, body=None, timeout: int = 25):
    payload = None
    request_headers = dict(headers or {})
    if body is not None:
        payload = json.dumps(body).encode("utf-8")
        request_headers.setdefault("Content-Type", "application/json")

    req = urllib_request.Request(url=url, data=payload, method=method.upper())
    for key, value in request_headers.items():
        req.add_header(key, value)

    try:
        with urllib_request.urlopen(req, timeout=timeout) as response:
            raw = response.read()
            status = response.getcode()
    except urllib_error.HTTPError as err:
        raw = err.read()
        status = err.code
    except Exception as err:
        return {"ok": False, "status": 0, "error": str(err), "data": {}}

    try:
        data = json.loads(raw.decode("utf-8")) if raw else {}
    except Exception:
        data = {}

    if not isinstance(data, dict):
        data = {}

    if 200 <= status < 300:
        return {"ok": True, "status": status, "data": data}
    return {"ok": False, "status": status, "error": data.get("error"), "data": data}


def form_request(url: str, method: str = "POST", headers=None, body=None, timeout: int = 25):
    payload = form_encode(body or {})
    request_headers = dict(headers or {})
    request_headers.setdefault("Content-Type", "application/x-www-form-urlencoded")
    req = urllib_request.Request(url=url, data=payload, method=method.upper())
    for key, value in request_headers.items():
        req.add_header(key, value)

    try:
        with urllib_request.urlopen(req, timeout=timeout) as response:
            raw = response.read()
            status = response.getcode()
    except urllib_error.HTTPError as err:
        raw = err.read()
        status = err.code
    except Exception as err:
        return {"ok": False, "status": 0, "error": str(err), "data": {}}

    try:
        data = json.loads(raw.decode("utf-8")) if raw else {}
    except Exception:
        data = {}

    if not isinstance(data, dict):
        data = {}

    if 200 <= status < 300:
        return {"ok": True, "status": status, "data": data}
    return {"ok": False, "status": status, "error": data.get("error"), "data": data}


def get_paypal_base_url() -> str:
    mode = str(os.environ.get("PAYPAL_MODE") or "sandbox").strip().lower()
    if mode == "live":
        return "https://api-m.paypal.com"
    return "https://api-m.sandbox.paypal.com"


def get_paypal_access_token():
    client_id = str(os.environ.get("PAYPAL_CLIENT_ID") or "").strip()
    client_secret = str(os.environ.get("PAYPAL_CLIENT_SECRET") or "").strip()
    if not client_id or not client_secret:
        return {"ok": False, "error": "Brak konfiguracji PayPal (PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET)."}

    token_endpoint = f"{get_paypal_base_url()}/v1/oauth2/token"
    basic_value = f"{client_id}:{client_secret}".encode("utf-8")
    auth_header = "Basic " + base64.b64encode(basic_value).decode("ascii")
    response = form_request(
        token_endpoint,
        method="POST",
        headers={"Authorization": auth_header},
        body={"grant_type": "client_credentials"},
    )
    if not response["ok"]:
        return {"ok": False, "error": "Nie udało się uwierzytelnić PayPal."}

    token = str(response["data"].get("access_token") or "").strip()
    if not token:
        return {"ok": False, "error": "PayPal nie zwrócił tokenu dostępu."}
    return {"ok": True, "token": token}


def create_stripe_checkout(order_data: dict, order_id: int, base_url: str):
    secret_key = str(os.environ.get("STRIPE_SECRET_KEY") or "").strip()
    if not secret_key:
        return {"ok": False, "error": "Brak konfiguracji Stripe (STRIPE_SECRET_KEY)."}

    payment_method = str(order_data.get("paymentMethod") or "").strip()
    stripe_method_types = ["card"]
    if payment_method == "blik":
        stripe_method_types = ["blik"]

    params = {
        "mode": "payment",
        "success_url": f"{base_url}/shop.html?payment=success&provider=stripe&order={order_id}",
        "cancel_url": f"{base_url}/shop.html?payment=cancel&provider=stripe&order={order_id}",
        "customer_email": str(order_data.get("email") or ""),
        "line_items[0][quantity]": "1",
        "line_items[0][price_data][currency]": "pln",
        "line_items[0][price_data][unit_amount]": str(parse_price_pln(order_data.get("pricePln")) * 100),
        "line_items[0][price_data][product_data][name]": f"Wydruk: {order_data.get('photoLabel') or 'Photo'}",
        "metadata[order_id]": str(order_id),
        "metadata[payment_method]": payment_method,
        "metadata[carrier]": str(order_data.get("carrier") or ""),
    }
    for index, method_name in enumerate(stripe_method_types):
        params[f"payment_method_types[{index}]"] = method_name

    request_data = form_encode(params)
    req = urllib_request.Request(
        "https://api.stripe.com/v1/checkout/sessions",
        data=request_data,
        method="POST",
        headers={
            "Authorization": f"Bearer {secret_key}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )
    try:
        with urllib_request.urlopen(req, timeout=25) as response:
            raw = response.read()
            status = response.getcode()
    except urllib_error.HTTPError as err:
        raw = err.read()
        status = err.code
    except Exception:
        return {"ok": False, "error": "Nie udało się połączyć ze Stripe."}

    try:
        data = json.loads(raw.decode("utf-8")) if raw else {}
    except Exception:
        data = {}
    if not isinstance(data, dict):
        data = {}

    if not (200 <= status < 300):
        message = "Stripe odrzucił utworzenie płatności."
        if isinstance(data.get("error"), dict):
            message = str(data["error"].get("message") or message)
        return {"ok": False, "error": message}

    checkout_url = str(data.get("url") or "").strip()
    session_id = str(data.get("id") or "").strip()
    if not checkout_url or not session_id:
        return {"ok": False, "error": "Stripe nie zwrócił linku płatności."}

    return {"ok": True, "provider": "stripe", "reference": session_id, "checkoutUrl": checkout_url}


def create_paypal_checkout(order_data: dict, order_id: int, base_url: str):
    auth = get_paypal_access_token()
    if not auth["ok"]:
        return auth

    value_pln = parse_price_pln(order_data.get("pricePln"))
    amount = f"{value_pln:.2f}"
    endpoint = f"{get_paypal_base_url()}/v2/checkout/orders"
    payload = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "custom_id": str(order_id),
                "description": f"Wydruk: {order_data.get('photoLabel') or 'Photo'}",
                "amount": {"currency_code": "PLN", "value": amount},
            }
        ],
        "application_context": {
            "return_url": f"{base_url}/api/payments/paypal/return?order={order_id}",
            "cancel_url": f"{base_url}/api/payments/paypal/cancel?order={order_id}",
            "shipping_preference": "SET_PROVIDED_ADDRESS",
            "user_action": "PAY_NOW",
        },
    }
    response = json_request(
        endpoint,
        method="POST",
        headers={"Authorization": f"Bearer {auth['token']}"},
        body=payload,
    )
    if not response["ok"]:
        return {"ok": False, "error": "PayPal odrzucił utworzenie zamówienia."}

    data = response["data"]
    order_ref = str(data.get("id") or "").strip()
    approve_link = ""
    for link in data.get("links") or []:
        if isinstance(link, dict) and link.get("rel") == "approve":
            approve_link = str(link.get("href") or "").strip()
            break

    if not order_ref or not approve_link:
        return {"ok": False, "error": "PayPal nie zwrócił linku autoryzacji płatności."}

    return {"ok": True, "provider": "paypal", "reference": order_ref, "checkoutUrl": approve_link}


def capture_paypal_payment(paypal_order_id: str):
    auth = get_paypal_access_token()
    if not auth["ok"]:
        return auth

    endpoint = f"{get_paypal_base_url()}/v2/checkout/orders/{paypal_order_id}/capture"
    response = json_request(
        endpoint,
        method="POST",
        headers={"Authorization": f"Bearer {auth['token']}"},
        body={},
    )
    if not response["ok"]:
        return {"ok": False, "error": "PayPal nie potwierdził płatności."}

    status = str(response["data"].get("status") or "").strip().upper()
    return {"ok": status == "COMPLETED", "status": status, "data": response["data"]}


def create_coinbase_checkout(order_data: dict, order_id: int, base_url: str):
    api_key = str(os.environ.get("COINBASE_COMMERCE_API_KEY") or "").strip()
    if not api_key:
        return {"ok": False, "error": "Brak konfiguracji Coinbase Commerce (COINBASE_COMMERCE_API_KEY)."}

    currency = "BTC" if str(order_data.get("paymentMethod")) == "bitcoin" else "ETH"
    payload = {
        "name": f"Print #{order_id}",
        "description": f"Wydruk: {order_data.get('photoLabel') or 'Photo'}",
        "pricing_type": "fixed_price",
        "local_price": {
            "amount": f"{parse_price_pln(order_data.get('pricePln')):.2f}",
            "currency": "PLN",
        },
        "metadata": {"order_id": str(order_id), "requested_crypto": currency},
        "redirect_url": f"{base_url}/shop.html?payment=success&provider=coinbase&order={order_id}",
        "cancel_url": f"{base_url}/shop.html?payment=cancel&provider=coinbase&order={order_id}",
    }
    response = json_request(
        "https://api.commerce.coinbase.com/charges",
        method="POST",
        headers={
            "X-CC-Api-Key": api_key,
            "X-CC-Version": "2018-03-22",
        },
        body=payload,
    )
    if not response["ok"]:
        return {"ok": False, "error": "Coinbase Commerce odrzucił utworzenie płatności."}

    data = response["data"].get("data")
    if not isinstance(data, dict):
        return {"ok": False, "error": "Coinbase Commerce zwrócił nieprawidłową odpowiedź."}

    reference = str(data.get("id") or "").strip()
    checkout_url = str(data.get("hosted_url") or "").strip()
    if not reference or not checkout_url:
        return {"ok": False, "error": "Coinbase Commerce nie zwrócił linku płatności."}

    return {"ok": True, "provider": "coinbase", "reference": reference, "checkoutUrl": checkout_url}


def create_checkout_for_order(order_data: dict, order_id: int, base_url: str):
    payment_method = str(order_data.get("paymentMethod") or "").strip()
    if payment_method in ("card", "apple_pay", "google_pay", "blik"):
        return create_stripe_checkout(order_data, order_id, base_url)
    if payment_method == "paypal":
        return create_paypal_checkout(order_data, order_id, base_url)
    if payment_method in ("bitcoin", "ethereum"):
        return create_coinbase_checkout(order_data, order_id, base_url)
    return {"ok": False, "error": "Nieobsługiwana metoda płatności."}


def parse_order_payload(body: dict):
    language = str(body.get("language") or "pl").strip() or "pl"
    first_name = str(body.get("firstName") or "").strip()
    last_name = str(body.get("lastName") or "").strip()
    email = str(body.get("email") or "").strip()
    phone = str(body.get("phone") or "").strip()
    city = str(body.get("city") or "").strip()
    postal_code = str(body.get("postalCode") or "").strip()
    street_address = str(body.get("streetAddress") or "").strip()
    payment_method = str(body.get("paymentMethod") or "").strip()
    shipping_method = (
        str(body.get("shippingMethod") or ORDER_SHIPPING_METHOD_COURIER).strip()
        or ORDER_SHIPPING_METHOD_COURIER
    )
    carrier = str(body.get("carrier") or "").strip()
    address = str(body.get("address") or "").strip()
    if not address:
        address = ", ".join(
            part for part in [street_address, f"{postal_code} {city}".strip()] if part
        )

    if (
        not first_name
        or not last_name
        or not email
        or not phone
        or not city
        or not postal_code
        or not street_address
        or not payment_method
        or payment_method not in ALLOWED_PAYMENT_METHODS
        or not carrier
    ):
        return None, "Brak wymaganych danych zamówienia."

    if shipping_method != ORDER_SHIPPING_METHOD_COURIER:
        return None, "Obecnie obsługiwana jest tylko wysyłka kurierem."

    order_data = {
        "language": language,
        "photo": str(body.get("photo") or ""),
        "photoLabel": str(body.get("photoLabel") or ""),
        "size": str(body.get("size") or ""),
        "pricePln": 0,
        "priceLabel": "",
        "firstName": first_name,
        "lastName": last_name,
        "fullName": f"{first_name} {last_name}".strip(),
        "email": email,
        "phone": phone,
        "city": city,
        "postalCode": postal_code,
        "streetAddress": street_address,
        "paymentMethod": payment_method,
        "shippingMethod": shipping_method,
        "carrier": carrier,
        "address": address,
        "message": str(body.get("message") or "-"),
    }

    size_price = PRINT_SIZE_PRICE_PLN.get(order_data["size"])
    if size_price is None:
        size_price = parse_price_pln(body.get("pricePln"))
    order_data["pricePln"] = size_price
    order_data["priceLabel"] = f"{size_price} PLN" if size_price > 0 else str(body.get("priceLabel") or "")

    if order_data["pricePln"] <= 0:
        return None, "Nieprawidłowa cena zamówienia."

    return order_data, None


def create_order_record(
    order_data: dict,
    payment_provider: str = "",
    payment_reference: str = "",
    payment_checkout_url: str = "",
    payment_status: str = "pending",
):
    created_at = utc_now_iso()
    with get_db_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO orders (
              language, photo, photo_label, size, price_pln, price_label,
              first_name, last_name, full_name, email, phone,
              city, postal_code, street_address,
              payment_method, shipping_method, carrier,
              payment_provider, payment_reference, payment_checkout_url, payment_status, payment_updated_at,
              address, message, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                order_data["language"],
                order_data["photo"],
                order_data["photoLabel"],
                order_data["size"],
                order_data["pricePln"],
                order_data["priceLabel"],
                order_data["firstName"],
                order_data["lastName"],
                order_data["fullName"],
                order_data["email"],
                order_data["phone"],
                order_data["city"],
                order_data["postalCode"],
                order_data["streetAddress"],
                order_data["paymentMethod"],
                order_data["shippingMethod"],
                order_data["carrier"],
                payment_provider,
                payment_reference,
                payment_checkout_url,
                payment_status,
                created_at,
                order_data["address"],
                order_data["message"],
                created_at,
            ),
        )
        return int(cursor.lastrowid)


def update_order_payment_state(
    order_id: int,
    *,
    payment_status: str,
    payment_provider: str = "",
    payment_reference: str = "",
    payment_checkout_url: str = "",
):
    if not order_id:
        return
    with get_db_connection() as conn:
        conn.execute(
            """
            UPDATE orders
            SET payment_status = ?,
                payment_provider = COALESCE(NULLIF(?, ''), payment_provider),
                payment_reference = COALESCE(NULLIF(?, ''), payment_reference),
                payment_checkout_url = COALESCE(NULLIF(?, ''), payment_checkout_url),
                payment_updated_at = ?
            WHERE id = ?
            """,
            (
                payment_status,
                payment_provider,
                payment_reference,
                payment_checkout_url,
                utc_now_iso(),
                order_id,
            ),
        )


class ApiHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=None, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

    def log_message(self, format, *args):
        super().log_message(format, *args)

    def end_headers(self):
        if self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _send_json(self, status_code: int, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _redirect(self, location: str, status_code: int = 302):
        self.send_response(status_code)
        self.send_header("Location", location)
        self.send_header("Content-Length", "0")
        self.end_headers()

    def _read_raw_body(self):
        content_length = int(self.headers.get("Content-Length", "0") or "0")
        if content_length <= 0:
            return b""
        if content_length > 2 * 1024 * 1024:
            raise ValueError("Payload too large")
        return self.rfile.read(content_length)

    def _read_json_body(self):
        content_length = int(self.headers.get("Content-Length", "0") or "0")
        if content_length <= 0:
            return {}
        if content_length > 1024 * 1024:
            raise ValueError("Payload too large")

        raw = self.rfile.read(content_length)
        if not raw:
            return {}
        return json.loads(raw.decode("utf-8"))

    def _parse_path(self):
        return normalize_api_path(urlparse(self.path).path)

    def _parse_url(self):
        return urlparse(self.path)

    def _is_forbidden_public_path(self, path: str) -> bool:
        decoded_path = urllib_parse.unquote(path or "/")
        lowered = decoded_path.lower()
        if "\x00" in decoded_path:
            return True
        if "/.." in lowered or lowered.startswith(".."):
            return True
        if lowered.startswith("/."):
            return True

        blocked_prefixes = ("/data", "/__pycache__", "/.git", "/.vscode")
        for prefix in blocked_prefixes:
            if lowered == prefix or lowered.startswith(prefix + "/"):
                return True

        blocked_suffixes = (".py", ".db", ".sqlite", ".sqlite3")
        return lowered.endswith(blocked_suffixes)

    def _bearer_token(self):
        auth = self.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return None
        return auth[len("Bearer ") :].strip()

    def _require_auth(self):
        cleanup_sessions()
        token = self._bearer_token()
        if not token:
            self._send_json(401, {"ok": False, "error": "Brak autoryzacji"})
            return None

        expires_at = SESSIONS.get(token)
        if not expires_at:
            self._send_json(401, {"ok": False, "error": "Sesja wygasła"})
            return None

        if expires_at < time.time():
            SESSIONS.pop(token, None)
            self._send_json(401, {"ok": False, "error": "Sesja wygasła"})
            return None

        SESSIONS[token] = time.time() + SESSION_TTL_SECONDS
        return token

    def _require_user_auth(self):
        token = self._bearer_token()
        if not token:
            self._send_json(401, {"ok": False, "error": "Najpierw się zaloguj."})
            return None

        user_id = get_user_id_from_session_token(token)
        if not user_id:
            self._send_json(401, {"ok": False, "error": "Sesja użytkownika wygasła."})
            return None

        user_row = get_user_by_id(user_id)
        if not user_row:
            USER_SESSIONS.pop(token, None)
            self._send_json(401, {"ok": False, "error": "Nie znaleziono konta użytkownika."})
            return None

        return user_row

    def do_HEAD(self):
        path = self._parse_path()
        if not path.startswith("/api/") and self._is_forbidden_public_path(path):
            self.send_error(404)
            return
        return super().do_HEAD()

    def do_GET(self):
        parsed_url = self._parse_url()
        path = normalize_api_path(parsed_url.path)
        query_params = parse_qs(parsed_url.query)
        if not path.startswith("/api/"):
            if self._is_forbidden_public_path(path):
                self.send_error(404)
                return
            return super().do_GET()

        if path == "/api/health":
            return self._send_json(200, {"ok": True, "time": utc_now_iso()})

        if path == "/api/settings":
            settings = read_site_settings_from_db()
            return self._send_json(200, {"ok": True, "settings": settings})

        if path == "/api/users/me":
            user_row = self._require_user_auth()
            if not user_row:
                return
            return self._send_json(200, {"ok": True, "user": serialize_public_user(user_row)})

        if path == "/api/blog/posts":
            posts = list_blog_posts(include_unpublished=False)
            return self._send_json(200, {"ok": True, "posts": posts})

        if path == "/api/blog/comments":
            post_slug = str((query_params.get("post") or [""])[0] or "").strip().lower()
            comments, error_message = get_blog_comments(post_slug)
            if error_message:
                return self._send_json(400, {"ok": False, "error": error_message})
            return self._send_json(200, {"ok": True, "comments": comments, "postSlug": post_slug})

        if path == "/api/payments/paypal/return":
            order_raw = (query_params.get("order") or [""])[0]
            token = (query_params.get("token") or [""])[0]
            try:
                order_id = int(order_raw)
            except Exception:
                order_id = 0

            if not order_id or not token:
                return self._redirect("/shop.html?payment=failed&provider=paypal")

            capture = capture_paypal_payment(token)
            if capture.get("ok"):
                update_order_payment_state(
                    order_id,
                    payment_status="paid",
                    payment_provider="paypal",
                    payment_reference=token,
                )
                return self._redirect(f"/shop.html?payment=success&provider=paypal&order={order_id}")

            update_order_payment_state(
                order_id,
                payment_status="payment_failed",
                payment_provider="paypal",
                payment_reference=token,
            )
            return self._redirect(f"/shop.html?payment=failed&provider=paypal&order={order_id}")

        if path == "/api/payments/paypal/cancel":
            order_raw = (query_params.get("order") or [""])[0]
            try:
                order_id = int(order_raw)
            except Exception:
                order_id = 0
            if order_id:
                update_order_payment_state(order_id, payment_status="payment_cancelled", payment_provider="paypal")
            return self._redirect(f"/shop.html?payment=cancel&provider=paypal&order={order_id or ''}")

        if path == "/api/admin/settings":
            if not self._require_auth():
                return
            settings = read_site_settings_from_db()
            return self._send_json(200, {"ok": True, "settings": settings})

        if path == "/api/admin/inbox":
            if not self._require_auth():
                return

            with get_db_connection() as conn:
                rows = conn.execute(
                    "SELECT id, type, language, payload, created_at FROM inbox ORDER BY id DESC LIMIT ?",
                    (MAX_ITEMS,),
                ).fetchall()

            messages = []
            for row in rows:
                try:
                    payload = json.loads(row["payload"])
                except Exception:
                    payload = {}
                if not isinstance(payload, dict):
                    payload = {}

                payload.update(
                    {
                        "id": row["id"],
                        "type": row["type"],
                        "language": row["language"] or payload.get("language") or "pl",
                        "createdAt": row["created_at"],
                    }
                )
                messages.append(payload)

            return self._send_json(200, {"ok": True, "messages": messages})

        if path == "/api/admin/orders":
            if not self._require_auth():
                return

            with get_db_connection() as conn:
                rows = conn.execute(
                    """
                    SELECT id, language, photo, photo_label, size, price_pln, price_label,
                           first_name, last_name, full_name, email, phone,
                           city, postal_code, street_address,
                           payment_method, shipping_method, carrier,
                           payment_provider, payment_reference, payment_checkout_url, payment_status, payment_updated_at,
                           address, message, created_at
                    FROM orders
                    ORDER BY id DESC
                    LIMIT ?
                    """,
                    (MAX_ITEMS,),
                ).fetchall()

            orders = []
            for row in rows:
                orders.append(
                    {
                        "id": row["id"],
                        "language": row["language"] or "pl",
                        "photo": row["photo"] or "",
                        "photoLabel": row["photo_label"] or "",
                        "size": row["size"] or "",
                        "pricePln": row["price_pln"],
                        "priceLabel": row["price_label"] or "",
                        "firstName": row["first_name"] or "",
                        "lastName": row["last_name"] or "",
                        "fullName": row["full_name"] or "",
                        "email": row["email"] or "",
                        "phone": row["phone"] or "",
                        "city": row["city"] or "",
                        "postalCode": row["postal_code"] or "",
                        "streetAddress": row["street_address"] or "",
                        "paymentMethod": row["payment_method"] or "",
                        "shippingMethod": row["shipping_method"] or "",
                        "carrier": row["carrier"] or "",
                        "paymentProvider": row["payment_provider"] or "",
                        "paymentReference": row["payment_reference"] or "",
                        "paymentCheckoutUrl": row["payment_checkout_url"] or "",
                        "paymentStatus": row["payment_status"] or "",
                        "paymentUpdatedAt": row["payment_updated_at"] or "",
                        "address": row["address"] or "",
                        "message": row["message"] or "",
                        "createdAt": row["created_at"],
                    }
                )

            return self._send_json(200, {"ok": True, "orders": orders})

        if path == "/api/admin/users":
            if not self._require_auth():
                return

            store = read_user_accounts_store()
            users_raw = store.get("users")
            safe_users = []
            if isinstance(users_raw, list):
                for entry in users_raw:
                    serialized = serialize_public_user_store_entry(entry)
                    if serialized:
                        safe_users.append(serialized)

            return self._send_json(
                200,
                {
                    "ok": True,
                    "users": safe_users,
                    "count": len(safe_users),
                    "sourceFile": USER_ACCOUNTS_RELATIVE_FILE,
                    "sourceFolder": USER_ACCOUNTS_RELATIVE_FOLDER,
                    "updatedAt": str(store.get("updatedAt") or ""),
                },
            )

        if path == "/api/admin/blog/posts":
            if not self._require_auth():
                return
            posts = list_blog_posts(include_unpublished=True)
            return self._send_json(200, {"ok": True, "posts": posts})

        return self._send_json(404, {"ok": False, "error": "Not found"})

    def do_POST(self):
        path = self._parse_path()
        if not path.startswith("/api/"):
            return self._send_json(404, {"ok": False, "error": "Not found"})

        if path == "/api/payments/stripe/webhook":
            try:
                raw_body = self._read_raw_body()
            except Exception:
                return self._send_json(400, {"ok": False, "error": "Nieprawidłowy payload"})

            secret = str(os.environ.get("STRIPE_WEBHOOK_SECRET") or "").strip()
            signature = str(self.headers.get("Stripe-Signature") or "").strip()
            if secret and not verify_stripe_signature(raw_body, signature, secret):
                return self._send_json(401, {"ok": False, "error": "Nieprawidłowy podpis Stripe webhook"})

            event = parse_json_bytes(raw_body)
            event_type = str(event.get("type") or "")
            data_object = event.get("data", {}).get("object", {})
            if not isinstance(data_object, dict):
                data_object = {}

            metadata = data_object.get("metadata")
            if not isinstance(metadata, dict):
                metadata = {}

            order_raw = metadata.get("order_id")
            try:
                order_id = int(order_raw)
            except Exception:
                order_id = 0

            session_id = str(data_object.get("id") or "")
            if event_type == "checkout.session.completed":
                payment_status = str(data_object.get("payment_status") or "").lower()
                if order_id and payment_status == "paid":
                    update_order_payment_state(
                        order_id,
                        payment_status="paid",
                        payment_provider="stripe",
                        payment_reference=session_id,
                    )
            elif event_type in ("checkout.session.expired", "checkout.session.async_payment_failed"):
                if order_id:
                    update_order_payment_state(
                        order_id,
                        payment_status="payment_failed",
                        payment_provider="stripe",
                        payment_reference=session_id,
                    )

            return self._send_json(200, {"ok": True})

        if path == "/api/payments/coinbase/webhook":
            try:
                raw_body = self._read_raw_body()
            except Exception:
                return self._send_json(400, {"ok": False, "error": "Nieprawidłowy payload"})

            secret = str(os.environ.get("COINBASE_COMMERCE_WEBHOOK_SECRET") or "").strip()
            signature = str(self.headers.get("X-CC-Webhook-Signature") or "").strip()
            if secret:
                expected = hmac_sha256_hex(secret, raw_body)
                if not signature or not hmac.compare_digest(expected, signature):
                    return self._send_json(401, {"ok": False, "error": "Nieprawidłowy podpis Coinbase webhook"})

            payload = parse_json_bytes(raw_body)
            event = payload.get("event")
            if not isinstance(event, dict):
                event = {}
            event_type = str(event.get("type") or "")
            event_data = event.get("data")
            if not isinstance(event_data, dict):
                event_data = {}

            metadata = event_data.get("metadata")
            if not isinstance(metadata, dict):
                metadata = {}

            try:
                order_id = int(metadata.get("order_id") or 0)
            except Exception:
                order_id = 0

            charge_id = str(event_data.get("id") or "")
            if order_id and event_type in ("charge:confirmed", "charge:resolved"):
                update_order_payment_state(
                    order_id,
                    payment_status="paid",
                    payment_provider="coinbase",
                    payment_reference=charge_id,
                )
            elif order_id and event_type in ("charge:failed",):
                update_order_payment_state(
                    order_id,
                    payment_status="payment_failed",
                    payment_provider="coinbase",
                    payment_reference=charge_id,
                )

            return self._send_json(200, {"ok": True})

        try:
            body = self._read_json_body()
        except Exception:
            return self._send_json(400, {"ok": False, "error": "Nieprawidłowy JSON"})

        if path == "/api/users/register":
            display_name = str(body.get("displayName") or body.get("name") or "").strip()
            email = str(body.get("email") or "").strip()
            password = str(body.get("password") or "")

            user_row, error_message = create_user_account(display_name, email, password)
            if error_message:
                return self._send_json(400, {"ok": False, "error": error_message})
            if not user_row:
                return self._send_json(400, {"ok": False, "error": "Nie udało się utworzyć konta."})

            token = create_user_session_token(int(user_row["id"]))
            return self._send_json(
                200,
                {
                    "ok": True,
                    "token": token,
                    "user": serialize_public_user(user_row),
                },
            )

        if path == "/api/users/login":
            email = str(body.get("email") or "").strip()
            password = str(body.get("password") or "")
            user_row = get_user_by_email(email)
            if not user_row or not verify_user_password(password, str(user_row["password_hash"] or "")):
                return self._send_json(401, {"ok": False, "error": "Nieprawidłowy e-mail lub hasło."})

            token = create_user_session_token(int(user_row["id"]))
            return self._send_json(
                200,
                {
                    "ok": True,
                    "token": token,
                    "user": serialize_public_user(user_row),
                },
            )

        if path == "/api/users/logout":
            token = self._bearer_token()
            if token:
                USER_SESSIONS.pop(token, None)
            return self._send_json(200, {"ok": True})

        if path == "/api/blog/comments":
            user_row = self._require_user_auth()
            if not user_row:
                return

            post_slug = str(body.get("postSlug") or body.get("post") or "").strip().lower()
            content = str(body.get("content") or "").strip()
            created_comment, error_message = create_blog_comment(post_slug, int(user_row["id"]), content)
            if error_message:
                return self._send_json(400, {"ok": False, "error": error_message})
            return self._send_json(200, {"ok": True, "comment": created_comment})

        if path == "/api/admin/login":
            password = str(body.get("password") or "").strip()
            if not password:
                return self._send_json(400, {"ok": False, "error": "Podaj hasło"})

            with get_db_connection() as conn:
                row = conn.execute("SELECT password_hash FROM admin WHERE id = 1").fetchone()

            if not row or hash_password(password) != row["password_hash"]:
                return self._send_json(401, {"ok": False, "error": "Nieprawidłowe hasło"})

            token = create_session_token()
            return self._send_json(200, {"ok": True, "token": token})

        if path == "/api/admin/logout":
            token = self._require_auth()
            if not token:
                return
            SESSIONS.pop(token, None)
            return self._send_json(200, {"ok": True})

        if path == "/api/admin/translate-content":
            if not self._require_auth():
                return

            source_language = str(body.get("sourceLanguage") or "pl").strip().lower()
            target_language = str(body.get("targetLanguage") or "en").strip().lower()
            content_payload = body.get("content")
            translated, error_message, status_code = translate_content_payload(
                source_language,
                target_language,
                content_payload,
            )
            if error_message:
                return self._send_json(
                    status_code if isinstance(status_code, int) else 400,
                    {"ok": False, "error": error_message},
                )

            return self._send_json(
                200,
                {
                    "ok": True,
                    "sourceLanguage": source_language,
                    "targetLanguage": target_language,
                    "content": translated,
                },
            )

        if path == "/api/admin/blog/posts":
            if not self._require_auth():
                return

            raw_post = body.get("post")
            payload = raw_post if isinstance(raw_post, dict) else body
            saved_post, error_message, status_code = save_blog_post(payload)
            if error_message:
                return self._send_json(
                    status_code if isinstance(status_code, int) else 400,
                    {"ok": False, "error": error_message},
                )
            return self._send_json(200, {"ok": True, "post": saved_post})

        if path == "/api/admin/password":
            if not self._require_auth():
                return

            current_password = str(body.get("currentPassword") or "").strip()
            new_password = str(body.get("newPassword") or "").strip()

            if not current_password or not new_password:
                return self._send_json(400, {"ok": False, "error": "Uzupełnij pola hasła"})
            if len(new_password) < 6:
                return self._send_json(400, {"ok": False, "error": "Nowe hasło za krótkie"})

            with get_db_connection() as conn:
                row = conn.execute("SELECT password_hash FROM admin WHERE id = 1").fetchone()
                if not row or hash_password(current_password) != row["password_hash"]:
                    return self._send_json(401, {"ok": False, "error": "Obecne hasło jest nieprawidłowe"})

                conn.execute(
                    "UPDATE admin SET password_hash = ?, updated_at = ? WHERE id = 1",
                    (hash_password(new_password), utc_now_iso()),
                )

            return self._send_json(200, {"ok": True})

        if path == "/api/inbox":
            message_type = str(body.get("type") or "").strip()
            language = str(body.get("language") or "pl").strip() or "pl"
            if message_type not in ("booking", "inquiry"):
                return self._send_json(400, {"ok": False, "error": "Nieprawidłowy typ wiadomości"})

            payload = dict(body)
            payload.pop("createdAt", None)

            with get_db_connection() as conn:
                conn.execute(
                    "INSERT INTO inbox (type, language, payload, created_at) VALUES (?, ?, ?, ?)",
                    (
                        message_type,
                        language,
                        json.dumps(payload, ensure_ascii=False),
                        utc_now_iso(),
                    ),
                )

            return self._send_json(200, {"ok": True})

        if path == "/api/orders":
            order_data, error_message = parse_order_payload(body)
            if error_message:
                return self._send_json(400, {"ok": False, "error": error_message})

            order_id = create_order_record(order_data, payment_status="manual_pending")
            return self._send_json(200, {"ok": True, "orderId": order_id})

        if path == "/api/orders/checkout":
            order_data, error_message = parse_order_payload(body)
            if error_message:
                return self._send_json(400, {"ok": False, "error": error_message})

            order_id = create_order_record(order_data, payment_status="creating_payment")
            base_url = get_public_base_url(self)
            checkout = create_checkout_for_order(order_data, order_id, base_url)
            if not checkout.get("ok"):
                update_order_payment_state(
                    order_id,
                    payment_status="payment_init_failed",
                    payment_provider=str(checkout.get("provider") or ""),
                    payment_reference=str(checkout.get("reference") or ""),
                    payment_checkout_url=str(checkout.get("checkoutUrl") or ""),
                )
                return self._send_json(
                    400,
                    {
                        "ok": False,
                        "orderId": order_id,
                        "error": checkout.get("error") or "Nie udało się rozpocząć płatności.",
                    },
                )

            update_order_payment_state(
                order_id,
                payment_status="awaiting_payment",
                payment_provider=str(checkout.get("provider") or ""),
                payment_reference=str(checkout.get("reference") or ""),
                payment_checkout_url=str(checkout.get("checkoutUrl") or ""),
            )
            return self._send_json(
                200,
                {
                    "ok": True,
                    "orderId": order_id,
                    "provider": checkout.get("provider"),
                    "checkoutUrl": checkout.get("checkoutUrl"),
                },
            )

        return self._send_json(404, {"ok": False, "error": "Not found"})

    def do_PUT(self):
        path = self._parse_path()
        if path != "/api/admin/settings":
            return self._send_json(404, {"ok": False, "error": "Not found"})

        if not self._require_auth():
            return

        try:
            body = self._read_json_body()
        except Exception:
            return self._send_json(400, {"ok": False, "error": "Nieprawidłowy JSON"})

        normalized = write_site_settings_to_db(body)
        return self._send_json(200, {"ok": True, "settings": normalized})

    def do_DELETE(self):
        parsed_url = self._parse_url()
        path = normalize_api_path(parsed_url.path)
        query_params = parse_qs(parsed_url.query)
        if path not in ("/api/admin/inbox", "/api/admin/orders", "/api/admin/blog/posts"):
            return self._send_json(404, {"ok": False, "error": "Not found"})

        if not self._require_auth():
            return

        if path == "/api/admin/blog/posts":
            post_id_raw = (query_params.get("id") or [""])[0]
            deleted, error_message, status_code = delete_blog_post(post_id_raw)
            if error_message:
                return self._send_json(
                    status_code if isinstance(status_code, int) else 400,
                    {"ok": False, "error": error_message},
                )
            return self._send_json(200, {"ok": bool(deleted)})

        with get_db_connection() as conn:
            if path == "/api/admin/inbox":
                conn.execute("DELETE FROM inbox")
            else:
                conn.execute("DELETE FROM orders")

        return self._send_json(200, {"ok": True})


def main():
    parser = argparse.ArgumentParser(description="Photo site API + static server")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8080)
    parser.add_argument("--root", default=os.getcwd())
    parser.add_argument("--db", default=None, help="Path to sqlite database file")
    args = parser.parse_args()

    root_dir = os.path.abspath(args.root)
    db_path = args.db or os.path.join(root_dir, "data", "site.db")

    global DB_PATH, USER_ACCOUNTS_PATH
    DB_PATH = db_path
    USER_ACCOUNTS_PATH = os.path.join(root_dir, "data", "users", "accounts.json")
    init_db()

    def handler(*handler_args, **handler_kwargs):
        return ApiHandler(*handler_args, directory=root_dir, **handler_kwargs)

    server = ThreadingHTTPServer((args.host, args.port), handler)
    print(f"Server running on http://{args.host}:{args.port}")
    print(f"Static root: {root_dir}")
    print(f"Database: {db_path}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")


if __name__ == "__main__":
    main()
