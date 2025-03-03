from pdf2image import convert_from_path
import os

def doc_to_image(input_dir,output_dir):

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
       
    for filename in os.listdir(input_dir):
        if filename.endswith(".pdf") or filename.endswith(".docx"):
            condidatname = os.path.splitext(filename)[0]
            file_input_path = os.path.join(input_dir,filename)
            output_path = os.path.join(output_dir,condidatname)
            os.makedirs(output_path)
        else:
            raise Exception("Extension doesn't match a 'pdf' or a 'docx'")

        try: 
            images = convert_from_path(file_input_path)
            for i, img in enumerate(images):
                img_path = os.path.join(output_path,f"{condidatname}_{i}.jpg")
                img.save(img_path, 'JPEG')
            print(f"✅ Converted {filename} to images successfully!")
        except Exception as e:
            print(f"❌ Error converting {filename}: {e}")


