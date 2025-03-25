from tools.complexe import (download_bert,
                            sentence_embedding,
                            cosine,
                            extract_skills_and_description
                            )

from sentence_transformers import SentenceTransformer
import os

offer_json = os.getenv("OUTPUT_OFFER", "./data_offer/output_data")
condidate_json = os.getenv("OUTPUT_RESUME", "./data_resume/output_data")
if not os.path.exists(offer_json):
    os.mkdir(path=offer_json)

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
            print(f"The score for the candidate {candidate_name} in {offer_name} offer is {score:.2f}")

def similarity_with_sbert():

    model = SentenceTransformer("all-MiniLM-L6-v2")

    for offer in os.listdir(offer_json):
        if offer.startswith("."):
            continue
        offer_path = os.path.join(os.getenv("OUTPUT_OFFER","./data_offer/output_data"),offer)
        offer_name = os.path.splitext(offer)[0]
        extracted_offer_data = extract_skills_and_description(offer_path)

        experience_offer_embeddings = model.encode(extracted_offer_data["experience"])
        print(experience_offer_embeddings.shape)

        for candidate in os.listdir(condidate_json):
            if candidate.startswith("."):
                continue
            candidate_path = os.path.join(os.getenv("OUTPUT_RESUME","./data_resume/output_data"),candidate)
            candidate_name = os.path.splitext(candidate)[0]
            extracted_resume_data = extract_skills_and_description(candidate_path)

            experience_resume_embeddings = model.encode(extracted_resume_data["experience"])
            print(experience_resume_embeddings.shape)
            
            # Experience similarity using SBERT
            experience_similarities = model.similarity(experience_offer_embeddings, experience_resume_embeddings)
            max_experience_similarities, _  = experience_similarities.max(dim=1)
            expereince_similarity = max_experience_similarities.mean().item()

            # Skills similarity using lexical score
            skills_similarity = skills_score(extracted_offer_data["skills"],extracted_resume_data["skills"])
            
            # Over all similarity
            similarity = (expereince_similarity + skills_similarity) / 2

            print(f"The score for the candidate {candidate_name} in {offer_name} offer is {similarity:.2f}")

            
def skills_score(offer_skills,candidate_skills):
    score = 0
    for offer_skill in offer_skills:
        if offer_skill in candidate_skills:
            score +=1
    score /= len(offer_skills)

    return score

    

        

