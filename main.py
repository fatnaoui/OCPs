from tools import (extract_text_from_pdf, 
                    extract_text_from_pdf_and_create_file,
                    )

import torch
from PIL import Image
from transformers import AutoModel, AutoTokenizer


pdf_path = "Hamza_Fatnaoui_CV.pdf"
text_dir = "converted_text"
name_condidat = "Hamza_Fatnaoui"

# I worked with Gemma "google/gemma-2-2b-it"
cache_dir = "models/MiniCPM_o_2_6"

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

model = model.eval().cuda()
tokenizer = AutoTokenizer.from_pretrained('openbmb/MiniCPM-o-2_6', trust_remote_code=True)



