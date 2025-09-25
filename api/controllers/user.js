import { db } from "../db.js";

export const getUsers = async (_, res) => {
  const q = "SELECT * FROM usuarios";
  try {
    const result = await db.query(q);
    const dataFormatada = result.rows.map((user) => {
      if (user.data_nascimento) {
        const d = new Date(user.data_nascimento);
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        return { ...user, data_nascimento: `${dia}/${mes}/${ano}` };
      }
      return user;
    });
    return res.status(200).json(dataFormatada);
  } catch (err) {
    return res.json(err);
  }
};

export const addUser = async (req, res) => {
  const q =
    "INSERT INTO usuarios(nome, email, fone, data_nascimento, cpf, tipo_pessoa, endereco, cep, municipio, rua, numero, bairro) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";

  const values = [
    req.body.nome,
    req.body.email,
    req.body.fone,
    req.body.data_nascimento,
    req.body.cpf,
    req.body.tipo_pessoa,
    req.body.endereco,
    req.body.cep,
    req.body.municipio,
    req.body.rua,
    req.body.numero,
    req.body.bairro,
  ];

  try {
    await db.query(q, values);
    return res.status(200).json("Usuário criado com sucesso.");
  } catch (err) {
    return res.json(err);
  }
};

export const updateUser = async (req, res) => {
  const q =
    "UPDATE usuarios SET nome = $1, email = $2, fone = $3, data_nascimento = $4, cpf = $5, tipo_pessoa = $6, endereco = $7, cep = $8, municipio = $9, rua = $10, numero = $11, bairro = $12 WHERE id = $13";

  const values = [
    req.body.nome,
    req.body.email,
    req.body.fone,
    req.body.data_nascimento,
    req.body.cpf,
    req.body.tipo_pessoa,
    req.body.endereco,
    req.body.cep,
    req.body.municipio,
    req.body.rua,
    req.body.numero,
    req.body.bairro,
    req.params.id,
  ];

  try {
    await db.query(q, values);
    return res.status(200).json("Usuário atualizado com sucesso.");
  } catch (err) {
    return res.json(err);
  }
};

export const deleteUser = async (req, res) => {
  const q = "DELETE FROM usuarios WHERE id = $1";
  try {
    await db.query(q, [req.params.id]);
    return res.status(200).json("Usuário deletado com sucesso.");
  } catch (err) {
    return res.json(err);
  }
};
