from tools import ( doc_to_image, 
                    download_omni, 
                    download_smolvl,
                    generate_from_omni,
                    generate_from_omni_for_multiple_image
                    )
import time

import warnings
warnings.simplefilter("ignore", FutureWarning)

input_dir = "./data/input_data" # where input data is stored
image_dir = "./data/image_data" # where we are gonna store our images data
output_dir = "./data/output_data" # where output data from the model is stored

# doc_to_image(input_dir,output_dir)

omni_model , omni_tokenizer = download_omni()
# smolvl_model, smolvl_processor = download_smolvl()

image = "./data/image_data/Hamza_Fatnaoui_CV/Hamza_Fatnaoui_CV_0.jpg"
images = ["./data/image_data/Hamza_Fatnaoui_CV/Hamza_Fatnaoui_CV_0 copy.jpg",
          "./data/image_data/Hamza_Fatnaoui_CV/Hamza_Fatnaoui_CV_0.jpg"]
# image1 = "./converted_data/Academic___Taha_Bouhsine/Academic___Taha_Bouhsine_0.jpg"
# # image2 = "./converted_data/Academic___Taha_Bouhsine/Academic___Taha_Bouhsine_1.jpg"

prompt = """Extract the skills, experience, and years of experience from the candidate's resume.

Return the output **only** as a valid JSON dictionary, without any extra text, explanations, or formatting such as triple backticks.

Ensure that the response is a **raw JSON object** that can be directly parsed in Python.

Format:
{
  "skills": ["List of relevant skills"],
  "experience": ["List of relevant experiences (don't miss responsibilities)"]
}
"""

print("It starts")

# start = time.time()
# res = generate_from_omni(omni_model,omni_tokenizer,prompt,image)
# end = time.time()

start = time.time()
res = generate_from_omni_for_multiple_image(omni_model,omni_tokenizer,prompt,images)
end = time.time()

latency = end - start
print(f"Latency time is: {latency}")   # Latency time is: 145.90626096725464
# # res = generate_from_smolvl(smolvl_model,smolvl_processor,prompt,image)

with open('twoImage.json','w') as f:
    f.write(res)

print("You Done Here")




