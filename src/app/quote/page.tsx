import { QuoteForm } from './quote-form';

export const metadata = {
  title: 'Cotización | S&G',
  description:
    'Póngase en contacto con nosotros para obtener una cotización para la reparación de su vehículo.',
};

export default function QuotePage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto py-16 md:py-24">
        <div className="mb-12 text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl">
            Solicitar una Cotización
          </h1>
          <p className="mx-auto mt-2 max-w-3xl text-muted-foreground">
            Complete el siguiente formulario con los detalles del servicio que
            necesita y nos pondremos en contacto con usted a la brevedad con una
            cotización.
          </p>
        </div>
        <QuoteForm />
      </div>
    </div>
  );
}
