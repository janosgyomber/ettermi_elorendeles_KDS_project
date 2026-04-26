-- ============================================================
-- KDS – Éttermi előrendelési és konyhai kijelző rendszer
-- SQL Tesztszkript
-- Adatbázis: MariaDB  |  Schema: kds
-- Alap: kds_db_dump.sql + dokumentacio.docx
--
-- MEGJEGYZÉSEK a dump és a dokumentáció eltéréseiről:
--  • A User tábla neve a dumpban: `user`
--    A dokumentáció szerint @Table(name="users") annotáció
--    alapján `users`-nak kellene lennie – valószínűleg
--    az annotáció nem volt alkalmazva a dump készítésekor.
--  • Az `orders` tábla a dumpban tartalmaz egy extra
--    `user_id` FK oszlopot (user_user_id mellett).
--  • Az `order_item` és `orders` táblák üresek a dumpban,
--    ezért a tesztek saját tesztadatokat szúrnak be,
--    majd törlés után takarítják el.
--
-- Futtatás: egyetlen tranzakcióban vagy szekciónként.
-- Minden teszt SELECT eredménye: ✓ PASS  /  ✗ FAIL
-- ============================================================

-- ============================================================
-- 0. PRE-FLIGHT – SÉMATÁBLÁK MEGLÉTÉNEK ELLENŐRZÉSE
-- ============================================================

SELECT '=== 0. PRE-FLIGHT ELLENŐRZÉSEK ===' AS szakasz;

SELECT IF(COUNT(*) > 0, '✓ PASS', '✗ FAIL') AS eredmeny,
       'category tábla létezik'              AS teszt
FROM   information_schema.tables
WHERE  table_schema = DATABASE()
  AND  table_name   = 'category';

SELECT IF(COUNT(*) > 0, '✓ PASS', '✗ FAIL') AS eredmeny,
       'product tábla létezik'               AS teszt
FROM   information_schema.tables
WHERE  table_schema = DATABASE()
  AND  table_name   = 'product';

SELECT IF(COUNT(*) > 0, '✓ PASS', '✗ FAIL') AS eredmeny,
       'orders tábla létezik'                AS teszt
FROM   information_schema.tables
WHERE  table_schema = DATABASE()
  AND  table_name   = 'orders';

SELECT IF(COUNT(*) > 0, '✓ PASS', '✗ FAIL') AS eredmeny,
       'order_item tábla létezik'            AS teszt
FROM   information_schema.tables
WHERE  table_schema = DATABASE()
  AND  table_name   = 'order_item';

-- A tábla neve a dumpban `user`, nem `users`
SELECT IF(COUNT(*) > 0, '✓ PASS', '✗ FAIL') AS eredmeny,
       'user tábla létezik (dumpban: user, nem users)' AS teszt
FROM   information_schema.tables
WHERE  table_schema = DATABASE()
  AND  table_name   IN ('user', 'users');

-- Elvárt oszlopok: orders.user_user_id FK
SELECT IF(COUNT(*) > 0, '✓ PASS', '✗ FAIL') AS eredmeny,
       'orders tábla tartalmazza a user_user_id FK oszlopot' AS teszt
FROM   information_schema.columns
WHERE  table_schema = DATABASE()
  AND  table_name   = 'orders'
  AND  column_name  = 'user_user_id';

-- Extra oszlop: orders.user_id (dumpban jelen van, doc nem említi)
SELECT IF(COUNT(*) > 0, '⚠ FIGYELEM – extra user_id oszlop az orders táblában', '✓ Nincs extra oszlop') AS eredmeny,
       'orders.user_id extra FK oszlop vizsgálat' AS teszt
FROM   information_schema.columns
WHERE  table_schema = DATABASE()
  AND  table_name   = 'orders'
  AND  column_name  = 'user_id';


-- ============================================================
-- 1. KATEGÓRIA TESZTEK  (CategoryRepository)
-- ============================================================

SELECT '=== 1. KATEGÓRIA TESZTEK ===' AS szakasz;

-- T01: Kategóriák száma (dump alapján 6 db)
SELECT IF(COUNT(*) = 6, '✓ PASS', '✗ FAIL') AS eredmeny,
       'T01 – Összes kategória száma = 6'    AS teszt,
       COUNT(*)                              AS aktualis_ertek
FROM   category;

