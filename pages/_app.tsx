import "@/styles/globals.css"
import type {AppProps} from "next/app"
import {QueryClient, QueryClientProvider} from "react-query"
import {Provider} from "react-redux"
import {useSession, SessionProvider} from "next-auth/react"
import {store} from "../store"
import Head from "next/head"
export const queryClient = new QueryClient()
export default function App({Component, pageProps: {session, ...pageProps}}: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <title>Ouidah-lounge Serveur</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          {
            //@ts-ignore
            Component.auth ? (
              <Auth>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )
          }
        </SessionProvider>
      </QueryClientProvider>
    </Provider>
  )
}

function Auth({children}: any) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const {status} = useSession({required: true})

  if (status === "loading") {
    return null
  }

  return children
}
