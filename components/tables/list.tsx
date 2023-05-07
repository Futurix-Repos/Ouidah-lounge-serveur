import {apiFetcher} from "@/helpers";
import {setCurrentTable} from "@/store/features/table";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {useQuery} from "react-query";
import {RxListBullet} from "react-icons/rx";
import {RiPlayListAddLine} from "react-icons/ri";
import clsx from "clsx";
import {openMenu} from "@/store/features/menu";
import {AiOutlineLoading3Quarters} from "react-icons/ai";
import {resetCart} from "@/store/features/cart";
import Link from "next/link";
function Table({table}: any) {
  const tableId = useAppSelector((state) => state.table.tab);
  const zoneId = useAppSelector((state) => state.zone.tab);
  const dispatch = useAppDispatch();
  const {
    isLoading,
    error,
    data: orders,
  } = useQuery({
    queryKey: ["orders", "table", table.id],
    queryFn: () => apiFetcher(`/api/orders?tableId=${table.id}`),
    refetchInterval: 1000,
  });

  return (
    <Link
      href={
        orders?.length
          ? `/table/busy/${table.id}?orderId=${orders[0].id}&zoneId=${zoneId}`
          : `/table/${table.id}?zoneId=${zoneId}`
      }
      className={clsx(
        "h-48 border flex flex-col relative col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
      )}
    >
      <div
        className={clsx(
          tableId === table.id && "bg-green-500",
          "flex w-full h-[100%] items-center justify-between space-x-6 p-6"
        )}
      >
        <div className="flex-1 truncate">
          <div className="flex items-center justify-center space-x-3">
            <h3 className="truncate text-sm font-medium text-gray-900">{table.name}</h3>
            <span
              className={clsx(
                orders?.length >= 1 ? "bg-red-600" : "bg-green-600",
                "inline-block flex-shrink-0 rounded-full  px-4 py-2 text-xs font-medium text-white"
              )}
            >
              {orders?.length >= 1 ? "Occupée" : "Disponible"}
            </span>
          </div>
          {/*  <p className="mt-1 truncate text-sm text-gray-500">{person.title}</p> */}
        </div>
      </div>
      <div className="">
        {/*  <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <button className="hover:bg-green-200 relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium ">
              <RxListBullet className={clsx("text-black", "h-5 w-5")} aria-hidden="true" />
              <span className={clsx("text-black", "ml-3")}>Commande en cours</span>
            </button>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <button
              disabled={orders?.length > 0}
              onClick={() => {
                dispatch(setCurrentTable(table.id));
                dispatch(resetCart());
                dispatch(openMenu());
              }}
              className="relative hover:bg-green-200 disabled:bg-black disabled:text-white  inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-black hover:text-gray-900"
            >
              <RiPlayListAddLine className={clsx("h-5 w-5")} aria-hidden="true" />
              <span className={clsx("ml-3")}>Nouvelle commande</span>
            </button>
          </div>
        </div> */}
      </div>
    </Link>
  );
}
export default function Tables() {
  const currentZone = useAppSelector((state) => state.zone.tab);
  const {
    isLoading,
    error,
    data: tables,
  } = useQuery({
    queryKey: ["tables", currentZone],
    queryFn: () => apiFetcher(`/api/tables?id=${currentZone}`),
  });

  if (!currentZone) return null;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <AiOutlineLoading3Quarters className="w-10 h-10 animate-spin" />
      </div>
    );
  }
  if (error) {
    return <div>Error</div>;
  }
  return (
    <ul
      role="list"
      className="h-[70vh] overflow-y-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-4 p-4"
    >
      {tables.map((table: any) => (
        <Table key={table.id} table={table} />
      ))}
    </ul>
  );
}
