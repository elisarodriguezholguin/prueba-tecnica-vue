# 🏋️‍♀️ Aplicación Web de Registro de Entrenamientos

Esta aplicación web permite a los usuarios **registrar, editar y visualizar sus entrenamientos** de manera intuitiva y en **tiempo real**.  
Fue desarrollada con tecnologías modernas para garantizar una experiencia fluida, atractiva y eficiente.

---

## 🚀 Características principales

- 📅 **Registro de entrenamientos:** permite ingresar fecha, duración y distancia.  
- ✏️ **Edición de registros existentes:** actualiza fácilmente los entrenamientos guardados.  
- 🔄 **Visualización en tiempo real:** sincronización automática con Firebase mediante `onSnapshot`.  
- 💾 **Almacenamiento en la nube:** los datos se guardan en **Firebase Firestore**.  
- ⚙️ **Arquitectura moderna:** construida con **Vue 3 + TypeScript**.  
- 🌐 **Despliegue en Railway:** lista para producción, asegurando disponibilidad y rendimiento.  

---

## 🧰 Tecnologías utilizadas

| Tecnología | Descripción |
|-------------|-------------|
| **Vue 3** | Framework principal para la interfaz de usuario |
| **TypeScript** | Tipado estático para mayor mantenibilidad |
| **Firebase Firestore** | Base de datos en tiempo real |
| **Vite** | Herramienta de desarrollo rápida para Vue |
| **Railway** | Plataforma de despliegue en la nube |

---

## ⚙️ Instalación y configuración

1. **Clona este repositorio:**
   ```bash
   git clone https://github.com/elisarodriguezholguin/prueba-tecnica-vue.git
   cd prueba-tecnica-vue
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura Firebase:**
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Copia tus credenciales del proyecto.
   - Crea el archivo `src/firebase.ts` con el siguiente contenido:
     ```ts
     import { initializeApp } from 'firebase/app'
     import { getFirestore } from 'firebase/firestore'

     const firebaseConfig = {
       apiKey: 'TU_API_KEY',
       authDomain: 'TU_AUTH_DOMAIN',
       projectId: 'TU_PROJECT_ID',
       storageBucket: 'TU_STORAGE_BUCKET',
       messagingSenderId: 'TU_SENDER_ID',
       appId: 'TU_APP_ID',
     }

     const app = initializeApp(firebaseConfig)
     export const db = getFirestore(app)
     ```

4. **Ejecuta la aplicación en modo desarrollo:**
   ```bash
   npm run dev
   ```

5. **Despliegue en Railway:**
   - Crea un nuevo proyecto en [Railway.app](https://railway.app/)
   - Conecta tu repositorio de GitHub.
   - Railway detectará automáticamente la configuración de Vite y Vue.

---

## 🖥️ Estructura del proyecto

```
src/
├── assets/                       # Archivos estáticos (imágenes, estilos, etc.)
├── components/                   # Componentes reutilizables
│   ├── EntrenamientoCard.vue     # Tarjeta individual de entrenamiento
│   └── EntrenamientoForm.vue     # Formulario de registro y edición
├── App.vue                        # Componente raíz de la aplicación
├── firebase.ts                    # Configuración e inicialización de Firebase
├── main.ts                        # Punto de entrada de la aplicación Vue
├── index.html                     # Archivo HTML principal
├── vite.config.ts                 # Configuración de Vite
├── tsconfig.json                  # Configuración de TypeScript
└── README.md                      # Documentación del proyecto

```


## 🧑‍💻 Autor

**Elisa Rodríguez**  
Ingeniera en Sistemas  
Desarrolladora web enfocada en crear experiencias intuitivas y modernas.

---

## 📝 Licencia

Este proyecto está bajo la licencia **MIT**.  
Puedes usarlo, modificarlo y distribuirlo libremente, con atribución correspondiente.

