// import WebSocket from "ws";

// type Message = {
//   topic: string;
//   payload: any;
// };

// const ws = new WebSocket("ws://localhost:8080");

// let buffer = Buffer.alloc(0);

// ws.on("open", () => {
//   console.log("connected");

//   send(ws, {
//     topic: "connect",
//     payload: { test: 1 }
//   }, Buffer.alloc(0));
// });

// ws.on("message", (data: Buffer) => {
//   buffer = Buffer.concat([buffer, data]);
//   parseBuffer();
// });

// function send(ws: WebSocket, msg: Message, bytes: Buffer = Buffer.alloc(0)) {
//   const jsonStr = JSON.stringify(msg);
//   const jsonBuf = Buffer.from(jsonStr);

//   const header = `${jsonBuf.length}+${bytes.length}:`;
//   const packet = Buffer.concat([
//     Buffer.from(header),
//     jsonBuf,
//     bytes
//   ]);

//   ws.send(packet);
// }

// function parseBuffer() {
//   while (true) {
//     const sepIndex = buffer.indexOf(":");
//     if (sepIndex === -1) return;

//     const header = buffer.slice(0, sepIndex).toString();
//     const match = header.match(/^(\d+)\+(\d+)$/);

//     if (!match) {
//       console.error("Invalid header:", header);
//       buffer = Buffer.alloc(0);
//       return;
//     }

//     const jsonLen = Number(match[1]);
//     const bytesLen = Number(match[2]);

//     const totalLen = sepIndex + 1 + jsonLen + bytesLen;
//     if (buffer.length < totalLen) return;

//     const jsonStart = sepIndex + 1;
//     const jsonEnd = jsonStart + jsonLen;
//     const bytesEnd = jsonEnd + bytesLen;

//     const jsonBuf = buffer.slice(jsonStart, jsonEnd);
//     const bytesBuf = buffer.slice(jsonEnd, bytesEnd);

//     try {
//       const msg: Message = JSON.parse(jsonBuf.toString());
//       onMessage(msg, bytesBuf);
//     } catch (e) {
//       console.error("JSON parse error", e);
//     }

//     buffer = buffer.slice(totalLen);
//   }
// }

// function onMessage(msg: Message, bytes: Buffer) {
//   console.log("TOPIC:", msg.topic);
//   console.log("PAYLOAD:", msg.payload);
//   console.log("BYTES:", bytes);
// }


// (function watch() {

//   socket = new WebSocket('ws://localhost:8433');

//   socket.onmessage = (event) => {
//     const { version } = JSON.parse(event.data);
//     if (localStorage.getItem('version') !== String(version)) {
//       localStorage.setItem('version', version);
//       location.reload();
//     }
//   };

//   socket.onclose = () => {
//     setTimeout(watch, 1000);
//   };

// })();