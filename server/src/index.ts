import Server from "./structures/Server";

const server = new Server();

server.start();

process.on("exit", server.close);
process.on("SIGINT", () => {
	server.close();
	process.exit(2);
});