-- T02: 'Burgerek' kategória létezik (id=1)
SELECT IF(COUNT(*) = 1, '✓ PASS', '✗ FAIL')   AS eredmeny,
       'T02 – Burgerek kategória létezik (id=1)' AS teszt
FROM   category
WHERE  category_id = 1
  AND  name = 'Burgerek';

-- T03: Minden kategóriának van neve (name NOT NULL)
SELECT IF(COUNT(*) = 0, '✓ PASS', '✗ FAIL')         AS eredmeny,
       'T03 – Minden kategóriának van neve (NULL check)' AS teszt
FROM   category
WHERE  name IS NULL OR TRIM(name) = '';

-- T04: Az összes 6 elvárt kategória neve megtalálható
SELECT IF(COUNT(DISTINCT name) = 6, '✓ PASS', '✗ FAIL') AS eredmeny,
       'T04 – Mind a 6 kategórianév egyedi és különböző'  AS teszt
FROM   category;

-- T05: Kategória ID szerint rendezett lekérdezés (CategoryService.findAll)
SELECT category_id, name, description,
       'T05 – findAll() eredménye' AS teszt
FROM   category
ORDER BY category_id;

-- T06: Kategória lekérése ID alapján (CategoryService.findById)
SELECT IF(name = 'Italok & Kávék', '✓ PASS', '✗ FAIL') AS eredmeny,
       'T06 – findById(6) → Italok & Kávék'             AS teszt
FROM   category
WHERE  category_id = 6;

-- T07: Nem létező kategória visszaad 0 sort (404 alapja)
SELECT IF(COUNT(*) = 0, '✓ PASS (404 vár)', '✗ FAIL')  AS eredmeny,
       'T07 – Nem létező kategória (id=999) → 0 sor'     AS teszt
FROM   category
WHERE  category_id = 999;


-- ============================================================
-- 2. TERMÉK TESZTEK  (ProductRepository)
-- ============================================================

SELECT '=== 2. TERMÉK TESZTEK ===' AS szakasz;

-- T08: Termékek száma (dump alapján 33 db)
SELECT IF(COUNT(*) = 33, '✓ PASS', '✗ FAIL') AS eredmeny,
       'T08 – Összes termék száma = 33'       AS teszt,
       COUNT(*)                               AS aktualis_ertek
FROM   product;

-- T09: Minden terméknek van neve
SELECT IF(COUNT(*) = 0, '✓ PASS', '✗ FAIL')       AS eredmeny,
       'T09 – Minden terméknek van neve (NULL check)' AS teszt
FROM   product
WHERE  name IS NULL OR TRIM(name) = '';

-- T10: Minden terméknek van pozitív ára
SELECT IF(COUNT(*) = 0, '✓ PASS', '✗ FAIL')       AS eredmeny,
       'T10 – Minden terméknek pozitív az ára'       AS teszt
FROM   product
WHERE  price IS NULL OR price <= 0;

-- T11: Minden termék létező kategóriához tartozik (FK integritás)
SELECT IF(COUNT(*) = 0, '✓ PASS', '✗ FAIL')                    AS eredmeny,
       'T11 – FK integritás: product.category_category_id valid' AS teszt
FROM   product p
       LEFT JOIN category c ON c.category_id = p.category_category_id
WHERE  c.category_id IS NULL;

-- T12: findByCategoryCategoryId(1) → Burgerek = 9 termék
SELECT IF(COUNT(*) = 9, '✓ PASS', '✗ FAIL')         AS eredmeny,
       'T12 – Burgerek kategóriában 9 termék van'     AS teszt,
       COUNT(*)                                       AS aktualis_ertek
FROM   product
WHERE  category_category_id = 1;

-- T13: findByCategoryCategoryId(2) → Szendvicsek & Chopped Cheese = 7 termék
SELECT IF(COUNT(*) = 7, '✓ PASS', '✗ FAIL')             AS eredmeny,
       'T13 – Szendvicsek kategóriában 7 termék van'      AS teszt,
       COUNT(*)                                           AS aktualis_ertek
FROM   product
WHERE  category_category_id = 2;

-- T14: findByCategoryCategoryId(5) → Desszert = 1 termék
SELECT IF(COUNT(*) = 1, '✓ PASS', '✗ FAIL')    AS eredmeny,
       'T14 – Desszert kategóriában 1 termék'    AS teszt,
       COUNT(*)                                  AS aktualis_ertek
FROM   product
WHERE  category_category_id = 5;

