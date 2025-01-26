import VideoGeneratorForm from '@/components/VideoGeneratorForm'

export default function VideoGeneration() {
  return (
    <main className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2 text-primary">Anzora Video</h1>
        <p className="text-xl text-muted-foreground">end-to-end automated video advertising agency</p>
      </header>
      <VideoGeneratorForm />
    </main>
  )
}

