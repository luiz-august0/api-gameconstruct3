const mysql = require('../config/mysql').pool;

class PlayerController {
    async get(req, res) {
        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM player_scores ORDER BY Player_Score DESC`,
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
        let playerName = player.toString(); 

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM player_scores WHERE Player_Name = '${playerName}'`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        if ((JSON.stringify(result) != '[]')) {
                            if (parseFloat(JSON.stringify(result[0].Player_Score)) < parseFloat(score)) {
                                conn.query(
                                    `UPDATE player_scores SET Player_Score = ${score} WHERE Player_Name = '${playerName}'`,
                                    (error, result, fields) => {
                                        if (error) { return res.status(500).send({ error: error }) }
                                        return res.status(201).json(result);
                                    }
                                )
                            } else {
                                return res.status(201).json(result);
                            }
                        } else {
                            conn.query(
                                `INSERT INTO player_scores VALUES('${playerName}', ${score})`,
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