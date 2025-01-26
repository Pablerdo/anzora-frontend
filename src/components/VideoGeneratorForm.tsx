"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function VideoGeneratorForm() {
  const [url, setUrl] = useState("")
  const [logo, setLogo] = useState<File | null>(null)
  const [moodImages, setMoodImages] = useState<File[]>([])
  const [productVideo, setProductVideo] = useState<File | null>(null)
  const [brandName, setBrandName] = useState("")
  const [productName, setProductName] = useState("")
  const [phrases, setPhrases] = useState(["", "", ""])
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [runId, setRunId] = useState<string | null>(null)
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null)
  const [inputImageUrl, setInputImageUrl] = useState("")
  const [prompt, setPrompt] = useState("")

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (runId) {
      intervalId = setInterval(async () => {
        const response = await fetch(`/api/webhook-video?runId=${runId}`)
        const data = await response.json()

        console.log(data)

        if (data.status === "success") {
          setGeneratedVideoUrl(data.videoUrl)
          setResult("Video generation completed!")
          clearInterval(intervalId)
        }
      }, 15000) // Check every 15 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [runId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)
    setRunId(null)
    setGeneratedVideoUrl(null)

    const formData = new FormData()
    /*
    formData.append("url", url)
    if (logo) formData.append("logo", logo)
    moodImages.forEach((image) => formData.append("moodImages", image))
    if (productVideo) formData.append("productVideo", productVideo)
    formData.append("brandName", brandName)
    formData.append("productName", productName)
    phrases.forEach((phrase, index) => {
      if (phrase.trim() !== "" || index === 0) {
        formData.append(`phrase${index + 1}`, phrase)
      }
    })
    formData.append("description", description)
    */
    formData.append("inputImageUrl", inputImageUrl)
    formData.append("prompt", prompt)

    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      console.log(data)

      if (data.runId) {
        setRunId(data.runId)
        setResult("Video generation started. Please wait...")
      } else if (data.videoUrl) {
        // This is for the commented out stub response
        setGeneratedVideoUrl(data.videoUrl)
        setResult(data.message)
      } else {
        throw new Error("No runId or videoUrl received")
      }
    } catch (error) {
      console.error("Error generating video:", error)
      setResult("Error generating video. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <Label htmlFor="inputImageUrl" className="text-lg font-semibold">
          Input Image URL <span className="text-red-500">*</span>
        </Label>
        <Input
          id="inputImageUrl"
          type="url"
          value={inputImageUrl}
          onChange={(e) => setInputImageUrl(e.target.value)}
          className="mt-1"
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>
      <div>
        <Label htmlFor="prompt" className="text-lg font-semibold">
          Prompt <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="mt-1"
          placeholder="Describe the video you want to generate..."
          required
        />
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Generating..." : "Generate Video"}
      </Button>
      {result && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Status</h2>
          <p>{result}</p>
          {runId && <p>Run ID: {runId}</p>}
        </div>
      )}
      {generatedVideoUrl && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Generated Video</h2>
          <video src={generatedVideoUrl} controls className="w-full max-w-lg mx-auto" />
        </div>
      )}
    </form>
  )
}

