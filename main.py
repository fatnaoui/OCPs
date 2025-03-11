from tools import ( doc_to_image, 
                    resume_extraction,
                    download_omni,
                    validate_env_vars,
                    download_bert,
                    sentence_embedding,
                    cosine
                    )
import os
from dotenv import load_dotenv
load_dotenv()
import time
import warnings
warnings.simplefilter("ignore", FutureWarning)



def main():
  choice = input("Hello Ms, type 'y' if you wanna work with the local model, and 'n' if not: ").strip().lower()

  while choice not in ('y','n'):
    choice = input("You enterd a different character, try again: ").strip().lower()

  if choice == 'y':
    
    # Validate required environment variables
    try:
        validate_env_vars("INPUT_RESUME", "IMAGE_RESUME", "OUTPUT_RESUME",
              "INPUT_OFFER", "IMAGE_OFFER", "OUTPUT_OFFER",
              "RESUME_EXTRACTION_PROMPT", "OFFER_EXTRACTION_PROMPT")
    except ValueError as e:
        print(f"{e}")
        return

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

    # Load the Model from the Cache
    # try:
    #   print("The model is being loaded ...")
    #   model , tokenizer = download_omni()
    #   print("The Model was Loaded")
    # except Exception as e:
    #   print(f"Error while trying to load the model {e}")
    #   return 

    # Information Extraction 
    extractions = [
            ("Resume", os.getenv("IMAGE_RESUME"), os.getenv("OUTPUT_RESUME"), os.getenv("RESUME_EXTRACTION_PROMPT")),
            ("Offer", os.getenv("IMAGE_OFFER"), os.getenv("OUTPUT_OFFER"), os.getenv("OFFER_EXTRACTION_PROMPT"))
        ]
    # for doc_type, image_path, output_path, prompt in extractions:
    #   try:
    #     print(f"{doc_type} is being extracted")
    #     resume_extraction(image_path,output_path,model,tokenizer,prompt)
    #     print(f"{doc_type} was extracted")
    #   except Exception as e:
    #     print(f"Error while trying to extract {doc_type} information {e}")
    #     return 

    print("You Done")

  else:
    print("API part will be available soon")

if __name__=='__main__':
  #main()

  model, tokenizer = download_bert()
  sentence = sentence_embedding("hello All, I am the king", model, tokenizer)
  print(sentence[0][:6])
  



  



