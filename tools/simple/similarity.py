from tools.complexe import download_bert
from tools.complexe import sentence_embedding
from tools.complexe import cosine

import os

offer_json = os.getenv("OUTPUT_OFFER", "./data_offer/output_data")
condidate_json = os.getenv("OUTPUT_RESUME", "./data_resume/output_data")
if not os.path.exists(offer_json):
    os.mkdir(offer_json)

def similarity_with_bert():
    bert_model, bert_tokenizer = download_bert()

    for offer in os.listdir(offer_json):
        if offer.startswith("."):
            continue
        offer_path = os.path.join(os.getenv("OUTPUT_OFFER","./data_offer/output_data"),offer)
        offer_name = os.path.splitext(offer)[0]
        offer_embedding = sentence_embedding(offer_path, bert_model, bert_tokenizer)

        for candidate in os.listdir(condidate_json):
            if candidate.startswith("."):
                continue
            candidate_path = os.path.join(os.getenv("OUTPUT_RESUME","./data_resume/output_data"),candidate)
            candidate_name = os.path.splitext(candidate)[0]
            candidate_mbedding = sentence_embedding(candidate_path,bert_model, bert_tokenizer)
            score = cosine(offer_embedding,candidate_mbedding)
            print(f"The score of {candidate_name} for the offer {offer_name}: {score:.2f}")

def similarity_with_sbert():
    pass

        

