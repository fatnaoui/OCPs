import pdfplumber

# pdf to text converter
def extract_text_from_pdf(pdf_path):
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
        return text
    except Exception as e:
        print(e)

# pdf to text converter and create file text
def extract_text_from_pdf_and_create_file(pdf_path,text_dir,name_condidat):
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
    except Exception as e:
        print(e)

    with open(f"{text_dir}/{name_condidat}.txt",'w') as f:
        f.write(text)

if __name__=='__main__':
    print("This is a python script that convert pdf documents into text")


