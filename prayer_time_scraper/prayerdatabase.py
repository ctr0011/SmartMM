import mariadb
import json
import time
from datetime import datetime, timedelta
from pypdf2_scraper_zakarya import extract_table_dataZ
from pypdfScraper import extract_table_data

def fetch_data(file_path,id):
    if (id ==1):
        data = extract_table_dataZ(file_path)
    elif (id == 2):
        data = extract_table_data(file_path)
    return data
    

# Function to insert data into MySQL table 

def insert_data(data,mosqueID):
    weekdayList = ['Monday','Tuesday', 'Wednesday','Thursday','Friday','Saturday','Sunday']
    try:
        conn = mariadb.connect(
        user="AdminIftikhar",#iftikhar
        password="blackbook10", #blackbook
        host="127.0.0.1",
        port=3306,
        database="prayerdb"

    )
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)


    cur = conn.cursor() 

    start_date = datetime(2024, 1, 1) 

    day_counter = 1 
    for month_data in data:
        for prayers in month_data:
            if not any(prayers.values()):
                continue  # Skip empty data 
            date = start_date + timedelta(days=day_counter - 1)
            date_only = date.date()
            day= date.weekday()
            weekday= weekdayList[day]
            
            fajr_time = prayers.get("Fajr", "") 

            duhr_time = prayers.get("Duhar", "") 

            asr_time = prayers.get("Asar", "") 

            maghrib_time = prayers.get("Maghrib", "") 

            isha_time = prayers.get("Isha", "")
            
            print(date_only,weekday, fajr_time, duhr_time, asr_time, maghrib_time, isha_time)

            # Insert into MySQL table 
            try:
                cur.execute("INSERT INTO PrayerTimeInfo (Fajr, Zuhr, Asar, Maghrib, Isha,Date,MosqueID,Day) VALUES (?,?,?,?,?,?,?,?)",
            (fajr_time, duhr_time, asr_time, maghrib_time, isha_time,date_only,mosqueID,weekday))
            except mariadb.Error as e:
                print(f"Error: {e}")
        
            conn.commit() 
            day_counter += 1
    
    conn.close() 

def main(): 
    data = fetch_data('elmprayertimetable2024.pdf',2)# ELM Mosque parser 
    insert_data(data,2)
    time.sleep(3)
    data = fetch_data('ZJM SalaahTimeTable2024.pdf',1) # Zakarya parser
    insert_data(data,1)


if __name__ == "__main__": 

    main() 
