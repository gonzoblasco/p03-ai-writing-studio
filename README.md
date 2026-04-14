# ✍️ AI Writing Studio (P03)

Un editor de texto minimalista y potente potenciado por Inteligencia Artificial, diseñado para potenciar el proceso de escritura mediante streaming de contenido en tiempo real y gestión de versiones.

Este proyecto forma parte del currículum **Full Stack AI Developer (P03)**.

---

## ✨ Características Principales

- **🤖 AI Streaming**: Generación de contenido en tiempo real utilizando la API de Anthropic (Claude Sonnet 4.6).
- **🎭 Control de Tono**: Selector dinámico de 4 personalidades (Profesional, Casual, Creativo, Conciso) que ajustan el comportamiento de la IA.
- **🔄 Historial de Versiones**: Sistema de control de versiones en memoria para restaurar estados anteriores del texto tras cada intervención de la IA.
- **📂 Gestión de Sesiones**: CRUD completo de sesiones de escritura persistidas en Supabase.
- **🔒 Seguridad Robusta**: Autenticación de usuarios y Row Level Security (RLS) para garantizar que cada usuario solo acceda a su contenido.
- **⚡ Interfaz Moderna**: Diseño limpio y profesional construido con Next.js 16, Tailwind CSS y componentes de shadcn/ui.

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **IA**: [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript) & [Vercel AI SDK](https://sdk.vercel.ai/docs)
- **Backend / DB**: [Supabase](https://supabase.com/) (Auth + PostgreSQL)
- **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Testing**: [Vitest](https://vitest.dev/)

---

## 🚀 Empezando

### Requisitos Previos

- Node.js (v20 o superior)
- Cuenta en Supabase
- API Key de Anthropic

### Instalación

1.  **Clona el repositorio**:
    ```bash
    git clone https://github.com/tu-usuario/p03-ai-writing-studio.git
    cd p03-ai-writing-studio
    ```

2.  **Instala las dependencias**:
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno**:
    Crea un archivo `.env.local` en la raíz y añade tus credenciales:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
    SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
    ANTHROPIC_API_KEY=tu_api_key_de_anthropic
    ```

4.  **Configura la base de datos**:
    Ejecuta el contenido de `schema.sql` en el SQL Editor de tu proyecto de Supabase para crear las tablas y políticas de RLS necesarias.

5.  **Inicia el servidor de desarrollo**:
    ```bash
    npm run dev
    ```

---

## 📂 Organización del Proyecto

- `/app`: Rutas del App Router (dashboard protegido, API de IA, auth).
- `/components`: Componentes de UI reutilizables y módulos específicos del editor.
- `/lib`: Lógica compartida, acciones de servidor (`actions/`) y clientes de servicios (`supabase/`).
- `/public`: Activos estáticos.
- `schema.sql`: Definición de la estructura de la base de datos y políticas de seguridad.

## 🧪 Testing

El proyecto utiliza Vitest para asegurar la integridad de las acciones de servidor y validaciones:

```bash
npm run test
```

---

*Desarrollado como parte del programa Full Stack AI Developer.*
