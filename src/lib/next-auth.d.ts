declare module "next-auth" {
    interface Session{
        user: {
            id: id,
            email: string,
            name: string
        },
        backendTokens: {
            accessToken: string,
            refreshToken: string,
            expiresIn: number
        }
    }
    
    interface Profile{
        given_name: string,
        family_name: string
    }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt"{
    interface JWT {
        user: {
            id: id,
            email: string,
            name: string
        },
        backendTokens: {
            accessToken: string,
            refreshToken: string,
            expiresIn: number
        }
    }
}