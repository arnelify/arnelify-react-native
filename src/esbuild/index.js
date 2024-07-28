const esbuild = require("esbuild");
const { client, server } = require("./config/settings");
const htmlPlugin = require("./plugins/html");

class ESBuild {

  static addPlugin(plugin) {
    if (plugin) client.plugins.push(plugin);
  }

  static async build() {

    this.addPlugin(htmlPlugin(client.minify));
    await esbuild.build(client);
    await esbuild.build(server);
  }

  static async watch() {

      await esbuild.build(server);
      this.addPlugin(htmlPlugin(client.minify));
      const ctx = await esbuild.context(client);
      ctx.watch();
  }
}

module.exports = ESBuild;