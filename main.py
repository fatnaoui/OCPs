from tools import ( doc_to_image, 
                    download_omni, 
                    download_smolvl,
                    generate_from_omni,
                    generate_from_smolvl,
                    )

import warnings
warnings.simplefilter("ignore", FutureWarning)

# input_dir = "./data" # where out data is stored
# output_dir = "./converted_data" # where we are gonna store our data

# doc_to_image(input_dir,output_dir)

omni_model , omni_tokenizer = download_omni()
# smolvl_model, smolvl_processor = download_smolvl()

image = "./converted_data/Hamza_Fatnaoui_CV/Hamza_Fatnaoui_CV_0.jpg"
# image1 = "./converted_data/Academic___Taha_Bouhsine/Academic___Taha_Bouhsine_0.jpg"
# # image2 = "./converted_data/Academic___Taha_Bouhsine/Academic___Taha_Bouhsine_1.jpg"

prompt = "Extract the skills and the experience from the condidat's resume, in dictionary form so i can load it as json"

res = generate_from_omni(omni_model,omni_tokenizer,image,prompt)
# res = generate_from_smolvl(smolvl_model,smolvl_processor,image,prompt)


print(res)




