
// export const prismaClient = new PrismaClient()

// import {PrismaClient} from "../generated/prisma/client"
import {PrismaClient} from "@prisma/client"
import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL
});

console.log(adapter)

export const prismaClient= new PrismaClient({adapter});

