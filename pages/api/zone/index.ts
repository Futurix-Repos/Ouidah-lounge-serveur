import type {NextApiRequest, NextApiResponse} from "next";
import clientPromise from "@/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const zone = await client.db().collection("zones").findOne({id: req.query.id});
    res.send(zone);
  } catch (error) {
    console.log(error);
    res.status(500).send({msg: "Server Error"});
  }
}
