const fs = require("fs").promises;
const winston = require("winston");
const path = require("path");
async function commitAndPushErrorLog() {
  const commands = [
    "git add ../../log/error.json",
    `git commit -m "Update error log"`,
    "git push origin main",
  ];

  for (const command of commands) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  }
}

const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, "../log/error.log"),
    }),
  ],
});

async function writeLogError(error, route) {
  console.log({ error, route });
  const errorLogPath = path.join(__dirname, "../../log/error.json");
  const errorDetails = {
    error: error,
    path: route,
    timestamp: new Date().toISOString(),
  };

  try {
    let data = await fs.readFile(errorLogPath);

    let errors = JSON.parse(data.toString());
    errors.push(errorDetails);

    await fs.writeFile(errorLogPath, JSON.stringify(errors, null, 2));
    await commitAndPushErrorLog();
  } catch (error) {
    console.error({ error });
    logger.error("Error accessing or updating the log file:", error);
  }
}

module.exports = writeLogError;
