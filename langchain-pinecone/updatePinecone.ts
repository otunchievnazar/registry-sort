import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Pinecone } from "@pinecone-database/pinecone";

export const updatePinecone = async (
  client: Pinecone,
  indexName: string,
  docs: any
) => {
  console.log("Updating Pinecone index...");

  const index = client.Index(indexName);

  console.log("Pinecone index retrieved:", indexName);
  for (const doc of docs) {
    console.log("Processing document:", doc.metadata?.source);
    const textPath = doc.metadata.source;
    const text = doc.pageContent;  
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000
    });

    //split text into chunks
    const chunks = await textSplitter.createDocuments([text]);
    console.log(`Text splint into ${chunks.length} chunks`);
    console.log(
        `Calling OpenAI's Embedding-endpoint documents-with-${chunks.length}-chunks`
    )

    // Create openAI embeddings
    let openAIEmbeddings;
    try {
        openAIEmbeddings = await new OpenAIEmbeddings().embedDocuments(
            chunks.map((chunk) => chunk.pageContent.replace(/\n/g, ""))
        );
    } catch (error) {
        console.error("Error creating embeddings:", error)
    }

    console.log("Embeddings created", openAIEmbeddings);
    console.log(`Creating - ${chunks.length} - chunks`);

    // create and upsert verctor in batches of 100
    const batchSize = 100;
    let batch = [];
    if (openAIEmbeddings) {
        for (let idx = 0; idx < chunks.length; idx++) {
            const chunk = chunks[idx];
            const vector = {
                id: `${textPath}-${idx}`,
                values: openAIEmbeddings[idx],
                metadata: {
                    ...chunk.metadata,
                    loc: JSON.stringify(chunk.metadata.loc),
                    pageContent: chunk.pageContent,
                    textPath: textPath,
                }
            }
            batch.push(vector);
            // if batch is full, upsert
            if (batch.length === batchSize || idx === chunks.length - 1) {
                await index.upsert(batch);
                batch = [];
            }
        }
        console.log(`Index updated with ${chunks}`);
    } else {
        console.error("openAIEmbeddings is undefined, skipping vector creation.");
    }
        
  }
};
