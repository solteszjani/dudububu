# Dudu és Bubu — voxel sandbox vezérlés

Ez a változat Minecraft-szerű, első személyű sandbox irányítást használ, de saját Dudu–Bubu világot és saját kezelőfelületet tart meg; nem másolja a Minecraft védett grafikáit, hangjait vagy eredeti tartalmait.

## Irányítás
- W A S D: mozgás
- Egér: nézés (kattints a 3D jelenetbe a pointer lock aktiválásához)
- Space: ugrás
- Shift: gyorsabb mozgás
- V: első-/harmadik személyű nézet váltása
- E: Dudu és Bubu ölelése, ha elég közel vannak
- F: közeli NPC-vel interakció
- G: ajándékozás
- Esc: egérkurzor visszaengedése a böngészőben

## Vercel
- Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- A Neon API használatához a `DATABASE_URL` környezeti változót a Vercelben kell beállítani.

Megjegyzés: a teljes buildet ebben a környezetben nem sikerült lefuttatni, mert az npm telepítés időtúllépésbe ütközött. A játék böngészőben történő ellenőrzése szükséges telepítés előtt.

## Voxel látványfrissítés

A jelenlegi változat a saját Dudu és Bubu játékhoz készített voxel / blokkos látványt használ: blokkos terep, kockás lombkoronájú fák, lépcsőzetes tetők, kockás karakterek végtagokkal és pixelhatású helyben generált textúrák. Nem használ Minecraft márkajelzést vagy eredeti Minecraft-eszközöket.

Telepítés után ellenőrizd a Vercel build logját. A buildhez szükséges parancs `npm run build`, kimenet `dist`.
