from tools import ( doc_to_image, 
                    download_omni, 
                    download_smolvl,
                    generate_from_omni,
                    generate_from_smolvl,
                    )

import warnings
warnings.simplefilter("ignore", FutureWarning)

input_dir = "./data/input_data" # where input data is stored
image_dir = "./data/image_data" # where we are gonna store our images data
output_dir = "./data/output_data" # where output data from the model is stored

# doc_to_image(input_dir,output_dir)

omni_model , omni_tokenizer = download_omni()
# smolvl_model, smolvl_processor = download_smolvl()

image = "./data/image_data/Hamza_Fatnaoui_CV/Hamza_Fatnaoui_CV_0.jpg"
# image1 = "./converted_data/Academic___Taha_Bouhsine/Academic___Taha_Bouhsine_0.jpg"
# # image2 = "./converted_data/Academic___Taha_Bouhsine/Academic___Taha_Bouhsine_1.jpg"

prompt = """Extract the skills, experience and year of experience from the candidate's resume.
Return the output **only** as a valid JSON dictionary, without any extra text or explanations.

Format:
{
  "skills": ["List of relevant skills"],
  "experience": ["List of relevant experiences"]
}

Ensure the output is **valid JSON** so it can be loaded directly into Python as a dictionary."""


res = generate_from_omni(omni_model,omni_tokenizer,image,prompt)
# # res = generate_from_smolvl(smolvl_model,smolvl_processor,image,prompt)

with open('a.json','w') as f:
    f.write(res)





