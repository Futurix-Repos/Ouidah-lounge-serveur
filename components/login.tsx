import {LockClosedIcon} from "@heroicons/react/20/solid"
import {Form, Formik, Field} from "formik"
import {signIn} from "next-auth/react"
import {useRouter} from "next/router"
import {useMutation} from "react-query"
import {BarLoader} from "react-spinners"
export default function Login() {
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      })
      if (response?.ok) {
        return
      } else {
        throw new Error(response?.error)
      }
    },
    onSuccess: () => {
      router.push("/")
    },
  })
  return (
    <Formik
      initialValues={{
        username: "Serveur",
        password: "serveur",
      }}
      onSubmit={async (values) => {
        mutation.mutate(values)
      }}
    >
      <div className="border bg-pink-100 flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              COMPTE SERVEUR
            </h2>
          </div>
          {mutation.isError && <div>Informations invalides!</div>}
          <Form className="mt-8 space-y-6" action="#" method="POST">
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="username" className="sr-only">
                  Utilisateur
                </label>
                <Field
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="relative items-center block w-full appearance-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="username address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block items-center w-full appearance-none   border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              {mutation.isError && (
                <button
                  type="submit"
                  className="group items-center relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Réessayer
                </button>
              )}
              {mutation.isLoading || mutation.isSuccess ? (
                <button
                  type="submit"
                  className="group items-center relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <BarLoader />
                </button>
              ) : null}
              {mutation.isIdle && (
                <button
                  type="submit"
                  className="group items-center relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Valider
                </button>
              )}
            </div>
          </Form>
        </div>
      </div>
    </Formik>
  )
}
