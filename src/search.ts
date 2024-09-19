import { OpenAIEmbeddings } from '@langchain/openai';
import 'dotenv/config';
import { redis, redisVectorStore } from './redis-store';

async function search() {
  await redis.connect();

  // Converter a string de consulta em embeddings
  const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });
  
  const query = 'O que é a xpto? quais os fundamentos a empresa possui?';
  const queryEmbedding = await embeddings.embedQuery(query);

  // Realizar a busca com o vetor de embeddings
  const response = await redisVectorStore.similaritySearchVectorWithScore(queryEmbedding, 5);

  console.log(response);

  await redis.disconnect();
}

search();
