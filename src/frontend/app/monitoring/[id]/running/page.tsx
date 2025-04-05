"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle, AlertCircle, FileText, Search, Zap } from "lucide-react"

export default function RunningMonitoringPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState("Initializing monitoring run...")
  const [completedStages, setCompletedStages] = useState<string[]>([])
  const [foundSources, setFoundSources] = useState(0)
  const [newSources, setNewSources] = useState(0)
  const [alerts, setAlerts] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Animation frame reference to properly clean up
  const animationRef = useRef<number | null>(null)
  const currentIndexRef = useRef(0)

  // Ensure component is mounted before animations
  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
      // Clean up any pending animation frames
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Simulate processing stages
  useEffect(() => {
    if (!isMounted) return

    const stages = [
      { message: "Connecting to source repositories...", duration: 2000 },
      { message: "Searching for new sources...", duration: 3000, action: () => setFoundSources(78) },
      { message: "Analyzing source content...", duration: 4000, action: () => setNewSources(8) },
      { message: "Classifying sources...", duration: 2500 },
      { message: "Checking for keyword matches...", duration: 2000, action: () => setAlerts(3) },
      { message: "Generating alerts...", duration: 1500 },
      { message: "Updating monitoring database...", duration: 2000 },
      { message: "Finalizing results...", duration: 1000 },
    ]

    let timer: NodeJS.Timeout

    const runStage = () => {
      const currentIndex = currentIndexRef.current

      if (currentIndex < stages.length) {
        const stage = stages[currentIndex]
        setCurrentStage(stage.message)

        // Update progress
        const progressIncrement = 100 / stages.length
        const startProgress = (currentIndex / stages.length) * 100
        const endProgress = ((currentIndex + 1) / stages.length) * 100

        const startTime = Date.now()

        const updateProgress = () => {
          if (!isMounted) return

          const elapsed = Date.now() - startTime
          const stageProgress = Math.min(elapsed / stage.duration, 1)
          const currentProgress = startProgress + (endProgress - startProgress) * stageProgress

          setProgress(currentProgress)

          if (stageProgress < 1) {
            animationRef.current = requestAnimationFrame(updateProgress)
          } else {
            // Stage complete
            setCompletedStages((prev) => [...prev, stage.message])
            if (stage.action) stage.action()
            currentIndexRef.current += 1

            if (currentIndexRef.current < stages.length) {
              timer = setTimeout(runStage, 500)
            } else {
              // All stages complete
              setTimeout(() => {
                if (isMounted) {
                  router.push("/monitoring/1")
                }
              }, 1000)
            }
          }
        }

        animationRef.current = requestAnimationFrame(updateProgress)
      }
    }

    timer = setTimeout(runStage, 1000)

    return () => {
      clearTimeout(timer)
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [router, isMounted])

  if (!isMounted) {
    return (
      <div className="max-w-3xl py-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl py-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Running Monitoring Schedule</CardTitle>
          <CardDescription>Climate Change Research</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="font-medium">{currentStage}</span>
            </div>

            {completedStages.map((stage, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-muted-foreground">{stage}</span>
              </div>
            ))}

            {error && (
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/40 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold">{foundSources}</div>
              <div className="text-xs text-muted-foreground">Sources Found</div>
            </div>
            <div className="bg-muted/40 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{newSources}</div>
              <div className="text-xs text-muted-foreground">New Sources</div>
            </div>
            <div className="bg-muted/40 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-2xl font-bold">{alerts}</div>
              <div className="text-xs text-muted-foreground">Alerts Generated</div>
            </div>
          </div>

          <div className="pt-4 text-center text-sm text-muted-foreground">
            <p>Monitoring run in progress</p>
            <p className="mt-1">This may take a few minutes to complete</p>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" onClick={() => router.push("/monitoring")} className="mt-4">
              Run in Background
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

