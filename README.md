# SAHP Management System

Sistema web completo para la gestión interna de **San Andreas Highway Patrol (SAHP)**.  
Incluye gestión de **vehículos**, **clases**, **instructores** y **autenticación**, con frontend en Angular y backend en Node.js desplegado en Vercel.

---

## 🚓 Funcionalidades

### 🔐 Autenticación
- Login con usuario y contraseña
- Contraseñas cifradas con **bcrypt**
- Autenticación mediante **JWT**
- Persistencia de sesión con `localStorage`
- Detección de token expirado

### 🚗 Vehículos
- Listado completo de vehículos
- Filtros por nombre y clase
- Ordenación A–Z / Z–A
- Copiar modelo al portapapeles
- CRUD completo (admin)
- Edición inline (sin popups)

### 🏷️ Clases
- Visualización de clases (B, A, S+)
- Relación con vehículos
- Conteo dinámico

### 👮 Instructores
- Listado de instructores
- Foto, rango, teléfono y fecha de nacimiento
- Conteo total
- Crear, editar y eliminar instructores (admin)
- Edición inline en la propia tarjeta

### 🛡️ Seguridad
- Rutas protegidas
- Acciones sensibles solo para administradores
- Validación backend

---

## 🧱 Tecnologías

### Frontend
- **Angular 18**
- Standalone Components
- Angular Router
- HttpClient
- FormsModule
- JWT Decode
- CSS moderno (Grid, Flex, clamp)
- Google Material Icons (instalados localmente)

### Backend
- **Node.js**
- API Serverless (Vercel)
- MySQL
- JWT
- bcryptjs
- CORS configurado manualmente

---

## 📂 Estructura del proyecto

### Frontend
```
sahp-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── vehicles/
│   │   │   ├── classes/
│   │   │   ├── instructors/
│   │   │   └── login/
│   │   ├── services/
│   │   └── guards/
│   ├── assets/
│   └── styles.css
```

### Backend
```
sahp-backend/
├── api/
│   ├── auth.js
│   ├── vehicles.js
│   ├── classes.js
│   └── instructors.js
├── db.js
└── vercel.json
```

---

## 🔧 Instalación local

### Backend
```bash
npm install
vercel dev
```

Variables de entorno:
```
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
```

### Frontend
```bash
npm install
ng serve
```

---

## 🚀 Deploy

- **Frontend**: Vercel
- **Backend**: Vercel (Serverless Functions)
- **Base de datos**: MySQL externo

---

## 🧪 Cuenta de prueba

```
Usuario: admin
Contraseña: admin123
```

---

## 📌 Notas importantes

- El backend usa `req.query` para DELETE y PUT (Vercel)
- Fechas se normalizan a formato `yyyy-MM-dd` para inputs type="date"
- No se usan CDNs externos para iconos

---

## 📸 Capturas

![Captura 1](https://i.imgur.com/qs5Z2XN.jpeg)
![Captura 2](https://i.imgur.com/avmSwqJ.jpeg)
![Captura 3](https://i.imgur.com/2VOJsRo.jpeg)
![Captura 4](https://i.imgur.com/uMBqYTr.jpeg)
![Captura 5](https://i.imgur.com/suO4yOr.jpeg)
![Captura 6](https://i.imgur.com/PcN55vI.jpeg)

---


## 👤 Autor

Proyecto desarrollado por **Lucas**  
Rol: Desarrollador Web

---

## 📝 Licencia

Proyecto privado – uso educativo / interno
