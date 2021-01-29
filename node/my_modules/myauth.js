const OAuth2Client = require('google-auth-library').OAuth2Client;
const config = require('config');
const logger = require("./mylog");

//const client_id = '25935528938-pdch6ucs5og14rfi3o5s093bq33cbrsb.apps.googleusercontent.com';
//const secret = 'mjJxtqgVLFHNU_g2LzQHcfSd';
//const client_id = '362716004128-4n48jhqt64vsm5go8t68m69voc4p0p2s.apps.googleusercontent.com';
//const secret = 'UXLGGwt-Q2ZrieOSsJItPuHP';
const client_id = config.api.auth.client_id;
const secret = config.api.auth.secret;


const callback_url = `${config.host.ip_address}:${config.host.port}`;

const verify = async (token) => 
{
    try 
    {
        const client = new OAuth2Client(client_id, secret, callback_url);

        const ticket = await client.verifyIdToken(
        {
            idToken: token,
            audience: client_id
        });

        const payload = ticket.getPayload();
        logger.info('payload', JSON.stringify(payload, null, 2));

        const user = 
        {
            name: payload.name,
            sub: payload.sub        //google が生成した、全 google account で一意の識別子
        }

        return user;
    }
    catch(err)
    {
        logger.error(err);
        throw err;
    }
}

const my_auth = 
{
    verify: verify,
    client_id: client_id,
    secret: secret,
    callback_url: callback_url
};

module.exports = my_auth;