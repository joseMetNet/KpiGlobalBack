# Proyecto base
## Instalaciones globales
- instalar typescript global
`$ npm install typescript -g`

## Instalaciones 
- Si el proyecto fue descargado de git omita los pasos siguientes y solo escriba el comando npm install
`$ npm install`

--nota: muchas veces en el primer npm install surgen problemas, con otro 
npm install se puede solucionar dichos problemas

## Configuraciónes importantes 
- Si el npm install se hizo de manera satisfactoria es momento de crear 
las variables de entorno crearemos un archivo .env en la raíz del proyecto
inicialmente solo contendrá dos variables
- PORT=8085
- URL_DATABASE=""

## pasos para generar un proyecto de node desde cero / explicación de cada comando instalado en este proyecto

- hacer npm init para inicializar el proyecto y agregar descripción autor y demás parámetros de inicio  
- npm init -y para saltar todo 

`$ npm init`
`$ npm init -y`

- instalamos express
`$ npm install express --save`

- instalamos mongoose / manejador de conexión y peticiones a base de datos
`$ npm install mongoose --save`

- instalamos express validator / manejador de validaciones en el enpoint
`$ npm install express-validator --save`

- instalamos cors / manejador de peticiones desde otros host 
`$ npm install cors --save`

- instalar dotenv / manejador de variables de entorno 
`$ npm install dotenv --save`

- instalar typescript 
`$ npm install typescript --save-dev`

- Ejecutar la inicialización de typescript/ transcompilador de typescript
`$ tsc --init`

- instalar tslint
`$ npm install tslint --save-dev`

- una vez ejecutado este comando se generara un archivo tsconfig.json en ese archivo aremos unas configuraciones / si están en comentario pulsa alt + }
- 1: buscar target y cambiar de es5 a es6 "target": "es6"
- 2: buscar outDir y en esta propiedad ponemos "outDir": "./dist"
- 3: buscar strict y dejar en true "strict":true 
- 4: buscar esModuleInterop y dejar en true "esModuleInterop":true
- 5: buscar sourceMap y dejar en true "sourceMap":true
- 6: buscar moduleResolution y dejamos con la propiedad node "moduleResolution":"node"

- Inicializar archivo de configuración de ts
./node_modules/.bin/tslint --init

- Una vez inicializado el archivo tslint agregamos una regla para usar la consola sin errores 
    - en el archivo tslint nos dirigimos al objeto rules y dentro del objeto agregamos el atributo : "no-console":false

## Instalaciones de desarrollo 

- ts-node-dev: nos permite observar los cambios instantáneos
`$ npm i ts-node-dev`

- Polors nos permite poner un color en la consola para fines prácticos
`$ npm i colors`

## Configuración de comandos 

- En el apartado de scripts en el archivo package.json encontraremos 
  los scripts para iniciar el proyecto.

-Iniciar proyecto en modo desarrollo npm run dev
`npm run dev`

- para compilar en producción usaremos 
`$ tsc`
`$ npm start`