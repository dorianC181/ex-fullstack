CREATE DATABASE IF NOT EXISTS cordon_bleu;
USE cordon_bleu;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  passwordHash VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  ingredients TEXT,
  servings INT,
  oven_required BOOLEAN,
  special_equipment_required BOOLEAN,
  exotic_ingredients BOOLEAN,
  country_of_origin VARCHAR(255),
  price_level INT,
  author_id INT
);