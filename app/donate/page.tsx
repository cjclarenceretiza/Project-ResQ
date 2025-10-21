"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockDonations, mockMissions } from "@/lib/mock-data"
import { Package, DollarSign, CheckCircle, FileText } from "lucide-react"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"

export default function DonatePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setShowSuccess(true)

    // Reset success message after 5 seconds
    setTimeout(() => setShowSuccess(false), 5000)
  }

  const activeMissions = mockMissions.filter((m) => m.status !== "completed")
  const recentDonations = mockDonations.slice(0, 5)

  return (
    <div className="min-h-screen dark">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Make a Difference Today</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Your donation directly supports disaster relief efforts and helps communities in need across the Philippines
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="money" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="money" className="gap-2">
                  <DollarSign className="w-4 h-4" />
                  Money
                </TabsTrigger>
                <TabsTrigger value="goods" className="gap-2">
                  <Package className="w-4 h-4" />
                  Goods
                </TabsTrigger>
              </TabsList>

              {/* Money Donation Form */}
              <TabsContent value="money">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Monetary Donation</h2>
                      <p className="text-sm text-muted-foreground">
                        Donate money to support relief operations. All transactions are secure and transparent.
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="amount">Donation Amount (PHP) *</Label>
                      <Input id="amount" type="number" min="100" placeholder="e.g., 1000" required />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {[500, 1000, 2500, 5000].map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              const input = document.getElementById("amount") as HTMLInputElement
                              if (input) input.value = amount.toString()
                            }}
                          >
                            ₱{amount.toLocaleString()}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Mission Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="mission">Allocate to Mission (Optional)</Label>
                      <Select>
                        <SelectTrigger id="mission">
                          <SelectValue placeholder="General fund (all missions)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General fund (all missions)</SelectItem>
                          {activeMissions.map((mission) => (
                            <SelectItem key={mission.id} value={mission.id}>
                              {mission.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Donor Info */}
                    <div className="space-y-2">
                      <Label htmlFor="donor-name">Your Name *</Label>
                      <Input id="donor-name" placeholder="e.g., Juan dela Cruz" required />
                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" id="anonymous" className="rounded" />
                        <Label htmlFor="anonymous" className="text-sm font-normal cursor-pointer">
                          Donate anonymously
                        </Label>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="your.email@example.com" required />
                      <p className="text-xs text-muted-foreground">
                        We'll send you a receipt and updates on how your donation is used
                      </p>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea id="message" placeholder="Add a message of support..." rows={3} />
                    </div>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#ff4500] text-[#ff4500]-foreground hover:bg-[#ff4500]/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Proceed to Payment"}
                  </Button>
                </form>
              </TabsContent>

              {/* Goods Donation Form */}
              <TabsContent value="goods">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Goods Donation</h2>
                      <p className="text-sm text-muted-foreground">
                        Donate physical items like food, clothing, medical supplies, or other relief goods.
                      </p>
                    </div>

                    {/* Item Description */}
                    <div className="space-y-2">
                      <Label htmlFor="items">Items to Donate *</Label>
                      <Textarea
                        id="items"
                        placeholder="e.g., 50 packs of canned goods, 100 bottles of water, 20 blankets..."
                        rows={4}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Please be specific about quantities and types of items
                      </p>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select required>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select item category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="food">Food & Water</SelectItem>
                          <SelectItem value="clothing">Clothing & Blankets</SelectItem>
                          <SelectItem value="medical">Medical Supplies</SelectItem>
                          <SelectItem value="hygiene">Hygiene Products</SelectItem>
                          <SelectItem value="other">Other Supplies</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Mission Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="goods-mission">Allocate to Mission (Optional)</Label>
                      <Select>
                        <SelectTrigger id="goods-mission">
                          <SelectValue placeholder="General inventory (all missions)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General inventory (all missions)</SelectItem>
                          {activeMissions.map((mission) => (
                            <SelectItem key={mission.id} value={mission.id}>
                              {mission.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Donor Info */}
                    <div className="space-y-2">
                      <Label htmlFor="goods-donor-name">Your Name *</Label>
                      <Input id="goods-donor-name" placeholder="e.g., Maria Santos" required />
                    </div>

                    {/* Contact */}
                    <div className="space-y-2">
                      <Label htmlFor="goods-email">Email Address *</Label>
                      <Input id="goods-email" type="email" placeholder="your.email@example.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" placeholder="+63 912 345 6789" required />
                      <p className="text-xs text-muted-foreground">We'll contact you to arrange pickup or drop-off</p>
                    </div>

                    {/* Delivery Method */}
                    <div className="space-y-2">
                      <Label htmlFor="delivery">Delivery Method *</Label>
                      <Select required>
                        <SelectTrigger id="delivery">
                          <SelectValue placeholder="Select delivery method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dropoff">I will drop off the items</SelectItem>
                          <SelectItem value="pickup">Please arrange pickup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#ff4500] text-[#ff4500]-foreground hover:bg-[#ff4500]/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Donation"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Success Message */}
            {showSuccess && (
              <div className="bg-chart-3/10 border border-chart-3/20 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-chart-3 mt-0.5" />
                <div>
                  <p className="font-medium text-chart-3 mb-1">Thank you for your donation!</p>
                  <p className="text-sm text-muted-foreground">
                    Your contribution will make a real difference. You'll receive a receipt and updates via email.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Transparency Info */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#ff4500]" />
                Full Transparency
              </h3>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Every donation is tracked and documented with receipts and photos.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-chart-3" />
                    <span>Official receipts provided</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-chart-3" />
                    <span>Photo documentation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-chart-3" />
                    <span>Regular updates on usage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-chart-3" />
                    <span>LGU verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Donations */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Recent Donations</h3>
              <div className="space-y-4">
                {recentDonations.map((donation) => (
                  <div key={donation.id} className="space-y-2 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{donation.donorName}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{donation.description}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          donation.status === "verified"
                            ? "bg-chart-3/10 text-chart-3 border-chart-3/20"
                            : "bg-primary/10 text-primary border-primary/20"
                        }
                      >
                        {donation.status}
                      </Badge>
                    </div>
                    {donation.type === "money" && donation.amount && (
                      <p className="text-sm font-semibold text-[#ff4500]">₱{donation.amount.toLocaleString()}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(donation.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Stats */}
            <div className="bg-gradient-to-br from-[#ff4500]/10 to-primary/10 border border-[#ff4500]/20 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Your Impact</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-3xl font-bold">₱8.5M</p>
                  <p className="text-sm text-muted-foreground">Total donations received</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">1,847</p>
                  <p className="text-sm text-muted-foreground">Families helped</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">100%</p>
                  <p className="text-sm text-muted-foreground">Transparency guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
