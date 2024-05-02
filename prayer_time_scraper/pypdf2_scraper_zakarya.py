import re
import PyPDF2

def extract_table_dataZ(pdf_file_path):
    final_data = []
    with open(pdf_file_path, 'rb') as f:
        pdf_reader = PyPDF2.PdfReader(f)
        num_pages = len(pdf_reader.pages)
        print(num_pages)
        for page_num in range(1,num_pages):
            page = pdf_reader.pages[page_num]
            page_text = page.extract_text() 
            row_pattern = r'\b(?:\d{1,2}|01-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))+\s+(?:MON|TUE|WED|THU|ﺟﻤﻌﮧ|SAT|SUN)\s+\d{1,2}(?:\s+\d{1,2}:\d{2}){10}'
            if (page_num == 3 or page_num == 4 or page_num == 5): # March April May 11 columns for time
                row_pattern = r'\b(?:\d{1,2}|01-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))+\s+(?:MON|TUE|WED|THU|ﺟﻤﻌﮧ|SAT|SUN)\s(?:\d{1,2}|1-Ram)+(?:\s+\d{1,2}:\d{2}){11}'
            
            table = re.findall(row_pattern, page_text)
            table_data_per_month = []
            final_data_per_month = []
            for row in table:
                row_data = row.split()
                table_data_per_month.append(row_data)
            for row in table_data_per_month:
                 if (page_num == 3 or page_num == 4 or page_num == 5):
                     obj ={
                    'Fajr' : row[4],
                    'Duhar':row[7],
                    'Asar':row[9],
                    'Maghrib': row[11],
                    'Isha': row[13]
                    }
                     final_data_per_month.append(obj)
                 else:
                     obj ={
                    'Fajr' : row[3],
                    'Duhar':row[6],
                    'Asar':row[8],
                    'Maghrib': row[10],
                    'Isha': row[12]
                    }
                     final_data_per_month.append(obj)
            print(final_data_per_month)
            final_data.append(final_data_per_month)
    return final_data

