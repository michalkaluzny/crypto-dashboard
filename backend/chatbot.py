from openai import OpenAI
import os


client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
def get_ai_response(text : str) -> str:
    """
    Gets the AI's response

    :param text: text to be analyzed
    :return: AI response
    """
    messages = [
            {"role": "system", "content": "Jesteś ekspertem od kryptowalut i technologii blockchain. Odpowiadaj po polsku, "
                                          "jasno i zwięźle, tłumacząc nawet trudne pojęcia w prosty sposób. Podawaj aktualne "
                                          "informacje, bazuj na faktach i w żadnym wypadku nie udzielaj porad inwestycyjnych. Jeśli użytkownik"
                                          " pyta o prognozy lub opinie, zaznacz, że są to tylko szacunki i nie stanowią "
                                          "rekomendacji."}
,
            {"role": "user", "content": text}
    ]

    model='gpt-4o'

    response = client.chat.completions.create(messages=messages, model=model, max_tokens=300)

    return response.choices[0].message.content