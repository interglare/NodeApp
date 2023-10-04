import express from 'express';
import cors from 'cors';
import db from './models/index.js';
import authRoute from './routes/auth.routes.js';
import fileRoute from './routes/file.routes.js';

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

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello!" });
});

// routes
authRoute(app);
fileRoute(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
  