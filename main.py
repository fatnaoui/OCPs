from tools import ( doc_to_image, 
                    resume_extraction,
                    download_omni,
                    )
import time
import warnings
warnings.simplefilter("ignore", FutureWarning)

# Handling The Flow of the Data
input_dir = "./data/input_data" # where input data is stored
image_dir = "./data/image_data" # where we are gonna store our images data
output_dir = "./data/output_data" # where output data from the model is stored

# Handling the Prompts
resume_extraction_prompt = "./prompts/resume_extraction_prompt.txt"

def main():
  choice = input("Hello Ms, type 'y' if you wanna work with the local model, and 'n' if not: ")

  while choice != 'y' and choice != 'n' :
    choice = input("you enterd a different character, try again: ")

  if choice == 'y':

    # Load the Model from the Cache
    try:
      print("The model is being loaded ...")
      model , tokenizer = download_omni()
      print("The Model was Loaded")
    except Exception as e:
      print(f"Error while trying to load the model {e}")
      return 

    # Converting all Resumes to Images and Store them 
    try:
      print("Converting from docs to images ...")
      doc_to_image(input_dir,image_dir)
      print("Doc to Image Done")
    except Exception as e:
      print(f"Error while trying to convert documents to images {e}")
      return 

    try:
      print("Information is being extracted")
      resume_extraction(image_dir,output_dir,model,tokenizer,resume_extraction_prompt)
      print(f"Done, Visit {output_dir} to see your extracted information")
    except Exception as e:
      print(f"Error while trying to extract information {e}")
      return 

    print("You Done")

  else:
    print("API part will be available soon")

if __name__=='__main__':
  main()
  



  



