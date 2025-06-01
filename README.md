# Sistema de Monitoreo de Aire - Frontend

Frontend del Sistema de Monitoreo de Aire desarrollado con React y TypeScript.

## Requisitos

- Node.js (versión 14 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd [NOMBRE_DEL_REPOSITORIO]
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
REACT_APP_API_URL=http://localhost:8000/api
```

4. Iniciar el servidor de desarrollo:
```bash
npm start
# o
yarn start
```

## Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── config/        # Configuración (axios, etc.)
├── services/      # Servicios de API
├── pages/         # Páginas de la aplicación
├── hooks/         # Custom hooks
├── utils/         # Utilidades
└── types/         # Definiciones de tipos TypeScript
```

## Características

- Autenticación de usuarios
- Gestión de zonas y estaciones
- Monitoreo de sensores en tiempo real
- Sistema de alertas
- Generación de reportes
- Dashboard personalizable

## Tecnologías Utilizadas

- React
- TypeScript
- Material-UI
- Redux Toolkit
- Axios
- React Router

## Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm build`: Construye la aplicación para producción
- `npm test`: Ejecuta las pruebas
- `npm eject`: Expulsa la configuración de Create React App

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.
