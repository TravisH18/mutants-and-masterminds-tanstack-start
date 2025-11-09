import { Link, useRouter } from "@tanstack/react-router";
import { Card } from "./retroui/Card";
import { Text } from "./retroui/Text";
import { Button } from "./ui/button";

export default function Dashboard() {
    const router = useRouter()
    return (
        <div className="flex flex-row gap-16 p-4 mx-auto">
            <Card>
                <Card.Header>
                    <Card.Title>
                        Campaigns
                    </Card.Title>
                </Card.Header>
                <Card.Content>
                    <Button>View my campaigns</Button>
                    <Button>Create new campaign (as GM)</Button>
                </Card.Content>
                
            </Card>
            <Card>
                <Card.Header>
                    <Card.Title>
                        Characters
                    </Card.Title>
                </Card.Header>
                <Card.Content>
                    <Button>View my characters</Button>
                    {/* onClick={() => router.navigate({to: '/new-character'})} */}
                    <Button>
                        <Link to="/new-character">
                            Create new hero (or villain)
                        </Link>
                    </Button>
                </Card.Content>
                
            </Card>
        </div>
    )
}