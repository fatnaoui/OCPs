import torch
from sklearn.metrics.pairwise import cosine_similarity

def sentence_embedding(sentence_json, model, tokenizer):
    with open(sentence_json,'r') as f:
        sentence = f.read()
        
    text_encoding = tokenizer.batch_encode_plus(
        [sentence],
        padding=True,
        truncation=True,
        return_tensors='pt',
        add_special_tokens=True
    )
    input_ids = text_encoding['input_ids']
    attention_mask = text_encoding['attention_mask']

  # Generate embeddings for the example sentence
    with torch.no_grad():
        outputs = model(input_ids, attention_mask=attention_mask)
        sentence_embedding = outputs.last_hidden_state.mean(dim=1)

    return sentence_embedding

def cosine(sentence_embedding1, sentence_embedding2):
    similarity_score = cosine_similarity(sentence_embedding1, sentence_embedding2)

    return similarity_score[0][0]
