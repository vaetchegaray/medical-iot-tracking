# Arquitectura de la aplicación
![image](https://hyperledger.github.io/composer/latest/assets/img/ComposerArchitecture.svg)

## REST SERVER
### Crear Aplicación Web
Hyperledger Composer tiene la capacidad de generar una REST API utilizando la herramienta `composer-rest-server`. Esto permite generar una Open API que utiliza el modelo antes definido que permite enviar o recibir transacciones según el modelo CRUD.
Luego, es posible desarrollar una aplicación (por ejemplo en Angular 4) comunicandose con la red utilizando la REST API.
![image](https://hyperledger.github.io/composer/latest/assets/img/Angular.svg)
Para la creación de la aplicación en Angular es posible utilizar Yeoman, una herramienta que permite crear aplicaciones web a partir de plantillas predefinidas. Esto se realiza en el caso específico de la herramienta composer utilizando `yo hyperledger-composer`.
