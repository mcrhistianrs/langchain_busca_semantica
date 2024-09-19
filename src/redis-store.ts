import { OpenAIEmbeddings } from '@langchain/openai';
import { RedisVectorStore } from '@langchain/redis';
import { createClient } from "redis";

  export const redis = createClient({
    url: 'redis://127.0.0.1:6379'
  })

  export const redisVectorStore = new RedisVectorStore(
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
    {
      indexName: 'marketing-embeddings',
      redisClient: redis,
      keyPrefix: 'marketing:'
    }
  )
