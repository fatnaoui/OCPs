from tools import ( extract_text_from_pdf, 
                    extract_text_from_pdf_and_create_file,
                    doc_to_image )

input_dir = "./data" # where out data is stored
output_dir = "./converted_data" # where we are gonna store our data

# pdf_path = "Hamza_Fatnaoui_CV.pdf"
# text_dir = "converted_text"
# name_condidat = "Hamza_Fatnaoui"

doc_to_image(input_dir,output_dir)



