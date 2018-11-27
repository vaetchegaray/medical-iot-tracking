/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A shipment has been received by an importer
 * @param {org.acme.shipping.externalchain.EncargoRecibido_Bodega} shipmentReceived - the ShipmentReceived transaction
 * @transaction
 */

function payOut(shipmentReceived) {

  	var shipment = shipmentReceived.shipment;
    var contract = shipment.contract;

  	var PagoTotal = 0.0
    var ProductosTotales = 0

  	for (const i in shipmentReceived.shipment.listaPedido.insumos){

      var producto = shipmentReceived.shipment.listaPedido.insumos[i]
      var cantidad = shipmentReceived.shipment.listaPedido.cantidades[i]

      function findFirst(element) {
  		return element == producto;
		}

      var j = contract.Unitprices.productos.findIndex(findFirst);
      var price = contract.Unitprices.precios[j];

      PagoTotal+= price*cantidad;
      ProductosTotales+=cantidad;

      const k = contract.origen.stock.insumos.findIndex(findFirst);
      const l = contract.clinica.stock.insumos.findIndex(findFirst);

      contract.origen.stock.cantidades[k] -= cantidad;
      contract.clinica.stock.cantidades[l] += cantidad;
    }

    var payOut = PagoTotal;

    console.log('Encargo número ' + shipment.shipmentId + ' recibido con fecha ' + shipmentReceived.timestamp);
    console.log('Tiempo de llegada según contrato: ' + contract.arrivalDateTime);

    // set the status of the shipment
    shipment.status = 'RECIBIDO';

    // if the shipment did not arrive on time the payout is zero
    if (shipmentReceived.timestamp > contract.arrivalDateTime) {
        payOut = 0;
        console.log('Encargo ha llegado con retraso');
    } else {
        // find the lowest temperature reading
        if (shipment.temperatureReadings) {
            // sort the temperatureReadings by centigrade
            shipment.temperatureReadings.sort(function (a, b) {
                return (a.centigrade - b.centigrade);
            });
            var lowestReading = shipment.temperatureReadings[0];
            var highestReading = shipment.temperatureReadings[shipment.temperatureReadings.length - 1];
            var penalty = 0;
            console.log('Temperatura más baja leída: ' + lowestReading.centigrade);
            console.log('Temperatura más alta leída: ' + highestReading.centigrade);

            // does the lowest temperature violate the contract?
            if (lowestReading.centigrade < contract.minTemperature) {
                penalty += (contract.minTemperature - lowestReading.centigrade) * contract.minPenaltyFactor;
                console.log('Penalización por temperatura baja: ' + penalty);
            }

            // does the highest temperature violate the contract?
            if (highestReading.centigrade > contract.maxTemperature) {
                penalty += (highestReading.centigrade - contract.maxTemperature) * contract.maxPenaltyFactor;
                console.log('Penalización por temperatura alta: ' + penalty);
            }

            // apply any penalities
            payOut -= (penalty * ProductosTotales);

            if (payOut < 0) {
                payOut = 0;
            }
        }
    }

    //console.log('Payout: ' + payOut);
    contract.origen.accountBalance += payOut;
    contract.clinica.accountBalance -= payOut;

  return getParticipantRegistry('org.acme.shipping.externalchain.Proveedor')
        .then(function (origenRegistry) {
            // update the grower's balance
            return origenRegistry.update(contract.origen);
        })
        .then(function () {
            return getParticipantRegistry('org.acme.shipping.supplychain.Bodega');
        })
        .then(function (origenRegistry) {
            // update the importer's balance
            return origenRegistry.update(contract.clinica);
        })
        .then(function () {
            return getAssetRegistry('org.acme.shipping.externalchain.Shipment');
        })
        .then(function (shipmentRegistry) {
            // update the state of the shipment
            return shipmentRegistry.update(shipment);
        });
}

/**
 * A temperature reading has been received for a shipment
 * @param {org.acme.shipping.externalchain.TemperatureReading} temperatureReading - the TemperatureReading transaction
 * @transaction
 */
