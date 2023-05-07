import clientPromise from "../../../db"
import bcrypt from "bcrypt"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

const authOptions = {
  secret: "secret",
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: {label: "username", type: "username", placeholder: "you@example.com"},
        password: {label: "Password", type: "password"},
      },
      //@ts-ignore
      authorize: async (credentials) => {
        const client = await clientPromise
       
        const user = await client.db().collection("users").findOne({
          username: credentials?.username.toLowerCase(),
          password: credentials?.password,
          role: "serveur",
        })

        if (!user) {
          return null
        }

        return {
          id: user._id,
          email: user,
          name: user._id,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
}
//@ts-ignore
export default NextAuth(authOptions)
