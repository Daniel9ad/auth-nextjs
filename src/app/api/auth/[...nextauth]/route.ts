import { Backend_URL } from "../../../../lib/Constants";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import GithubProvider from "next-auth/providers/github"

async function refreshToken(token: JWT): Promise<JWT> {
    const res = await fetch(Backend_URL + "/auth/refresh", {
        method: "POST",
        headers: {
            authorization: `Refresh ${token.backendTokens.refreshToken}`,
        },
    });
    console.log("refreshed token");

    const response = await res.json();

    return {
        ...token,
        backendTokens: response,
    };
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credential",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "jsmith"
                },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                console.log("Verificando authorize...")
                if (!credentials?.username || !credentials?.password) return null
                const { username, password } = credentials
                const res = await fetch(Backend_URL + "/auth/login", {
                    method: "POST",
                    body: JSON.stringify({
                        username,
                        password
                    }),
                    headers: {
                        "Content-type": "application/json"
                    }
                })
                if (res.status == 401) {
                    console.log(res.statusText)
                    return null
                }
                const user = await res.json()
                return user
            }

        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
        }),
        // FacebookProvider({
        //     clientId: process.env.FACEBOOK_ID,
        //     clientSecret: process.env.FACEBOOK_SECRET
        // }),
        // GithubProvider({
        //     clientId: process.env.GITHUB_ID,
        //     clientSecret: process.env.GITHUB_SECRET,
        // })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log("SignIn")
            console.log({ user, account, profile, email, credentials })
            if (account?.provider === 'google') {
                try {
                    const res = await fetch(Backend_URL + "/auth/google-signin", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            given_name: profile?.given_name,
                            family_name: profile?.family_name,
                            email: profile?.email,
                        }),
                    });

                    if (res.ok) {
                        const data = await res.json();
                        Object.assign(user, {
                            user: data.user,
                            backendTokens: data.backendTokens
                        });
                        return true;
                    } else {
                        console.log('Incorrecto')
                        console.log(res)
                        return false
                    }
                } catch (error) {
                    console.error("Error during Google sign in:", error)
                    return false
                }
            }
            return true
        },

        async jwt({ token, user, account, profile }) {
            // console.log("jwt")
            // console.log({ token, user, account, profile })
            if (user) return { ...token, ...user }
            // if (new Date().getTime() < token.backendTokens.expiresIn) {
            //     return token
            // }
            // return await refreshToken(token);
            return token
        },

        async session({ session, token, user }) {
            session.user = token.user
            session.backendTokens = token.backendTokens
            return session
        }
    }

}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }