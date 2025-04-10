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

from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Candidate(BaseModel):
  full_name: str

class Candidates(BaseModel):
  candidates: List[Candidate]

memory_db = {"candidates": []}

@app.get("/candidates") #,response_model=Candidates)
def get_candidates():
  return Candidates(candidates=memory_db["candidates"])

@app.post("/candidate",response_model=Candidate)
def add_candidate(candidate: Candidate):
  memory_db["candidates"].append(candidate)
  return candidate

# Validate required environment variables
try:
    validate_env_vars("INPUT_RESUME", "IMAGE_RESUME", "OUTPUT_RESUME",
          "INPUT_OFFER", "IMAGE_OFFER", "OUTPUT_OFFER",
          "RESUME_EXTRACTION_PROMPT", "OFFER_EXTRACTION_PROMPT")
except Exception as e:
  raise Exception(f"Missing required env vars: {e}")

@app.get("/")
def welcome():
    return {"message": "Welcome to OCP Resume & Offer Processing, Friendo"}

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

  
        
  


 
  



  



