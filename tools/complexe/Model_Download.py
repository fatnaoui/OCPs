import torch
from transformers import AutoModel, AutoTokenizer
from transformers import AutoProcessor, AutoModelForVision2Seq

device = "cuda" if torch.cuda.is_available() else "cpu"

def download_omni():

    # Load the model with 4-bit precision
    model = AutoModel.from_pretrained(
        "openbmb/MiniCPM-o-2_6",
        trust_remote_code=True,
        attn_implementation="sdpa", 
        init_vision=True,
        init_audio=False,
        init_tts=False,
    ).to(device)
    tokenizer = AutoTokenizer.from_pretrained('openbmb/MiniCPM-o-2_6',trust_remote_code=True)
    
    return model, tokenizer

def download_smolvl():
    processor = AutoProcessor.from_pretrained("HuggingFaceTB/SmolVLM-Instruct",trust_remote_code=True) 
    model = AutoModelForVision2Seq.from_pretrained(
        "HuggingFaceTB/SmolVLM-Instruct",
        torch_dtype=torch.bfloat16,
        _attn_implementation="flash_attention_2" if device == "cuda" else "eager",
        trust_remote_code=True
        ).to(device)

    return model, processor


