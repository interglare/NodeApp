import express from 'express';
import cors from 'cors';
import db from './models/index';
import { routes } from './routes/index.routes';

const app = express();

app.use(cors());

db.sequelize.sync(
  // {force: true}
  ).then(() => {
  console.log('Drop and Resync Db');
});

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/", routes);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
  