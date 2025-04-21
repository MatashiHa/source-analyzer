"use client"

// Update the Dashboard component to work with the new layout
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Tag, Database, Search, FileText } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

function Dashboard() {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur px-8">
        <div className="flex h-16 items-center justify-between py-4">
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-bold">
              {t("common.dashboard")}
            </Link>
            <Link href="/templates" className="text-sm font-medium">
              {t("common.templates")}
            </Link>
            <Link href="/monitoring" className="text-sm font-medium">
              {t("common.monitoring")}
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/analysis/new">{t("common.newAnalysis")}</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="px-8">
        <section className="container py-10">
          <h1 className="text-3xl font-bold mb-6">{t("dashboard.title")}</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t("dashboard.activeAnalyses")}</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">3 pending completion</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t("dashboard.processedSources")}</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,284</div>
                <p className="text-xs text-muted-foreground">+24 in the last 24 hours</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t("dashboard.classificationTemplates")}</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">2 custom templates</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container py-6">
          <h2 className="text-2xl font-bold mb-6">{t("dashboard.recentAnalyses")}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Climate Change Research",
                type: "Long-term Monitoring",
                sources: 142,
                date: "Updated 2 hours ago",
              },
              {
                title: "Market Trends Q2 2023",
                type: "Single Analysis",
                sources: 87,
                date: "Completed June 15, 2023",
              },
              {
                title: "Competitor Analysis",
                type: "Long-term Monitoring",
                sources: 56,
                date: "Updated 1 day ago",
              },
            ].map((analysis, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{analysis.title}</CardTitle>
                  <CardDescription>{analysis.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span>{analysis.sources} sources</span>
                    <span className="text-muted-foreground">{analysis.date}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href="/analysis/results">
                        {t("common.view")} {t("common.details")}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Button variant="outline" asChild>
              <Link href="/monitoring">
                {t("common.view")} {t("common.all")}
              </Link>
            </Button>
          </div>
        </section>

        <section className="container py-6">
          <h2 className="text-2xl font-bold mb-6">{t("dashboard.quickActions")}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
              <Link href="/analysis/new">
                <Search className="h-5 w-5" />
                <span>{t("dashboard.newAnalysis")}</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
              <Link href="/monitoring">
                <Clock className="h-5 w-5" />
                <span>{t("dashboard.scheduleMonitoring")}</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
              <Link href="/templates">
                <Tag className="h-5 w-5" />
                <span>{t("dashboard.createTemplate")}</span>
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left w-screen">
            &copy; 2025 {t("app.name")}. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Help
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

export default function Home() {
  return <Dashboard />
}

