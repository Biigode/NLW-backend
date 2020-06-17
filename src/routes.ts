import express, { Request, Response } from "express";
import ItemsController from "./controller/itemsController";
import PointsController from "./controller/pointsController";

const itemsController = new ItemsController();
const pointsController = new PointsController();
const routes = express.Router();

routes.get("/", (request: Request, response: Response) => {
  return response.json({ Up: true }).status(200);
});

routes.get("/items", itemsController.Index);

routes.post("/points", pointsController.Create);
routes.get("/points", pointsController.Index);
routes.get("/points/:id", pointsController.Show);
export default routes;
