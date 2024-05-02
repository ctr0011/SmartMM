#!/bin/bash 


echo "mariadb connector c installation"

sudo apt install -y git gcc make cmake libssl-dev
git clone https://github.com/MariaDB/mariadb-connector-c.git
mkdir build && cd build
cmake ../mariadb-connector-c/ -DCMAKE_INSTALL_PREFIX=/usr
make
sudo make install
export LD_LIBRARY_PATH=/usr/lib/mariadb:$LD_LIBRARY_PATH

echo "Installing mariadb python package"

pip3 install mariadb==1.1.10

echo "Installing PyPDF2 python library"

pip3 install PyPDF2

echo "Running scraping scripts for prayerdb population"

cd prayer_time_scraper
cd ..
python3 prayerdatabase.py
