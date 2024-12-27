const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

class WebSocketService {
	constructor(server) {
		this.wss = new WebSocket.Server({ server });
		this.clients = new Map();

		this.wss.on("connection", this.handleConnection.bind(this));
	}

	handleConnection(ws, req) {
		try {
			const token = req.url.split("=")[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			this.clients.set(decoded.id, ws);

			ws.on("message", (message) => this.handleMessage(decoded.id, message));
			ws.on("close", () => this.clients.delete(decoded.id));
		} catch (error) {
			ws.close();
		}
	}

	handleMessage(riderId, message) {
		// Handle different message types
		const data = JSON.parse(message);

		switch (data.type) {
			case "LOCATION_UPDATE":
				this.handleLocationUpdate(riderId, data.payload);
				break;
			case "STATUS_UPDATE":
				this.handleStatusUpdate(riderId, data.payload);
				break;
		}
	}

	sendToRider(riderId, message) {
		const client = this.clients.get(riderId);
		if (client && client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(message));
		}
	}

	broadcastToAllRiders(message) {
		this.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}
}

module.exports = WebSocketService;
