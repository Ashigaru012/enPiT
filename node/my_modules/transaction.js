const logger = require('../my_modules/mylog');
const mysql = require('mysql');


let connection;

const init_db = () =>
{
    logger.info("init db");

    connection = mysql.createConnection({
        host: '172.27.0.2',
        user: 'user',
        password: 'user',
        port: 3306,
        database: 'taskul_db'
    });
    
    connection.on('error', (err) => 
    {
        logger.error('db error: ', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST')
        {
            logger.error('re-make db connection... ');
            init_db();
        }
        else
        {
            throw err;
        }
    });
    
    connection.connect(err => 
    {
        if(err)
        {
            logger.error('error db connection: ', err.stack);
            setTimeout(init_db, 1000);
            return;
        }
        logger.info('db connection success');
    });
}

init_db();


const transaction = class 
{
    begin()
    {
        return new Promise((resolve, reject) =>
        {
            const proc = () =>
            {
                connection.beginTransaction((err) => 
                {
                    logger.info("transaction begin: ");
                    
                    if(err)
                    {
                        if(err.code === 'PROTOCOL_CONNECTION_LOST')
                        {
                            proc();
                            return;
                        }
                        reject(err);
                    }
                    else resolve();
                })
            }

            proc();
        });
    }

    query(statement, params)
    {
        return new Promise((resolve, reject) => 
        {
            const proc = () =>
            {
                connection.query(statement, params, (err, results, fields) => 
                {
                    logger.info("transaction query: ", statement, params);
    
                    if(err)
                    {
                        if(err.code === 'PROTOCOL_CONNECTION_LOST')
                        {
                            proc();
                            return;
                        }
                        reject(err);
                    }
                    else resolve(results, fields);
                });
            }

            proc();
        });
    }

    commit()
    {
        return new Promise((resolve, reject) => 
        {
            const proc = () =>
            {
                connection.commit((err) => 
                {
                    logger.info("transaction commit: ");
                    
                    if(err)
                    {
                        if(err.code === 'PROTOCOL_CONNECTION_LOST')
                        {
                            proc();
                            return;
                        }
                        reject(err);
                    }
                    else resolve(err);
                });
            }

            proc();
        });
    }

    rollback(err)
    {
        return new Promise((resolve, reject) => 
        {
            connection.rollback(() => 
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

  
module.exports = new transaction();