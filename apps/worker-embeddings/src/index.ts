
import { Worker } from 'bullmq'
import { prismaClient } from '@repo/db/client'
import { googleAi } from '@repo/embedding/embedding'
import { bullMQConnection } from '@repo/redis/client'

const embeddingWorker = new Worker('project-embeddings', async (job) => {
  const { projectId, inputforAi } = job.data

  const aiResponse = await googleAi.models.embedContent({
      model: 'gemini-embedding-2',
      contents: inputforAi as string,
      config: {
        outputDimensionality: 1536
      }
    })
  // const aiResponse = await openai.embeddings.create({
  //   model: "text-embedding-3-small",
  //   input: inputforAi
  // })

  console.log(aiResponse)
  console.log(aiResponse.embeddings)
  // @ts-ignore
  console.log(aiResponse.embeddings[0]?.values)
  // @ts-ignore
  const embeddingNumbers = aiResponse.embeddings[0]?.values

  const vectorString = `[${embeddingNumbers?.join(',')}]`;

  await prismaClient.$executeRaw`UPDATE "Project" SET embedding = ${vectorString}::vector WHERE id = ${projectId}`;
}, {
  connection: bullMQConnection,
  limiter: {
    max: 20,
    duration: 60 * 100
  }
})

embeddingWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with error ${err.message}`);
})
