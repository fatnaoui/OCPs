from pdf2image import convert_from_path
import os
from tqdm import tqdm
import tempfile; import subprocess; import glob
from multiprocessing import Pool, cpu_count
from functools import partial

# pdf to image
def pdf_to_image(file_input_path,output_path,condidatname,filename):
    try:
        images = convert_from_path(file_input_path)
        for i, img in enumerate(images):
            img_path = os.path.join(output_path,f"{condidatname}_{i}.jpg")
            img.save(img_path, 'JPEG')
    except Exception as e:
        print(f"Error converting {filename} to images: {e}")

# docs to image
def docx_to_image(file_input_path,output_path,condidatname,filename):
    with tempfile.TemporaryDirectory() as temp_dir:
        try:
            subprocess.run(["libreoffice", "--headless", "--convert-to", "pdf", file_input_path, "--outdir", temp_dir], check=True)  
        except Exception as e:
            print(f"Error converting {filename} to PDF: {e}")
            return
        
        # Ensure the temp PDF exists
        pdf_files = glob.glob(os.path.join(temp_dir, "*.pdf"))
        if not pdf_files:
            print(f"Failed to convert {filename} to PDF.")
            return
        
        temp_pdf_path = pdf_files[0] 
        # Convert PDF to images
        pdf_to_image(temp_pdf_path,output_path,condidatname,filename)

def process_single_file(input_dir, output_dir, filename):
    if not filename.endswith((".pdf", ".docx")):
        return

    condidatname = os.path.splitext(filename)[0]
    file_input_path = os.path.join(input_dir, filename)
    output_path = os.path.join(output_dir, condidatname)

    if os.path.exists(output_path):
        return

    os.makedirs(output_path, exist_ok=True)

    if filename.endswith(".docx"):
        docx_to_image(file_input_path, output_path, condidatname, filename)
    else:
        pdf_to_image(file_input_path, output_path, condidatname, filename)


def doc_to_image(input_dir,output_dir):

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
       
    condidats_list = sorted(os.listdir(input_dir),reverse=True)

    worker_func = partial(process_single_file, input_dir, output_dir)

    # Use multiprocessing Pool
    with Pool(cpu_count()) as pool:
        list(tqdm(pool.imap_unordered(worker_func, condidats_list), 
                  total=len(condidats_list), 
                  desc="Processing DOCs", 
                  unit="file"))
        




