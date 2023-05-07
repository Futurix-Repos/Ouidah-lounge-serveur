import type {NextApiRequest, NextApiResponse} from "next";
import clientPromise from "../../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const {status, tableId} = req.query;
      let orders = [];
      const client = await clientPromise;
      if (status) {
        if (status === "success") {
          const pipeline = [
            {
              $match: {
                status: "success",
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "clientId",
                foreignField: "id",
                as: "client",
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "barmanId",
                foreignField: "id",
                as: "barman",
              },
            },

            {
              $lookup: {from: "zones", localField: "zoneId", foreignField: "id", as: "zone"},
            },
            {
              $lookup: {from: "tables", localField: "tableId", foreignField: "id", as: "table"},
            },
          ];
          orders = await client
            .db()
            .collection("orders")
            .aggregate(pipeline)
            .sort({
              updatedAt: -1,
            })
            .toArray();
          orders = orders.map((order: any) => {
            return {
              ...order,
              client: order.client[0],
              barman: order.barman[0],
              zone: order.zone[0],
              table: order.table[0],
            };
          });
        } else if (status === "pending") {
          const pipeline = [
            {
              $match: {
                status: "pending",
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "barmanId",
                foreignField: "id",
                as: "barman",
              },
            },
            {
              $lookup: {from: "zones", localField: "zoneId", foreignField: "id", as: "zone"},
            },
            {
              $lookup: {from: "tables", localField: "tableId", foreignField: "id", as: "table"},
            },
          ];

          orders = await client
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
            .sort({createdAt: -1})
            .toArray();
          orders = orders.map((order: any) => {
            return {
              ...order,
              barman: order.barman[0],
              zone: order.zone[0],
              table: order.table[0],
            };
          });
        } else if (status === "failed") {
          const pipeline = [
            {
              $match: {
                $or: [
                  {status: "failed-no-balance"},
                  {status: "failed-no-user"},
                  {status: "failed"},
                ],
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "clientId",
                foreignField: "id",
                as: "client",
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "barmanId",
                foreignField: "id",
                as: "barman",
              },
            },
            {
              $lookup: {from: "zones", localField: "zoneId", foreignField: "id", as: "zone"},
            },
            {
              $lookup: {from: "tables", localField: "tableId", foreignField: "id", as: "table"},
            },
          ];
          orders = await client.db().collection("orders").aggregate(pipeline).toArray();
          orders = orders.map((order: any) => {
            return {
              ...order,
              client: order.client[0],
              barman: order.barman[0],
              zone: order.zone[0],
              table: order.table[0],
            };
          });
        } else {
          orders = [];
        }
      } else if (tableId) {
        orders = await client
          .db()
          .collection("orders")
          .find({
            tableId,
            status: "pending",
          })
          .project({
            clientId: 0,
            barmanId: 0,
            zoneId: 0,
            tableId: 0,
          })
          .toArray();
      }
      res.send(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({msg: "Server Error"});
    }
  }

  if (req.method === "PUT") {
    try {
      const client = await clientPromise;
      const {items, orderId} = req.body;
      const response = await client
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
              updatedAt: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
            },
          }
        );
      res.send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send({msg: "Server Error"});
    }
  }
}
