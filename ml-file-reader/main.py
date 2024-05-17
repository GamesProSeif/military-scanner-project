import asyncio
import websockets

async def handle_message(websocket, message):
	if message == "a:?":
		await websocket.send("a:0")
		print("Sent response to 'a:?'")
	elif message.startswith("r:"):
		try:
			rate = int(message.split(":")[1])
			# Use asyncio.create_task to run send_data concurrently
			await asyncio.create_task(send_data(websocket, rate))
		except ValueError:
			print("Invalid rate received from server")
	else:
		print(f"Unknown message received: {message}")

async def send_data(websocket, rate):
	while True:
		try:
			with open("data.txt", "r") as file:
				data = file.read()
			await websocket.send(data)
			await asyncio.sleep(1 / rate)
		except FileNotFoundError:
			print("Error: Data file 'data.txt' not found")
			break

async def main():
	uri = "ws://localhost:8080"
	async with websockets.connect(uri) as websocket:
		# Continuously listen for messages and handle them
		while True:
			message = await websocket.recv()
			await handle_message(websocket, message)

if __name__ == "__main__":
	try:
		asyncio.run(main())
	except websockets.ConnectionClosedOK:
		print("end of session - exiting program...")
