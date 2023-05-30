import {ObjectId} from "mongodb"
import type {NextApiRequest, NextApiResponse} from "next"
import clientPromise from "../../../db"
import {updateStock} from "@/helpers"
import axios from "axios"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const client = await clientPromise
      const {id, status} = req.query
      if (id && !status) {
        const pipeline = [
          {
            $match: {
              id,
            },
          },
          {
            $lookup: {from: "zones", localField: "zoneId", foreignField: "id", as: "zone"},
          },
          {
            $lookup: {from: "tables", localField: "tableId", foreignField: "id", as: "table"},
          },
          {
            $unwind: "$zone",
          },
          {
            $unwind: "$table",
          },
        ]
        let order = await client
          .db()
          .collection("orders")
          .aggregate(pipeline)
          .project({
            _id: 0,
            zoneId: 0,
            tableId: 0,
            clientId: 0,
            barmanId: 0,
          })
          .sort({id: -1})
          .toArray()

        res.send(order[0])
      } else if (id && status) {
        const order = await client.db().collection("orders").findOne({id})
        res.send(order)
      } else {
        res.send(null)
      }
    } catch (error) {
      console.log(error)
      res.status(500).send({msg: "Server Error"})
    }
  }

  if (req.method === "POST") {
    try {
      const {items, amount, tableId, serveurId, zoneId} = req.body

      const client = await clientPromise
      const session = client.startSession()
      const table = await client.db().collection("tables").findOne({id: tableId})
      const zone = await client.db().collection("zones").findOne({id: zoneId})
      await session.withTransaction(async () => {
        try {
          const serveur = await client.db().collection("users").findOne({
            id: serveurId,
          })
          //Update ingredients
          updateStock({client, items, session}).catch(error => {
            throw error
          })

          //Register the order
          const date = new Date()
          const createdAt = date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          const _orderId = new ObjectId()

          const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
          const hourStamp = Number(`${date.getHours()}${minute}`)
          await client
            .db()
            .collection("orders")
            .insertOne(
              {
                _id: _orderId,
                id: _orderId.toString(),
                serveur: {
                  firstname: serveur?.firstname,
                  lastname: serveur?.lastname,
                },
                serveurId,
                zoneId,
                tableId,
                zone: zone?.name,
                table: table?.name,
                stand: "",
                items,
                amount,
                discount: 0,
                status: "pending",
                createdAt,
                day: date.toLocaleDateString("fr-Fr", {day: "2-digit"}),
                month: date.toLocaleDateString("fr-Fr", {month: "long"}),
                year: date.toLocaleString("fr-Fr", {year: "numeric"}),
                hour: date.getHours(),
                min: date.getMinutes(),
                updatedAt: createdAt,
                timeStamp: new Date(),
                hourStamp,
              },
              {session}
            )
        } catch (error: any) {
          console.log(error)
          session.endSession()
          throw new Error(error)
        }
      })

      res.send({msg: "success"})
     
    } catch (error: any) {
      console.log({error})
      res.status(500).send({msg: error.message})
    }
  }
  if (req.method === "PUT") {
    try {
      const {items, orderId, amount} = req.body

      const client = await clientPromise
      const session = client.startSession()
        const updatedAt = new Date().toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
      await session.withTransaction(async () => {
        await updateStock({client, items, session})
        await client
          .db()
          .collection("orders")
          .updateOne(
            {id: orderId},
            {
              $push: {
                items: {
                  $each: items,
                },
              },
              $set: {
                updatedAt,
              },
              $inc: {
                amount: Number(amount),
              },
            },
            {
              session,
            }
          )
      })

      res.send({msg: "Order modified successfully"})
    } catch (error: any) {
      console.error(error)
      res.status(500).send({msg: error.message})
    }
  }
}
