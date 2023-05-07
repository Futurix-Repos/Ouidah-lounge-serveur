import type {NextApiRequest, NextApiResponse} from "next"
import clientPromise from "../../db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const {name, category} = req.query
    console.log(req.query)
    const products = await client
      .db()
      .collection("sellingProducts")
      .find({
        name: {
          $regex: name ? name : ".*",
          $options: "i",
        },
        categoryId: {
          $regex: category && category !== "tout" ? category : ".*",
          $options: "i",
        },
      })
      .toArray()
    res.send(products)
  } catch (error) {
    console.log(error)
    res.status(500).send({msg: "Server Error"})
  }
}
