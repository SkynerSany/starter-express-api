const remove = require('lodash/remove');

const db = require('../data/async-race.json');
const { generateId } = require('../utils');

const state = { velocity: {}, blocked: {} };

const getAllGarage = async (limit, page) => {
  const allGarage = db.garage.slice(page * limit, page * limit + limit);
  return [allGarage, db.garage.length]
}

const addCar = async (car) => {
  const newCar = {...car, id: generateId()};
  await db.garage.push(newCar);
  return newCar
}

const getCar = async (id) => {
  return await db.garage.find((car) => car.id === id);
}

const deleteCar = async (id) => {
  return await remove(db.garage, (car) => car.id === id);
}

const setStatusCar = async (id, status, resolve) => {
 
  if (!id || !status || !/^(started)|(stopped)|(drive)$/.test(status)) {
    resolve([404, 'Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"']);
    return;
  }

  if (!db.garage.find((car) => car.id === +id)) {
    resolve([404, "Car with such id was not found in the garage."]);
    return;
  }

  const distance = 500000;

  if (status === "drive") {
    const velocity = state.velocity[id];

    if (!velocity) {
      resolve([404, 'Engine parameters for car with such id was not found in the garage. Have you tried to set engine status to "started" before?']);
      return;
    }
    
    if (state.blocked[id]) {
      resolve([404, "Drive already in progress. You can't run drive for the same car twice while it's not stopped."]);
      return;
    }

    state.blocked[id] = true;

    const x = Math.round(distance / velocity);

    if (new Date().getMilliseconds() % 3 === 0) {
      setTimeout(() => {
        delete state.velocity[id];
        delete state.blocked[id];
        resolve([500, "Car has been stopped suddenly. It's engine was broken down."]);
      }, (Math.random() * x) ^ 0);
    } else {
      setTimeout(() => {
        delete state.velocity[id];
        delete state.blocked[id];
        resolve([200, JSON.stringify({ success: true })]);
      }, x);
    }
  } else {
    const x = (Math.random() * 2000) ^ 0;

    const velocity = status === "started" ? Math.max(50, (Math.random() * 200) ^ 0) : 0;

    if (velocity) {
      state.velocity[id] = velocity;
    } else {
      delete state.velocity[id];
      delete state.blocked[id];
    }

    setTimeout(
      () => {
        resolve([200, JSON.stringify({ velocity, distance })]);
      }, x
    );
  }
}

const updateCar = async (id, newCar) => {
  const carIndex = db.garage.findIndex((car) => car.id === id);
  if (carIndex < 0) return null;

  db.garage[carIndex] = {id, ...newCar};

  return db.garage[carIndex];
}

const getWinner = async (id) => {
  return await db.winners.find((car) => car.id === id);
}

const addWinner = async (car) => {
  await db.winners.push(car);
  return car
}

const getWinners = async (limit, page, sort, order) => {
  let winners = [...db.winners];
  winners.sort((a, b) => order === 'ASC' ? a[sort] - b[sort] : b[sort] - a[sort]);
  winners = winners.slice(page * limit, page * limit + limit);
  return [winners, db.winners.length]
}

const deleteWinner = async (id) => {
  return await remove(db.winners, (winner) => winner.id === id);
}

const updateWinner = async (id, newWinner) => {
  const winnerIndex = db.winners.findIndex((winner) => winner.id === id);
  if (winnerIndex < 0) return null;

  db.garage[winnerIndex] = {id, ...newWinner};

  return db.garage[winnerIndex];
}

module.exports = {
  getAllGarage,
  addCar,
  getCar,
  deleteCar,
  updateCar,
  setStatusCar,
  addWinner,
  getWinner,
  getWinners,
  deleteWinner,
  updateWinner,
}
