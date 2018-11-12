# Arquitectura de la aplicación

![image](https://hyperledger.github.io/composer/latest/assets/img/ComposerArchitecture.svg)

## REST SERVER

### Crear Aplicación Web

Hyperledger Composer tiene la capacidad de generar una REST API utilizando la herramienta `composer-rest-server`. Esto permite generar una Open API que utiliza el modelo antes definido que permite enviar o recibir transacciones según el modelo CRUD.
Luego, es posible desarrollar una aplicación (por ejemplo en Angular 4) comunicandose con la red utilizando la REST API.

![image](https://hyperledger.github.io/composer/latest/assets/img/Angular.svg)

---

Para la creación de la aplicación en Angular es posible utilizar Yeoman, una herramienta que permite crear aplicaciones web a partir de plantillas predefinidas. Esto se realiza en el caso específico de la herramienta composer utilizando `yo hyperledger-composer`.

## Personalizar servidor

El REST SERVER que incluye la herramienta Hyperledger Composer permite una serie de funcionalidades:
- [Publicar eventos](https://hyperledger.github.io/composer/latest/integrating/publishing-events.html)
- [Permitir autenticación](https://hyperledger.github.io/composer/latest/integrating/enabling-rest-authentication.html)
- [Permitir múltiples usuarios](https://hyperledger.github.io/composer/latest/integrating/enabling-multiuser.html)
- [Activar HTTPS y TLS](https://hyperledger.github.io/composer/latest/integrating/securing-the-rest-server.html)
- [Integración con Node-RED](https://www.npmjs.com/package/node-red-contrib-composer)
- [Llamar servicios externos](https://hyperledger.github.io/composer/latest/integrating/call-out)
