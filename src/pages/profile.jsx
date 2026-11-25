import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
function Profile() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [logoutLoading, setlogoutLoading] = useState(false)

    const handleLogout = () => {
        setlogoutLoading(true)
        localStorage.removeItem("token")

        setTimeout(() => {
            navigate("/login")
        }, 3000);
    }


    useEffect(() => {
        const token = localStorage.getItem("token")

        if (!token) {
            setError("You are not authenticated. Please log in.")
            setIsLoading(false)
            setTimeout(() => {
                navigate('/login')
            }, 4000);
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/users/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data = await response.json()

                if (response.ok) {
                    setProfile(data.data)
                } else {
                    if (response.status === 401) {
                        localStorage.removeItem("token")
                        navigate("/login")
                    } else {
                        setError(data.message)
                    }
                }

            } catch (error) {
                console.error("profile fetching error:", error)
                setError("Unable to retrieve your profile. Please try again")
            } finally {
                setIsLoading(false)
            }

        }
        fetchProfile()

    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-3xl font-semibold text-green-700">
                    Loading your profile
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
                <div className="bg-white border border-red-200 rounded-xl shadow-lg p-8 max-w-md w-full">
                    <p className="text-red-600 text-center font-medium">
                        {error}
                    </p>
                </div>

            </div>
        )
    }


    return (


        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg space-y-5 flex flex-col
            border border-gray-200">

                <button className="bg-red-600 text-white font-semibold p-2 ml-10
                    rounded-full hover:bg-red-700 transition duration-300 self-end cursor-pointer"
                    type="button" onClick={() => handleLogout()}>{logoutLoading ? "logging out...." : "Log out"}
                </button>

                <h1 className="text-3xl font-bold text-slate-700">
                    Welcome, {profile.name}
                </h1>

                <p className="text-gray-600 text-lg">
                    email: {profile.email}
                </p>

                <p className="text-gray-500 text-sm">
                    Account created: {new Date(profile.createdAt).toLocaleDateString()}
                </p>





            </div>


            {/* Or simply */}
            {/* <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-5 py-2 mt-10 rounded-md hover:bg-red-800"
            >
                Logout
            </button> */}
        </div>
    )
}





export default Profile 