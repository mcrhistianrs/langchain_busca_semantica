import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from "@langchain/openai";
import 'dotenv/config';
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { redis, redisVectorStore } from "./redis-store";

async function main() {
  await redis.connect();

  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-3.5-turbo',
    temperature: 0.3
  });
  
  const prompt = new PromptTemplate({
    template: `
    Usar o conteúdo disponibilizado para responder o usuário.
    Se a resposta não for encontrada, não invente.
    
    Fonte:
    {context}
  
    Pergunta:
    {input}
    `.trim(),
    inputVariables: ['context', 'input']
  });

  const combineDocsChain = await createStuffDocumentsChain({
    llm,
    prompt,
  });

  const responseChain = await createRetrievalChain({
    combineDocsChain,
    retriever: redisVectorStore.asRetriever(),
  });

 

  // Set the input in prompt variable 
  const response = await responseChain.invoke({
    input: "Faça um texto para instagram para divulgar a empresa xpto?", 
  });

  console.log(response.answer);

  await redis.disconnect();
  
}

main();
