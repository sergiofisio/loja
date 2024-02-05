const { findUnique } = require("../../prismaFunctions/prisma");

async function verify(req, res) {
    try {
        const data = req.body;
        
        console.log({ data });
        

        const verifyInput = await findUnique('user', { [data.input]: data.value });

        if (verifyInput)
            return res.json(true);
        return res.json(false)
    } catch (error) {
        console.log(error);

        return res.status(error.status).json({ error: error.message });

    }
}

module.exports = verify;