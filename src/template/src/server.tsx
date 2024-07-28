import path from "path";
import { createServer } from "http";
// import { Server as SocketIO } from "socket.io";
import { readFile } from "fs";
import mimeDb from "mime-db";

import { renderToString, renderToStaticMarkup } from "react-dom/server";
import { AppRegistry } from "react-native";

import env from "../app.json";
import App from './App';

/**
 * Server for Production
 */
class Server {

  #server: any = null;
  #io: any = null;

  constructor() {
    this.#server = createServer(this.#requestHandler);
    // this.#io = new SocketIO(this.#server);
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

        AppRegistry.registerComponent(env.name, () => App);

        /* @ts-ignore */
        const { element, getStyleElement } = AppRegistry.getApplication(env.name/*, { initialProps }*/);

        readFile(path.resolve(webDir, "index.html"), (err, buffer) => {
  
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('Not found.');
            return;
          }

          const styles = renderToStaticMarkup(getStyleElement());
          const html = renderToString(element);
      
          const htmlTarget = '<div id="root"></div>';
          const htmlFinal = `<div id="root">${html}</div>`;
          const stylesTarget = '<!-- Dynamic Styles -->';

          const index = buffer.toString()
            .replace(htmlTarget, htmlFinal)
            .replace(stylesTarget, styles);
      
          res.writeHead(200, { 'Content-Type': mime });
          res.end(Buffer.from(index));
        });

        return;
      }

      res.writeHead(200, { 'Content-Type': mime });
      res.end(buffer);
    });

  }

  /**
   * Start server
   */
  async start() {

    const port = 3000;

    this.#server.listen(port, () => {
      console.log(`Server started on port: ${port}`);
    });
  }
}

/** Init */
const server = new Server();
server.start();