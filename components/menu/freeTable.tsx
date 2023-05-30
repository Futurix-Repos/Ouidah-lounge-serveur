/* eslint-disable @next/next/no-img-element */
import React, {Fragment, useState, useEffect} from "react"
import {Dialog, Menu, Transition} from "@headlessui/react"
import {
  Bars3BottomLeftIcon,
  CheckBadgeIcon,
  CogIcon,
  HeartIcon,
  HomeIcon,
  PhotoIcon,
  PlusIcon as PlusIconOutline,
  RectangleStackIcon,
  Squares2X2Icon as Squares2X2IconOutline,
  TrashIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import {
  Bars4Icon,
  CheckIcon,
  MagnifyingGlassIcon,

  PlusIcon as PlusIconMini,
  Squares2X2Icon as Squares2X2IconMini,
} from "@heroicons/react/20/solid"
import clsx from "clsx"
import {useMutation, useQuery} from "react-query"
import {apiFetcher} from "../../helpers"
import {useAppDispatch, useAppSelector} from "../../store/hooks"
import {setProductCategory, setSearchTerm} from "../../store/features/productCategory"
import {
  addItem,
  increaseItemQty,
  decreaseItemQty,
  deleteItem,
  resetCart,
} from "../../store/features/cart"
import {Field, Form, Formik} from "formik"
import axios, {AxiosError} from "axios"
import {openStatusModal} from "@/store/features/order"
import {setOrderId} from "@/store/features/menu"
import {queryClient} from "@/pages/_app"
import {useRouter} from "next/router"
import Link from "next/link"
import {useSession} from "next-auth/react"
import {BarLoader} from "react-spinners"

function Categories() {
  const dispatch = useAppDispatch()
  const currentCategory = useAppSelector((state) => state.productCategory.tab)
  const {
    isLoading,
    error,
    data: categories,
  } = useQuery({
    queryKey: "categories",
    queryFn: () => apiFetcher("/api/categories"),
  })
  return (
    <div className="mt-3 sm:mt-2">
      <div className="hidden sm:block">
        <nav className="border p-2 whitespace-nowrap border-cyan-700  space-x-12 bg-[#EAF0F0] overflow-x-auto w-full">
          {categories
            ?.concat({id: "", name: "tout"})
            .reverse()
            .map((category: any) => (
              <button
                key={category.name}
                onClick={() => dispatch(setProductCategory(category.id))}
                className={clsx(
                  category.name === currentCategory
                    ? "bg-[#4A5C2F] text-white"
                    : "text-black hover:bg-[#738d4b] border border-black",
                  "shadow-lg px-3 w-48 py-6  font-medium text-sm rounded-md first-letter:uppercase"
                )}
              >
                {category.name}
              </button>
            ))}
        </nav>
      </div>
    </div>
  )
}
function Products() {
  const dispatch = useAppDispatch()
  const productCategory = useAppSelector((state) => state.productCategory.tab)
  const searchTerm = useAppSelector((state) => state.productCategory.searchTerm)

  //Only products for the area
  const {
    isLoading,
    error,
    data: products,
  } = useQuery({
    queryKey: ["products", searchTerm, productCategory],
    queryFn: () => apiFetcher(`/api/products?category=${productCategory}&name=${searchTerm}`),
  })

  return (
    <section className="relative z-50 mt-8 pb-16" aria-labelledby="gallery-heading">
      <ul
        role="list"
        className="p-2 max-h-[60vh]  overflow-y-auto mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4"
      >
        {products?.map((product: any) => (
          <li
            key={product.name}
            onClick={() => dispatch(addItem(product))}
            className="bg-slate-700 flex flex-col items-center justify-center space-y-4 rounded-md"
          >
            <h3 className="text-center mt-6 text-lg font-semibold leading-8 tracking-tight text-white">
              {product.name}
            </h3>
            <p className="text-base leading-7 text-gray-300">
              {Number(product.price).toLocaleString("en-US")} FCFA
            </p>
            <p className="text-sm leading-6 text-gray-500">{product.location}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
function Cart() {
  const {data: session} = useSession()
  console.log({session})
  const router = useRouter()
  const [discount, setDiscount] = useState(0)
  const tableId = router.query.id
  const zoneId = router.query.zoneId
  const dispatch = useAppDispatch()
  const [registered, setRegistered] = useState(false)
  const items = useAppSelector((state) => state.cart.content)
  const subTotal = items.reduce((acc, item) => acc + item.price * item.qty, 0)

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/api/order", data)
      return response.data
    },
    onMutate: (data: any) => {},
    onSuccess: (data: any) => {
      setRegistered(true)
    },
    onError: (error: AxiosError<{msg: string}>) => {},
  })

  if (mutation.isSuccess) {
    return (
      <div className=" h-full flex flex-col items-center justify-center">
        <CheckBadgeIcon className="w-24 h-24 text-green-600" />
        <p>Paiement réussi.</p>
        <button
          onClick={() => {
            dispatch(resetCart())
            mutation.reset()
            router.push("/")
          }}
          className="mt-4 hover:bg-green-900 py-3 rounded-md px-4 bg-green-600 text-white"
        >
          Prendre une nouvelle commande
        </button>
      </div>
    )
  }
  if (!items.length)
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4 ">
        <svg
          width="88"
          height="88"
          viewBox="0 0 88 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.10352e-05 83.92C6.10352e-05 86.16 1.80006 87.96 4.04006 87.96H56.0001C58.2401 87.96 60.0401 86.16 60.0401 83.92V80H6.10352e-05V83.92ZM30.0001 31.96C15.0001 31.96 6.10352e-05 40 6.10352e-05 56H60.0001C60.0001 40 45.0001 31.96 30.0001 31.96ZM10.4801 48C14.9201 41.8 24.3601 39.96 30.0001 39.96C35.6401 39.96 45.0801 41.8 49.5201 48H10.4801ZM6.10352e-05 64H60.0001V72H6.10352e-05V64ZM68.0001 16V0H60.0001V16H40.0001L40.9201 24H79.1601L73.5601 80H68.0001V88H74.8801C78.2401 88 81.0001 85.4 81.4001 82.12L88.0001 16H68.0001Z"
            fill="#2E636E"
          />
        </svg>
        <p>Pas de produits ajoutés </p>
      </div>
    )
  return (
    <div className="relative flex h-full flex-col space-y-4 ">
      <ul role="list" className="space-y-3 divide-gray-200 h-[60%] p-2 overflow-y-auto border">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between py-4 px-2 border shadow-xl bg-slate-100 rounded-sm"
          >
            <div className="flex">
              <div className="ml-3">
                <p className="text-xs w-12 border truncate font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">
                  <span className="text-green-500 font-bold text-sm">{item.qty}</span>
                  {` * ${Number(item.price)} FCFA`}
                </p>
              </div>
            </div>
            <div className="flex space-x-4  items-center justify-center">
              <button
                onClick={() => dispatch(increaseItemQty(item))}
                className="rounded-lg border w-8 p-1 bg-blue-500 text-white hover:bg-blue-400"
              >
                +
              </button>

              <button
                onClick={() => dispatch(decreaseItemQty(item))}
                className="rounded-lg border p-1 w-8 bg-blue-500 text-white hover:bg-blue-400"
              >
                -
              </button>
              <button
                onClick={() => dispatch(deleteItem(item))}
                className="rounded-lg border p-2 bg-red-500 text-white hover:bg-red-400"
              >
                <TrashIcon className="w-5 h-5 " />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="sticky bottom-0 flex-none  border-gray-200 bg-gray-50 p-6">
      <div className="flex items-center justify-between border-gray-200 pt-6 text-gray-900">
            <dt>Total</dt>
            <dd className="text-base">{Number(subTotal).toLocaleString()} FCFA</dd>
          </div>
      </div>
      <div className=" mx-1 flex w-full space-x-2">
        <div className="mx-1 flex w-full space-x-2">
          {mutation.isSuccess && <p>Commande réussie.</p>}
          {mutation.isError && (
            <div className="p-2 mt-6 flex items-center justify-between space-x-4 border w-full">
              <button
                onClick={async () => {
                  mutation.mutate({
                    items,
                    amount: subTotal,
                    zoneId,
                    tableId,
                    //@ts-ignore
                    serveurId: session?.user?.email.id,
                  })
                }}
                className="w-1/2 border rounded-md py-2 px-4 bg-green-500 hover:bg-green-700 text-white"
              >
                {mutation.error?.response?.data?.msg} Réssayer
              </button>
              <button
                type="button"
                onClick={() => {
                  dispatch(resetCart())
                  mutation.reset()
                }}
                className="w-1/2 border rounded-md py-2 px-4 bg-red-500 hover:bg-red-700 text-white"
              >
                Annuler
              </button>
            </div>
          )}
          {mutation.isLoading && (
            <div className="py-4 w-full border mt-2 rounded-md px-2">
              <BarLoader color="#2E636E" loading={true} height={4} width={"100%"} />
            </div>
          )}
          {mutation.isError && (
            <div className="border p-2 text-white bg-red-500 animate-pulse">
              {mutation.error?.response?.data?.msg}
            </div>
          )}
          {mutation.isIdle && (
            <div className="mt-4 flex border p-2 justify-around  items-center space-x-4 w-full">
              <button
                onClick={async () => {
                  mutation.mutate({
                    items,
                    amount: subTotal,
                    zoneId,
                    tableId,
                    //@ts-ignore
                    serveurId: session?.user?.email.id,
                  })
                }}
                className="w-1/3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Valider
              </button>

              <button
                type="button"
                onClick={() => {
                  dispatch(resetCart())
                }}
                className="w-1/3 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
       
      </div>
    </div>
  )
}
function SearchBar() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const zoneId = router.query.zoneId
  const tableId = router.query.id
  const {data: table} = useQuery({
    queryKey: ["table", tableId],
    queryFn: () => apiFetcher(`/api/table?id=${tableId}`),
  })
  const {data: zone} = useQuery({
    queryKey: ["zone", zoneId],
    queryFn: () => apiFetcher(`/api/zone?id=${zoneId}`),
  })
  const searchTerm = useAppSelector((state) => state.productCategory.searchTerm)
  return (
    <header className="w-full">
      <div className="h-12 border mb-2 flex items-center justify-center text-lg font-bold">
        Nouvelle commande pour la {table?.name}-{zone?.name}
      </div>
      <div className=" border  relative z-10 flex h-12 flex-shrink-0 border-b border-gray-600 bg-white shadow-sm">
        <div className="flex flex-1 justify-between px-4 sm:px-6">
          <div className="flex flex-1">
            <div className="flex w-full md:ml-0">
              <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                  <MagnifyingGlassIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                </div>

                <input
                  name="desktop-search-field"
                  id="desktop-search-field"
                  className="hidden h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:block"
                  placeholder="Rechercher un produit"
                  value={searchTerm}
                  onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  type="search"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
export default function MenuFreeTableComponent() {
  return (
    <>
      <div className="flex border h-[100vh] ">
        {/* Content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Main content */}
          <div className="flex flex-1 items-stretch overflow-hidden">
            <main className="flex-1 overflow-hidden">
              <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                <SearchBar />

                <Categories />

                <Products />
              </div>
            </main>

            {/* Details sidebar */}
            <aside className="hidden h-screen w-[20rem] overflow-y-auto border-l border-gray-200 bg-white p-2 lg:block">
              <Cart />
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
