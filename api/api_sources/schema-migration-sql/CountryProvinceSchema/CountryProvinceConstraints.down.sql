-- # Revert Changes introduce by CountryProvinceConstraints
ALTER TABLE country_province DROP CONSTRAINT FK_country_province;