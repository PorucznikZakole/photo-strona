# Uruchamianie strony z backendem (globalne ustawienia i zamówienia)

## 1) Start serwera
W folderze projektu uruchom:

```bash
python3 server.py --host 0.0.0.0 --port 8080
```

Serwer wystawi:
- statyczną stronę (index, shop, portfolio, admin)
- API (`/api/...`) do ustawień, wiadomości i zamówień
- bazę danych SQLite w `data/site.db`

## 2) Otwórz stronę
- Strona: `http://localhost:8080/`
- Panel admina: `http://localhost:8080/admin.html`

## 3) Logowanie admina
- Hasło domyślne: `Samolot123`

## 4) Co działa globalnie
Po uruchomieniu przez serwer:
- przełącznik `Sklep` w panelu wpływa na widok użytkowników,
- wiadomości z formularzy trafiają do panelu,
- zamówienia `Kup wydruk` trafiają do zakładki `Zamówienia`.

## 5) Konfiguracja płatności online (Stripe / PayPal / Coinbase)
Ustaw zmienne środowiskowe przed startem serwera:

```bash
export SITE_BASE_URL="http://localhost:8080"
export STRIPE_SECRET_KEY="sk_..."
export STRIPE_WEBHOOK_SECRET="whsec_..."
export PAYPAL_MODE="sandbox" # albo live
export PAYPAL_CLIENT_ID="..."
export PAYPAL_CLIENT_SECRET="..."
export COINBASE_COMMERCE_API_KEY="..."
export COINBASE_COMMERCE_WEBHOOK_SECRET="..."
python3 server.py --host 0.0.0.0 --port 8080
```

Gotowy szablon masz też w pliku `PAYMENTS_ENV.example`.

Webhooki:
- Stripe: `POST /api/payments/stripe/webhook`
- Coinbase Commerce: `POST /api/payments/coinbase/webhook`
- PayPal return/cancel:
  - `GET /api/payments/paypal/return`
  - `GET /api/payments/paypal/cancel`

## Uwaga
Jeśli otwierasz pliki bez serwera (np. klikając `index.html`), API nie działa.