function temperatureReading(temperatureReading) {

    var shipment = temperatureReading.shipment;
    var NS = 'org.acme.shipping.externalchain';
    var contract = shipment.contract;
    var factory = getFactory();

    console.log('Nuevo Registro de temperatura: ' + temperatureReading.centigrade + ' en el encargo número ' + shipment.$identifier);

    if (shipment.temperatureReadings) {
        shipment.temperatureReadings.push(temperatureReading);
    } else {
        shipment.temperatureReadings = [temperatureReading];
    }

    if (temperatureReading.centigrade < contract.minTemperature ||
        temperatureReading.centigrade > contract.maxTemperature) {
        var temperatureEvent = factory.newEvent(NS, 'TemperatureThresholdEvent');
        temperatureEvent.shipment = shipment;
        temperatureEvent.temperature = temperatureReading.centigrade;
        temperatureEvent.message = 'Temperature threshold violated! Emitting TemperatureEvent for shipment: ' + shipment.$identifier;
        //console.log(temperatureEvent.message);
        emit(temperatureEvent);
    }

    return getAssetRegistry(NS + '.Shipment')
        .then(function (shipmentRegistry) {
            // add the temp reading to the shipment
            return shipmentRegistry.update(shipment);
        });
}

/**
 * A GPS reading has been received for a shipment
 * @param {org.acme.shipping.externalchain.GpsReading} gpsReading - the GpsReading transaction
 * @transaction
 */
function gpsReading(gpsReading) {

    var factory = getFactory();
    var NS = "org.acme.shipping.externalchain";
    var shipment = gpsReading.shipment;

    var CLINICA_ALEMANA = '/LAT:33.391S/LONG:70.573W';

    if (shipment.gpsReadings) {
        shipment.gpsReadings.push(gpsReading);
    } else {
        shipment.gpsReadings = [gpsReading];
    }

    var latLong = '/LAT:' + gpsReading.latitude + gpsReading.latitudeDir + '/LONG:' +
    gpsReading.longitude + gpsReading.longitudeDir;

    if (latLong == CLINICA_ALEMANA) {
        var shipmentInPortEvent = factory.newEvent(NS, 'ShipmentInPortEvent');
        shipmentInPortEvent.shipment = shipment;
        var message = 'El encargo ha llegado a la clínica. Ubicación: ' + CLINICA_ALEMANA;
        shipmentInPortEvent.message = message;
        emit(shipmentInPortEvent);
    }

    return getAssetRegistry(NS + '.Shipment')
    .then(function (shipmentRegistry) {
        // add the gps reading to the shipment
        return shipmentRegistry.update(shipment);
    });
}

/**
 * Function to verify every content in Pedido is in Shipment
 * @param {org.acme.shipping.externalchain.SolicitarPedidoProveedor} s - la solicitud de insumos y medicamentos
 * @transaction
 */

async function CrearEncargo(s) {  // eslint-disable-line no-unused-vars
  const factory = getFactory();
  const NS = 'org.acme.shipping.externalchain';

  const shipment = factory.newResource(NS, 'Shipment', s.shipmentId);

  // set the status of the shipment
  shipment.status = 'SOLICITADO';
  shipment.contract = s.contract;

  var pedido = factory.newConcept(NS, 'listaStock');
  pedido.insumos = s.listaPedido.insumos;

  for (const x in s.listaPedido.insumos) {

    producto = s.listaPedido.insumos[x]
    function findFirst(element) {
       return element == producto;
     }
    const j = s.contract.origen.stock.insumos.findIndex(findFirst);

    if (s.listaPedido.cantidades[x] > s.contract.origen.stock.cantidades[j]) {
      throw new Error('Cantidad requerida sobrepasa el stock del proveedor');
    }
  }

  pedido.cantidades = s.listaPedido.cantidades;
  shipment.listaPedido = pedido;

  // add the shipment
    const shipmentRegistry = await getAssetRegistry(NS + '.Shipment');
    await shipmentRegistry.addAll([shipment]);

    let shipCreationEvent = factory.newEvent(NS, 'ShipmentCreated');
    shipCreationEvent.shipment = shipment;
    var message = 'Un nuevo encargo ha sido solicitado con fecha: '; // + s.timestamp
  	shipCreationEvent.message = message;
    emit(shipCreationEvent);

}
