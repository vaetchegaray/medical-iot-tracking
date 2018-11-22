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
 * @param {org.acme.shipping.supplychain.CrearEncargo} s - la solicitud de insumos y medicamentos
 * @transaction
 */

async function CompletarEncargo(s) {  // eslint-disable-line no-unused-vars
  const factory = getFactory();
  const NS = 'org.acme.shipping.supplychain';

  const shipment = factory.newResource(NS, 'Encargo', s.encargoId);

  // set the status of the shipment
  shipment.status = 'SOLICITADO';
  shipment.contract = s.contract;
  shipment.urgencia = s.urgencia;

  var pedido = factory.newConcept(NS, 'listaStock');
  pedido.insumos = s.listaPedido.insumos;
  pedido.cantidades = s.listaPedido.cantidades;

  shipment.listaPedido = pedido;

  // add the shipment
    const shipmentRegistry = await getAssetRegistry(NS + '.Encargo');
    await shipmentRegistry.addAll([shipment]);

    let shipCreationEvent = factory.newEvent(NS, 'ShipmentCreated');
    shipCreationEvent.shipment = shipment;
    var message = 'Un nuevo encargo ha sido solicitado con fecha: '; // + s.timestamp
  	shipCreationEvent.message = message;
    emit(shipCreationEvent);

}

/**
 * A shipment has been received by an importer
 * @param {org.acme.shipping.supplychain.EncargoRecibido} sReceived - Transaccion que implica la recepción de un encargo
 * @transaction
 */
async function ActualizacionStocks(sReceived) {  // eslint-disable-line no-unused-vars
  	const factory = getFactory();
    const NS = 'org.acme.shipping.supplychain';

  	const encargo = sReceived.shipment;
    const contract = encargo.contract;
  	const enfermero = sReceived.efermero;

    console.log('Contract arrivalDateTime: ' + contract.arrivalDateTime);

    // set the status of the shipment
    encargo.status = 'RECIBIDO';

    var shipmentRecibido = factory.newEvent(NS, 'ShipmentRecibido');
    shipmentRecibido.shipment = encargo;
    var message = 'El pedido ' + encargo.encargoId + ' ha llegado en el momento ' +    sReceived.timestamp + 'y se encuentra disponible.';
    shipmentRecibido.message = message;
    emit(shipmentRecibido);

  const servicioSolicitante = contract.receptor
  const servicioEntregante = contract.emisor

  for (const i in encargo.listaPedido.insumos ) {

    var producto = encargo.listaPedido.insumos[i];
    var cantidad = encargo.listaPedido.cantidades[i];

    function findFirst(element) {
  		return element == producto;
		}

    const j = servicioSolicitante.stock.insumos.findIndex(findFirst);
    const k = servicioEntregante.stock.insumos.findIndex(findFirst);

    servicioSolicitante.stock.cantidades[j] += cantidad;
    servicioEntregante.stock.cantidades[k] -= cantidad;

    //Poner un if si el id del producto es nuevo

  }

    // updates
    const enfermeroRegistry = await getParticipantRegistry('org.acme.shipping.supplychain.Enfermero');
    await enfermeroRegistry.update(contract.enfermero);

    const BC_Registry = await getParticipantRegistry('org.acme.shipping.supplychain.Bodega');
    await BC_Registry.update(servicioEntregante);

  	const BS_Registry = await getParticipantRegistry('org.acme.shipping.supplychain.Bodega');
    await BS_Registry.update(servicioSolicitante);

    const shipmentRegistry = await getAssetRegistry('org.acme.shipping.supplychain.Encargo');
    await shipmentRegistry.update(encargo);
}



