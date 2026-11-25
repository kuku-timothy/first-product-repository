import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)


    useEffect(() => {
        const token = localStorage.getItem("token")

        if (token) {
            navigate("/profile")
        }
    }, [])

    const showMessage = (text) => {
        setMessage(text)

        setTimeout(() => {
            setMessage("")
        }, 5000)
    }

    const handleLogin = async (e) => {
        e.preventDefault()

        // if (!email.trim() || !password) {
        //     showMessage("Please, enter email and password")
        //     return;
        // }

        if (!email.trim()) {
            showMessage("Email is required")
            return;
        }

        if (!password) {
            showMessage("Password is required")
            return;
        }


        setIsLoading(true)

        try {
            const response = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem("token", data.data.token)
                showMessage(data.message)

                navigate("/profile")
            } else {
                showMessage(data.message)
            }



        } catch (error) {
            console.error("Login error", error)
            showMessage("Unable to connect to the server. Please try again")

        } finally {
            setIsLoading(false)
        }

    }




    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Login to Your Account
                </h1>

                <form onSubmit={handleLogin}>
                    <div className="block space-y-6">
                        <div className="mb-4">
                            <label htmlFor="email" className="text-lg font-medium mb-2">Email Address: </label>
                            <input type="email" id="email" placeholder="Enter Email Address"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-400 rounded-md p-3 outline-0 focus:ring-1
                                 focus:ring-blue-500 mt-2"/>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="text-lg font-md mb-2">Password: </label>

                            <div className="flex justify-center border border-gray-400 rounded-lg outline-0 focus-within:ring-1 focus-within:ring-blue-500 mt-2">
                                <input type={showPassword ? "text" : "password"} id="password" placeholder="Enter password"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 rounded-md outline-0"
                                />



                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="hover:underline cursor-pointer text-sm mx-2">
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {message && (
                            <p className="text-center text-sm text-red-600 mb-4">
                                {message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <button type="submit" disabled={isLoading}
                            className="w-1/2 bg-blue-600 text-white font-bold p-2 rounded-lg hover:bg-blue-800 disabled:opacity-50"
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-5">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-800 text-sm font-medium hover:underline">
                            Register
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    )
}




export default Login 