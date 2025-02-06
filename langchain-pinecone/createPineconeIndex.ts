import { Pinecone } from "@pinecone-database/pinecone";

export const createPineconeIndex = async (
  client: Pinecone,
  indexName: string,
  vectorDimension: number
) => {
  console.log(`Creating Pinecone index: ${indexName}`);

  const existingIndexes = await client.listIndexes();
  const indexExists = existingIndexes.indexes?.some(index => index.name === indexName) ?? false;

  if (indexExists) {
    console.log(`Index ${indexName} already exists`);
    return;
  } else {
    const createClient = await client.createIndex({
      name: indexName,
      dimension: vectorDimension,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });
    console.log(`Index ${indexName} created`);
  }
};
