from PIL import Image
import torch

device = "cuda" if torch.cuda.is_available() else "cpu"

def generate_from_omni(model,tokenizer,image,prompt):
    image = Image.open(image).convert('RGB')
    msgs = [{'role': 'user', 'content': [image, prompt]}]
    res = model.chat(
        image=None,
        msgs=msgs,
        tokenizer=tokenizer
    )
    return res

def generate_from_smolvl(model,processor,image,prompt):
    image = Image.open(image).convert('RGB')
    messages = [
    {
        "role": "user",
        "content": [
            {"type": "image"},
            #{"type": "image"},
            {"type": "text", "text": prompt}
        ]
    },
]

    # Prepare inputs
    prompt = processor.apply_chat_template(messages, add_generation_prompt=True)
    inputs = processor(text=prompt, images=[image], return_tensors="pt")
    inputs = inputs.to(device)

    # Generate outputs
    generated_ids = model.generate(**inputs, max_new_tokens=500)
    generated_texts = processor.batch_decode(
        generated_ids,
        skip_special_tokens=True,
    )

    return generated_texts[0]