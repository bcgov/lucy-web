-- ## Add Primary Key Constraint to Country Province table ## --
ALTER TABLE country_province ADD CONSTRAINT PK_country_province PRIMARY KEY (country_code, province_code);

-- ## Add Foreign Key Constraint to Country Province table ## --
ALTER TABLE country_province ADD CONSTRAINT FK_country_province FOREIGN KEY (country_code) REFERENCES country (country_code) ON DELETE CASCADE;