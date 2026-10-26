# Dudu és Bubu – Desktop Adventure UI

React + Vite + Three.js böngészős 3D-kalandjáték, teljes képernyős, játékon belüli menürendszerrel.

## Fejlesztett felület
- Teljes képernyős játékablak: a 3D-s világ mindig látható.
- Játékon belüli fülek: Világ, Küldetések, Hátizsák, Közösség, Bolt és barkács, Jutalmak, Beállítások.
- Meghívókód, kapcsolatállapot, jutalmak és játékadatok nem külön weboldalszakaszként, hanem a menürendszerben jelennek meg.
- Dudu és Bubu karakterei külön karokkal, lábakkal, mancsokkal, fülekkel, szemfénnyel és járás közben mozgó végtagokkal rendelkeznek.
- Megmaradtak a Three.js világ, a gyűjthető tárgyak, az NPC-k, a küldetések, az ajándékozás és a Neon API prototípus funkciói.

## Vercel telepítés
1. A mappa tartalmát töltsd fel a GitHub-repozitórium gyökerébe.
2. Vercel: Import Git Repository.
3. Application Preset: Vite.
4. Root Directory: `./` (ha a package.json a repo gyökerében van).
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Add meg a `DATABASE_URL` környezeti változót a Neon PostgreSQL kapcsolat karakterláncával, ha használni szeretnéd az API mentését.

## Irányítás
- Dudu: W/A/S/D, ugrás: Space.
- Bubu: nyílbillentyűk, ugrás: Enter.
- E: ölelés, F: NPC interakció, G: ajándékozás.
- Kattints a 3D-s jelenetre a kamera vezérléséhez; ESC feloldja az egérzárat.

## Fontos korlátok
Ez továbbra is böngészős Three.js játék, nem natív Windows-játék. A karakterek részletesebb, procedurális geometriai modellek, nem fotórealisztikus, szkennelt vagy professzionális riggelt modellek. A hálózati játék PeerJS-en alapul, a Neon API pedig a felhőmentés prototípusát adja; éles használat előtt a teljes buildet, két klienses szinkronizálást, adatbázis-sémát és jogosultságkezelést végig kell tesztelni.
