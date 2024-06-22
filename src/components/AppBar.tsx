import Link from "next/link"
import SignInButton from "./SignInButton"
import Read from "react";

const AppBar = () => {
    return (
        <header className="flex gap-4 p-4 bg-gradient-to-b from-white to-gray-200 shadow">
            <Link href={"/"} className="transition-colors hover:text-green-600">
                Home Page
            </Link>
            <Link href={"/dashboard"} className="transition-colors hover:text-green-600">
                DashBoard
            </Link>
            <SignInButton />
        </header>
    )
}

export default AppBar