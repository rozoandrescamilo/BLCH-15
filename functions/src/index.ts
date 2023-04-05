import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as OAI from 'openai';
import * as request from 'request';
import * as io from 'io';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

admin.initializeApp();

OAI.api_key = functions.config().openai.key;

export const analyzeDatabase = functions.https.onRequest(async (req, res) => {
  const url = 'https://raw.githubusercontent.com/rozoandrescamilo/blch/main/bdstartco.json';
  
  const prompt = `Teniendo en cuenta la base de datos de Startups que se encuentra en esta URL: \n\n${url}\n\n responde la siguiente pregunta: ¿Qué startups de la base de datos están relacionados con logística, transporte, envíos nacionales e internacionales?`;
  const model_engine = 'text-davinci-002';
  const temperature = 0.5;
  const max_tokens = 3000;

  const response = await OAI.Completion.create({
    engine: model_engine,
    prompt,
    max_tokens,
    temperature,
    n: 1,
    stop: null
  });

  const text = response.choices[0].text;

  const file = fs.createWriteStream('respuesta.txt');

  await new Promise((resolve, reject) => {
    const stream = request({
      uri: text,
      gzip: true
    })
      .pipe(file)
      .on('finish', () => {
        admin.storage().bucket().upload('respuesta.txt', {
          destination: 'respuesta.txt'
        });
        res.status(200).send('Análisis completado.');
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });
});
