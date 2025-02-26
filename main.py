from tools import extract_text_from_pdf, extract_text_from_pdf_and_create_file

pdf_path = "Hamza_Fatnaoui_CV.pdf"
text_dir = "converted_text"
name_condidat = "Hamza_Fatnaoui"

extract_text_from_pdf_and_create_file(pdf_path,text_dir,name_condidat)