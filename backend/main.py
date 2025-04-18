from turtle import up
from sympy.functions.elementary.piecewise import ExprCondPair
import run_model
import os
from dotenv import load_dotenv
load_dotenv()
import time
import warnings
warnings.simplefilter("ignore", FutureWarning)

from fastapi import FastAPI, UploadFile, File, Form
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List

from tools import ( doc_to_image, 
                    resume_extraction,
                    download_omni,
                    validate_env_vars,
                    similarity_with_bert,
                    similarity_with_sbert,
                    clean_json,
                    )

# Load the Model from the Cache
try:
  print("The model is being loaded ...")
  model , tokenizer = download_omni()
  print("The Model was Loaded")
except Exception as e:
  print(f"Error while trying to load the model {e}")

# Create necessary directories if they don't exist
for dir_path in [
    "./data_resume/input_data", 
    "./data_resume/image_data", 
    "./data_resume/output_data",
    "./data_offer/input_data", 
    "./data_offer/image_data", 
    "./data_offer/output_data"
]:
    os.makedirs(dir_path, exist_ok=True)
    print(f"Created directory: {dir_path}")

app = FastAPI()

origins = ["*","http://localhost:3000","https://5173-01jn2a4rdakmhm1hazd2318er7.cloudspaces.litng.ai"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Offer(BaseModel):
  offer_filename: str
  cv_filenames: List[str]

class Offers(BaseModel):
  offers: List[Offer]

memory_db = {"offers": []}

# === GET all offers ===
@app.get("/offers", response_model=Offers)
def get_offers():
    return Offers(offers=memory_db["offers"])

# === POST: Add one offer + multiple CVs ===
@app.post("/", response_model=Offer)
async def add_candidates(
    offer: UploadFile = File(...),
    cvs: List[UploadFile] = File(...)
):
    input_resume = os.getenv("INPUT_RESUME", "./data_resume/input_data")
    input_offer = os.getenv("INPUT_OFFER", "./data_offer/input_data")

    os.makedirs(input_resume, exist_ok=True)
    os.makedirs(input_offer, exist_ok=True)

    # Save job offer
    path_offer = os.path.join(input_offer, offer.filename)
    with open(path_offer, "wb") as f:
        f.write(await offer.read())

    # Save CVs
    uploaded_cv_names = []
    for cv in cvs:
        cv_filename = os.path.basename(cv.filename) 
        path_resume = os.path.join(input_resume, cv_filename)
        with open(path_resume, "wb") as f:
            f.write(await cv.read())
        uploaded_cv_names.append(cv.filename)

    # Save in memory DB
    offer_record = {
        "offer_filename": offer.filename,
        "cv_filenames": uploaded_cv_names
    }
    memory_db["offers"].append(offer_record)

    # Return as response
    return Offer(**offer_record)

# Validate required environment variables
try:
    validate_env_vars("INPUT_RESUME", "IMAGE_RESUME", "OUTPUT_RESUME",
          "INPUT_OFFER", "IMAGE_OFFER", "OUTPUT_OFFER",
          "RESUME_EXTRACTION_PROMPT", "OFFER_EXTRACTION_PROMPT")
except Exception as e:
  raise Exception(f"Missing required env vars: {e}")

@app.get("/scores")
async def scores():
  # res = run(model,tokenizer)
  time.sleep(10)
  res = [{
            "candidate_name": "primo",
            "score":50.45,
            "data":{"skills": ["java","C++"],
            "experience": ["i know java"]}
        },
        {
            "candidate_name": "Hamza Fatnaoui",
            "score":70.50,
            "data": {"skills": ["python","C++"],
            "experience": ["i know python"]}
        }
            ]
  return res

# def main():

#   # Converting all DOCs to Images and Store them 
#   conversions = [
#           ("Resume", os.getenv("INPUT_RESUME"), os.getenv("IMAGE_RESUME")),
#           ("Offer", os.getenv("INPUT_OFFER"), os.getenv("IMAGE_OFFER"))
#       ]
#   for doc_type, input_path, image_path in conversions:
#     try:
#         print(f"Converting {doc_type} documents to images ...")
#         doc_to_image(input_path, image_path)
#         print(f"{doc_type} to Image conversion done")
#     except Exception as e:
#         print(f"Error while trying to convert {doc_type} documents to images: {e}")
#         return

#   choice = input("Hello Ms, type 'y' if you wanna work with the local model, and 'n' if not: ").strip().lower()

#   while choice not in ('y','n'):
#     choice = input("You enterd a different character, try again: ").strip().lower()

#   if choice == 'y':

#     # Load the Model from the Cache
#     try:
#       print("The model is being loaded ...")
#       model , tokenizer = download_omni()
#       print("The Model was Loaded")
#     except Exception as e:
#       print(f"Error while trying to load the model {e}")
#       return 

#     # Information Extraction 
#     extractions = [
#             ("Resume", os.getenv("IMAGE_RESUME"), os.getenv("OUTPUT_RESUME"), os.getenv("RESUME_EXTRACTION_PROMPT"), os.getenv("RESUME_EXAMPLE"), os.getenv("RESUME_EXAMPLE_OUTPUT")),
#             ("Offer", os.getenv("IMAGE_OFFER"), os.getenv("OUTPUT_OFFER"), os.getenv("OFFER_EXTRACTION_PROMPT"), os.getenv("OFFER_EXAMPLE"), os.getenv("OFFER_EXAMPLE_OUTPUT"))
#         ]
#     for doc_type, image_path, output_path, prompt, image_example, image_output_example  in extractions:
#       try:
#         print(f"{doc_type} is being extracted")
#         resume_extraction(image_path,output_path,model,tokenizer,prompt,doc_type, image_example, image_output_example)
#         print(f"{doc_type} was extracted")
#       except Exception as e:
#         print(f"Error while trying to extract {doc_type} information {e}")
#         return 

#     print("You Done Extracting Information")

#   else:
#     print("API part will be available soon")

#   choice = input("To get the score, choose a method: 'b' for using BERT, and 's' for using SBERT: ").strip().lower()

#   while choice not in ('b','s'):
#     choice = input("You enterd a different character, try again: ").strip().lower()

#   # print("Similarity using BESRT")
#   # similarity_with_bert()
#   # print()
#   print("similarity_with_sbert")
#   similarity_with_sbert()

# if __name__=='__main__':
#   pass
#   # main()

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



 
  



  