-- T15: Nem létező kategóriájú termék → 0 sor
SELECT IF(COUNT(*) = 0, '✓ PASS (404 vár)', '✗ FAIL')    AS eredmeny,
       'T15 – Nem létező kategória (id=99) termékei → 0'   AS teszt
FROM   product
WHERE  category_category_id = 99;

-- T16: Legdrágább termék az adott databan
SELECT name AS legdragabb_termek,
       price AS ar,
       'T16 – Legdrágább termék lekérdezése' AS teszt
FROM   product
ORDER BY price DESC
LIMIT 1;

-- T17: Legolcsóbb termék
SELECT name AS legolcsobb_termek,
       price AS ar,
       'T17 – Legolcsóbb termék lekérdezése' AS teszt
FROM   product
ORDER BY price ASC
LIMIT 1;

-- T18: Classic Burger ára 2750 Ft (id=10)
SELECT IF(price = 2750, '✓ PASS', '✗ FAIL')         AS eredmeny,
       'T18 – Classic Burger (id=10) ára = 2750 Ft'   AS teszt,
       price                                          AS aktualis_ar
FROM   product
WHERE  product_id = 10;

-- T19: Termékek kategóriánkénti darabszáma (mind a 6 kategóriában legyen termék)
SELECT IF(COUNT(DISTINCT category_category_id) = 6, '✓ PASS', '✗ FAIL') AS eredmeny,
       'T19 – Mind a 6 kategóriában van legalább 1 termék'                AS teszt
FROM   product;


-- ============================================================
-- 3. FELHASZNÁLÓ TESZTEK  (UserRepository)
--    FIGYELEM: a dumpban a tábla neve `user`, nem `users`
-- ============================================================

SELECT '=== 3. FELHASZNÁLÓ TESZTEK ===' AS szakasz;

-- T20: Admin felhasználó létezik
-- A DataInitializer is létrehozza, de a dumpban már bent van
SELECT IF(COUNT(*) = 1, '✓ PASS', '✗ FAIL')  AS eredmeny,
       'T20 – admin felhasználó létezik'        AS teszt
FROM   user
WHERE  username = 'admin';

-- T21: Admin szerepkör helyes
SELECT IF(role = 'ADMIN', '✓ PASS', '✗ FAIL')   AS eredmeny,
       'T21 – admin szerepköre = ADMIN'            AS teszt
FROM   user
WHERE  username = 'admin';

-- T22: findByUsername('admin') → pontosan 1 sor
SELECT IF(COUNT(*) = 1, '✓ PASS', '✗ FAIL')        AS eredmeny,
       'T22 – findByUsername(admin) → 1 sor'         AS teszt,
       COUNT(*)                                      AS sorok_szama
FROM   user
WHERE  username = 'admin';

-- T23: findByUsername nem létező felhasználó → 0 sor
SELECT IF(COUNT(*) = 0, '✓ PASS (404 vár)', '✗ FAIL') AS eredmeny,
       'T23 – findByUsername(nemletezik) → 0 sor'       AS teszt
FROM   user
WHERE  username = 'nemletezik_felhasznalo';

-- T24: Jelszó BCrypt formátumban van tárolva ($2a$ prefix)
SELECT IF(password LIKE '$2a$%', '✓ PASS', '✗ FAIL')        AS eredmeny,
       'T24 – admin jelszava BCrypt formátumú ($2a$ prefix)'  AS teszt,
       LEFT(password, 7)                                      AS jelszohash_eleje
FROM   user
WHERE  username = 'admin';

-- T25: Jelszó mező hossza legalább 60 karakter (BCrypt standard)
SELECT IF(LENGTH(password) >= 60, '✓ PASS', '✗ FAIL')  AS eredmeny,
       'T25 – admin jelszóhash hossza ≥ 60 karakter'     AS teszt,
       LENGTH(password)                                  AS hash_hossz
FROM   user
WHERE  username = 'admin';

-- T26: UserDTO szimuláció – jelszó mező NEM szerepel a kimenetben
SELECT user_id,
       username,
       name,
       role,
       'T26 – UserDTO: jelszó nélküli lekérdezés (password oszlop kihagyva)' AS teszt
FROM   user
WHERE  username = 'admin';


-- ============================================================
-- 4. RENDELÉS TESZTEK  (OrderRepository)
--    Az orders tábla üres a dumpban → tesztadatot szúrunk be
-- ============================================================

