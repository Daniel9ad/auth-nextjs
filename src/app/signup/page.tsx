"use client"

import { Button } from "@/components/Button"
import InputBox from "@/components/InputBox"
import { Backend_URL } from "@/lib/Constants"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRef } from "react"


type FormInputs = {
    name: string,
    email: string,
    password: string
}

const SignupPage = () => {
    const register = async () => {
        console.log("registrando")
        const res = await fetch(Backend_URL + "/auth/register", {
            method: "POST",
            body: JSON.stringify({
                name: data.current.name,
                email: data.current.email,
                password: data.current.password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (!res.ok) {
            alert(res.statusText)
            return
        }
        const response = await res.json()
        alert("User Registered")
        console.log({ response })
    }

    const data = useRef<FormInputs>({
        name: "",
        email: "",
        password: ""
    })

    return (
        <div className="m-2 border rounded overflow-hidden shadow">
            <div className="p-2 bg-gradient-to-b from-white to-slate-200 text-slate-600">
                SignUp
            </div>
            <div className="p-2 flex flex-col gap-6">
                <InputBox
                    autoComplete="off"
                    name="name"
                    labelText="Name"
                    required
                    onChange={(e) => (data.current.name = e.target.value)}
                />
                <InputBox
                    name="email"
                    labelText="Email"
                    required
                    onChange={(e) => (data.current.email = e.target.value)}
                />
                <InputBox
                    name="password"
                    labelText="Password"
                    type="password"
                    required
                    onChange={(e) => (data.current.password = e.target.value)}
                />
                <div className="flex justify-center items-center gap-2">
                    <Button onClick={register}>Submit</Button>
                    <Link href={"/"} className="">Cancelar</Link>
                </div>
            </div>
            <button onClick={() => signIn("google")}>
                Continuar con Google
            </button>
        </div>
    )
}

export default SignupPage