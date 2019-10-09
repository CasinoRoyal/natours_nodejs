const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

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

app.listen(port, (req, res) => {
  console.log('Server start on ' + port);
});