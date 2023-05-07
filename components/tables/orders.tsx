/* eslint-disable @next/next/no-img-element */
import {apiFetcher} from "@/helpers";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {useMutation, useQuery} from "react-query";
import {RiPlayListAddLine} from "react-icons/ri";
import {openMenu, openMenuItem, setOrderId} from "@/store/features/menu";
import {BanknotesIcon, CreditCardIcon} from "@heroicons/react/24/outline";
import {openStatusModal} from "@/store/features/order";
import axios from "axios";
import {queryClient} from "@/pages/_app";
function Order({order}: any) {
  const dispatch = useAppDispatch();
  const total = order.items.reduce((acc: any, item: any) => acc + item.price * item.qty, 0);
  const validateOrder = useMutation({
    mutationFn: async (data: any) => {
      await axios.put("http://localhost:7000/nfc/order", data);
    },
    onMutate: (data: any) => {},
  });
  return (
    <li
      onFocus={() => dispatch(setOrderId(order.id))}
      key={order.id}
      className="relative h-full flex flex-col space-y-4  rounded bg-white py-5 px-4 focus-within:ring-2 focus-within:ring-inset hover:bg-gray-50"
    >
      <div className="flex justify-between space-x-3">
        <div className="min-w-0 flex-1">
          {/*  <a href="#" className="block focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <p className="truncate text-sm font-medium text-gray-900">{order.id}</p>
          </a> */}
        </div>
        <time
          dateTime={order.updatedAt}
          className="flex-shrink-0 whitespace-nowrap text- font-semibold text-black"
        >
          {order.updatedAt}
        </time>
      </div>
      <ul
        role="list"
        className="relative z-[40]  overflow-y-auto p-2 h-full divide-y divide-gray-200"
      >
        {order.items.map((item: any) => (
          <li key={item.id} className="flex py-4">
            <img className="h-10 w-10 rounded-full" src={item.image} alt="" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">{`${item.qty} * ${item.price} FCFA`}</p>
            </div>
          </li>
        ))}
      </ul>
      {/* <button
        onClick={() => {
          dispatch(setOrderId(order.id));
          dispatch(openMenuItem());
        }}
        className="mt-4 bg-green-500 text-white relative inline-flex border rounded flex-1 items-center justify-center rounded-br-lg px-2 py-4  font-medium  hover:text-white"
      >
        <BanknotesIcon className="h-5 w-5 text-white" aria-hidden="true" />
        <span className="ml-3">Ajouter un produit</span>
      </button> */}
      <button
        onClick={() => {
          dispatch(setOrderId(order.id));
          dispatch(openStatusModal());
          validateOrder.mutate({orderId: order.id, amount: total});
        }}
        className="mt-4 bg-blue-600 text-white inline-flex border rounded flex-1 items-center justify-center rounded-br-lg px-2 py-4 text-sm font-medium  hover:text-white"
      >
        <CreditCardIcon className="h-5 w-5 text-white" aria-hidden="true" />
        <span className="ml-3">Paiement {total.toLocaleString()} FCFA</span>
      </button>
    </li>
  );
}
export default function Orders() {
  const menuIsOpen = useAppSelector((state) => state.order.statusModal);
  const currentTable = useAppSelector((state) => state.table.tab);
  const {
    isLoading,
    error,
    data: orders,
  } = useQuery({
    queryKey: ["orders", "table", currentTable],
    queryFn: () => apiFetcher(`/api/orders?tableId=${currentTable}`),
    refetchInterval: menuIsOpen ? 1000 : 10000,
  });
  if (!orders?.length) {
    return (
      <div className="h-[80vh] border flex items-center justify-center text-lg font-bold uppercase">
        Aucune commande en cours sur cette table
      </div>
    );
  }
  return (
    <ul role="list" className="divide-y divide-gray-200 border rounded  overflow-hidden h-[80vh]">
      {orders?.map((order: any) => (
        <Order key={order.id} order={order} />
      ))}
    </ul>
  );
}