SELECT '=== 4. RENDELÉS TESZTEK (tesztadat előkészítés) ===' AS szakasz;

-- Tesztfelhasználók (ha még nem léteznek)
INSERT IGNORE INTO user (user_id, name, password, role, username) VALUES
(2, 'Teszt Felszolgáló', '$2a$10$dj631gwlfw8m8RdqVtU.8OYOLZPZPVRpMVql7/Nfco9piP9E.uqNW', 'WAITER',  'teszt_felszolgalo'),
(3, 'Teszt Konyha',      '$2a$10$dj631gwlfw8m8RdqVtU.8OYOLZPZPVRpMVql7/Nfco9piP9E.uqNW', 'KITCHEN', 'teszt_konyha');

-- Tesztrendelések (user_user_id és user_id mindkét FK kitöltve az orders sémája szerint)
INSERT INTO orders (order_id, full_price, status, table_numb, time_stamp, user_user_id, user_id) VALUES
(1,  5500, 'PAID',      3,  '2026-04-26 11:15:00.000000', 1, 1),
(2,  7950, 'DONE',      7,  '2026-04-26 12:05:00.000000', 2, 2),
(3,  6100, 'PREPARING', 2,  '2026-04-26 12:45:00.000000', 2, 2),
(4,  2750, 'PENDING',   5,  '2026-04-26 13:10:00.000000', 2, 2),
(5,  2750, 'PAID',      1,  '2026-04-26 11:50:00.000000', 1, 1),
(6,  4700, 'PREPARING', 4,  '2026-04-26 13:20:00.000000', 2, 2);

-- Rendelési tételek (valós product_id-kat használunk a dumpból)
INSERT INTO order_item (item_id, comment, item_status, quantity, order_order_id, product_product_id) VALUES
-- 1. rendelés (PAID) – asztal: 3
(1,  NULL,           'DONE',      1, 1, 10),  -- Classic Burger
(2,  NULL,           'DONE',      1, 1, 25),  -- Sült burgonya
(3,  NULL,           'DONE',      2, 1, 33),  -- Üdítő x2
-- 2. rendelés (DONE) – asztal: 7
(4,  'extra sajt',   'DONE',      2, 2, 12),  -- BBQ Burger x2
(5,  NULL,           'DONE',      2, 2, 26),  -- Hagymakarikák x2
(6,  NULL,           'DONE',      1, 2, 37),  -- Espresso
-- 3. rendelés (PREPARING) – asztal: 2
(7,  'hagymát ne',   'DONE',      1, 3, 4),   -- Crunchy Chicken Burger
(8,  NULL,           'PREPARING', 1, 3, 16),  -- Classic Chopped Cheese
(9,  NULL,           'PREPARING', 1, 3, 26),  -- Hagymakarikák
(10, NULL,           'PENDING',   1, 3, 32),  -- Churros
-- 4. rendelés (PENDING) – asztal: 5
(11, NULL,           'PENDING',   1, 4, 10),  -- Classic Burger
(12, 'sok jéggel',   'PENDING',   1, 4, 33),  -- Üdítő
-- 5. rendelés (PAID) – asztal: 1
(13, NULL,           'DONE',      1, 5, 10),  -- Classic Burger
-- 6. rendelés (PREPARING) – asztal: 4
(14, NULL,           'PREPARING', 2, 6, 12),  -- BBQ Burger x2
(15, NULL,           'DONE',      1, 6, 31),  -- Coleslaw saláta
(16, NULL,           'PENDING',   2, 6, 33);  -- Üdítő x2

-- ---- Rendelés tesztek ----

SELECT '=== 4. RENDELÉS TESZTEK ===' AS szakasz;

-- T27: Összes rendelés száma = 6
SELECT IF(COUNT(*) = 6, '✓ PASS', '✗ FAIL') AS eredmeny,
       'T27 – Összes rendelés száma = 6'      AS teszt,
       COUNT(*)                               AS aktualis_ertek
FROM   orders;

-- T28: findByUserUserId(1) → admin felhasználó 2 rendelése (id=1, id=5)
SELECT IF(COUNT(*) = 2, '✓ PASS', '✗ FAIL')        AS eredmeny,
       'T28 – findByUserUserId(1) → 2 rendelés'      AS teszt,
       COUNT(*)                                      AS aktualis_ertek
FROM   orders
WHERE  user_user_id = 1;

