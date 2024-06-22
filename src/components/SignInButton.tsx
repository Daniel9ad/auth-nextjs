"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"

const SignInButton = () => {
    const { data: session } = useSession()
    // console.log('Verificar session')
    // console.log(session?.user)
    if (session && session.user) {
        return (
            <div className="flex gap-4 ml-auto">
                <p className="text-green-600">{session.user.email}</p>
                <Link href={"/api/auth/signout"} className="flex gap-4 ml-auto text-red-600">
                    Sign Out
                </Link>
            </div>
        )
    }
    return (
        <div className="flex gap-4 ml-auto items-center">
            <Link href={"/api/auth/signin"} className="flex gap-4 ml-auto text-green-600">
                Sign In
            </Link>
            <Link href={"/signup"} className="flex gap-4 ml-auto bg-green-600 text-green-200 p-2 rounded">
                Sign Up
            </Link>
        </div>
    )
}

export default SignInButton