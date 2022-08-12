const subscribeBtn = document.getElementById("subscribe");
const unsubscribeBtn = document.getElementById("unsubscribe");
const msgSpan = document.getElementById("msg");
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
    console.log("Connected to Brower✅");
});

socket.addEventListener("message", (message) => {
    msgSpan.innerHTML = message.data + " " + new Date();
});

function messageTemplate(type, topic) {
    const msg = { type, topic };
    return JSON.stringify(msg);
}

function handleSubscribe(e) {
    socket.send(messageTemplate("subscribe", "testTopic"));
}

function handleUnsubscribe(e) {
    socket.send(messageTemplate("unsubscribe", "testTopic"));
}

subscribeBtn.addEventListener("click", handleSubscribe);
unsubscribeBtn.addEventListener("click", handleUnsubscribe);
