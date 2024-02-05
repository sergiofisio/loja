const { findUnique } = require("../prismaFunctions/prisma");

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const token = (req.headers["authorization"]).split(" ")[1];


    try {

        if (!token) {
            res.status(401).json({ error: "Token não encontrado" });
        } else {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded)=> {
                if (err) {

                    return res.status(408).json({ error: "Token inválido" });
                } else {
                    const user = await findUnique('user', { id: decoded.id });

                    if (!user) {
                        return res.status(408).json({ error: "Token inválido" });
                    }

                    req.user = user;

                    next();
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = verifyToken;
