import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_response(prompt: str):

    try:

        response = model.generate_content(prompt)

        text = response.text.strip()

        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

        return json.loads(text)

    except json.JSONDecodeError:

        return {
            "success": False,
            "message": "Gemini returned invalid JSON",
            "raw_response": text
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }