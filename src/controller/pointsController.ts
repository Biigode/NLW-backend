import { Request, Response } from "express";
import knex from "../database/connection";
class PointsController {
  async Index(request: Request, response: Response) {
    const { city, uf, items } = request.query;
    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("points")
      .join("point_item", "points.id", "=", "point_item.point_id")
      .whereIn("point_item.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");
    return response.json(points).status(200);
  }
  async Show(request: Request, response: Response) {
    const { id } = request.params;
    const point = await knex("points").where("id", id).first();
    if (!point) return response.json({ Error: "Point not found" }).status(404);

    const items = await knex("items")
      .join("point_item", "items.id", "=", "point_item.item_id")
      .where("point_item.point_id", id)
      .select("items.title");

    return response.json({ point, items }).status(200);
  }
  async Create(request: Request, response: Response) {
    const {
      image,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;
    const trx = await knex.transaction();

    const point = {
      image,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const ids = await trx("points").insert(point);
    const point_id = ids[0];

    const pointItems = items.map((item_id: number) => {
      return { item_id, point_id };
    });

    await trx("point_item").insert(pointItems);
    await trx.commit();
    return response.json({ id: ids[0], ...point }).status(200);
  }
}

export default PointsController;