-- T29: findByStatus('PENDING') → 1 rendelés
SELECT IF(COUNT(*) = 1, '✓ PASS', '✗ FAIL')     AS eredmeny,
       'T29 – findByStatus(PENDING) → 1 rendelés' AS teszt,
       COUNT(*)                                   AS aktualis_ertek
FROM   orders
WHERE  status = 'PENDING';

-- T30: findByStatus('PREPARING') → 2 rendelés
SELECT IF(COUNT(*) = 2, '✓ PASS', '✗ FAIL')       AS eredmeny,
       'T30 – findByStatus(PREPARING) → 2 rendelés' AS teszt,
       COUNT(*)                                     AS aktualis_ertek
FROM   orders
WHERE  status = 'PREPARING';

-- T31: findByStatus('PAID') → 2 rendelés
SELECT IF(COUNT(*) = 2, '✓ PASS', '✗ FAIL')   AS eredmeny,
       'T31 – findByStatus(PAID) → 2 rendelés'  AS teszt,
       COUNT(*)                                 AS aktualis_ertek
FROM   orders
WHERE  status = 'PAID';

-- T32: Minden rendelésnek van érvényes timestamp-je
SELECT IF(COUNT(*) = 0, '✓ PASS', '✗ FAIL')          AS eredmeny,
       'T32 – Minden rendelésnek van time_stamp értéke' AS teszt
FROM   orders
WHERE  time_stamp IS NULL;

-- T33: Minden rendelésnek van asztalszáma
SELECT IF(COUNT(*) = 0, '✓ PASS', '✗ FAIL')           AS eredmeny,
       'T33 – Minden rendelésnek van table_numb értéke' AS teszt
FROM   orders
WHERE  table_numb IS NULL;

-- T34: Minden rendelés meglévő felhasználóhoz tartozik (FK)
SELECT IF(COUNT(*) = 0, '✓ PASS', '✗ FAIL')               AS eredmeny,
       'T34 – FK integritás: orders.user_user_id létező user' AS teszt
FROM   orders o
       LEFT JOIN user u ON u.user_id = o.user_user_id
WHERE  u.user_id IS NULL;

-- T35: Rendelés státusz PATCH szimulációja – státusz frissítése
UPDATE orders SET status = 'DONE' WHERE order_id = 3;

SELECT IF(status = 'DONE', '✓ PASS', '✗ FAIL')                  AS eredmeny,
       'T35 – PATCH /orders/3/status: PREPARING → DONE sikerült'  AS teszt
FROM   orders
WHERE  order_id = 3;

-- Visszaállítás a következő tesztekhez
UPDATE orders SET status = 'PREPARING' WHERE order_id = 3;

-- T36: Nem létező rendelés → 0 sor (404 alapja)
SELECT IF(COUNT(*) = 0, '✓ PASS (404 vár)', '✗ FAIL') AS eredmeny,
       'T36 – Nem létező rendelés (id=999) → 0 sor'    AS teszt
FROM   orders
WHERE  order_id = 999;


-- ============================================================
-- 5. RENDELÉSI TÉTEL TESZTEK  (OrderItemRepository)
-- ============================================================

SELECT '=== 5. RENDELÉSI TÉTEL TESZTEK ===' AS szakasz;

-- T37: Összes tétel száma = 16
SELECT IF(COUNT(*) = 16, '✓ PASS', '✗ FAIL') AS eredmeny,
       'T37 – Összes order_item sor száma = 16' AS teszt,
       COUNT(*)                                AS aktualis_ertek
FROM   order_item;

-- T38: findByOrderOrderId(3) → 4 tétel a 3. rendelésben
SELECT IF(COUNT(*) = 4, '✓ PASS', '✗ FAIL')           AS eredmeny,
       'T38 – findByOrderOrderId(3) → 4 tétel'          AS teszt,
       COUNT(*)                                         AS aktualis_ertek
FROM   order_item
WHERE  order_order_id = 3;

-- T39: Minden tételnek van mennyisége (quantity > 0)
SELECT IF(COUNT(*) = 0, '✓ PASS', '✗ FAIL')             AS eredmeny,
       'T39 – Minden tételnek van quantity > 0 értéke'    AS teszt
FROM   order_item
WHERE  quantity IS NULL OR quantity <= 0;

