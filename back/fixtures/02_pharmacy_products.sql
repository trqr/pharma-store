-- Pharmacy Products fixtures
-- Note: medicine_id should reference existing MedicineReference entries
-- Adjust the medicine_id values according to your existing data

INSERT INTO pharmacy_product (medicine_id, price, enabled, promotion_price) VALUES
(16000, 12.50, 1, 10.00),
(17000, 8.75, 1, NULL),
(18000, 15.90, 1, 12.90),
(19000, 6.50, 1, NULL),
(20000, 22.00, 0, NULL),
(21000, 18.50, 1, 15.00),
(22000, 9.90, 1, NULL),
(23000, 14.25, 1, NULL),
(24000, 11.00, 1, 9.50),
(25000, 25.75, 1, NULL);
