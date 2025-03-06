from tools import ( doc_to_image, 
                    download_omni, 
                    download_smolvl,
                    generate_from_omni,
                    generate_from_omni_for_multiple_image
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

# Converting all Resumes to Images and Store them 
# doc_to_image(input_dir,output_dir)

# Load the Model from the Cache
omni_model , omni_tokenizer = download_omni()

with open(resume_extraction_prompt,'r') as f:
  prompt = f.read()

print("It starts")

start = time.time()
res = generate_from_omni_for_multiple_image(omni_model,omni_tokenizer,prompt,images)
end = time.time()

latency = end - start
print(f"Latency time is: {latency}")   # Latency time is: 145.90626096725464
# res = generate_from_smolvl(smolvl_model,smolvl_processor,prompt,image)

with open('twoImage.json','w') as f:
    f.write(res)

print("You Done Here")


  



