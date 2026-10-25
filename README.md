# Dudu és Bubu – 3D Varázserdő (Neon + Vercel)

React + Vite + Three.js, PeerJS-alapú közvetlen játékoskapcsolattal és Neon PostgreSQL felhőmentéssel.

## Mit tárol a Neon?

A `dudu_bubu_worlds` tábla a szobakódhoz menti a közös játékállapotot JSONB formában: készlet, pontok, küldetések, jutalmak, dekorációk, eredmények, napi ajándék állapota és nappal/éjszaka mód. A `revision` mező változatkövetésre szolgál.

A szoba két külön titkot használ:
- `ownerToken`: kizárólag a szoba létrehozójánál marad, ezzel lehet menteni;
- `joinToken`: a meghívókód része, ezzel olvashatja a vendég a közös mentést.

A `DATABASE_URL` csak szerveroldali környezeti változó. Soha ne nevezd át `VITE_DATABASE_URL`-re, és ne tedd kliensoldali kódba.

## 1. Neon-adatbázis létrehozása

1. Nyisd meg a [Neon Console](https://console.neon.tech/)-t, és hozz létre egy PostgreSQL projektet.
2. A **Connect** menüben másold ki a connection stringet. A pooled connection string ajánlott.
3. Opcionálisan nyisd meg a Neon SQL Editort, és futtasd le a `database/schema.sql` tartalmát. Az API is létrehozza/frissíti a táblát automatikusan.

## 2. Vercel telepítés

1. Csomagold ki a ZIP-et.
2. Töltsd fel a `dudu-bubu-vercel` mappa tartalmát egy GitHub-repozitórium gyökerébe. Ha a teljes mappát töltöd fel, Vercelben a **Root Directory** legyen `dudu-bubu-vercel`.
3. Importáld a repót a [Vercelbe](https://vercel.com/).
4. A Project → Settings → Environment Variables részen add hozzá:
   - **Name:** `DATABASE_URL`
   - **Value:** a Neon connection string teljes értéke
   - Environment: Production (és igény szerint Preview/Development)
5. Telepítési beállítások:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Mentsd a változót, majd készíts új deploymentet.

## 3. Közös játék két gépről

1. Mindkét gépen nyissátok meg ugyanazt a Vercel webcímet.
2. Az első játékos kattintson a **Szoba létrehozása** gombra.
3. Másolja ki és küldje el a teljes meghívókódot. A kód a PeerJS szobakódot és egy titkos csatlakozási tokent tartalmaz.
4. A második játékos illessze be a teljes kódot, majd kattintson a **Csatlakozás** gombra.
5. A szoba gazdája menti a közös játékállapotot a Neonba; a vendég 3 másodpercenként ellenőrzi a friss mentést. A mozgás valós időben PeerJS-en keresztül szinkronizálódik.

## Helyi fejlesztés

```bash
npm install
cp .env.example .env.local
# Add meg a DATABASE_URL-t a .env.local fájlban
npm run dev
```

A Vite fejlesztői szerver önmagában nem futtatja a Vercel `api/` függvényeket. Az API helyi teszteléséhez használd a Vercel CLI-t (`vercel dev`), és állítsd be ugyanazt a `DATABASE_URL` környezeti változót.

## Ellenőrzések és korlátok

- A mentési API ellenőrzi a szobakód és a token formátumát, a mentés méretét, és külön tulajdonosi tokent kér az íráshoz.
- A `DATABASE_URL` nem kerül a böngészőbe.
- A jelenlegi verzió játékprototípus. A PeerJS jelzőszolgáltatás és NAT/firewall beállítások befolyásolhatják a közvetlen kapcsolatot.
- A Neon felhőmentés a közös készletet és játékmetaadatokat menti. A 3D-s világ minden elemének (például a pontos karakterpozícióknak, a tárgyak világpozícióinak és az NPC-k állapotának) teljes, szerver-authoritatív szinkronizálása még külön fejlesztést igényel.
- Nincs felhasználói fiókrendszer vagy moderáció. Ne használjátok érzékeny személyes adatok tárolására.
