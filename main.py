from tools import doc_to_image, download_omni
from PIL import Image

# input_dir = "./data" # where out data is stored
# output_dir = "./converted_data" # where we are gonna store our data

# doc_to_image(input_dir,output_dir)

model, tokenizer = download_omni(exist=False)

# test.py
image = Image.open('./converted_data/CV Billal Benboubker/CV Billal Benboubker_0.jpg').convert('RGB')
question = 'What is in the image?'
msgs = [{'role': 'user', 'content': [image, question]}]
res = model.chat(
    image=None,
    msgs=msgs,
    tokenizer=tokenizer
)
print(res)