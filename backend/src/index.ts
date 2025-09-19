import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { eventRoutes } from "./routes/events";
import { inscriptionRoutes } from "./routes/inscriptions";
import { auditRoutes } from "./routes/audit";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3001;

import { setSocketInstance } from "./services/socket";

setSocketInstance(io);

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/events", eventRoutes);
app.use("/api/events", inscriptionRoutes);
app.use("/api/audit", auditRoutes);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

io.on("connection", (socket) => {
  socket.on("join-event", (eventId: number) => {
    socket.join(`event-${eventId}`);
  });

  socket.on("leave-event", (eventId: number) => {
    socket.leave(`event-${eventId}`);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Socket.IO habilitado`);
});
