use prayerdb;

CREATE TABLE MosquesInfo 
(ID INT PRIMARY KEY,Name VARCHAR(100), Website VARCHAR(255), Location VARCHAR(300),ContactNo VARCHAR(20)); 

INSERT INTO MosquesInfo (ID,Name, Website, ContactNo, Location) 
VALUES (1,'Zakarya Mosque', 'https://www.zakariyyamasjid.co.uk/', '07878889369', 'Bolton UK'); 

INSERT INTO MosquesInfo (ID,Name, Website, ContactNo, Location)  
VALUES (2,'East London Mosque', 'https://www.eastlondonmosque.org.uk/', '+442076503000', '46 Whitechapel Road, London E1 1JX');

CREATE TABLE PrayerTimeInfo (ID INT PRIMARY KEY AUTO_INCREMENT, MosqueID INT, Date DATE,Day VARCHAR(20),
Fajr VARCHAR(10),Zuhr VARCHAR(10),Asar VARCHAR(10),Maghrib VARCHAR(10),Isha VARCHAR(10),FOREIGN KEY (MosqueID) REFERENCES MosquesInfo(ID)); 
