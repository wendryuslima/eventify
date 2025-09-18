import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { eventRoutes } from "./routes/events";
import { inscriptionRoutes } from "./routes/inscriptions";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


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


app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
);


app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
