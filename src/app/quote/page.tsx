import { QuoteForm } from './quote-form';

export const metadata = {
  title: 'Cotización con IA | Machado Automotive Excellence',
  description:
    'Obtenga una cotización instantánea para la reparación de su vehículo utilizando nuestra herramienta de IA.',
};

export default function QuotePage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto py-16 md:py-24">
        <div className="mb-12 text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl">
            Cotización Mejorada con IA
          </h1>
          <p className="mx-auto mt-2 max-w-3xl text-muted-foreground">
            Nuestro sistema inteligente analiza el daño de tu vehículo para
            ofrecerte una cotización inicial precisa y una lista de servicios
            recomendados en segundos.
          </p>
        </div>
        <QuoteForm />
      </div>
    </div>
  );
}
