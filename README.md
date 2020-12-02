## Requisitos previos

En primer lugar deberán configurar las variables de entorno en el archivo .env:

```
SMTP_HOST=
SMTP_PORT=465
SMTP_SECURE=true
SMTP_AUTH_USER=
SMTP_AUTH_PASS=
COBEAUTY_HOST=https://cobeauty.store
```

Las variables SMTP son necesarias para que el usuario reciba en su cuenta de correo el resultado del test de Tono Perfecto.

Mientras que el HOST de Cobeauty es necesario configurarlo para dirigir al usuario a la URL correcta cuando finaliza el cuestionario. si hace clic en ver resultado debería llevarlo a la tienda de Cobeauty.

## Desarrollo

Para ejecutar la aplicación en un ambiente local, la opción recomendada es utilizar docker-compose.

1. Ejecutar el siguiente comando para crear el contenedor y dejarlo funcionando: ```docker-compose up --build```

2. Acceder en tu navegador a __localhost:3030__.


## Producción

El despliegue en producción se realiza en la instancia EC2 de AWS que el cliente ya dispone.

1. Conectar por SSH al servidor ```ssh -i Documents/aws/keys/teha-prod.pem ubuntu@13.56.44.110```

2. Ingresar al directorio de tonoperfecto. ```cd tonoperfecto```. Este directorio posee un clone del proyecto. Si es un despliegue desde cero, deberá descomprimir el proyecto que le fue entregado __tonoperfecto-sources.zip__ y luego crear un archivo __.env__ con la configuración de las variables de entorno previamente mencionadas.

3. Para ejecutar el proyecto con docker-compose deberá ejecutar el siguiente comando ```docker-compose up --build -d```.

El servidor de producción posee un reverse proxy (nginx) configurado para resolver todo lo que recibe en https://tonoperfecto.cobeauty.store a http://localhost:3030. Si desea actualizar esta configuración deberá editar el archivo __/etc/nginx/sites-available/tonoperfecto.cobeauty.store__. IMPORTANTE: la edición incorrecta de esta configuración podría dejar inaccesible la aplicación.

### Registro de respuestas

Con el fin de recolectar información útil para futuros análisis, la aplicación tiene una funcionalidad por la cual guarda todas las ejecuciones del cuestionario que llegaron a finalizar en una sugerencia de producto para el usuario.

Esta información puede ser descargada del servidor con el siguiente comando:

```scp -i Documents/aws/keys/teha-prod.pem ubuntu@13.56.44.110:~/tonoperfecto/data/records.json .```

Este archivo se encuentra en formato JSON para facilitar la integración con futuros sistemas que se puedan desarrollar, no obstante si requiere hacer un análisis lo puede convertir a formato de planilla de cálculo con la siguiente herramienta [Convertir JSON a Excel](https://json-csv.com/).