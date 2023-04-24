var db = require("../config/connection");
var collection = require("../config/collections");
const bcrypt = require("bcrypt");
var objectId = require("mongodb").ObjectID;

module.exports = {
  findAdmin: () => {
    return new Promise(async (resolve, reject) => {
      let admin = await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne();
      resolve(admin);
    });
  },
  createAdmin: () => {
    return new Promise(async (resolve, reject) => {
      let password = await bcrypt.hash("admin", 10);
      let admin = {
        username: "admin",
        password: password,
      };
      db.get()
        .collection(collection.ADMIN_COLLECTION)
        .insertOne(admin)
        .then(() => {
          resolve();
        });
    });
  },
  doLogin: (details) => {
    return new Promise(async (resolve, reject) => {
      let admin = await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne({ username: details.username });
      if (admin) {
        bcrypt.compare(details.password, admin.password).then((response) => {
          if (response) {
            let data = { admin };
            resolve(data);
          } else {
            resolve({ loginErr: "Incorect Password" });
          }
        });
      } else {
        resolve({ loginErr: "Incorect Admin Id" });
      }
    });
  },
};
