import { useRouter } from "@tanstack/react-router";
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
                        <Text as="h1">Campaigns</Text>
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
                        <Text as="h1">Characters</Text>
                    </Card.Title>
                </Card.Header>
                <Card.Content>
                    <Button>View my characters</Button>
                    <Button onClick={() => router.navigate({to: '/new-character'})}>Create new hero (or villain)</Button>
                </Card.Content>
                
            </Card>
        </div>
    )
}