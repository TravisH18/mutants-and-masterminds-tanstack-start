import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Card } from '~/components/retroui/Card'
import { Button } from '~/components/ui/button'
import { getSupabaseServerClient } from '~/utils/supabase'

const fetchCampaigns = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const { user } = Route.useRouteContext()

  if (!user) {
    return null
  }

  const campaigns = await supabase
    .from('campaigns')
    .select('name, image_url, description, campaign_members(user_id)')
    .eq('campaign_members(user_id)', user.id)

  if (!campaigns) {
    return null
  }

  return {
    campaigns: campaigns.data
  }
})

export const Route = createFileRoute('/_authed/campaigns')({
  component: CampaignsComponent,
})

async function CampaignsComponent() {
  const { user } = Route.useRouteContext()
  const router = useRouter()
  const campaigns = await fetchCampaigns()
  console.log(campaigns?.campaigns)

  if (!campaigns?.campaigns) {
    return (
      <div>
        <h1>You are not a part of any campaigns</h1>
        <Button>Create New Campagin?</Button>
      </div>
    )
  }

  return (
    <div>
      <h1>Welcome, to your campaigns!</h1>
      {campaigns.campaigns.map((campaign) => (
        <Card>
          <Card.Header>
            <Card.Title>{campaign.name}</Card.Title>
            <Card.Description>{campaign.description}</Card.Description>
          </Card.Header>
          <Card.Content>
            <img src={campaign.image_url} />
            <Button onClick={() => router.navigate({to: '/campaigns/${campaign.id}}'})}>View</Button>
          </Card.Content>
        </Card>
      ))}

    </div>
  )
}