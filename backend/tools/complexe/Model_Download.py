import torch
import random
from transformers import AutoModel, AutoTokenizer
from transformers import BertTokenizer, BertModel

device = "cuda" if torch.cuda.is_available() else "cpu"

random.seed(42)
torch.manual_seed(42)
if torch.cuda.is_available():
    torch.cuda.manual_seed_all(42)

def download_omni():

    # Load the model with 4-bit precision
    model = AutoModel.from_pretrained(
        "openbmb/MiniCPM-o-2_6",
        trust_remote_code=True,
        attn_implementation="sdpa",
        torch_dtype=torch.bfloat16,
        init_vision=True,
        init_audio=False,
        init_tts=False,
    ).eval().to(device)

    tokenizer = AutoTokenizer.from_pretrained('openbmb/MiniCPM-o-2_6',trust_remote_code=True)
    
    return model, tokenizer

def download_bert():
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    model = BertModel.from_pretrained('bert-base-uncased')

    return model, tokenizer


