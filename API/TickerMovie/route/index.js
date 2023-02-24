
const TickerMovie = require('./TickerRouter');

module.exports = [
  { method: 'POST', path: '/TickerMovie/insert', config: TickerMovie.insert },
  { method: 'POST', path: '/TickerMovie/findAll', config: TickerMovie.findAll },
  { method: 'POST', path: '/TickerMovie/findById', config: TickerMovie.findById },
  { method: 'POST', path: '/TickerMovie/updateById', config: TickerMovie.updateById },
  { method: 'POST', path: '/TickerMovie/deleteById', config: TickerMovie.deleteById },
];
