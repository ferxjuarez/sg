-- 1. Tabla para perfiles de usuario y roles
-- Esta tabla almacenará información adicional del usuario, como su rol.
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user' NOT NULL,
  full_name TEXT,
  avatar_url TEXT
);

-- 2. Tabla para las imágenes de la galería
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  -- El campo 'description' es para el texto que acompaña cada imagen en la galería.
  description TEXT,
  image_url TEXT NOT NULL,
  image_hint VARCHAR(50),
  display_order SMALLINT
);

-- 3. Habilitar Seguridad a Nivel de Fila (RLS) para ambas tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- 4. Función para obtener el rol de un usuario
-- Esta función nos permitirá verificar si un usuario es administrador.
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM profiles WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. Políticas de acceso para la tabla 'profiles'
-- Los usuarios pueden ver su propio perfil y los administradores pueden ver todos.
CREATE POLICY "Allow individual read access" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow admin read access" ON profiles FOR SELECT USING (get_user_role() = 'admin');
CREATE POLICY "Allow individual update access" ON profiles FOR UPDATE USING (auth.uid() = id);


-- 6. Políticas de acceso para la tabla 'gallery_images'
-- POLÍTICA 1: Permitir que cualquier persona (visitantes de la web) pueda ver las imágenes.
CREATE POLICY "Allow public read-only access" ON gallery_images FOR SELECT USING (true);

-- POLÍTICA 2: Permitir que SOLO los administradores ('admin') puedan insertar, actualizar y eliminar imágenes.
CREATE POLICY "Allow admin full access"
ON gallery_images
FOR ALL
USING (get_user_role() = 'admin')
WITH CHECK (get_user_role() = 'admin');


-- 7. Datos de ejemplo para la galería (opcional)
-- Este código puebla la tabla con las imágenes de ejemplo.
INSERT INTO gallery_images (description, image_url, image_hint, display_order)
VALUES
  ('Flawless red car after paint correction', 'https://images.unsplash.com/photo-1593699199342-59b40e08f0ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Y2FyJTIwcmVwYWlyfGVufDB8fHx8MTc2NDYzMTg1M3ww&ixlib=rb-4.1.0&q=80&w=1080', 'car repair', 1),
  ('Side view of a blue luxury car after dent removal', 'https://images.unsplash.com/photo-1610099610040-ab19f3a5ec35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8bHV4dXJ5JTIwY2FyfGVufDB8fHx8MTc2NDU4NDY4M3ww&ixlib-rb-4.1.0&q=80&w=1080', 'luxury car', 2),
  ('Close-up on a perfectly polished black car panel', 'https://images.unsplash.com/photo-1666009419871-c8bee023574e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYWludHxlbnwwfHx8fDE3NjQ2NzQ5NDR8MA&ixlib-rb-4.1.0&q=80&w=1080', 'car paint', 3),
  ('White SUV looking new after a full detailing service', 'https://images.unsplash.com/photo-1652509860229-c8c8cd33def1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxzdXYlMjBkZXRhaWxpbmd8ZW58MHx8fHwxNzY0Njc0OTQ0fDA&ixlib-rb-4.1.0&q=80&w=1080', 'suv detailing', 4),
  ('A classic car restored to its original glory', 'https://images.unsplash.com/photo-1591293835940-934a7c4f2d9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjbGFzc2ljJTIwY2FyfGVufDB8fHx8MTc2NDY2MTUxMHww&ixlib-rb-4.1.0&q=80&w=1080', 'classic car', 5),
  ('Motorcycle gas tank after custom polishing', 'https://images.unsplash.com/photo-1749291436739-f8d160f07f46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxtb3RvcmN5Y2xlJTIwcG9saXNofGVufDB8fHx8MTc2NDY3NDk0NHww&ixlib-rb-4.1.0&q=80&w=1080', 'motorcycle polish', 6);

-- ¡IMPORTANTE! Después de crear tu usuario administrador, ejecuta esto para darle el rol de 'admin'.
-- Reemplaza 'user-id-del-admin' con el ID de usuario real de Supabase.
-- UPDATE profiles SET role = 'admin' WHERE id = 'user-id-del-admin';
