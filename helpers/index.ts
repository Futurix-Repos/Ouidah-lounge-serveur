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



const updateStockForBundleProduct = async ({
  ingredients,
  standId,
  session,
  client,
  quantity,
}:any) => {
  for (const ingredient of ingredients) {
    const product = await client.db().collection("sellingProducts").findOne({
      productId: ingredient.id,
      standId,
      deStock: true,
    });

    if (!product) {
      throw new Error(`${ingredient.name} n'existe pas dans l'entrepôt`);
    }
    const totalToDeStock = ingredient.qty * quantity;
    await client
      .db()
      .collection("sellingProducts")
      .updateOne(
        {
          id: product.id,
        },
        {
          $inc: {
            stock: -totalToDeStock,
          },
        },
        { session }
      );
  }
};
export const updateStock = async ({
  client,
  items,
  session,
}: {
  client: MongoClient;
  items: any[];
  
  session: any;
}) => {
  for (const item of items) {
    if (item.special) continue;
    const product = await client.db().collection("sellingProducts").findOne(
      {
        standId: item.standId,
        productId: item.productId,
      },
      { session }
    );

    if (!product) {
      throw new Error(`${item.name} n'existe pas dans l'entrepôt`);
    }
    if (product.bundle) {
      await updateStockForBundleProduct({
        ingredients: item.ingredients,
        standId: item.standId,
        session,
        client,
        quantity: item.qty,
      });
    } else {
      let totalToDeStock = item.deStock
        ? item.qty * item.contenance
        : item.qty * item.sellingPerUnit.qty;


      await client
        .db()
        .collection("sellingProducts")
        .updateOne(
          {
            standId: item.standId,
            productId: item.productId,
          },
          {
            $inc: {
              stock: -totalToDeStock,
            },
          },
          { session }
        );
    }
  }
};
