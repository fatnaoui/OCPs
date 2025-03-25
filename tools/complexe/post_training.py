from typing_extensions import LiteralString


from typing import Any


import json

skills_variations = [
    "skills", "required_skills", "abilities", "competencies", "expertise", "technicalSkills",
    "softSkills", "hardSkills", "proficiencies", "capabilities", "qualifications",
    "strengths", "talents", "specialties", "knowledgeAreas"
]
experience_variations = [
    "experience","experiences" , "required_experience", "workHistory", "employment", "jobs",
    "jobExperience","professionalExperience", "careerHistory", "employmentHistory",
    "pastRoles", "workExperience", "positionsHeld", "workRecord", "description",
    "descriptions","jobDescription", "roleDescription", "workDuties", "jobDuties",
    "tasks", "duties", "responsibilities", "keyResponsibilities",
    "coreResponsibilities", "primaryDuties", "assignedTasks",
    "jobFunctions", "workResponsibilities", "positionDetails"
]

def clean_json(model_output) -> str | LiteralString:
    try:
        start_index: int = model_output.find("{")
        end_index: int = model_output.rfind("}")

        if start_index == -1:
            raise Exception("No valid JSON found!")
            
        json_str: str = model_output[start_index:end_index+1]

        return json_str

    except Exception as e:
        print(f"Error: {e}")
        return "An Error is encoutered while extracting infromation"
        
def extract_skills_and_description(json_file):
    with open(json_file,'r') as f:
        data = json.load(f)

    extracted_data = {
        "skills": [],
        "experience": []
    }

    # Extract skills dynamically
    for skill in skills_variations:
        if skill in data:
            extracted_data["skills"] = data[skill]
            break

    for experience in experience_variations:
        if experience in data:
            extracted_data["experience"] = data[experience]
            break  

    return extracted_data

