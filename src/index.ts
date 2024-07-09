import { Manager } from "./manager.js";
import { ConfigDataService } from "./services/ConfigDataService.js";
import express, { Express, Request, Response } from "express";
const configData = new ConfigDataService().data;

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
configData.bot.TOKEN.forEach((token, index) => {
  const byteblaze = new Manager(configData, index, configData.utilities.MESSAGE_CONTENT.enable);
  // Anti crash handling
  process
    .on("unhandledRejection", (error) => byteblaze.logger.unhandled("AntiCrash", error))
    .on("uncaughtException", (error) => byteblaze.logger.unhandled("AntiCrash", error))
    .on("uncaughtExceptionMonitor", (error) => byteblaze.logger.unhandled("AntiCrash", error))
    .on("exit", () =>
      byteblaze.logger.info("ClientManager", `Successfully Powered Off ByteBlaze, Good Bye!`)
    )
    .on("SIGINT", () => {
      byteblaze.logger.info("ClientManager", `Powering Down ByteBlaze...`);
      process.exit(0);
    });
  byteblaze.start();
  byteblaze.login(token);
});
