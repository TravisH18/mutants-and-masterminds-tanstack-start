import { Link } from "@tanstack/react-router"
import { Button } from "./retroui/Button"
export default function AuthedNav() {
    return (
        <div className="flex flex-row gap-4 mb-6">
            <Button>
                <Link to="/dashboard">Home</Link>
            </Button>
            <Button>
                <Link to="/campaigns">My Campaigns</Link>
            </Button>
            <Button>
                <Link to="/characters">My Characters</Link>
            </Button>
        </div>
    )
}