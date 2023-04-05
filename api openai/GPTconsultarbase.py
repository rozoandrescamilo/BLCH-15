import os
import openai as OAI
import io
import pandas as pd

from dotenv import load_dotenv

load_dotenv()
OAI.api_key = os.getenv("OPENAI_API_KEY")

response = OAI.Completion.create(
    model="text-davinci-003", 
    prompt="Say this is a test", 
    temperature=0, 
    max_tokens=7)


form_data = """
https://raw.githubusercontent.com/rozoandrescamilo/blch/main/bdstartco.json
"""

# Configuración de la solicitud
prompt = f"Teniendo en cuenta la base de datos de Startups que se enuentra en esta URL: \n\n{form_data}\n\n responde la siguiente pregunta: ¿Que startups de la base de datos estan relacionados con logistica, transporte, envios nacionales e internacionales?"
model_engine = "text-davinci-002"
temperature = 0.5
max_tokens = 3000

# Enviar solicitud a la API
response = OAI.Completion.create(
    engine=model_engine,
    prompt=prompt,
    max_tokens=max_tokens,
    temperature=temperature,
    n=1,
    stop=None,
)

# Guardar la respuesta como archivo txt
with open("respuesta.txt", "wb") as f:
    f.write(io.BytesIO(response.choices[0].text.encode('utf-8')).getvalue())