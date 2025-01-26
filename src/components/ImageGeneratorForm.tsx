'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ImageGeneratorForm() {
  const [url, setUrl] = useState('')
  const [moodImages, setMoodImages] = useState<File[]>([])
  const [productImage, setProductImage] = useState<File | null>(null)
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [runId, setRunId] = useState<string | null>(null)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (runId) {
      intervalId = setInterval(async () => {
        const response = await fetch(`/api/webhook?runId=${runId}`);
        const data = await response.json();
        
        console.log(data)
        
        if (data.status === 'success') {
          setGeneratedImageUrl(data.imageUrl);
          setResult('Image generation completed!');
          clearInterval(intervalId);
        }
      }, 15000); // Check every 15 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [runId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)
    setRunId(null)
    setGeneratedImageUrl(null)

    const formData = new FormData()
    formData.append('url', url)
    moodImages.forEach((image) => formData.append('moodImages', image))
    if (productImage) formData.append('productImage', productImage)
    formData.append('prompt', prompt)
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      console.log(data)
      
      if (data.runId) {
        setRunId(data.runId)
        setResult('Image generation started. Please wait...')
      } else {
        throw new Error('No runId received')
      }
    } catch (error) {
      console.error('Error generating image:', error)
      setResult('Error generating image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <Label htmlFor="url" className="text-lg font-semibold">Instagram Username (@)</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl("https://www.instagram.com/" + e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="moodImages" className="text-lg font-semibold">Mood Images (up to 3)</Label>
        <Input
          id="moodImages"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setMoodImages(Array.from(e.target.files || []).slice(0, 3))}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="productImage" className="text-lg font-semibold">Product Image</Label>
        <Input
          id="productImage"
          type="file"
          accept="image/*"
          onChange={(e) => setProductImage(e.target.files?.[0] || null)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="prompt" className="text-lg font-semibold">Prompt</Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="mt-1"
          placeholder="Describe the image you want to generate..."
          required
        />
      </div>
      <Button 
        type="submit" 
        disabled={isLoading} 
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
      >
        {isLoading ? 'Generating...' : 'Generate Image'}
      </Button>
      {result && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Status</h2>
          <p>{result}</p>
          {runId && <p>Run ID: {runId}</p>}
        </div>
      )}
      {generatedImageUrl && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Generated Image</h2>
          <img src={generatedImageUrl || "/placeholder.svg"} alt="Generated Image" className="w-full max-w-lg mx-auto" />
        </div>
      )}
    </form>
  )
}

