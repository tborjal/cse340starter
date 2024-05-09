-- TASK 1

INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony','Stark','tony@startkent.com','Iam1ronM@n');


UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

DELETE FROM account
WHERE account_id = 1;

SELECT inv_make, inv_model 
FROM classification
JOIN inventory
	ON classification.classification_id = inventory.classification_id
WHERE classification_name = 'Sport';

/*

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interior')
WHERE inv_id = 10;

 UPDATE inventory
SET inv_image = 
  CONCAT(
    SUBSTRING(inv_image, 1, POSITION('/' IN inv_image) + 6),
    '/vehicle',
    SUBSTRING(inv_image, POSITION('/' IN inv_image) + 6)
  ),

 inv_thumbnail =CONCAT(SUBSTRING(inv_thumbnail, 1, POSITION('/' IN inv_thumbnail) + 6),
    '/vehicle',
    SUBSTRING(inv_thumbnail, POSITION('/' IN inv_thumbnail) + 6)
  );
  */