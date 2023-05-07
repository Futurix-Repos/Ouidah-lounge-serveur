import type {NextApiRequest, NextApiResponse} from "next";
import clientPromise from "@/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const table = await client.db().collection("tables").findOne({id: req.query.id});
    res.send(table);
  } catch (error) {
    console.log(error);
    res.status(500).send({msg: "Server Error"});
  }
}
