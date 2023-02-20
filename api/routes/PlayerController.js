const mysql = require('../config/mysql').pool;

class PlayerController {
    async get(req, res) {
        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT CONCAT(Player_Name,"- ",Player_Score) AS "" FROM player_scores ORDER BY Player_Score DESC`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        return res.status(201).json(result);
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

    async post(req, res) {
        const { player, score } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM player_scores WHERE Player_Name = "${player}"`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        if (JSON.stringify(result) != '[]') {
                            conn.query(
                                `UPDATE player_scores SET Player_Score = ${score} WHERE Player_Name = "${player}"`,
                                (error, result, fields) => {
                                    if (error) { return res.status(500).send({ error: error }) }
                                    return res.status(201).json(result);
                                }
                            )
                        } else {
                            conn.query(
                                `INSERT INTO player_scores VALUES("${player}", ${score})`,
                                (error, result, fields) => {
                                    if (error) { return res.status(500).send({ error: error }) }
                                    return res.status(201).json(result);
                                }
                            )
                        }
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }
}

export default new PlayerController();