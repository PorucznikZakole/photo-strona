MUZYKA DLA ODTWARZACZA STRONY

Wrzuć tutaj pliki audio:
assets/audio/tracks

Obsługiwane formaty:
mp3, ogg, wav, m4a, webm, aac, flac

Jak to działa:
- odtwarzacz na stronie losuje utwory z tego folderu,
- po zakończeniu utworu automatycznie losuje kolejny,
- muzyka zapętla się bez końca,
- stan (utwór/czas) jest pamiętany przy przejściu między podstronami.
- żeby automatyczne wykrywanie plików działało, uruchamiaj stronę przez serwer (`python3 server.py`).

Opcjonalnie możesz utworzyć plik:
assets/audio/tracks/tracks.json
z listą konkretnych nazw plików (dowolna kolejność), np.:
[
  "track-01.mp3",
  "night.wav"
]
