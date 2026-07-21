-- Tabla de Administradores
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Categorías
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Películas
CREATE TABLE movies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    original_title VARCHAR(255),
    overview TEXT,
    release_year INTEGER,
    duration INTEGER, -- En minutos
    language VARCHAR(100),
    classification VARCHAR(50),
    director VARCHAR(255),
    cast_members TEXT,
    country VARCHAR(100),
    poster_url TEXT,
    backdrop_url TEXT,
    trailer_url TEXT,
    vimeus_video_id VARCHAR(100), -- ID provisto por Vimeus tras el procesamiento
    status VARCHAR(50) DEFAULT 'draft', -- draft, published, hidden
    is_featured BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla Intermedia: Películas y Categorías
CREATE TABLE movie_categories (
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, category_id)
);

-- Tabla de Configuraciones Generales
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Seguimiento de Procesamiento de Videos en Vimeus
CREATE TABLE video_processing_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    vimeus_uri VARCHAR(255),
    status VARCHAR(50) DEFAULT 'uploading', -- uploading, processing, ready, error
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para actualizar updated_at en movies
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_movies_modtime
BEFORE UPDATE ON movies
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_video_status_modtime
BEFORE UPDATE ON video_processing_status
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
