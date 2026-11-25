import { useState } from "react"
import { Link, Links, useNavigate } from "react-router-dom"

function Register() {
    const [name, setName] = useState("")
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const showMessage = (text) => {
        setMessage(text)
        setTimeout(() => {
            setMessage("")
        }, 5000)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            showMessage("Kindly complete the form. Some fields are empty")
            return;
        }


        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailPattern.test(email.trim())) {
            showMessage("Please enter a valid email address")
            return;
        }



        if (password.length < 8) {
            showMessage("Password must contain at least 8 characters")
            return;
        }

        if (!/[0-9]/.test(password)) {
            showMessage("Password must contain at least one number")
            return;
        }

        if (!/[^A-Za-z0-9]/.test(password)) {
            showMessage("Password must contain at least one special character")
            return;
        }



        if (password !== confirmPassword) {
            showMessage("Passwords do not match")
            return;
        }

        console.log("Form validation successful")

        setIsLoading(true)

        try {
            const response = await fetch("http://localhost:5000/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            })

            const data = await response.json()
            if (response.ok) {
                setName("")
                setEmail("")
                setPassword("")
                setConfirmPassword("")

                setTimeout(() => {
                    navigate('/login')
                }, 6000);
            }

            showMessage(data.message)

        } catch (error) {
            console.error("Registration error", error)
            showMessage("Unable to connect to the server. Please try again")
        }
        finally {
            setIsLoading(false)
        }

    }


    return (

        <div className="min-h-screen flex items-center justify-center my-6">
            <div className="w-130 h-150 p-8 bg-white shadow-sm rounded-lg border border-gray-100">
                <h1 className="text-3xl font-bold text-center mb-6">
                    Create Account
                </h1>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-md font-medium mb-2">Full Name </label>
                        <input id="name" type="text" placeholder="Enter your full name"
                            value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full outline-0 border border-gray-400 rounded-md p-3 focus:ring-1 focus:ring-blue-600" />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-md font-medium mb-2 mt-4">Email address</label>
                        <input id="email" type="email" placeholder="Enter your email"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-400 outline-0 rounded-md p-3 focus:ring-1 focus:ring-blue-600" />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-md font-medium mb-2 mt-4">Password</label>
                        <div className="flex justify-center border border-gray-400 rounded-lg outline-0 focus-within:ring-1 focus-within:ring-blue-500">
                            <input id="password" type={`${showPassword === false ? "password" : "text"}`} placeholder="Enter your password"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 rounded-md outline-0 gap-2" />

                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="hover:underline cursor-pointer text-sm mx-2">
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div className="focus:ring-1 focus:ring-blue-600">
                        <label htmlFor="confirmPassword" className="block text-md font-medium mb-2 mt-4">Confirm Password</label>
                        <input id="confirmPassword" type="password" placeholder="confirm your password"
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-gray-400 outline-0 rounded-md p-3" />
                    </div>

                    {message && (
                        <p className="text-center text-red-600 text-xs font-medium mt-4">
                            {message}
                        </p>
                    )}

                    <div className="flex items-center justify-center">
                        <button disabled={isLoading} className="w-full max-w-1/2 bg-blue-800 text-white text-lg p-2 
                        rounded-md mt-6 font-semibold cursor-pointer hover:bg-blue-600">
                            {isLoading ? "Registering..." : "Register"}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm font-semibold text-green-800 mt-3">
                    Already have an account?
                    <Link to="/login" className="text-blue-600 font-semibold cursor-pointer hover:underline ml-2">
                        Login
                    </Link>
                </p>

            </div>

        </div>
    )
}



export default Register 