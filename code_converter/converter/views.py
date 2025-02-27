
import logging
import re
import google.generativeai as genai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

logger = logging.getLogger(__name__)

# Configure Google Gemini API Key from settings.py
genai.configure(api_key=settings.GOOGLE_API_KEY)

class ConvertCodeView(APIView):
    """
    API to convert source code from one programming language to another.
    """
    def post(self, request, *args, **kwargs):
        uploaded_file = request.FILES.get("file")
        target_language = request.data.get("instruction", "").strip()

        if not uploaded_file:
            return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        if not target_language:
            return Response({"error": "Target language is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            file_content = uploaded_file.read().decode("utf-8")
        except Exception as e:
            return Response({"error": f"Error reading file: {e}"}, status=status.HTTP_400_BAD_REQUEST)

        prompt = f"""### Task:
You are an expert programmer. Convert the following code into {target_language}. 
Ensure that the output is syntactically correct, idiomatic, and follows best practices.

### Input Code:
{file_content}

### Converted Code ({target_language}):
"""

        try:
            model = genai.GenerativeModel("gemini-1.5-pro-latest")
            response = model.generate_content(prompt)
            generated_text = response.text.strip()

            # Cleaning up response
            cleaned_code = "\n".join(
                line for line in generated_text.splitlines()
                if line.strip() and not line.strip().startswith("--") and not line.strip().startswith("#")
            )

            logger.info(f"Converted code to {target_language}:\n{cleaned_code}")
            return Response({"converted_code": cleaned_code})

        except Exception as e:
            logger.exception("Code translation failed")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SummarizeCodeView(APIView):
    """
    API to generate a concise summary of uploaded source code.
    """
    def post(self, request, *args, **kwargs):
        uploaded_file = request.FILES.get("file")

        if not uploaded_file:
            return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            file_content = uploaded_file.read().decode("utf-8")
        except Exception as e:
            return Response({"error": f"Error reading file: {e}"}, status=status.HTTP_400_BAD_REQUEST)

        prompt = f"""### Task:
You are an expert software engineer. Provide a concise but meaningful summary of the following code, 
explaining its functionality and key components.

### Input Code:
{file_content}

### Summary:
"""

        try:
            model = genai.GenerativeModel("gemini-1.5-pro")
            response = model.generate_content(prompt)
            summary_text = response.text.strip()

            logger.info(f"Generated summary:\n{summary_text}")
            return Response({"summary": summary_text})

        except Exception as e:
            logger.exception("Code summarization failed")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GenerateDocstringView(APIView):
    """
    API to generate proper Python docstrings for functions in the uploaded code.
    """
    def post(self, request, *args, **kwargs):
        uploaded_file = request.FILES.get("file")

        if not uploaded_file:
            return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            file_content = uploaded_file.read().decode("utf-8")
        except Exception as e:
            return Response({"error": f"Error reading file: {e}"}, status=status.HTTP_400_BAD_REQUEST)

        # Extract functions from the code
        functions = self.extract_functions(file_content)
        if not functions:
            return Response({"error": "No functions found in the provided code."}, status=status.HTTP_400_BAD_REQUEST)

        docstrings = {}
        for function in functions:
            docstring = self.generate_docstring(function)
            docstrings[function] = docstring

        return Response({"docstrings": docstrings})

    def extract_functions(self, code):
        """
        Extracts Python function definitions from the provided code.
        """
        function_pattern = r"(def\s+\w+\(.*?\)):(\s*\"\"\".*?\"\"\"|)"
        matches = re.findall(function_pattern, code, re.DOTALL)
        functions = [match[0] for match in matches]
        return functions

    def generate_docstring(self, function_code):
        """
        Generates a docstring for a given function using the Gemini API.
        """
        prompt = f"""### Task:
You are a senior software engineer. Generate a proper Python docstring for the following function.

### Function:
{function_code}

### Docstring:
"""
        try:
            model = genai.GenerativeModel("gemini-1.5-pro")
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Error generating docstring: {e}")
            return "Error generating docstring."
