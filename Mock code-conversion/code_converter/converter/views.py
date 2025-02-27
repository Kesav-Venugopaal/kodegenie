
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import torch

logger = logging.getLogger(__name__)

deepseek_pipeline = None


def get_deepseek_pipeline():
    """Lazy load DeepSeek 1.3B pipeline."""
    global deepseek_pipeline
    if deepseek_pipeline is None:
        try:
            model_name = "deepseek-ai/deepseek-coder-1.3b-instruct"  
            tokenizer = AutoTokenizer.from_pretrained(model_name)
            model = AutoModelForCausalLM.from_pretrained(
                model_name,
                torch_dtype=torch.float32, 
                device_map={"": "cpu"} 
            )

            deepseek_pipeline = pipeline(
                "text-generation",
                model=model,
                tokenizer=tokenizer,
                max_new_tokens=1024,
                temperature=0.2
            )
            logger.info(f"{model_name} pipeline loaded successfully.")
        except Exception as e:
            logger.exception(f"Failed to load {model_name} model.")
            raise e
    return deepseek_pipeline


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

        prompt = f"""### Instruction:
Translate the following code into {target_language}. Ensure the output is valid and idiomatic {target_language} code.

### Input Code:
{file_content}

### Output ({target_language}):
"""

        try:
            pipeline_instance = get_deepseek_pipeline()
            generated_response = pipeline_instance(
                prompt,
                max_new_tokens=1024,
                num_return_sequences=1
            )

            generated_text = generated_response[0]["generated_text"]

            if f"### Output ({target_language}):" in generated_text:
                converted_code = generated_text.split(f"### Output ({target_language}):")[1].strip()
            else:
                converted_code = generated_text.strip()

            cleaned_code = "\n".join(
                line for line in converted_code.splitlines()
                if line.strip() and not line.strip().startswith("--") and not line.strip().startswith("#")
            )

            logger.info(f"Converted code to {target_language}:\n{cleaned_code}")

            return Response({"converted_code": cleaned_code})

        except Exception as e:
            logger.exception("Code translation failed")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
