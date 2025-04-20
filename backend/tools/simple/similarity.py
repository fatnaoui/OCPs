from tools.complexe import (download_bert,
                            sentence_embedding,
                            cosine,
                            extract_skills_and_description
                            )

from sentence_transformers import SentenceTransformer
import os
import numpy as np

offer_json = os.getenv("OUTPUT_OFFER", "./data_offer/output_data")
condidate_json = os.getenv("OUTPUT_RESUME", "./data_resume/output_data")
if not os.path.exists(offer_json):
    os.makedirs(offer_json,exist_ok=True)

def similarity_with_bert():
    res = []
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
            quote = f"The score for the candidate {candidate_name} in {offer_name} offer is {score:.2f}"
            print(quote)
            res.append(quote)

    return res


def similarity_with_sbert():
    res = []
    model = SentenceTransformer("all-MiniLM-L6-v2")

    for offer in os.listdir(offer_json):
        if offer.startswith("."):
            continue
        offer_path = os.path.join(os.getenv("OUTPUT_OFFER","./data_offer/output_data"),offer)
        offer_name = os.path.splitext(offer)[0]
        extracted_offer_data = extract_skills_and_description(offer_path)

        experience_offer_embeddings = model.encode(extracted_offer_data["experience"])
        skills_offer_embeddings = model.encode(extracted_offer_data["combined_skills"])
        exp_skills_offer_embeddings = np.concatenate((experience_offer_embeddings,skills_offer_embeddings), axis=0)

        for candidate in os.listdir(condidate_json):
            if candidate.startswith("."):
                continue
            candidate_path = os.path.join(os.getenv("OUTPUT_RESUME","./data_resume/output_data"),candidate)
            candidate_name = os.path.splitext(candidate)[0]
            extracted_resume_data = extract_skills_and_description(candidate_path)

            experience_resume_embeddings = model.encode(extracted_resume_data["experience"])
            skills_resume_embeddings = model.encode(extracted_resume_data["combined_skills"])
            exp_skills_resume_embeddings = np.concatenate((experience_resume_embeddings,skills_resume_embeddings), axis=0)

            # Experience similarity using SBERT
            experience_similarities = model.similarity(experience_offer_embeddings, experience_resume_embeddings)
            max_experience_similarities, _  = experience_similarities.max(dim=1)
            expereince_similarity = max_experience_similarities.mean().item()

            # Skills similarity using lexical score
            # skills_similarity_lex = skills_score(extracted_offer_data["skills"],extracted_resume_data["skills"])
            
            # Skills similarity using SBERT
            skills_similarities = model.similarity(skills_offer_embeddings, skills_resume_embeddings)
            max_skills_similarities, _  = skills_similarities.max(dim=1)
            skills_similarity_sbert = max_skills_similarities.mean().item()

            # Similarity using SBERT
            skills_exp_similarities = model.similarity(exp_skills_offer_embeddings, exp_skills_resume_embeddings)
            max_skills_exp_similarities, _  = skills_exp_similarities.max(dim=1)
            skills_exp_similarities_sbert = max_skills_exp_similarities.mean().item()

            # Over all similarity
            # similarity_lex = (expereince_similarity*0.7 + skills_similarity_lex*0.3) 
            similarity_sbert = (expereince_similarity*0.5 + skills_similarity_sbert*0.5)

            # print(f"The score for the candidate {candidate_name} in {offer_name} offer using lex is {similarity_lex*100:.2f}")
            # print(f"The score for the candidate {candidate_name} in {offer_name} offer is {similarity_sbert*100:.2f}")
            s = f"{skills_exp_similarities_sbert*100:.2f}"
            quote = f"The score for the candidate {candidate_name} in {offer_name} offer is {s}"
            dictt = {
                "candidate_name": candidate_name,
                "score":s,
                "data": extracted_resume_data
            }
            print(quote)
            res.append(dictt)
            print()

    return res

            
def skills_score(offer_skills,candidate_skills):
    score = 0
    for offer_skill in offer_skills:
        if offer_skill in candidate_skills:
            score +=1
    score /= len(offer_skills)

    return score

    

        

