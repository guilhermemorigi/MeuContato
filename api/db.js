import mysql from "mysql"

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "nhr3110",
    database: "gerenciamentocontatos"
})