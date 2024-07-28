import path from "path";
import { createServer } from "http";
import { Server as SocketIO } from "socket.io";
import { readFile, watch } from "fs";
import mimeDb from "mime-db";

/**
 * Server for development.
 */
class Server {

  #server: any = null;
  #io: any = null;

  constructor() {
    this.#server = createServer(this.#requestHandler);
    this.#io = new SocketIO(this.#server);
  }

  /**
   * Request Handler
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async #requestHandler(req: any, res: any) {

    const webDir = path.resolve(".", "web");

    /** Forbidden */
    const forbidden = ['/server.js'];
    for (const item of forbidden) {
      const isForbidden = req.url?.startsWith(item);
      if (isForbidden) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('Not found.');
        return;
      }
    }

    /** Mime */
    let mime = 'text/html';
    const [url] = req.url?.split('?') as any;
    const filename = path.resolve(webDir, url.substring(1, url.length));
    const ext = path.extname(filename).replace('.', '');
    for (const key in mimeDb) {
      const hasExt = Array.isArray(mimeDb[key]['extensions'])
        && mimeDb[key]['extensions']?.includes(ext);
      if (hasExt) mime = key;
    }

    /** Response */
    readFile(filename, (isNotExist, buffer) => {

      if (isNotExist) {

        readFile(path.resolve(webDir, "index.html"), (err, buffer) => {

          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('Not found.');
            return;
          }

          const index = buffer.toString();

          res.writeHead(200, { 'Content-Type': mime });
          res.end(Buffer.from(index));
        });

        return;
      }

      res.writeHead(200, { 'Content-Type': mime });
      res.end(buffer);
    });
  }

  start(previous: string | null = null) {

    const port = 3000;
    this.#server.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });

    const webDir = path.resolve(".", "web");
    const watchHandler = (e: any, filename: any) => {

      const isSourceMap = filename?.endsWith('.js.map');
      if (!isSourceMap) return;

      const isPrevious = filename === previous;
      if (isPrevious) return;

      this.#io.emit('refresh');
      previous = filename;
    };

    watch(webDir, watchHandler);
  }
}

/** Init */
const server = new Server();
server.start();