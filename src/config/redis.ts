// import Redis from "ioredis";

// let redisInstance: Redis | null = null;

// export const getRedisClient = (): Redis => {
//   if (!redisInstance) {
//     redisInstance = new Redis({
//       host: process.env.REDIS_HOST || "127.0.0.1",
//       port: Number(process.env.REDIS_PORT || 6379),
//       password: process.env.REDIS_PASSWORD || undefined,
//       db: 0,
//       connectTimeout: 2000,
//       maxRetriesPerRequest: null,
//       retryStrategy: (times) => Math.min(times * 50, 2000),
//     });

//     redisInstance.on("connect", () => console.log("✅ Connected to Redis"));
//     redisInstance.on("error", (err) => console.error("❌ Redis error:", err.message));
//   }
//   return redisInstance;
// };


import Redis from "ioredis";

let redisInstance: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redisInstance) {
    if (!process.env.REDIS_URL) {
      throw new Error("REDIS_URL environment variable is not set!");
    }

    redisInstance = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      connectTimeout: 5000,
      retryStrategy: (times: number) => Math.min(times * 50, 2000),
    });

    redisInstance.on("connect", () => console.log("✅ Connected to Redis"));
    redisInstance.on("ready", () => console.log("✅ Redis is ready to use"));
    redisInstance.on("error", (err) => console.error("❌ Redis error:", err.message));
    redisInstance.on("close", () => console.warn("⚠️ Redis connection closed"));
    redisInstance.on("reconnecting", (time: number) => {
      console.log(`🔄 Reconnecting to Redis in ${time}ms`);
    });
  }

  return redisInstance;
};

