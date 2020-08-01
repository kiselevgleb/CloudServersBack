const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const {
  streamEvents
} = require('http-event-stream');
const {
  v4: uuidv4
} = require('uuid');
const app = new Koa();
app.use(koaBody({
  urlencoded: true,
}));

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };
  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({
      ...headers
    });
    try {
      return await next();
    } catch (e) {
      e.headers = {
        ...e.headers,
        ...headers
      };
      throw e;
    }
  }
  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUD, DELETE, PATCH',
    });
    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }
    ctx.response.status = 204;
  }
});

let servers = [];
const Router = require('koa-router');
const router = new Router();
let masMes = "";
let masMesReplaced = "";
router.get('/names', async (ctx) => {
  if (!users.includes(ctx.request.query.name)) {
    users.push(ctx.request.query.name);
    ctx.body = true;
  } else {
    ctx.body = false;
  }
});

router.get('/all', async (ctx) => {
  ctx.body = servers;

});
router.get('/create', async (ctx) => {
  let idnum = uuidv4();
  servers.push({
    id: idnum,
    state: 'stopped',
  });
  ctx.body = servers;

  router.get(`/${idnum}`, async (ctx) => {

    console.log(idnum)

    streamEvents(ctx.req, ctx.res, {
      async fetch(lastEventId) {
        return [];
      },
      stream(sse) {
        const interval = setInterval(() => {
          
          sse.sendEvent({
            data: "ok"
          });
          return () => clearInterval(interval);
        }, 1000);
      }
    });
    ctx.respond = false;
  });



});
router.post('/rem', async (ctx) => {
  console.log("close");
  const resultDel = servers.filter((s) => s.id.toString() === ctx.request.body);
  console.log(resultDel);

  if (resultDel !== null) {
    const num = servers.indexOf(resultDel[0]);
    console.log(num);
    servers.splice(num, 1);
    ctx.body = true;
  } else {
    ctx.body = false;
  }
});

app.use(router.routes()).use(router.allowedMethods());
const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
server.listen(port);