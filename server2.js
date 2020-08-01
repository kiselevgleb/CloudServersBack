const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();

const ticketsAll = [{
  id: 1234,
  name: 'test test test test test test',
  dis: 'test+ test+ test+',
  status: 'TODO',
  created: '2020-07-17 13:33',
}, {
  id: 234,
  name: 'test2 test test test test test',
  dis: 'test+ test+ test+',
  status: 'TODO',
  created: '2020-07-17 13:32',
}];
app.use(koaBody({
  urlencoded: true,
}));

app.use(async (ctx) => {
  const {
    method,
  } = ctx.request.query;
  ctx.response.set({
    'Access-Control-Allow-Origin': '*',
  });
  ctx.response.set({
    'Access-Control-Allow-Headers': '*',
  });
  switch (method) {
    case 'all':
      ctx.response.body = ticketsAll;
      return;
    case 'ticketById':
      const {
        id,
      } = ctx.request.query;
      const result = ticketsAll.filter((tic) => tic.id === id);
      ctx.response.body = result;
      return;
    case 'delById':
      const js = JSON.parse(ctx.request.body);
      const resultDel = ticketsAll.filter((tic) => tic.id.toString() === js.num);
      const num = ticketsAll.indexOf(resultDel[0]);
      ticketsAll.splice(num, 1);
      ctx.response.body = ticketsAll;
      return;
    case 'createTicket':
      const j = JSON.parse(ctx.request.body);
      const repeat = ticketsAll.filter((tic) => tic.name === j.name);
      let numId = ticketsAll.length;
      let numEr = ticketsAll.filter((tic) => tic.id === numId);

      while (numEr.length !== 0) {
        numId++;
        numEr = ticketsAll.filter((tic) => tic.id === numId);
      }
      if (repeat.length === 0) {
        ticketsAll.push({
          id: numId,
          name: `${j.name}`,
          dis: `${j.dis}`,
          status: `${j.status}`,
          created: `${j.created}`,
        });
      }
      ctx.response.body = ticketsAll;
      return;
    default:
      ctx.response.status = 404;
  }
});
const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
