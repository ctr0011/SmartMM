#!/bin/bash 
 
# Update package lists 

sudo apt update 

# Upgrade installed packages 

sudo apt upgrade -y 

# Install MariaDB server 

sudo apt install mariadb-server -y 
 

# Secure installation 

echo sudo mysql_secure_installation -y 

# Access MariaDB shell to create a new user and database 
echo "Enter root password for MariaDB (default is blank): "

read -s root_password 

# Provide username and password for new user 

db_username="AdminIftikhar" 

db_password="blackbook10" 



# Create a new user and database 

echo "CREATE DATABASE IF NOT EXISTS prayerdb;" | sudo mysql -u root -p"${root_password}"

echo "GRANT ALL PRIVILEGES ON prayerdb.* TO '${db_username}'@'localhost' IDENTIFIED BY '${db_password}';" | sudo mysql -u root -p"${root_password}"

echo "FLUSH PRIVILEGES;" | sudo mysql -u root -p"${root_password}"
  

# Export username and password to a file for later use 

echo "export DB_USERNAME='${db_username}'" > ~/.db_credentials 

echo "export DB_PASSWORD='${db_password}'" >> ~/.db_credentials  

echo "MariaDB installation completed successfully!" 

echo "** Database Tables creation script **"
echo mysql -u "${db_username}" -p'${db_password}' prayerdb < ./dbsetup.sql


