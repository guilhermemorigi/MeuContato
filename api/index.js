import cors from "cors";
import express from "express";
import userRoutes from "./routes/users.js";
import path from "path";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", userRoutes);

// Serve o build do React em produção
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(path.resolve(), '..', 'frontend', 'build');
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
