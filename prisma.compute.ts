import { defineComputeConfig } from "@prisma/compute-sdk/config";

export default defineComputeConfig({
  app: {
    name: "next-prisma",
    framework: "nextjs",
    env: ".env",
  },
});
