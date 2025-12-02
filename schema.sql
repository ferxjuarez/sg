-- 1. Tabla para las imágenes de la galería
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  image_hint VARCHAR(50),
  -- Puedes añadir un campo de 'orden' si quieres controlar la posición de las imágenes
  display_order SMALLINT
);

-- 2. Habilitar Seguridad a Nivel de Fila (RLS)
-- Es una buena práctica de seguridad en Supabase.
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de acceso para la tabla 'gallery_images'

-- POLÍTICA 1: Permitir que cualquier persona (visitantes de la web) pueda ver las imágenes.
CREATE POLICY "Allow public read-only access"
ON gallery_images
FOR SELECT
USING (true);

-- POLÍTICA 2: Permitir que los usuarios autenticados (administradores) puedan insertar, actualizar y eliminar imágenes.
CREATE POLICY "Allow full access for authenticated users"
ON gallery_images
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 4. Datos de ejemplo para la galería (opcional)
-- Puedes ejecutar este código para poblar la tabla con las imágenes que ya están en la web.
INSERT INTO gallery_images (description, image_url, image_hint, display_order)
VALUES
  ('Flawless red car after paint correction', 'https://images.unsplash.com/photo-1593699199342-59b40e08f0ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Y2FyJTIwcmVwYWlyfGVufDB8fHx8MTc2NDYzMTg1M3ww&ixlib=rb-4.1.0&q=80&w=1080', 'car repair', 1),
  ('Side view of a blue luxury car after dent removal', 'https://images.unsplash.com/photo-1610099610040-ab19f3a5ec35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8bHV4dXJ5JTIwY2FyfGVufDB8fHx8MTc2NDU4NDY4M3ww&ixlib=rb-4.1.0&q=80&w=1080', 'luxury car', 2),
  ('Close-up on a perfectly polished black car panel', 'https://images.unsplash.com/photo-1666009419871-c8bee023574e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYWludHxlbnwwfHx8fDE3NjQ2NzQ5NDR8MA&ixlib-rb-4.1.0&q=80&w=1080', 'car paint', 3),
  ('White SUV looking new after a full detailing service', 'https://images.unsplash.com/photo-1652509860229-c8c8cd33def1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxzdXYlMjBkZXRhaWxpbmd8ZW58MHx8fHwxNzY0Njc0OTQ0fDA&ixlib-rb-4.1.0&q=80&w=1080', 'suv detailing', 4),
  ('A classic car restored to its original glory', 'https://images.unsplash.com/photo-1591293835940-934a7c4f2d9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjbGFzc2ljJTIwY2FyfGVufDB8fHx8MTc2NDY2MTUxMHww&ixlib-rb-4.1.0&q=80&w=1080', 'classic car', 5),
  ('Motorcycle gas tank after custom polishing', 'https://images.unsplash.com/photo-1749291436739-f8d160f07f46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxtb3RvcmN5Y2xlJTIwcG9saXNofGVufDB8fHx8MTc2NDY3NDk0NHww&ixlib-rb-4.1.0&q=80&w=1080', 'motorcycle polish', 6);

