
USE [customer_support_ticketing_system_db];
GO



IF OBJECT_ID('dbo.comments', 'U') IS NOT NULL DROP TABLE dbo.comments;
IF OBJECT_ID('dbo.tickets', 'U') IS NOT NULL DROP TABLE dbo.tickets;
IF OBJECT_ID('dbo.customers', 'U') IS NOT NULL DROP TABLE dbo.customers;
GO


CREATE TABLE dbo.customers (
    customer_ID INT IDENTITY (1,1) PRIMARY KEY,
    first_name VARCHAR(15) NOT NULL,
    last_name VARCHAR(15) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone_no VARCHAR(13) NOT NULL,
    [password] VARCHAR(MAX) NOT NULL  -- Use brackets to avoid reserved word issues
);
GO


-- ========================================
-- INSERT SAMPLE DATA INTO customers
-- ========================================
INSERT INTO dbo.customers (first_name, last_name, email, phone_no, [password])
VALUES
('Alex','Mengo','mengoalex20@gmail.com','0712345678','password123'),
('Mike','Waitere','mike21@gmail.com','0711345678','password123'),
('Betty','Chebet','bett12@gmail.com','0714345678','password123'),
('Debbie','Obongi','debbs@gmail.com','0712345679','password123'),
('Alex','Mwangi','alexm2@gmail.com','0712345078','password123'),
('Aaron','Muraithi','muraithi20@gmail.com','0712342678','password123'),
('Ian','Nguru','yian@gmail.com','0212345678','password123');
GO

SELECT * FROM dbo.customers;
GO


CREATE TABLE dbo.tickets (
    ticket_no INT IDENTITY (1,1) PRIMARY KEY,
    event_name VARCHAR(50) NOT NULL,
    event_location VARCHAR(50) NOT NULL,
    price INT NOT NULL,
    event_date DATETIME2(0) NOT NULL
);
GO


INSERT INTO dbo.tickets (event_name, event_location, price, event_date)
VALUES
('Blankets & Wine','Kasarani',5000,'2025-10-23 10:00'),
('Sol Fest','Langata',3000,'2025-12-18 17:00'),
('Sunset GT','Ruaka',7000,'2025-08-23 09:00'),
('October Fest','Nanyuki',4000,'2025-10-18 11:00'),
('Safari Rally','Naivasha',6000,'2025-09-07 10:30'),
('SAGE','Kiambu',8000,'2025-10-18 12:00'),
('SiTH','Machakos',6500,'2025-12-06 12:00');
GO

SELECT * FROM dbo.tickets;
GO



CREATE TABLE dbo.comments (
    comment_ID INT IDENTITY (1,1) PRIMARY KEY,
    comment_date DATETIME2(2) NOT NULL,
    ticket_no INT NOT NULL,
    comment_text NVARCHAR(MAX),
    customer_ID INT NOT NULL,
    FOREIGN KEY (ticket_no) REFERENCES dbo.tickets (ticket_no),
    FOREIGN KEY (customer_ID) REFERENCES dbo.customers (customer_ID)
);
GO


INSERT INTO dbo.comments (comment_date, ticket_no, comment_text, customer_ID)
VALUES
('2025-11-10 10:30:00',3,'I feel very excited for the event.',7),
('2025-06-15 11:00:00',2,'The tickets were cheaper than I thought. They look amazing.',5),
('2025-03-05 12:00:00',7,'Just came back from the show yesterday. I had a blast!',2),
('2025-08-11 09:15:00',1,'I got the ticket but ran into an issue while using it.',4),
('2025-09-02 14:30:00',6,'Just got my tickets in the mail.',1),
('2025-06-22 11:20:00',5,'I received an email to confirm my purchase but I have not received the tickets!',3),
('2025-09-12 15:45:00',4,'Had an amazing experience.',6);
GO

SELECT * FROM dbo.comments;
GO
