Este es un proyecto creado con next.js, utiliza prisma y otras dependencias para iniciar:

## Iniciando el proyecto

ejecutar :
npm i

y luego npm run dev

de esta forma en el puesto 3000 de su localhost podra disfrutar de esta web

http://localhost:3000/

##Metodos de acceso

Requerimientos:
-debe tener una base de datos mysql llamada eagle2_0(esta en la ruta prisma/eagle2_0.sql, puede instalar este script en php my admin)
-dentro de la base de datos tener minimo 3 usuarios con roles de checkiro, operario y digitador(dentro del script de la base de datos esta)
usae el correo para iniciar sesion 

por defecto
checkinero: checkinero@mail.com 
digitador: digitador@mail.com
operario: operario@mail.com

contraseña(para todos los usuarios en el ejemplo): 1234

##Rutas de la app

tener en cuenta que si no tienes un usuario con el rol correspondiente, no te dejara acceder, incluso cuando nos has iniciado sesion

"/" accesible siempre para todos, (es el login de la app)
"/checkin" solo es accesible con el rol de checkinero
"/operario" solo es accesible con el rol de operario
"/digitador" solo es accesible con el rol de digitador

despues de agregar, actualizar o eliminar siempre recargar la pagina.
