const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);

  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>', 
  process.env.DB_PASSWORD
);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).catch(err => console.log(err))

const port = process.env.PORT || 8000;

const server = app.listen(port, (req, res) => {
  console.log('Server start on ' + port);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

