import type {NextApiRequest, NextApiResponse} from "next";
import clientPromise from "../../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const zoneId = req.query.id;
    const tables = await client.db().collection("tables").find({zoneId}).toArray();
    res.send(tables);
  } catch (error) {
    console.log(error);
    res.status(500).send({msg: "Server Error"});
  }
}
