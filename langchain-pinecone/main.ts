import { Pinecone } from "@pinecone-database/pinecone";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import * as dotenv from "dotenv";
import fs from "fs";
import { createPineconeIndex } from "./createPineconeIndex";
import { updatePinecone } from "./updatePinecone";
import { queryPineconeVectorStoreAndQueryLLM } from "./queryPineconeVectorStoreAndQueryLLM";
import { join } from 'path';

dotenv.config();

const loader = new DirectoryLoader("./documents", {
  ".txt": (path) => new TextLoader(path),
  ".pdf": (path) => new PDFLoader(path),
});

const question = "What is the main topic of this document? give sumuarry";
const indexName = "registry-db";
const vectorDimension = 1536;

const client = new Pinecone({
  apiKey:
    process.env.PINECONE_API_KEY ||
    "pcsk_xoXAP_DSLtj4M82q88wgN5YqHdHHdgHo2K5cHvG3FnJ5kGWu41mMo5CE3dp94YxJ7YpzP",
});


(async () => {
  
  const docs = await loader.load();


  await createPineconeIndex(client, indexName, vectorDimension);

  await updatePinecone(client, indexName, docs);

  await queryPineconeVectorStoreAndQueryLLM(client, indexName, question);
})();
