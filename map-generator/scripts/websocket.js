/**
 * @type WebSocket
 */
let socket;

function setupSocket() {
	socket = new WebSocket("ws://localhost:8080");

	socket.onopen = (e) => {
		socket.send("a:1");
	};

	/**
	 *
	 * @param {MessageEvent} e
	 */
	socket.onmessage = (e) => {
		/**
		 * @type string
		 */
		const message = e.data.toString();
		console.log("Message Received:", message);
		if (message.startsWith("s:")) {
			[gridDimensions, gridSize] = message
				.slice(2)
				.split(" ")
				.map((m) => parseInt(m));
			init();
			display = true;
		} else {
		}
	};
}
