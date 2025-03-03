from pdf2image import convert_from_path
import os

def doc_to_image(input_dir,output_dir):

    if not os.path.exists(output_dir):
        os.mkdir(output_dir)
       
    for filename in os.listdir(input_dir):
        if filename.endswith(".pdf") or filename.endswith(".docx"):
            file_input_path = os.path.join(input_dir,filename)
            output_path = os.path.join(output_dir,f"{os.path.splitext(filename)[0]}")
        else:
            raise Exception("Extension doesn't match a 'pdf' or a 'docx'")

        try: 
            images = convert_from_path(file_input_path)
            for i, img in enumerate(images):
                img_path = f"{os.path.join(output_path,f"{os.path.splitext(filename)[0]}")}_{i}.jpg"
                img.save(img_path, 'JPEG')
        except Exception as e:
            print(f'Error converting {pdf_path}: {e}')


