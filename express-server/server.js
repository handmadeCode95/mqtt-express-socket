const http = require("http");
const express = require("express");
const webSocket = require("ws");
const mqtt = require("mqtt");

// HTTP
const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/*", (req, res) => {
    res.render("home");
});

// WebSocket
const server = http.createServer(app);
const wss = new webSocket.Server({ server });

// 웹소켓 커넥트
wss.on("connection", (socket) => {
    console.log("Connencted");
    socket.isAlive = true;

    // MQTT 커넥트
    const options = {
        host: "127.0.0.1",
        port: 1883,
        // Clean session
        clean: true,
        connectTimeout: 4000,
        // Auth
        clientId: "subscriber",
        // username: "",
        // password: "",
    };
    const client = mqtt.connect(options);

    // subscribe로 소켓 연결 시 mqtt클라이언트 생성
    socket.on("message", (data) => {
        const parsedData = JSON.parse(data.toString("utf8"));

        switch (parsedData.type) {
            case "subscribe":
                client.subscribe(parsedData.topic);
                break;
            case "unsubscribe":
                console.log("unsubscribe");
                client.unsubscribe(parsedData.topic);
                break;
        }
        // 동일 토픽 제한??
        // const subscribedTopic = [];
        // subscribedTopic.push({ clientId: client.clientId, parsedData.topic });

        // 구독한 메세지 찍기
        client.on("message", (topic, msg) => {
            console.log(`토픽: ${topic}, 메세지: ${msg}`);
            socket.send(msg.toString());
        });
    });

    socket.on("close", () => {
        console.log("Disconnected");
        client.end();
    });
});

/*
// heartbeat
setInterval(() => {
    wss.clients.forEach((connection) => {
        if (connection.isAlive === false) {
            console.log("Connection died", connection.clientId);
            return connection.terminate();
        }

        connection.isAlive = false;
        connection.ping();
    });
}, 30000);
*/

server.listen(3000, () => {
    console.log("Listening on http://localhost:3000");
});
