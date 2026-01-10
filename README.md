# 🏍️ SAHP – Sistema de Gestión de Instructores

Aplicación web desarrollada con **Angular** y un **backend serverless en Node.js**, orientada a la gestión de instructores del SAHP.  
Incluye listado, creación, edición inline y eliminación de instructores, con control de permisos mediante **JWT**.

---

## 🚀 Tecnologías utilizadas

### Frontend
- Angular (standalone components)
- TypeScript
- HTML5 / CSS3
- FormsModule (ngModel)
- jwt-decode
- Google Material Icons (local)
- Desplegado en Vercel

### Backend
- Node.js
- API serverless (Vercel Functions)
- MySQL
- CORS configurado manualmente
- CRUD completo de instructores

---

## 📂 Estructura del proyecto

```
/src
 ├── app
 │   ├── components
 │   ├── pages
 │   │   └── instructores
 │   ├── services
 │   └── app.routes.ts
 │
 └── assets
     └── icons
```

---

## ✨ Funcionalidades

- 📋 Listado de instructores
- ➕ Crear instructor
- ✏️ Edición inline (sin popups)
- ❌ Eliminación con confirmación
- 🔐 Control de permisos con JWT
- ⏳ Loader durante peticiones
- 📱 Diseño responsive

---

## 🔐 Autenticación

- Token JWT almacenado en `localStorage`
- Validación de expiración
- Acciones protegidas para administradores

---

## 🧑‍🏫 Modelo Instructor

```ts
{
  state_id: number;
  nombre: string;
  apellidos: string;
  rango_sahp: string;
  fecha_nacimiento: string;
  telefono: string;
  foto: string;
}
```

---

## 🔌 Endpoints

- GET    /api/instructors
- POST   /api/instructors
- PUT    /api/instructors?state_id=ID
- DELETE /api/instructors?state_id=ID

---

## 🛠️ Instalación

```bash
npm install
ng serve
```

App disponible en:
http://localhost:4200

---

## 👨‍💻 Autor

Lucas – Proyecto educativo / práctico

---

## 📄 Licencia

MIT
