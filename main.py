from tools import extract_text_from_pdf, extract_text_from_pdf_and_create_file

pdf_path = "Hamza_Fatnaoui_CV.pdf"
text_dir = "converted_text"
name_condidat = "Hamza_Fatnaoui"

# extract_text_from_pdf_and_create_file(pdf_path,text_dir,name_condidat)
from transformers import AutoModelForCausalLM, AutoTokenizer

model_id = "mistralai/Mistral-7B-v0.1"
tokenizer = AutoTokenizer.from_pretrained(model_id)

model = AutoModelForCausalLM.from_pretrained(model_id)

text = "Hello my name is"
inputs = tokenizer(text, return_tensors="pt")

outputs = model.generate(**inputs, max_new_tokens=20)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))