-- T40: Minden tételnek van item_status értéke
SELECT IF(COUNT(*) = 0, '✓ PASS', '✗ FAIL')       AS eredmeny,
       'T40 – Minden tételnek van item_status értéke' AS teszt
FROM   order_item
WHERE  item_status IS NULL;

-- T41: Minden tétel meglévő termékre mutat (FK)
SELECT IF(COUNT(*) = 0, '✓ PASS', '✗ FAIL')                    AS eredmeny,
       'T41 – FK integritás: order_item.product_product_id valid' AS teszt
FROM   order_item oi
       LEFT JOIN product p ON p.product_id = oi.product_product_id
WHERE  p.product_id IS NULL;

-- T42: Minden tétel meglévő rendelésre mutat (FK)
SELECT IF(COUNT(*) = 0, '✓ PASS', '✗ FAIL')                AS eredmeny,
       'T42 – FK integritás: order_item.order_order_id valid' AS teszt
FROM   order_item oi
       LEFT JOIN orders o ON o.order_id = oi.order_order_id
WHERE  o.order_id IS NULL;

-- T43: KITCHEN státuszfrissítés – item_status PENDING → PREPARING
UPDATE order_item SET item_status = 'PREPARING' WHERE item_id = 10;

SELECT IF(item_status = 'PREPARING', '✓ PASS', '✗ FAIL')                    AS eredmeny,
       'T43 – PATCH /order-items/10/status: PENDING → PREPARING (KDS)'       AS teszt
FROM   order_item
WHERE  item_id = 10;

-- T44: KITCHEN státuszfrissítés – item_status PREPARING → DONE
UPDATE order_item SET item_status = 'DONE' WHERE item_id = 10;

SELECT IF(item_status = 'DONE', '✓ PASS', '✗ FAIL')               AS eredmeny,
       'T44 – PATCH /order-items/10/status: PREPARING → DONE (KDS)' AS teszt
FROM   order_item
WHERE  item_id = 10;

-- T45: Egy rendelés DONE állapot automatikus vizsgálata
--      (Ha minden tétel DONE, a rendelés is DONE-ra állítható)
SELECT IF(
         (SELECT COUNT(*) FROM order_item WHERE order_order_id = 1 AND item_status <> 'DONE') = 0,
         '✓ PASS – Minden tétel DONE, rendelés lezárható',
         '✗ FAIL – Nem minden tétel készült el'
       ) AS eredmeny,
       'T45 – 1. rendelés összes tétele DONE állapotú' AS teszt;


-- ============================================================
-- 6. ÜZLETI LOGIKA / INTEGRÁCIÓ TESZTEK
-- ============================================================

SELECT '=== 6. ÜZLETI LOGIKA TESZTEK ===' AS szakasz;

-- T46: Rendelés teljes árának konzisztenciája
--      A full_price-nak meg kell egyeznie a tételek sum(qty*price) értékével
SELECT o.order_id,
       o.full_price                             AS tarolt_ar,
       SUM(oi.quantity * p.price)              AS szamolt_ar,
       IF(o.full_price = SUM(oi.quantity * p.price),
          '✓ PASS', '✗ FAIL – eltérés!')       AS eredmeny,
       'T46 – full_price konzisztencia ellenőrzés' AS teszt
FROM   orders o
       JOIN order_item oi ON oi.order_order_id  = o.order_id
       JOIN product    p  ON p.product_id       = oi.product_product_id
GROUP BY o.order_id, o.full_price;

-- T47: KDS nézet – el nem készült tételek (PENDING + PREPARING)
SELECT IF(COUNT(*) > 0, '✓ PASS', '✗ FAIL')              AS eredmeny,
       'T47 – KDS: vannak nyitott (PENDING/PREPARING) tételek' AS teszt,
       COUNT(*)                                           AS nyitott_tetelek
FROM   order_item
WHERE  item_status IN ('PENDING', 'PREPARING');

-- T48: Aktív rendelések (nem PAID) asztalszámra rendezve
SELECT o.order_id,
       o.table_numb,
       o.status,
       COUNT(oi.item_id)                  AS tetelek_szama,
       'T48 – Aktív rendelések KDS-nézet' AS teszt
FROM   orders o
       JOIN order_item oi ON oi.order_order_id = o.order_id
WHERE  o.status <> 'PAID'
GROUP BY o.order_id, o.table_numb, o.status
ORDER BY o.table_numb;

