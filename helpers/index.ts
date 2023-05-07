import axios from "axios"
import {MongoClient} from "mongodb"

export const fetcher = async (url: string) => {
  const response = await axios.get(`http://localhost:7000/${url}`)
  return response.data
}

export const apiFetcher = async (url: string) => {
  const response = await axios.get(url)
  return response.data
}

export const getStatus = (status: string) => {
  if (status === "success") {
    return "success"
  } else if (status === "pending") {
    return "en attente"
  } else if (status.includes("no-balance")) {
    return "montant insuffisant"
  } else if (status.includes("no-user")) {
    return "utilisateur non existant"
  } else {
    return "échouée"
  }
}
export const updateStock = async ({
  client,
  items,
  session,
}: {
  client: MongoClient
  items: any[]

  session: any
}) => {
  for (const item of items) {
    if (item.special) continue

    const product = await client.db().collection("sellingProducts").findOne(
      {
        productId: item.productId,
        deStock: true,
      },
      {session}
    )

    if (!product) {
      throw new Error(`${item.name} n'existe pas dans l'entrepôt`)
    }

    let totalToDestock = item.deStock
      ? item.qty * item.contenance
      : item.qty * item.sellingPerUnit.qty

    if (totalToDestock > product.stock) {
      throw new Error(`${item.name} stock insuffisant`)
    }

    await client
      .db()
      .collection("sellingProducts")
      .updateOne(
        {
          productId: item.productId,
          deStock: true,
        },
        {
          $inc: {
            stock: -totalToDestock,
          },
        },
        {session}
      )
  }
}
