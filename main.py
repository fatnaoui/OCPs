from tools import extract_text_from_pdf, extract_text_from_pdf_and_create_file

pdf_path = "Hamza_Fatnaoui_CV.pdf"
text_dir = "converted_text"
name_condidat = "Hamza_Fatnaoui"

# extract_text_from_pdf_and_create_file(pdf_path,text_dir,name_condidat)

# I worked with Gemma "google/gemma-2-2b-it"
cache_dir = "./gemma_2_2b"

from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig

quantization_config = BitsAndBytesConfig(load_in_8bit=True)

tokenizer = AutoTokenizer.from_pretrained("google/gemma-2-2b-it")
model = AutoModelForCausalLM.from_pretrained(
    "google/gemma-2-2b-it",
    quantization_config=quantization_config,
    cache_dir = "./gemma_2_2b"
)

# input_text = "Write me a poem about Machine Learning."
# input_ids = tokenizer(input_text, return_tensors="pt").to("cuda")

# outputs = model.generate(**input_ids, max_new_tokens=32)
# print(tokenizer.decode(outputs[0]))