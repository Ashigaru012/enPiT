const db = require("./mydb");
const logger = require('../my_modules/mylog');

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
                logger.info("transaction begin: ");
                if(err)reject(err);
                else resolve();
            })
        });
    }

    query(statement, params)
    {
        return new Promise((resolve, reject) => 
        {
            this.connection.query(statement, params, (err, results, fields) => 
            {
                logger.info("transaction query: ", statement, params);
                if(err) reject(err);
                else resolve(results, fields);
            });
        });
    }

    commit()
    {
        return new Promise((resolve, reject) => 
        {
            this.connection.commit((err) => 
            {
                logger.info("transaction commit: ");
                if(err) reject(err);
                else resolve(err);
            });
        });
    }

    rollback(err)
    {
        return new Promise((resolve, reject) => 
        {
            this.connection.rollback(() => 
            {
                logger.error("transaction rollback: ", err);
                reject(err); 
            });
        });
    }

    async do(process)
    {
        try
        {
            await this.begin();

            await process();

            await this.commit();
        }
        catch(err)
        {
            await this.rollback(err);
        }
    }
}

  
module.exports = new transaction(db);