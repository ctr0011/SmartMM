import re
import PyPDF2

def extract_table_data(pdf_file_path):
    final_data = []
    with open(pdf_file_path, 'rb') as f:
        pdf_reader = PyPDF2.PdfReader(f)
        num_pages = len(pdf_reader.pages)
        for page_num in range(num_pages):
            page = pdf_reader.pages[page_num]
            page_text = page.extract_text()
            row_pattern = r'\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+\d{1,2}\d{1,2}:\d{2}\s+\d{1,2}:\d{2}\s+\d{1,2}:\d{2}\s+\d{1,2}:\d{2}\s+\d{1,2}:\d{2}\s+\d{1,2}:\d{2}\s+\d{1,2}:\d{2}\s+\d{1,2}:\d{2}\s+\d{1,2}:\d{2}\s+\d{1,2}:\d{2}\s+\d{1,2}:\d{2}\s+\d{1,2}:\d{2}'
            if (page_num == 11): # change regex for this specific page
                row_pattern = r'\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+\d{1,2}(?::\d{2})?\s+\d{1,2}:\d{2}(?:\s+\d{1,2}:\d{2}){10}\b'
        
            table = re.findall(row_pattern, page_text)
            table_data_per_month = []
            final_data_per_month = []
            for row in table:
                row_data = row.split()
                table_data_per_month.append(row_data)
            for i, row in enumerate(table_data_per_month):
                if (page_num == 11 and i<9):
                     obj ={
                        'Duhar':row[4],
                        'Asar':row[6],
                        'Maghrib': row[9],
                        'Isha': row[11]
                    }
                     if i < 9:
                        obj['Fajr'] = row[1][1:]
                     else:
                        obj['Fajr'] = row[1][2:]

                     final_data_per_month.append(obj)
                elif (page_num == 11 and i >=9):
                    
                    obj ={
                    'Fajr' : row[2],
                    'Duhar':row[5],
                    'Asar':row[7],
                    'Maghrib': row[10],
                    'Isha': row[12]
                }
                    final_data_per_month.append(obj)
            
                else:
                    obj ={
                        'Duhar':row[4],
                        'Asar':row[6],
                        'Maghrib': row[9],
                        'Isha': row[11]
                    }
                    if i < 9:
                        obj['Fajr'] = row[1][1:]
                    else:
                        obj['Fajr'] = row[1][2:]

                    final_data_per_month.append(obj)
            final_data.append(final_data_per_month)

    return final_data
