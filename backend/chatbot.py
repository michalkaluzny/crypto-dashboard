from openai import OpenAI
import os


client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
def get_ai_response(text: str) -> str:
    """
    Gets the AI's response

    :param text: text to be analyzed
    :return: AI response
    """
    system_prompt = """You are an expert in cryptocurrencies and blockchain technology. Your goal is to explain complex
     technical concepts in a clear, concise, and simple way. Always base your answers on facts and up-to-date 
     information. Under no circumstances should you provide investment or financial advice. If the user asks for 
     market forecasts or opinions, you must explicitly state that these are only estimates and do not constitute 
     professional financial recommendations."""
    messages = [
            {"role": "system", "content": system_prompt}
,
            {"role": "user", "content": text}
    ]

    model='gpt-4o'

    response = client.chat.completions.create(messages=messages, model=model, max_tokens=300)

    return response.choices[0].message.content
