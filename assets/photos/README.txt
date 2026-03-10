WRZUCANIE ZDJEC DO KATEGORII

1) Wrzucaj zdjecia do osobnych folderow:
   - assets/photos/black-and-white
   - assets/photos/color
   - assets/photos/nature
   - assets/photos/landscape
   - assets/photos/portrait
   - assets/photos/featured (blok \"Wybrane na sprzedaz\" w sklepie)

2) Nazwy plikow sa dowolne.

3) Obslugiwane rozszerzenia:
   jpg, jpeg, png, webp, avif

4) Zakladki w Sklepie i Portfolio czytaja zdjecia bezposrednio z tych folderow.
   Blok \"Wybrane na sprzedaz\" czyta zdjecia z folderu assets/photos/featured.
   Jesli folder featured jest pusty, blok pokazuje losowe zdjecia z calej galerii.

5) Opcjonalnie (dla hostingow bez listowania folderow):
   - stworz plik assets/photos/photos.json jako obiekt kategorii, np.:
     {
       "bw": ["foto-1.jpg"],
       "color": ["foto-2.jpg"],
       "nature": ["foto-3.jpg"],
       "landscape": ["foto-4.jpg"],
       "portrait": ["foto-5.jpg"]
     }
   - albo dodaj plik photos.json w konkretnym folderze kategorii
     (np. assets/photos/portrait/photos.json) jako zwykla tablice nazw.
