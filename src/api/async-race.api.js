const KoaRouter = require("koa-router");
const asyncRaceCtrl = require("../controllers/async-race.ctrl");

const api = KoaRouter();

api.get("/async-race/garage/limit/:limit/page/:page", async (ctx, _next) => {
  const limit = ctx.params.limit ? parseInt(ctx.params.limit, 10) : 10;
  const page = ctx.params.page ? parseInt(ctx.params.page, 10) - 1 : 0;

  const [garage, garageLength] = await asyncRaceCtrl.getAllGarage(limit, page);
  if (garage) {
    ctx.status = 200;
    ctx.body = garage;
    ctx.response.set("Access-Control-Expose-Headers","X-Total-Count");
    ctx.response.set('X-Total-Count', garageLength.toString());
  } else {
    ctx.status = 404;
    ctx.body = {};
  }
});

api.get("/async-race/garage/id/:id", async (ctx, _next) => {
  const id = parseInt(ctx.params.id, 10);

  const car = await asyncRaceCtrl.getCar(id);
  if (car) {
    ctx.status = 200;
    ctx.body = car;
  } else {
    ctx.status = 404;
  }
});

api.delete("/async-race/garage/id/:id", async (ctx, _next) => {
  const id = parseInt(ctx.params.id, 10);

  const car = await asyncRaceCtrl.deleteCar(id);
  if (car) {
    ctx.status = 200;
    ctx.body = {};
  } else {
    ctx.status = 404;
    ctx.body = {};
  }
});

api.put("/async-race/garage/id/:id", async (ctx, _next) => {
  const id = parseInt(ctx.params.id, 10);
  const newCar = ctx.request.body;

  const car = await asyncRaceCtrl.updateCar(id, newCar);

  if (car) {
    ctx.status = 200;
    ctx.body = car;
  } else {
    ctx.status = 404;
    ctx.body = {};
  }
});

api.post("/async-race/garage/", async (ctx, _next) => {
  const car = ctx.request.body;
  const newCar = await asyncRaceCtrl.addCar(car);

  if (newCar) {
    ctx.status = 201;
    ctx.body = newCar;
  } else {
    ctx.status = 404;
  }
});

api.patch("/async-race/engine/id/:id/status/:status", async (ctx, _next) => {
  const id =  parseInt(ctx.params.id, 10);
  const status = ctx.params.status;

  const [statusNumber, message] = await new Promise((resolve, reject) => {
    asyncRaceCtrl.setStatusCar(id, status, resolve);
  })

  ctx.status = statusNumber;
  ctx.body = message;
});

api.post("/async-race/winners", async (ctx, _next) => {
  const car = ctx.request.body;
  const winner = await asyncRaceCtrl.addWinner(car);

  if (winner) {
    ctx.status = 201;
    ctx.body = winner;
  } else {
    ctx.status = 500;
    ctx.body = 'Error: Insert failed, duplicate id';
  }
});

api.get("/async-race/winners/id/:id", async (ctx, _next) => {
  const id =  parseInt(ctx.params.id, 10);
  const winner = await asyncRaceCtrl.getWinner(id);

  if (winner) {
    ctx.status = 200;
    ctx.body = winner;
  } else {
    ctx.status = 404;
    ctx.body = {};
  }
});

api.get("/async-race/winners/page/:page/limit/:limit/sort/:sort/order/:order", async (ctx, _next) => {
  const page = ctx.params.page ? parseInt(ctx.params.page, 10) - 1 : 0;
  const limit = ctx.params.limit ? parseInt(ctx.params.limit, 10) : 10;
  const sort = ctx.params.sort;
  const order = ctx.params.order;

  const [winners, winnersLength] = await asyncRaceCtrl.getWinners(limit, page, sort, order);
  if (winners) {
    ctx.status = 200;
    ctx.body = winners;
    ctx.response.set("Access-Control-Expose-Headers","X-Total-Count");
    ctx.response.set('X-Total-Count', winnersLength.toString());
  } else {
    ctx.status = 404;
    ctx.body = {};
  }
});

api.delete("/async-race/winners/id/:id", async (ctx, _next) => {
  const id = parseInt(ctx.params.id, 10);

  const winner = await asyncRaceCtrl.deleteWinner(id);
  if (winner) {
    ctx.status = 200;
    ctx.body = {};
  } else {
    ctx.status = 404;
    ctx.body = {};
  }
});

api.put("/async-race/winners/id/:id", async (ctx, _next) => {
  const id = parseInt(ctx.params.id, 10);
  const newWinner = ctx.request.body;

  const winner = await asyncRaceCtrl.updateWinner(id, newWinner);

  if (winner) {
    ctx.status = 200;
    ctx.body = winner;
  } else {
    ctx.status = 404;
    ctx.body = {};
  }
});


module.exports = exports = api;
