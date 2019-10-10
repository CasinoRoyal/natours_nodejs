const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');


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