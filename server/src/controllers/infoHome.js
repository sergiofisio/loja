const { findMany } = require("../prismaFunctions/prisma");

const infoHome = async (req, res) => {
    const { table } = req.params;

    let include = {}
    switch (table) {
        case 'product':
            include = {
                images: true,
            }
            break;
        case 'partner':
            include = {
                cart: true
            }
            break;
    }
    try {

        const info = await findMany(table,
            include
        )

        res.json({ info })

    } catch (error) {
        console.log(error);

    }
};

module.exports = infoHome;