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

/* global getParticipantRegistry getAssetRegistry getFactory */


/**
 * Function to verify every content in Pedido is in Shipment
 * @param {org.acme.shipping.supplychain.EncargoSolicitado} shipment - la solicitud de insumos y medicamentos
 * @transaction
 */

async function CompletarEncargo(s) {  // eslint-disable-line no-unused-vars

  const shipment = factory.newResource(NS, 'Shipment', s.encargoId);
  const servicioSolicitante = s.poseedor.servicioTrabajador.servicioId;

    var shipmentSolicitado = factory.newEvent(NS, 'ShipmentSolicitadoEvent');
  shipmentSolicitado.shipment = shipment;
  var message = 'Un nuevo encargo ha sido solicitado con fecha: ' + shipmentReceived.timestamp;
  shipmentSolicitado.message = message;
  emit(shipmentSolicitado);

  // set the status of the shipment
  shipment.status = 'SOLICITADO';
  shipment.contract = s.contract;
  shipment.urgencia = s.urgencia;

  var insumos = []

  for (suministro in s.Suministro){
  		insumo = factory.newConcept(NS, 'Suministro', suministro.suministroId);
    	insumo.type = suministro.type;
    	insumo.cantidad = 6; // Ver aquí como se puede actualizar una nueva cantidad.
		insumos.push(insumo)
    }

  shipment.listaPedido = insumos;

  // add the shipment
    const shipmentRegistry = await getAssetRegistry(NS + '.Encargo');
    await shipmentRegistry.addAll([shipment]);

    let shipCreationEvent = factory.newEvent(NS, 'ShipmentCreated');
    shipCreationEvent.shipment = shipment;
    emit(shipCreationEvent);

    const bodegaRegistry = await getParticipantRegistry('org.acme.shipping.supplychain.Bodega');
    await bodegaRegistry.update(s.contract.bodeguero);

}

/**
 * A shipment has been received by an importer
 * @param {org.acme.shipping.supplychain.EncargoRecibido} shipmentReceived - the ShipmentReceived transaction
 * @transaction
 */
async function ActualizacionStocks(shipmentReceived) {  // eslint-disable-line no-unused-vars

    const contract = shipmentReceived.shipment.contract;
    const shipment = shipmentReceived.shipment;
  	const enfermero = shipmentReceived.efermero
//    let payOut = contract.unitPrice * shipment.unitCount;

    console.log('Contract arrivalDateTime: ' + contract.arrivalDateTime);

    // set the status of the shipment
    shipment.status = 'RECIBIDO';

    var shipmentRecibido = factory.newEvent(NS, 'ShipmentRecibidoEvent');
    shipmentRecibido.shipment = shipment;
    var message = 'El pedido ' + shipment.encargoId + ' ha llegado en el momento ' +    shipmentReceived.timestamp + 'y se encuentra disponible.';
    shipmentRecibido.message = message;
    emit(shipmentRecibido);

    const servicioSolicitante = shipment.enfermero.ServicioClinico

  for (suministro in shipment.listaPedido) {

    id = suministro.suministroId;
    cantidad = suministro.cantidad;

    try {
    	servicioSolicitante.stock.id.cantidad += newCantidad;
    }
    catch(err){
    	servicioSolicitante.stock.push([id, cantidad])
    }

  }

    // update the nurse's balance
    const enfermeroRegistry = await getParticipantRegistry('org.acme.shipping.supplychain.Enfermero');
    await enfermeroRegistry.update(contract.enfermero);

    // update the bodega's balance
    const bodegaRegistry = await getParticipantRegistry('org.acme.shipping.supplychain.Bodega');
    await bodegaRegistry.update(contract.encargadoBodega);

    // update the state of the shipment
    const shipmentRegistry = await getAssetRegistry('org.acme.shipping.supplychain.Shipment');
    await shipmentRegistry.update(shipment);
}



/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.acme.shipping.supplychain.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
async function setupDemo(setupDemo) {  // eslint-disable-line no-unused-vars

    const factory = getFactory();
    const NS = 'org.acme.shipping.supplychain';

    // create the grower
    const enfermero = factory.newResource(NS, 'Enfermero', 'farmer@email.com');
    const enfermeroPersonalData = factory.newConcept(NS, 'PersonalData');
    enfermeroPersonalData.data = 'Germán';
    enfermero.address = enfermeroPersonalData;
    enfermero.accountBalance = 0;

    // create the importer
    const trabajadorBodega = factory.newResource(NS, 'Bodega', 'supermarket@email.com');
    const bodegaPersonalData = factory.newConcept(NS, 'PersonalData');
    bodegaPersonalData.country = 'Vicente';
    trabajadorBodega.address = bodegaPersonalData;
    trabajadorBodega.accountBalance = 0;

    // create the shipper
    const estafeta = factory.newResource(NS, 'Estafeta', 'shipper@email.com');
    const estafetaPersonalData = factory.newConcept(NS, 'PersonalData');
    estafetaPersonalData.country = 'Angélica';
    estafeta.address = estafetaPersonalData;
    estafeta.accountBalance = 0;

    // create the contract
    const contract = factory.newResource(NS, 'Contract', 'CON_001');
    contract.enfermero = factory.newRelationship(NS, 'Enfermero', 'farmer@email.com');
    contract.encargadoBodega = factory.newRelationship(NS, 'Bodega', 'supermarket@email.com');
    contract.estafeta = factory.newRelationship(NS, 'Estafeta', 'shipper@email.com');
    const tomorrow = setupDemo.timestamp;
    tomorrow.setDate(tomorrow.getDate() + 1);
    contract.arrivalDateTime = tomorrow; // the shipment has to arrive tomorrow
    contract.minTemperature = 2; // min temperature for the cargo
    contract.maxTemperature = 10; // max temperature for the cargo
    contract.minPenaltyFactor = 0.2; // we reduce the price by 20 cents for every degree below the min temp
    contract.maxPenaltyFactor = 0.1; // we reduce the price by 10 cents for every degree above the max temp

    // create the shipment
    const shipment = factory.newResource(NS, 'Shipment', 'SHIP_001');
    shipment.status = 'IN_TRANSIT';
    shipment.contract = factory.newRelationship(NS, 'Contract', 'CON_001');

    // add the growers
    const enfermeroRegistry = await getParticipantRegistry(NS + '.Enfermero');
    await enfermeroRegistry.addAll([enfermero]);

    // add the importers
    const bodegaRegistry = await getParticipantRegistry(NS + '.Bodega');
    await bodegaRegistry.addAll([trabajadorBodega]);

    // add the shippers
    const estafetaRegistry = await getParticipantRegistry(NS + '.Estafeta');
    await estafetaRegistry.addAll([estafeta]);

    // add the contracts
    const contractRegistry = await getAssetRegistry(NS + '.Contract');
    await contractRegistry.addAll([contract]);

    // add the shipments
    const shipmentRegistry = await getAssetRegistry(NS + '.Shipment');
    await shipmentRegistry.addAll([shipment]);
}
