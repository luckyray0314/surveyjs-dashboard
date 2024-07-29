function NoSqlCrudAdapter (dbConnectFunction, getId) {
  function getObjects (collectionName, filter, callback) {
    filter = filter || [];
    let query = {};
    filter.forEach(fi => query[fi.field] = fi.value);
    dbConnectFunction((db, finalizeCallback) => {
      db.collection(collectionName).find(query).toArray()
        .then((results) => {
          callback(results);
          finalizeCallback(results);
        })
        .catch(() => {
          console.error(JSON.stringify(arguments));
        });
      }
    );
  }

  function getObjectsPaginated (collectionName, filter, order, offset, limit, callback) {
    filter = filter || [];
    let query = {};
    filter.forEach(fi => {
      if(!!fi.value) {
        let val = fi.value;
        query[fi.field] = val;
      }
    });
    let sort = {};
    order.forEach(fi => {
      sort[fi.field] = fi.value == "desc" ? -1 : 1;
    });
    console.log("getObjectsPaginated:");
    console.log("filter: ", JSON.stringify(filter));
    console.log("order: ", JSON.stringify(order));
    console.log("query: ", JSON.stringify(query));
    console.log("sort: ", JSON.stringify(sort));
    dbConnectFunction((db, finalizeCallback) => {
      db.collection(collectionName).count(query).then(count => {
        db.collection(collectionName).find(query).sort(sort).skip(parseInt(offset)).limit(parseInt(limit)).toArray()
        .then((results) => {
          const result = { data: results, totalCount: count };
          callback(result);
          finalizeCallback(result);
        })
        .catch(() => {
          console.error(JSON.stringify(arguments));
        });
      });
    });
  }

  function deleteObject (collectionName, idValue, callback) {
    dbConnectFunction((db, finalizeCallback) => {
      db.collection(collectionName).deleteMany({ id: idValue })
        .then((results) => {
          callback(results);
          finalizeCallback(results);
        })
        .catch(() => {
          console.error(JSON.stringify(arguments));
        });
      }
    );
  }

  function createObject (collectionName, object, callback) {
    object.id = object.id || getId();
    dbConnectFunction((db, finalizeCallback) => {
      db.collection(collectionName).insertOne(object)
        .then((results) => {
          callback(object.id);
          finalizeCallback(results);
        })
        .catch(() => {
          console.error(JSON.stringify(arguments));
        });
      }
    );
  }

  function updateObject (collectionName, object, callback) {
    dbConnectFunction((db, finalizeCallback) => {
      db.collection(collectionName).updateOne({ id: object.id }, { $set: object })
        .then((results) => {
          callback(results);
          finalizeCallback(results);
        })
        .catch(() => {
          console.error(JSON.stringify(arguments));
        });
      }
    );
  }

  return {
    create: createObject,
    retrieve: getObjects,
    update: updateObject,
    delete: deleteObject,
    retrievePaginated: getObjectsPaginated
  }
}

module.exports = NoSqlCrudAdapter;