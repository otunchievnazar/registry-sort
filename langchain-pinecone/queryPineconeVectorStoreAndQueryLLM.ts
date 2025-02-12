import { OpenAIEmbeddings } from "@langchain/openai";
import { OpenAI } from "@langchain/openai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";
import { Pinecone } from "@pinecone-database/pinecone";
import { log } from "console";
import { query } from "express";

export const queryPineconeVectorStoreAndQueryLLM = async (
  client: Pinecone,
  indexName: string,
  question: string
) => {
  console.log("Querying Pinecone index...");

  const index = client.Index(indexName);

  const queryEmbedding = await new OpenAIEmbeddings().embedDocuments([
    question,
  ]);

  const flattenedQueryEmbedding = queryEmbedding.flat();
  console.log("Query embedding:", flattenedQueryEmbedding);
  let queryResponse = await index.query({
    topK: 10,
    vector: flattenedQueryEmbedding,
    includeMetadata: true,
    includeValues: true,
  });

  console.log(`Found ${queryResponse.matches.length} results`);

  console.log("Asking question...");

  if (queryResponse.matches.length) {
    const llm = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const chain = loadQAStuffChain(llm);
    const concatenatedPageContent = queryResponse.matches
      .map((match) => match.metadata?.pageContent)
      .join(" ");
    const document = new Document({ pageContent: concatenatedPageContent });

    const result = await chain.invoke({
      input_documents: document,
      question: question,
    });

    console.log("Answer:", result);
  } else {
    console.log("No results found");
  }
};
