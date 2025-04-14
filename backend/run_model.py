from turtle import up
from sympy.functions.elementary.piecewise import ExprCondPair
from tools import ( doc_to_image, 
                    resume_extraction,
                    download_omni,
                    validate_env_vars,
                    similarity_with_bert,
                    similarity_with_sbert,
                    clean_json
                    )
import os
from dotenv import load_dotenv
load_dotenv()
import time
import warnings
warnings.simplefilter("ignore", FutureWarning)

def run(model,tokenizer):  
    
    # Converting all DOCs to Images and Store them 
    conversions = [
            ("Resume", os.getenv("INPUT_RESUME"), os.getenv("IMAGE_RESUME")),
            ("Offer", os.getenv("INPUT_OFFER"), os.getenv("IMAGE_OFFER"))
        ]
    for doc_type, input_path, image_path in conversions:
        try:
            print(f"Converting {doc_type} documents to images ...")
            doc_to_image(input_path, image_path)
            print(f"{doc_type} to Image conversion done")
        except Exception as e:
            print(f"Error while trying to convert {doc_type} documents to images: {e}")
            return

    # Information Extraction 
    extractions = [
            ("Resume", os.getenv("IMAGE_RESUME"), os.getenv("OUTPUT_RESUME"), os.getenv("RESUME_EXTRACTION_PROMPT"), os.getenv("RESUME_EXAMPLE"), os.getenv("RESUME_EXAMPLE_OUTPUT")),
            ("Offer", os.getenv("IMAGE_OFFER"), os.getenv("OUTPUT_OFFER"), os.getenv("OFFER_EXTRACTION_PROMPT"), os.getenv("OFFER_EXAMPLE"), os.getenv("OFFER_EXAMPLE_OUTPUT"))
        ]
    for doc_type, image_path, output_path, prompt, image_example, image_output_example  in extractions:
      try:
        print(f"{doc_type} is being extracted")
        resume_extraction(image_path,output_path,model,tokenizer,prompt,doc_type, image_example, image_output_example)
        print(f"{doc_type} was extracted")
      except Exception as e:
        print(f"Error while trying to extract {doc_type} information {e}")
        return

    similarity = similarity_with_sbert()
    return similarity

    


