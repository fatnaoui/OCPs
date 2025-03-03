import torch
from PIL import Image
from transformers import AutoModel, AutoTokenizer

cache_dir = "./models/MiniCPM_o_2_6"

def download_omni(exist=True):
    if exist:
        model = AutoModel.from_pretrained(
            cache_dir,
            trust_remote_code=True,
            attn_implementation='sdpa', # sdpa or flash_attention_2
            torch_dtype=torch.bfloat16,
            init_vision=True,
            init_audio=False,
            init_tts=False,
            )
        tokenizer = AutoTokenizer.from_pretrained(cache_dir, trust_remote_code=True)
        return model, tokenizer

    model = AutoModel.from_pretrained(
        'openbmb/MiniCPM-o-2_6',
        trust_remote_code=True,
        attn_implementation='sdpa', # sdpa or flash_attention_2
        torch_dtype=torch.bfloat16,
        init_vision=True,
        init_audio=False,
        init_tts=False,
        cache_dir=cache_dir
    )

    tokenizer = AutoTokenizer.from_pretrained('openbmb/MiniCPM-o-2_6', trust_remote_code=True,cache_dir=cache_dir)