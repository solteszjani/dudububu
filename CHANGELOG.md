# Változások – Neon stabilizálás

- A Neon API külön tulajdonosi és meghívási tokent használ.
- A tokenek SHA-256 lenyomatként kerülnek az adatbázisba.
- A vendég csak a megfelelő meghívókóddal olvashatja a mentést; íráshoz a házigazda titka szükséges.
- A mentés legfeljebb 100 KB, a szobakód és a token formátuma ellenőrzött.
- A mentési időzítő nem indul újra minden játékállapot-változásnál.
- A mentés verziószáma monoton növekszik, így a vendég megbízhatóbban észleli a frissítéseket.
- A telepítési útmutató pontosítva, `.gitignore` hozzáadva.
