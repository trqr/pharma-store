-- Stock fixtures
-- Links pharmacy_product with warehouse and defines stock quantity

INSERT INTO stock (product_id, warehouse_id, stock) VALUES
-- Product 1 in multiple warehouses
(12, 7, 150),
(12, 8, 75),
(12, 3, 100),

-- Product 2 in multiple warehouses
(13, 7, 200),
(13, 4, 50),

-- Product 3
(14, 7, 80),
(14, 8, 120),
(14, 9, 45),

-- Product 4
(15, 7, 300),
(15, 9, 150),

-- Product 5
(1617, 8, 25),

-- Product 6
(17, 7, 90),
(17, 8, 60),
(17, 10, 110),

-- Product 7
(18, 7, 180),
(18, 9, 95),

-- Product 8
(19, 8, 140),
(19, 10, 70),

-- Product 9
(20, 1, 250),
(20, 8, 130),
(20, 9, 85),

-- Product 10
(21, 1, 60),
(21, 10, 40);
