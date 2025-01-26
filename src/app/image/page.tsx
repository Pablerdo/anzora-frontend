import ImageGeneratorForm from '@/components/ImageGeneratorForm'

export default function ImageGeneration() {
  return (
    <main className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2 text-orange-500">Anzora Image</h1>
        <p className="text-xl text-muted-foreground">end-to-end automated image generation agency</p>
      </header>
      <ImageGeneratorForm />
    </main>
  )
}

