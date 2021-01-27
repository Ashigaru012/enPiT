const db = require("./mydb");

const transaction = class 
{
    constructor(connection)
    {
      this.connection = connection;
    }

    begin()
    {
        return new Promise((resolve, reject) =>
        {
            this.connection.beginTransaction((err) => 
            {
                if(err)reject(err);
                else resolve();
            })
        });
    }

    query(statement, params)
    {
        return new Promise((resolve, reject) => {
            this.connection.query(statement, params, (err, results, fields) => 
            {
                if(err) reject(err);
                else resolve(results, fields);
            });
        });
    }

    commit()
    {
        return new Promise((resolve, reject) => {
            this.connection.commit((err) => {
                if(err) reject(err);
                else resolve(err);
            });
        });
    }

    rollback(err)
    {
        return new Promise((resolve, reject) => {
            this.connection.rollback(() => { reject(err); });
        });
    }
}

  
module.exports = new transaction(db);