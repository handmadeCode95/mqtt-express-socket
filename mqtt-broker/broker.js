const aedes = require("aedes")();
const server = require("net").createServer(aedes.handle);
const PORT = 1883;

server.listen(PORT, function () {
    console.log("server started and listening on port", PORT);
});

// 클라이언트 에러
aedes.on("clientError", function (client, err) {
    console.error("client error", client.id, err.message, err.stack);
});

// 연결에러
aedes.on("connectionError", function (client, err) {
    console.error("client error", client, err.message, err.stack);
});

// 발행
aedes.on("publish", function (packet, client) {
    console.log("Published", new Date());
    if (packet && packet.payload) {
        console.log(
            "Publish packet:",
            packet.topic.toString(),
            packet.payload.toString()
        );
    }
    if (client) {
        console.log("Message from:", client.id);
    }
});

// 구독
aedes.on("subscribe", function (subscriptions, client) {
    if (client) {
        console.log("Subscribe:", subscriptions, client.id);
    }
});

// 구독취소
aedes.on("unsubscribe", function (subscriptions, client) {
    if (client) {
        console.log("Unsubscribe:", subscriptions, client.id);
    }
});

// 연결종료
aedes.on("clientDisconnect", function (client) {
    if (client) {
        console.log("Disconnect:", client.id);
    }
});
