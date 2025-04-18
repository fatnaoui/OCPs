from typing import Any

from tools.complexe import (generate_from_omni_for_multiple_image,
                            clean_json
                            )
                            
import os
from dotenv import load_dotenv
load_dotenv()
from tqdm import tqdm
import time
from PIL import Image

def resume_extraction(image_data,output_data,model,tokenizer,prompt_file,doc_type, image_example, image_output_example):
    '''Here, we are assuming that data 'resumes' is already converted to images,
    And we're gonna extract all the infromation in condidate's resume, and
    store it as json file to work with it later'''

    if not os.path.exists(output_data):
        os.mkdir(output_data)

    if not os.path.isdir(image_data):
        raise ValueError(f"Invalid directory path: {image_data}")

    with open(prompt_file,'r') as f:
        prompt = f.read()

    candidates = [c for c in os.listdir(image_data) if not c.startswith(".")]

    try:
        with Image.open(image_example) as img:
            image_example = img.convert('L')
        with open(image_output_example,'r') as f:
            image_output_example = f.read()
    except Exception as e:
        print(f"{e}")

    for candidate in tqdm(candidates, desc=f"Processing {doc_type}", unit=doc_type):
        candidate_path = os.path.join(image_data,candidate)

        # Validate candidate path
        if not os.path.isdir(candidate_path):
            continue

        # Get all resume pages (filter hidden files)
        candidate_cv_pages = [
            os.path.join(candidate_path, page)
            for page in os.listdir(candidate_path)
            if not page.startswith(".")
        ]
        condidate_output_path = os.path.join(output_data,f"{candidate}.json")

        try:
            ress: str = generate_from_omni_for_multiple_image(model,tokenizer,prompt,candidate_cv_pages,image_example,image_output_example=image_output_example)
            res: str = clean_json(ress)
            with open(condidate_output_path,'w') as f:
                f.write(res)
                
        except Exception as e:
            print(f"Error processing {candidate}: {e}")
            continue
    
    print("You extracted data is ready to analyse")

