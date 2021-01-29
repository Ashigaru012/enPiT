const config = require('config');

const common =
{
    protocol: `${config.host.protocol}`,
    host: `${config.host.ip_address}:${config.host.port}`,
    map_link: `${config.host.protocol}://${config.host.ip_address}:${config.host.port}`,
    chat_link: `${config.host.protocol}://${config.host.ip_address}:${config.host.port}/rooms`,
    ranking_link: `${config.host.protocol}://${config.host.ip_address}:${config.host.port}/ranking/weekly`,
    mypage_link: `${config.host.protocol}://${config.host.ip_address}:${config.host.port}/users/me`
}

module.exports = common;