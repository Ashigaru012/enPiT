
const make_hf_links = (user_id) =>
{
    return {
        map_link: `http://localhost:3000/test/map4/${user_id}`,
        chat_link: `http://localhost:3000/test/rooms/${user_id}`,
        ranking_link: `http://localhost:3000/test/ranking/weekly/${user_id}`,
        mypage_link: `http://localhost:3000/test/users/${user_id}/${user_id}`
    };
}

module.exports = make_hf_links;