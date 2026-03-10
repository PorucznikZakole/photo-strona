# Edycja tekstów strony

Teksty strony możesz teraz edytować w plikach:
- `assets/content/pl.json` (polski)
- `assets/content/en.json` (angielski)

## Jak to działa
1. Otwórz `pl.json` albo `en.json`.
2. Zmień wartość wybranego klucza (po prawej stronie po `:`).
3. Zapisz plik.
4. Odśwież stronę twardo: `Cmd + Shift + R`.

Po odświeżeniu nowe teksty pojawią się na stronie automatycznie.

## Ważne zasady
- Zachowaj poprawny format JSON (przecinki, cudzysłowy, nawiasy).
- Kluczy po lewej stronie nie zmieniaj (np. `heroTitle`, `shopTitle`).
- Jeśli chcesz pogrubienie w tekście, możesz użyć HTML (np. `<strong>tekst</strong>`) tam, gdzie jest to już użyte.

## Najczęściej edytowane klucze
- Strona główna: `heroTitle`, `heroLead`, `aboutP1`, `contactDesc`
- Sklep: `shopTitle`, `shopLead`, `shopCollectionsDesc`
- Portfolio: `portfolioPageHeading`, `portfolioPageLead`, `portfolioGalleryDesc`
- Formularze: `bookingMessageHint`, `inquiryMessagePlaceholder`
