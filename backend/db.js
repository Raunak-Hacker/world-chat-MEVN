var mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", true);

let start = new Date();
async function connectDb() {
  await mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(
      () => {
        let end = new Date() - start;
        console.info(`Connected to database in ${end}ms`);
      },
      (error) => {
        console.error(`Error connecting to database: ${error}`);
        process.exit(1);
      }
    );
}

module.exports = { connectDb };
