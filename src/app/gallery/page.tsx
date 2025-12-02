import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const metadata = {
  title: 'Galería de Trabajos | Machado Automotive Excellence',
  description:
    'Vea ejemplos de nuestro trabajo en reparación de abolladuras y pulido de automóviles.',
};

export default function GalleryPage() {
  const galleryImages = PlaceHolderImages.filter((p) =>
    p.id.startsWith('gallery-')
  );

  return (
    <div className="bg-background">
      <div className="container mx-auto py-16 md:py-24">
        <div className="mb-12 text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl">
            Galería de Trabajos Realizados
          </h1>
          <p className="mx-auto mt-2 max-w-3xl text-muted-foreground">
            Explora la calidad y precisión de nuestros servicios. Aquí puedes
            ver una selección de vehículos que hemos restaurado a su antigua
            gloria.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((image) => (
            <Card key={image.id} className="group overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    data-ai-hint={image.imageHint}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">
                    {image.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
