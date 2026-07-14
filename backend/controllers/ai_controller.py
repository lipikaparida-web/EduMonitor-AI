from services.gemini_service import generate_response

from prompts.career_prompt import career_prompt
from prompts.resume_prompt import resume_prompt
from prompts.interview_prompt import interview_prompt
from prompts.company_prompt import company_prompt


def career_ai(student):

    prompt = f"""
{career_prompt}

Student Details:

{student.model_dump_json(indent=2)}
"""

    result = generate_response(prompt)

    return {
        "success": True,
        "message": "Career recommendation generated successfully",
        "data": result
    }


def resume_ai(resume):

    prompt = f"""
{resume_prompt}

Resume:

{resume.resume_text}
"""

    result = generate_response(prompt)

    return {
        "success": True,
        "message": "Resume evaluated successfully",
        "data": result
    }


def interview_ai(student):

    prompt = f"""
{interview_prompt}

Student Details:

{student.model_dump_json(indent=2)}
"""

    result = generate_response(prompt)

    return {
        "success": True,
        "message": "Interview questions generated successfully",
        "data": result
    }


def company_ai(student):

    prompt = f"""
{company_prompt}

Student Details:

{student.model_dump_json(indent=2)}
"""

    result = generate_response(prompt)

    return {
        "success": True,
        "message": "Company recommendations generated successfully",
        "data": result
    }