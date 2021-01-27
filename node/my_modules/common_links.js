const config = require('config');

const common_links =
{
    map_link: `http://${config.host.ip_address}:${config.host.port}`,
    chat_link: `http://${config.host.ip_address}:${config.host.port}/rooms`,
    ranking_link: `http://${config.host.ip_address}:${config.host.port}/ranking/weekly`,
    mypage_link: `http://${config.host.ip_address}:${config.host.port}/users/me`
}

module.exports = common_links;