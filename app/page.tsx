import { Navigation } from "@/components/navigation"
import { StatsDashboard } from "@/components/stats-dashboard"
import { MissionCard } from "@/components/mission-card"
import { CommunityFeed } from "@/components/community-feed"
import { mockStatistics, mockMissions, mockUpdates } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import LazyMap from "@/components/LazyMap"
import { Mission } from "@/lib/types"

export default function HomePage() {
  const topMissions = mockMissions.filter((m) => m.status !== "completed").slice(0, 5)
  const recentUpdates = mockUpdates.slice(0, 4)

  return (
    <div className="min-h-screen dark">
      <Navigation />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center py-12 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
            Coordinate Relief.
            <br />
            <span className="text-[#ff4500]">Save Lives.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Connect volunteers, donors, and communities to respond faster to disasters and emergencies across the
            Philippines.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/missions">
              <Button size="lg" className="bg-[#ff4500] text-white hover:bg-[#ff4500]/90">
                Join a Mission
              </Button>
            </Link>
            <Link href="/donate">
              <Button size="lg" variant="outline">
                Make a Donation
              </Button>
            </Link>
          </div>
        </section>

        {/* Statistics Dashboard */}
        <section>
          <StatsDashboard stats={mockStatistics} />
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Top Missions */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Active Missions</h2>
                <p className="text-muted-foreground">Join these urgent relief operations and make an impact</p>
              </div>
              <Link href="/missions">
                <Button variant="ghost" className="gap-2">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {topMissions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          </section>

          {/* Community Feed */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Community Updates</h2>
              <p className="text-sm text-muted-foreground">Latest news and announcements</p>
            </div>

            <CommunityFeed updates={recentUpdates} />
          </section>
        </div>
      </main>
    </div>
  )
}