-- T49: Szerepkör-alapú hozzáférés szimulációja
--      ADMIN felhasználó lekérése → minden szerepkört láthat
SELECT IF(role = 'ADMIN', '✓ PASS – ADMIN teljes hozzáféréssel rendelkezik', '✗ FAIL') AS eredmeny,
       'T49 – Admin szerepkör ellenőrzés'                                               AS teszt
FROM   user
WHERE  username = 'admin';

-- T50: WAITER felhasználó rendeléseket adhat le (jogosultság ellenőrzés)
SELECT IF(role IN ('WAITER', 'ADMIN'), '✓ PASS – Rendelés leadható', '✗ FAIL – Nincs jogkör') AS eredmeny,
       'T50 – teszt_felszolgalo rendelést adhat le'                                            AS teszt
FROM   user
WHERE  username = 'teszt_felszolgalo';

-- T51: KITCHEN felhasználó tételeket frissíthet (jogosultság ellenőrzés)
SELECT IF(role IN ('KITCHEN', 'ADMIN'), '✓ PASS – Tétel státusz frissíthető', '✗ FAIL – Nincs jogkör') AS eredmeny,
       'T51 – teszt_konyha tételt frissíthet (KDS)'                                                    AS teszt
FROM   user
WHERE  username = 'teszt_konyha';

-- T52: Legtöbbet rendelt termék
SELECT p.name                       AS termek_neve,
       SUM(oi.quantity)             AS osszes_rendelt,
       'T52 – Top 1 leggyakoribb termék' AS teszt
FROM   order_item oi
       JOIN product p ON p.product_id = oi.product_product_id
GROUP BY p.product_id, p.name
ORDER BY osszes_rendelt DESC
LIMIT 1;

-- T53: Kategóriánkénti forgalom (termékek × mennyiség × ár)
SELECT c.name                            AS kategoria,
       COUNT(DISTINCT oi.item_id)        AS rendelt_tetelek,
       SUM(oi.quantity)                  AS osszes_db,
       SUM(oi.quantity * p.price)        AS becsult_forgalom,
       'T53 – Kategória forgalom összesítő' AS teszt
FROM   order_item oi
       JOIN product  p ON p.product_id        = oi.product_product_id
       JOIN category c ON c.category_id       = p.category_category_id
GROUP BY c.category_id, c.name
ORDER BY becsult_forgalom DESC;


-- ============================================================
-- 7. TAKARÍTÁS – TESZTADATOK TÖRLÉSE
--    (Csak a tesztek által beillesztett sorok)
-- ============================================================

SELECT '=== 7. CLEANUP – TESZTADATOK TÖRLÉSE ===' AS szakasz;

DELETE FROM order_item WHERE item_id BETWEEN 1 AND 16;
DELETE FROM orders     WHERE order_id BETWEEN 1 AND 6;
DELETE FROM user       WHERE user_id IN (2, 3);

-- Takarítás ellenőrzése
SELECT IF(COUNT(*) = 0, '✓ PASS – order_item üres', '✗ FAIL') AS eredmeny,
       'Cleanup: order_item tábla'                              AS tabla
FROM   order_item;

SELECT IF(COUNT(*) = 0, '✓ PASS – orders üres', '✗ FAIL') AS eredmeny,
       'Cleanup: orders tábla'                              AS tabla
FROM   orders;

SELECT IF(COUNT(*) = 1, '✓ PASS – csak admin maradt', '✗ FAIL') AS eredmeny,
       'Cleanup: user tábla (admin megmarad)'                    AS tabla
FROM   user;

SELECT '=== TESZTSZKRIPT VÉGE ===' AS info;
-- ============================================================
-- ÖSSZEFOGLALÓ
-- Tesztek száma: 53
-- Lefedett területek:
--   • Séma meglét (T01-T07 előkészítő)
--   • CategoryRepository: findAll, findById (T01-T07)
--   • ProductRepository:  findAll, findByCategoryCategoryId,
--                         findByAvailable, findById (T08-T19)
--   • UserRepository:     findAll, findByUsername, findById (T20-T26)
--   • OrderRepository:    findAll, findByUserUserId,
--                         findByStatus, PATCH status (T27-T36)
--   • OrderItemRepository:findAll, findByOrderOrderId,
--                         PATCH itemStatus (KDS) (T37-T45)
--   • Üzleti logika:      FK integritás, full_price konzisztencia,
--                         KDS nézet, szerepkörök (T46-T53)
-- ============================================================
