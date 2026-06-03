const port = process.env.PORT || process.env.NITRO_PORT || "3000";
const host = process.env.HOST || process.env.NITRO_HOST || "0.0.0.0";

process.env.PORT = port;
process.env.NITRO_PORT = port;
process.env.HOST = host;
process.env.NITRO_HOST = host;
process.env.HOSTNAME = host;

console.log(`Starting LanaStone server on ${host}:${port}`);

await import("./.output/server/index.mjs");