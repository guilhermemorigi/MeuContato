import cors from "cors";
import express from "express";
import userRoutes from "./routes/users.js";

const app = express();

app.use(express.json());
app.use(cors({
  origin: [
    "https://meucontato.onrender.com",
    "https://meucontato-1.onrender.com/"
  ]
}));

app.use("/", userRoutes);

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
