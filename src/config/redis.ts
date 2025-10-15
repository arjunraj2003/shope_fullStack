// import { createClient } from "redis";

// const redis=createClient(
//      {
//         socket: {
//         host: 'localhost',  // or your Redis host/IP or container name
//         port: 6379,         // or your Redis port
//         timeout: 10000      // optional: increase timeout to 10s
//         }
//      }
// );

// redis.on("error",(err)=>console.log("Redis error:",err));

// redis.connect();


// export default redis;

import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true, // ✅ Important for Upstash
    reconnectStrategy: retries => Math.min(retries * 500, 5000), // Optional: reconnect logic
  },
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// ✅ Use async/await to handle connection errors properly
(async () => {
  try {
    await redis.connect();
    console.log("Connected to Redis successfully");
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
})();

export default redis;

