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
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redis.connect();

export default redis;
