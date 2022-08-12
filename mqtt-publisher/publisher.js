const mqtt = require("mqtt");

const options = {
    host: "127.0.0.1",
    port: 1883,
    // Clean session
    clean: true,
    connectTimeout: 4000,
    // Auth
    // clientId: "publisher",
    // username: "",
    // password: "",
};

const client = mqtt.connect(options);

client.on("connect", () => {
    console.log("Connected", client.connected);
    setInterval(() => {
        console.log("Publish:", new Date());
        client.publish("testTopic", "testMsg", {
            retain: true,
            qos: 1,
        });
    }, 10000);
});
