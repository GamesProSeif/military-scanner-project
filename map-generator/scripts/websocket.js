const socket = new WebSocket("ws://localhost:8080");

socket.onopen = (e) => {
	socket.send("a:1");
}