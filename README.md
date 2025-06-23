# 🚀 URL Shortener Service

![Status](https://img.shields.io/badge/status-🚧%20In%20Development-yellow)  
![NestJS](https://img.shields.io/badge/framework-NestJS-blue)  
![MongoDB](https://img.shields.io/badge/database-MongoDB-green)  
![Redis](https://img.shields.io/badge/cache-Redis-orange)  
![License](https://img.shields.io/badge/license-MIT-lightgrey)

Un **acortador de URLs** ligero y seguro, construido con NestJS, MongoDB y Redis.  
Implementa índices B-Tree para búsquedas rápidas, caching en Redis para reducir hits a la base de datos, y un algoritmo de SHA-256 determinista (truncado) con mecanismo anti-colisiones.  
Protegido con un flujo de autenticacion completo usando JWT, CORS y Helmet para mitigar XSS y otras vulnerabilidades.

**Pueden encontrar la especificacion OpenApi-compliant y visualizarla usando swagger en este enlace** : [https://url-shortener.towers.solutions/apidoc](https://url-shortener.towers.solutions/apidoc)

## Como Funciona?

- crea un usuario con tu correo electronico y contraseña
- inicia sesion con tu nuevo usuario, recibirás un token JWT
- usa el token para autenticarte en las siguientes peticiones
- acorta una URL usando el endpoint POST `/shortenER`
- obtén la URL acortada y accede a ella, redirigiendo al usuario a la URL original

---

## 📋 Características

- 🔗 **Acortamiento determinista**: SHA-256 truncado + control de colisiones  
- ⚙️ **B-Tree indexes** en MongoDB para búsquedas ultrarrápidas  
- 🚀 **Caching con Redis** para minimizar latencia y carga en BD  
- 🔐 **Seguridad**: JWT (auth), CORS configurado y Helmet habilitado  
- 🐳 **Despliegue usando CI/CD** automatizado con un Pipeline de integracion continua apuntado a un AppService

---

## 🏃‍♂️ Puesta en marcha (Local)

Sigue estos pasos para levantar el proyecto en tu máquina local usando Docker Compose.

### 1️⃣ Clona el repositorio

```bash
git clone https://github.com/AlejoTorres2001/url-shortener-prometeo.git
cd url-shortener
```

## 2️⃣ Crea el Archivo de configuración

Copia el ejemplo y rellena las variables según tu entorno

```bash
cp .env.example .env
```

```bash
# 🔑 JWT & Seguridad
JWT_ACCESS_TOKEN_SECRET="tu_secreto_de_acceso"
JWT_REFRESH_TOKEN_SECRET="tu_secreto_de_refresh"
JWT_ACCESS_TOKEN_EXPIRATION=3600       # en segundos
JWT_REFRESH_TOKEN_EXPIRATION=86400    # en segundos

# 🌐 CORS
ALLOWED_DOMAINS=http://localhost:3000,http://127.0.0.1:3000

# 🗄️ MongoDB
DEV_BACKEND_MONGO_DATABASE_URI="mongodb://usuario:pass@localhost:27017/url_shortener_dev"
PROD_BACKEND_MONGO_DATABASE_URI="mongodb+srv://usuario:pass@cluster.mongodb.net/url_shortener_prod"

# 🐳 Redis
DEV_REDIS_HOST=redis
DEV_REDIS_PORT=6379
DEV_REDIS_PASSWORD="tu_pass_redis"

# 🌍 URLs base
DEV_SHORTENER_BASE_URL=http://localhost:8000
PROD_SHORTENER_BASE_URL=https://url-shortener.towers.solutions

# 🔒 Google Safe Browsing
GSB_API_KEY = 'api_key'
GSB_API_URL = 'api_url'
```

## 3️⃣ Levanta los servicios

Asegurate de tener el motor de Docker corriendo y ejecuta:

```bash
docker-compose up -d
```

Si quieres escuchar los los logs de los servicios, puedes ejecutar:

```bash
docker-compose logs -f api 
o
docker-compose logs -f redis
```

De este manera vas a poner en marcha los siguientes servicios:

- **Api**
- **Redis**

Para un mecanismo de persistencia de datos, puedes levantar una instancia de MongoDB en tu máquina,aunque es recomendable usar la free-tier de un servicio externo como MongoDB Atlas, ahi podras conseguir una base de datos gratuita y escalable y las credenciales para usarla en el archivo `.env`.

## 4️⃣ Accede a la API

La API estará disponible en `http://localhost:8000`. Puedes probar los endpoints usando Postman o swagger en `http://localhost:8000/apidoc`
