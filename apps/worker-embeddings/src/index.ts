
import { Worker } from 'bullmq'
import { prismaClient } from '@repo/db/client'
import { openai } from '@repo/embedding/embedding'
import { bullMQConnection } from '@repo/redis/client'

const embeddingWorker = new Worker('project-embeddings', async (job) => {
  const { projectId, inputforAi } = job.data

  const aiResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: inputforAi
  })

  console.log(aiResponse.data[0]?.embedding)
  const embeddingNumbers = aiResponse.data[0]?.embedding

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
