import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

export async function getDbConnection() {
    const db = await SQLite.openDatabaseAsync('quiz.db');
    return db;
}

export async function createTables() {
    //deletarBancoDeDados()

    let db = await getDbConnection();
    const queryTema = `CREATE TABLE IF NOT EXISTS temas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL
            );`;
    await db.execAsync(queryTema);

    const queryPerguntas = ` CREATE TABLE IF NOT EXISTS perguntas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                temaId INTEGER,
                texto TEXT NOT NULL,
                FOREIGN KEY (temaId) REFERENCES temas (id)
            );`;
    await db.execAsync(queryPerguntas);
    const queryAlternativas = `CREATE TABLE IF NOT EXISTS alternativas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                perguntaId INTEGER,
                alternativa CHAR NOT NULL,
                texto TEXT NOT NULL,
                correta BOOLEAN NOT NULL,
                FOREIGN KEY (perguntaId) REFERENCES perguntas (id)
            );`;
    await db.execAsync(queryAlternativas);

    await db.closeAsync();
}

async function deletarBancoDeDados() {
    const databaseName = 'quiz.db';  // Nome do arquivo do banco de dados
    const dbPath = `${FileSystem.documentDirectory}SQLite/${databaseName}`;
    
    try {
        // Verifica se o arquivo do banco existe antes de deletar
        const arquivoExiste = await FileSystem.getInfoAsync(dbPath);
        if (arquivoExiste.exists) {
            // Deleta o arquivo do banco
            await FileSystem.deleteAsync(dbPath);
            console.log("Banco de dados deletado com sucesso!");
        } else {
            console.log("Banco de dados não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao deletar o banco de dados:", error);
    }
}

export async function obterTemas() {
    let db = await getDbConnection();
    const registros = await db.getAllAsync('SELECT * FROM temas;');
    await db.closeAsync();

    return registros.map(registro => ({
        id: registro.id,
        nome: registro.nome,
    }));
}

export async function addTema(nome) {
    let db = await getDbConnection();
    let query = 'INSERT INTO temas (nome) VALUES (?);';
    const result = await db.runAsync(query, [nome]);

    const temaCadastrado = { id: result.lastInsertRowId, nome };
    await db.closeAsync();
    return temaCadastrado;
}

export async function editTema(id, nome) {
    let db = await getDbConnection();
    let query = 'UPDATE temas SET nome = ? WHERE id = ?;';
    await db.runAsync(query, [nome, id]);
    await db.closeAsync();
}

export async function deleteTema(id) {
    let db = await getDbConnection();
    let query = 'DELETE FROM temas WHERE id = ?;';
    await db.runAsync(query, [id]);
    await db.closeAsync();
}

export async function addPergunta(temaId, texto) {
    let db = await getDbConnection();
    let query = 'INSERT INTO perguntas (temaId, texto) VALUES (?, ?);';
    const result = await db.runAsync(query, [temaId, texto]);
    
    const perguntaCadastrada = { id: result.lastInsertRowId, temaId, texto };
    await db.closeAsync();
    return perguntaCadastrada;
}

export async function updatePergunta(id, temaId, texto) {
    let db = await getDbConnection();
    let query = 'UPDATE perguntas SET temaId = ?, texto = ? WHERE id = ?;';
    
    await db.runAsync(query, [temaId, texto, id]);

    const perguntaAtualizada = { id, temaId, texto };
    await db.closeAsync();
    return perguntaAtualizada;
}


export async function updateAlternativa(id, perguntaId, alternativa, texto, correta) {
    let db = await getDbConnection();
    let query = 'UPDATE alternativas SET perguntaId = ?, alternativa = ?, texto = ?, correta = ? WHERE id = ?;';
    
    await db.runAsync(query, [perguntaId, alternativa, texto, correta, id]);

    const alternativaAtualizada = { id, perguntaId, alternativa, texto, correta };
    await db.closeAsync();
    return alternativaAtualizada;
}


export async function obterPerguntasPorTema(temaId) {
    let db = await getDbConnection();
    const registros = await db.getAllAsync('SELECT * FROM perguntas WHERE temaId = ?;', [temaId]);
    await db.closeAsync();

    return registros.map(registro => ({
        id: registro.id,
        temaId: registro.temaId,
        texto: registro.texto,
    }));
}

export async function deletePergunta(id) {
    let db = await getDbConnection();
    let query = 'DELETE FROM perguntas WHERE id = ?;';
    await db.runAsync(query, [id]);
    await db.closeAsync();
}

export async function addAlternativa(perguntaId, alternativa, texto, correta) {
    let db = await getDbConnection();
    let query = 'INSERT INTO alternativas (perguntaId, alternativa, texto, correta) VALUES (?, ?, ?, ?);';
    const result = await db.runAsync(query, [perguntaId, alternativa, texto, correta]);
    
    const alternativaCadastrada = { id: result.lastInsertRowId, perguntaId, alternativa, texto, correta };
    await db.closeAsync();
    return alternativaCadastrada;
}


export async function obterPerguntaEAlternativas(perguntaId) {
    let db = await getDbConnection();

    const query = `
        SELECT 
            p.id AS perguntaId,
            p.texto AS perguntaTexto,
            a.id AS alternativaId,
            a.alternativa AS alternativaLetra,
            a.texto AS alternativaTexto,
            a.correta AS alternativaCorreta
        FROM perguntas p
        LEFT JOIN alternativas a ON p.id = a.perguntaId
        WHERE p.id = ?;
    `;

    const registros = await db.getAllAsync(query, [perguntaId]);
    await db.closeAsync();

    if (registros.length === 0) {
        return null;
    }

    const pergunta = {
        id: registros[0].perguntaId,
        texto: registros[0].perguntaTexto,
        alternativas: [],
    };

    const aa = obterAlternativasPorPergunta(pergunta.id)
    registros.forEach((registro) => {
        if (registro.alternativaId) {
            pergunta.alternativas.push({
                id: registro.alternativaId,
                letra: registro.alternativaLetra, // Adicionando a letra da alternativa
                texto: registro.alternativaTexto,
                correta: registro.alternativaCorreta === 1,
            });
        }
    });
    
    return pergunta;
}


export async function obterAlternativasPorPergunta(perguntaId) {
    let db = await getDbConnection();
    const registros = await db.getAllAsync('SELECT * FROM alternativas WHERE perguntaId = ?;', [perguntaId]);
    await db.closeAsync();
   
    return registros.map(registro => ({
        id: registro.id,
        perguntaId: registro.perguntaId,
        alternativa: registro.alternativa,
        texto: registro.texto,
        correta: registro.correta === 1,
    }));
}


export async function deleteAlternativa(id) {
    let db = await getDbConnection();
    let query = 'DELETE FROM alternativas WHERE id = ?;';
    await db.runAsync(query, [id]);
    await db.closeAsync();
}