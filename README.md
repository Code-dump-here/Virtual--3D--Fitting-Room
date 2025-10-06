# Virtual Fitting Room

A web-based virtual fitting room application with Unity WebGL integration for 3D body visualization and clothing try-on.

## Features

- Interactive body parameter controls (height, chest, waist, hips, etc.)
- Preset body types (Athletic, Petite, Plus Size, etc.)
- Clothing catalog with database integration
- Unity WebGL 3D model integration ready
- Supabase backend for data persistence

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Installation

1. **Clone or copy this project to your machine**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**

   The `.env` file is already included with Supabase configuration. If you need to use a different Supabase project, update the values in `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup:**

   The database migration is already created. The tables will be available in your Supabase project.

## Running the Application

### Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production files will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── BodyControls.tsx      # Body parameter sliders
│   │   ├── ClothingSelector.tsx  # Clothing catalog
│   │   ├── PresetSelector.tsx    # Body preset buttons
│   │   └── UnityViewer.tsx       # Unity integration
│   ├── lib/
│   │   └── supabase.ts      # Database client and types
│   ├── App.tsx              # Main application
│   └── main.tsx             # Entry point
├── public/                  # Static assets
│   └── Build/              # Place Unity WebGL build here (not included)
├── supabase/
│   └── migrations/         # Database schema
└── package.json
```

## Unity Integration

The application is ready for Unity WebGL integration:

1. **Build your Unity project for WebGL**
2. **Copy the build files to `/public/Build/`:**
   ```
   /public/Build/
   ├── Build.data
   ├── Build.framework.js
   ├── Build.loader.js
   └── Build.wasm
   ```

3. **Add the Unity loader script to `/index.html`** (before closing `</body>` tag):
   ```html
   <script src="/Build/Build.loader.js"></script>
   <script>
     createUnityInstance(document.querySelector("#unity-container"), {
       dataUrl: "/Build/Build.data",
       frameworkUrl: "/Build/Build.framework.js",
       codeUrl: "/Build/Build.wasm",
     }).then((unityInstance) => {
       window.unityInstance = unityInstance;
       window.sendMessageToUnity = (objectName, methodName, value) => {
         unityInstance.SendMessage(objectName, methodName, value);
       };
     });
   </script>
   ```

4. **Create these C# scripts in Unity:**
   - `BodyController.cs` with `UpdateBodyParameters(string jsonParams)` method
   - `ClothingController.cs` with `LoadClothing(string modelPath)` method

## Database Schema

### clothing_items table
- `id`: UUID primary key
- `name`: Clothing item name
- `category`: Type of clothing (tops, bottoms, dresses, etc.)
- `image_url`: Preview image URL
- `model_path`: Path to 3D model in Unity
- `price`: Price in USD
- `sizes`: Available sizes array

### body_presets table
- `id`: UUID primary key
- `name`: Preset name
- `description`: Preset description
- `parameters`: JSON with body measurements

## Technology Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Database:** Supabase (PostgreSQL)
- **Build Tool:** Vite
- **3D Viewer:** Unity WebGL (to be integrated)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Adding Clothing Items

Use Supabase dashboard or SQL to add clothing items:

```sql
INSERT INTO clothing_items (name, category, image_url, model_path, price, sizes)
VALUES (
  'Classic T-Shirt',
  'tops',
  'https://example.com/tshirt.jpg',
  'Models/Clothing/TShirt_01',
  29.99,
  ARRAY['XS', 'S', 'M', 'L', 'XL']
);
```

### Adding Body Presets

```sql
INSERT INTO body_presets (name, description, parameters)
VALUES (
  'Athletic',
  'Toned and muscular build',
  '{"height": 175, "chest": 95, "waist": 75, "hips": 95, "shoulders": 110, "inseam": 80}'::jsonb
);
```

## Notes

- The Unity 3D viewer shows placeholder instructions until Unity build files are added
- All other features (body controls, clothing catalog, presets) work without Unity
- The application uses Supabase for data persistence
- Row Level Security (RLS) is enabled on all tables
- Unity does not exist yet (please don't ask)

## Support

For issues or questions, refer to the documentation:
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Unity WebGL Documentation](https://docs.unity3d.com/Manual/webgl.html)
