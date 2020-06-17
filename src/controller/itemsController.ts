import { Request, Response } from "express";
import knex from "../database/connection";
class ItemsController {
  async Index(request: Request, response: Response) {
    const ret = await knex("items").select("*");
    const serializedItems = ret.map((item) => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://localhost:3333/uploads/${item.image}`,
      };
    });
    return response.json(serializedItems).status(200);
  }
}
export default ItemsController;
