// start dev server(Koa静态服务)
function stratServer(app, port, memoryFs, basePath) {
  app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');
    ctx.set('Access-Control-Max-Age', 300);
    if (ctx.method == 'OPTIONS') {
      ctx.body = '';
      ctx.status = 204;
    } else {
      await next();
    }
  });
  app.use(async ctx => {
    try {
      content = memoryFs.readFileSync(path.resolve(basePath, './' + ctx.path));
      ctx.type = path.extname(ctx.path);
      ctx.body = content;
    } catch (err) {
      ctx.stats = 404;
      ctx.body = '404 not found';
    }
  });
  app.listen(port, () => {
    console.log(`[INFO] | Start develope server at port ${port}`);
  });
}

// 处理html模版
function handleHTML(path, data) {
  console.log(`[INFO] | Write resource to html,path:${global.projectConfig['HTML_PATH']}...`);
  let newFileData = `{{define "resource"}}\n`;
  data.forEach(item => {
    if (/\.css$/.test(item)) {
      newFileData += `<link rel="stylesheet" href="//localhost:${argvs.port}/${item}">\n`;
    } else {
      newFileData += `<script src="//localhost:${argvs.port}/${item}"></script>\n`;
    }
  });
  newFileData += '{{end}}';
  fs.writeFileSync(path, newFileData);
  console.log('[INFO] | Write resource to html success!');
}



module.exports = function buildDev(port, config) {
  const compiler = webpack(config);
  const memoryFs = new MemoryFileSystem();
  const app = new Koa();
  compiler.outputFileSystem = memoryFs; // 输出内存
  stratServer(app, port, memoryFs, config.output.path);
  let watch = compiler.watch({
      ignored: `/node_modules/`,
      aggregateTimeout: 500,
      poll: 1000,
    },
    (err, stats) => {
      if (err || stats.hasErrors()) {
        console.log(`[ERROR] | ${err || stats.toJson().errors}`);
        return;
      }
      let resultJson = stats.toJson().assetsByChunkName;
      let outputArr = [];
      Object.keys(resultJson).forEach(key => {
        if (Array.isArray(resultJson[key])) {
          outputArr = outputArr.concat(resultJson[key]);
        } else {
          outputArr.push(resultJson[key]);
        }
      });
      console.log('[INFO] | Build Success!');
      outputArr.forEach(item => {
        console.log(`--- ${item}`);
      });
      if (global.projectConfig['HTML_PATH']) {
        try {
          handleHTML(global.projectConfig['HTML_PATH'], outputArr);
        } catch (err) {
          console.log(`[Error] | Write Error: ${err}`);
        }
      }
    }
  );
  process.on('SIGINT', function () {
    watch.close(() => {
      console.log('[INFO] | Webpack Watching Ended.');
      process.exit();
    });
  });
}