/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.acme.shipping.supplychain.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
async function setupDemo(setupDemo) {  // eslint-disable-line no-unused-vars

    const factory = getFactory();
    const NS = 'org.acme.shipping.supplychain';

    // Crear un enfermero
    const enfermero = factory.newResource(NS, 'Enfermero', 'user001');
    const ePersonalData = factory.newConcept(NS, 'PersonalData');
    ePersonalData.nombre = 'Germán';
    ePersonalData.apellido = 'Cheuque';
    ePersonalData.cargo = 'enfermero';
    ePersonalData.mail = 'clinica@mail.com';
    enfermero.data = ePersonalData;
  	enfermero.ServicioID = 'servicio001';

    // Crear un Bodeguero
    const bodeguero = factory.newResource(NS, 'Bodeguero', 'user002');
    const bPersonalData = factory.newConcept(NS, 'PersonalData');
 	bPersonalData.nombre = 'Vicente';
    bPersonalData.apellido = 'Etchegaray';
    bPersonalData.cargo = 'bodeguero';
    bPersonalData.mail = 'bodega@mail.com';
    bodeguero.data = bPersonalData;

    // Crear el estafeta
    const estafeta = factory.newResource(NS, 'Estafeta', 'user003');
    const esPersonalData = factory.newConcept(NS, 'PersonalData');
 	esPersonalData.nombre = 'Angie';
    esPersonalData.apellido = 'Ubilla';
    esPersonalData.cargo = 'estafeta';
    esPersonalData.mail = 'tens@mail.com';
    estafeta.data = esPersonalData;

    const paciente = factory.newResource(NS, 'Paciente', 'paciente001');
    paciente.cobroPendiente = 0;


  	const bodega_clinica = factory.newResource(NS, 'Bodega', 'clinica001');
  	var stock_clinica = factory.newConcept(NS, 'listaStock');
  	stock_clinica.insumos = ['INSULINA', 'ADRENALINA', 'GASA', 'JERINGA'];
    stock_clinica.cantidades = [400, 300, 500, 1000];
    bodega_clinica.stock = stock_clinica


  	const bodega_servicio = factory.newResource(NS, 'Bodega', 'servicio001');
  	var stock_servicio = factory.newConcept(NS, 'listaStock');
  	stock_servicio.insumos = ['INSULINA', 'ADRENALINA', 'GASA', 'JERINGA'];
    stock_servicio.cantidades = [5, 0, 20, 0];
    bodega_servicio.stock = stock_servicio


    // create the contract
    const contract = factory.newResource(NS, 'Contract', 'CON_001');
    contract.enfermero = factory.newRelationship(NS, 'Enfermero', 'user001');
    //contract.bodeguero = factory.newRelationship(NS, 'Bodeguero', 'user002');
    //contract.estafeta = factory.newRelationship(NS, 'Estafeta', 'user003');
  	contract.receptor = factory.newRelationship(NS, 'Bodega', 'servicio001');
    contract.emisor = factory.newRelationship(NS, 'Bodega', 'clinica001');
    const tomorrow = setupDemo.timestamp;
    tomorrow.setDate(tomorrow.getDate() + 1);
    contract.arrivalDateTime = tomorrow; // the shipment has to arrive tomorrow


    // crear un encargo
    const encargo = factory.newResource(NS, 'Encargo', 'ENCARGO_001');
    encargo.status = 'EN_CAMINO';
  	encargo.urgencia = 'ALTA';
    const listaEncargo = factory.newConcept(NS, 'listaStock');
  	listaEncargo.insumos = ['INSULINA', 'ADRENALINA', 'GASA', 'JERINGA'];
    listaEncargo.cantidades = [10, 2, 50, 15];
    encargo.listaPedido = listaEncargo
    encargo.contract = factory.newRelationship(NS, 'Contract', 'CON_001');

    // Agregar enfermeros
    const enfermeroRegistry = await getParticipantRegistry(NS + '.Enfermero');
    await enfermeroRegistry.addAll([enfermero]);

    // Agregar Bodegueros
    const bodegaRegistry = await getParticipantRegistry(NS + '.Bodeguero');
    await bodegaRegistry.addAll([bodeguero]);

    // Agregar Estafetas
    const estafetaRegistry = await getParticipantRegistry(NS + '.Estafeta');
    await estafetaRegistry.addAll([estafeta]);

  	// Agregar Bodegas
    const bodegasRegistry = await getParticipantRegistry(NS + '.Bodega');
    await bodegasRegistry.addAll([bodega_clinica, bodega_servicio]);

  	// Agregar Pacientes
    const pacienteRegistry = await getParticipantRegistry(NS + '.Paciente');
    await pacienteRegistry.addAll([paciente]);

    // Agregar Contratos
    const contractRegistry = await getAssetRegistry(NS + '.Contract');
    await contractRegistry.addAll([contract]);

    // Agregar Encargos
    const shipmentRegistry = await getAssetRegistry(NS + '.Encargo');
    await shipmentRegistry.addAll([encargo]);
}
