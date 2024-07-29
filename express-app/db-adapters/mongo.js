const fs = require("fs");
const { MongoClient, ObjectId } = require('mongodb');
const NoSqlCrudAdapter = require("./nosql-crud-adapter");
const SurveyStorage = require("./survey-storage");

const readFileSync = filename => fs.readFileSync(filename).toString("utf8");

const dbConfig = {
  host: process.env.DATABASE_HOST || "localhost",
  port: process.env.DATABASE_PORT || 27017,
  database: process.env.DATABASE_DB,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD
    ? readFileSync(process.env.DATABASE_PASSWORD)
    : null
};

const url = `mongodb://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/`;
const client = new MongoClient(url);

function MongoStorage() {
  function dbConnectFunction (dbCallback) {
    client.connect()
      .then(() => {
        const db = client.db(dbConfig.database);
        dbCallback(db, () => {
          if (!!process.env.DATABASE_LOG) {
            console.log(arguments[0]);
            console.log(arguments[1]);
          }
          client.close();
        });
      })
      .catch(() => {
        console.error(JSON.stringify(arguments));
      });
  }
  const dbQueryAdapter = new NoSqlCrudAdapter(dbConnectFunction, () => new ObjectId().toString());
  return new SurveyStorage(dbQueryAdapter);
}

module.exports = MongoStorage;
