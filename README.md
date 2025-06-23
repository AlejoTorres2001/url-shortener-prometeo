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


## 🛠️ Decisiones sobre tecnologías utilizadas

Para garantizar robustez escalabilidad y buena experiencia de desarrollo, he seleccionado cuidadosamente cada tecnología y herramienta. A continuación se detallan las decisiones y sus justificaciones:

### NestJS + TypeScript

- **Arquitectura modular y escalable**: NestJS presenta una arquitectura opinionada pero muy robusta, imponinendo patrones y estandares de software de grado industrial. Está basado en módulos y controladores, lo que facilita la organización del código y la separación de responsabilidades. Generando un marco de trabajo que permite crear abstracciones reutilizables y mantener un código limpio y mantenible.
  
- **Inyección de dependencias**: Una de las principales razones de su eleccion. Permite gestionar servicios y repositorios de forma limpia y testeable.  
  
- **TypeScript**: Aporta tipado estático, autocompletado y detección temprana de errores en tiempo de compilación, mejorando la mantenibilidad y la experiecia de desarrollo.

### MongoDB

- **Modelo de datos flexible**: Su esquema orientado a documentos es ideal para almacenar informacion  sin la rigidez de esquemas relacionales.Es sencillo generar y escalar un cluster en MongoDB Atlas, lo que permite un crecimiento ágil del servicio. Este servicio de base de datos cloud nos permite escalar horizontalmente y manejar grandes volúmenes de datos sin complicaciones mientras que no descuidamos aspectos de networking y seguridad.
  
- **Índices B-Tree**: Permiten búsquedas rápidas basadas en el hash truncado o la url original, garantizando un rendimiento óptimo incluso con grandes volúmenes de datos. Los índices B-Tree son eficientes para operaciones de búsqueda, inserción y eliminación, lo que mejora la velocidad de acceso a los datos.
  
- **Escalabilidad horizontal**: MongoDB Replica Sets y Sharding facilitan el crecimiento del servicio conforme aumente el tráfico.

### Redis como Caché

- **Latencia mínima**: Almacenar en Redis los mappings más consultados reduce significativamente la carga en MongoDB y acelera la redirección. Implementando una cola LRU (Least Recently Used) para mantener en caché las URLs más solicitadas, optimizando el uso de memoria y mejorando la velocidad de respuesta.

- **TTL configurable**: Podemos expirar entradas según la política de uso, manteniendo la caché actualizada y evitando datos obsoletos.Siendo este uno de los aspectos mas complejos de manejar en un sistema de cacheo, Redis nos permite definir un tiempo de vida para cada entrada, lo que ayuda a mantener la cache limpia y eficiente.
  
- **Alto rendimiento**: Es un pilar fundamental en el desarrollo e arquitecturas distribuidas a gran escala, permitiendo manejar millones de peticiones por segundo con baja latencia.

### Algoritmo de hash determinista (SHA-256 truncado)

- **Determinismo**: Un mismo `urlOriginal` siempre produce el mismo `shortCode`, evitando duplicados y simplificando validaciones y reduciendo las escrituras en la base de datos
  
- **Seguridad**: SHA-256 no garantiza resistencia a colisiones accidentales pero se implementa un mecanismo de resolución de colisiones para asegurar unicidad en los `shortCode`.

### Seguridad

- **JWT**: Se optó por unua estrategia de autenticacion completa usando JSON Web Tokens, proporcionando un mecanismo seguro y escalable para manejar sesiones de usuario. Los tokens se firman y se pueden verificar sin necesidad de almacenar estado en el servidor, lo que mejora la escalabilidad.

- **CORS**: Configurado para permitir solo dominios específicos, protegiendo la API de accesos no autorizados desde otros orígenes.

- **Helmet**: Se utiliza para establecer cabeceras HTTP seguras, mitigando vulnerabilidades comunes como XSS, clickjacking y otros ataques basados en cabeceras HTTP.

- **Validación de entradas**: Se implementan validaciones exhaustivas usando ValidationPipelines en los DTOs para prevenir inyecciones y asegurar que los datos recibidos cumplen con los formatos esperados.

- **Google Safe Browsing**: Se integra con la API de Google Safe Browsing para verificar URLs y prevenir redirecciones a sitios maliciosos, mejorando la seguridad del servicio.

- **Manejo de errores**: Se implementa un manejo de errores centralizado para capturar y registrar excepciones, proporcionando respuestas claras y evitando fugas de información sensible.

- **Rate Limiting**: Se implementa un mecanismo de limitación de tasa para prevenir abusos y ataques de denegación de servicio, asegurando que la API pueda manejar múltiples peticiones sin comprometer su rendimiento.

- **Patron Abstract Repository**: Se utiliza para abstraer la lógica de acceso a datos, permitiendo una mayor flexibilidad y facilidad. Muy util para trabajar con distintas funtes de datos sin exponer logica especifica de cada conector dentro de los servicios de negocio.
