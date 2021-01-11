# Taskul

# ミッション
地元住民たちが地域の垣根を越えて協力し、課題解決をしていくなかで、地域間の継続的な交流を促す。

# 目的
・現状、日常の中で発生している小さな課題は地域間や地元住民の間でも共有されていないものが多い。<br>
・日常の小さな課題を共有することによってそれぞれの得意な部分を生かしてスムーズに問題解決を行えるのではないか。<br>
・Taskulを使用することで、継続的に発生する小さな課題を住民の間で共有、解決ができ、地域の人との間で継続的な交流を促せる。<br>

# 目標
(数値化された目標)(数値は仮)<br>
・3ヵ月で20件以上の依頼達成もしくは60％以上の依頼達成。<br>
・6ヵ月間で平均月5件の依頼達成(継続的利用の確認)。<br>
・依頼者と実行者が異なる地区の活動が6ヵ月で15件以上される。<br>

# シナリオ
・スキマ時間のある利用者が地域の困りごとを受信する「アンテナ」を設置する。<br>
・依頼をしたい人がマップに表示されたアンテナに依頼を一斉送信<br>
・アンテナで受信した困りごとの中から一つを選び、依頼者とともに解決を目指す。<br>

# 開発環境
開発には docker を使用しています<br>
データベース: mysql<br>
言語: node.js<br>
フレームワーク: express<br>



# 実行方法
1.次のコマンドを入力し、コンテナを起動。(--buildオプションは git から pull したときの初回起動時のみ必要で、以降は無くてもいいです)
```
docker-compose up -d --build
```
起動したコンテナを確認するには次のコマンドを入力する
```
docker-compose ps
```

2.次のコマンドを入力し、node コンテナ内に入る
```
docker-compose exec node /bin/sh
```

3.サーバーを起動する
```
yarn run dev
```
サーバーを起動したら `http://localhost:3000` からアクセス可能。<br>
テスト用のページURLの例) `http://localhost:3000/test/map?addr=福島県大沼郡会津美里町観音北甲`<br>
コンテナから出る時は、Ctl を押したまま P と Q を順番に押すか、次のコマンドを入力する
```
exit
```
または、
```
quit
```

起動したコンテナを停止するときは
```
docker-compose down
```

URL一覧<br>
マップ表示テスト<br>
`http://localhost:3000/test/map?{パラメータ}`<br>
例) `http://localhost:3000/test/map?addr=福島県大沼郡会津美里町瀬戸町甲`
<br>

Google Static Maps API を使用したマップ表示テスト<br>
`http://localhost:3000/test/map2?{パラメータ}`<br>
例) `http://localhost:3000/test/map2?center=37.461618,139.839123`<br>

リアルタイムでアンテナを表示できるマップテスト<br>
`http://localhost:3000/test/map3/:user_id?{パラメータ}`<br>
例）`http://localhost:3000/test/map3/1?center=37.461618,139.839123`

チャットテスト<br>
`http://localhost:3000/test/chat`<br>
`http://localhost:3000/test/chat2`<br>

依頼、請け負いテスト<br>
`http://localhost:3000/test/requests`<br>