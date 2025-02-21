import logging
import google.generativeai as genai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)

# Set your Gemini API Key
genai.configure(api_key="AIzaSyAoS0AQRA-bc7RFKkQ0xtNZwwQoY4-zc9w")

class ConvertCodeView(APIView):
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
You are an expert programmer. Convert the following code into {target_language}. Ensure that the output is syntactically correct, idiomatic, and follows best practices.

### Input Code:
{file_content}

### Converted Code ({target_language}):
"""

        try:
            model = genai.GenerativeModel("gemini-pro")
            response = model.generate_content(prompt)
            generated_text = response.text.strip()

            # Cleaning up the response (removing unnecessary comments)
            cleaned_code = "\n".join(
                line for line in generated_text.splitlines()
                if line.strip() and not line.strip().startswith("--") and not line.strip().startswith("#")
            )

            logger.info(f"Converted code to {target_language}:\n{cleaned_code}")

            return Response({"converted_code": cleaned_code})

        except Exception as e:
            logger.exception("Code translation failed")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
