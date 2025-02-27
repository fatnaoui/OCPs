from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "mistralai/Mistral-7B"

# Download only
AutoTokenizer.from_pretrained(model_name)
AutoModelForCausalLM.from_pretrained(model_name, cache_dir="./mistral-7b")