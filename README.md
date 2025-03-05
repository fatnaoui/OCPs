python version: Python 3.12.6
start by installing this: pip install torch transformers accelerate sentencepiece
sentencepeiece issue: sudo apt update
                      sudo apt install cmake pkg-config

Create a token from hugging face if it is your first time dealing with models from it, and try to log in using huggingface-cli login

"I encountered a similar error but was able to resolve it by referring to the Hugging Face documentation.

Initially, access the Hugging Face hub via the notebook by executing the following commands:
!pip install huggingface_hub

huggingface-cli download --local-dir ./models/MiniCPM_o_2_6 openbmb/MiniCPM-o-2_6
huggingface-cli download --local-dir ./models/smolvl HuggingFaceTB/SmolVLM-Instruct
huggingface-cli download --local-dir ./models/smolvl2 HuggingFaceTB/SmolVLM-256M-Instruct

Pdf2image it won't work without excuting this command
sudo apt update
sudo apt install poppler-utils

To use subprocess (which convert a docx to pdf): sudo apt install libreoffice

