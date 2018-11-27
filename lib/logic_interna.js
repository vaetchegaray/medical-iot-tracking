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
 * @param {org.acme.shipping.supplychain.SolicitarPedidoBodega} s - la solicitud de insumos y medicamentos
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

  for (const x in s.listaPedido.insumos) {

    producto = s.listaPedido.insumos[x]

    function findFirst(element) {
       return element == producto;
     }

    const j = s.contract.emisor.stock.insumos.findIndex(findFirst);

    if (s.listaPedido.cantidades[x] > s.contract.emisor.stock.cantidades[j]) {
      throw new Error('Cantidad requerida sobrepasa el stock');
    }
  }

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
 * Un encargo ha sido recibido por el servicio
 * @param {org.acme.shipping.supplychain.EncargoRecibido_Servicio} sReceived - Transaccion que implica la recepción de un encargo
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
    const NS = 'org.acme.shipping.externalchain';
  	const NS_I = 'org.acme.shipping.supplychain';

    // Crear un enfermero
    const enfermero = factory.newResource(NS_I, 'Enfermero', 'user001');
    const ePersonalData = factory.newConcept(NS_I, 'PersonalData');
    ePersonalData.nombre = 'Germán';
    ePersonalData.apellido = 'Cheuque';
    ePersonalData.cargo = 'enfermero';
    ePersonalData.mail = 'clinica@mail.com';
    enfermero.data = ePersonalData;
  	enfermero.ServicioID = 'servicio001';

    // Crear un Bodeguero
    const bodeguero = factory.newResource(NS_I, 'Bodeguero', 'user002');
    const bPersonalData = factory.newConcept(NS_I, 'PersonalData');
 	bPersonalData.nombre = 'Vicente';
    bPersonalData.apellido = 'Etchegaray';
    bPersonalData.cargo = 'bodeguero';
    bPersonalData.mail = 'bodega@mail.com';
    bodeguero.data = bPersonalData;

    // Crear el estafeta
    const estafeta = factory.newResource(NS_I, 'Estafeta', 'user003');
    const esPersonalData = factory.newConcept(NS_I, 'PersonalData');
 	esPersonalData.nombre = 'Angie';
    esPersonalData.apellido = 'Ubilla';
    esPersonalData.cargo = 'estafeta';
    esPersonalData.mail = 'tens@mail.com';
    estafeta.data = esPersonalData;

    const paciente = factory.newResource(NS_I, 'Paciente', 'paciente001');
    paciente.cobroPendiente = 0;


  	const bodega_clinica = factory.newResource(NS_I, 'Bodega', 'clinica001');
  	var stock_clinica = factory.newConcept(NS_I, 'listaStock');
  	stock_clinica.insumos = ['INSULINA', 'ADRENALINA', 'GASA', 'JERINGA'];
    stock_clinica.cantidades = [400, 300, 500, 1000];
    bodega_clinica.stock = stock_clinica;
  	bodega_clinica.accountBalance = 0.0;


  	const bodega_servicio = factory.newResource(NS_I, 'Bodega', 'servicio001');
  	var stock_servicio = factory.newConcept(NS_I, 'listaStock');
  	stock_servicio.insumos = ['INSULINA', 'ADRENALINA', 'GASA', 'JERINGA'];
    stock_servicio.cantidades = [5, 0, 20, 0];
    bodega_servicio.stock = stock_servicio


    // create the contract
    const contract1 = factory.newResource(NS_I, 'Contract_Interna', 'CON_001');
    contract1.enfermero = factory.newRelationship(NS_I, 'Enfermero', 'user001');
    //contract.bodeguero = factory.newRelationship(NS, 'Bodeguero', 'user002');
    //contract.estafeta = factory.newRelationship(NS, 'Estafeta', 'user003');
  	contract1.receptor = factory.newRelationship(NS_I, 'Bodega', 'servicio001');
    contract1.emisor = factory.newRelationship(NS_I, 'Bodega', 'clinica001');
    const tom = setupDemo.timestamp;
    tom.setDate(tom.getDate() + 1);
    contract1.arrivalDateTime = tom; // the shipment has to arrive tomorrow

    // crear un encargo
    const encargo = factory.newResource(NS_I, 'Encargo', 'ENCARGO_001');
    encargo.status = 'EN_CAMINO';
  	encargo.urgencia = 'ALTA';
    const listaEncargo = factory.newConcept(NS_I, 'listaStock');
  	listaEncargo.insumos = ['INSULINA', 'ADRENALINA', 'GASA', 'JERINGA'];
    listaEncargo.cantidades = [10, 2, 50, 15];
    encargo.listaPedido = listaEncargo
    encargo.contract = factory.newRelationship(NS_I, 'Contract_Interna', 'CON_001');

    // Agregar enfermeros
    const enfermeroRegistry = await getParticipantRegistry(NS_I + '.Enfermero');
    await enfermeroRegistry.addAll([enfermero]);

    // Agregar Bodegueros
    const bodegaRegistry = await getParticipantRegistry(NS_I + '.Bodeguero');
    await bodegaRegistry.addAll([bodeguero]);

    // Agregar Estafetas
    const estafetaRegistry = await getParticipantRegistry(NS_I + '.Estafeta');
    await estafetaRegistry.addAll([estafeta]);

  	// Agregar Bodegas
    const bodegasRegistry = await getParticipantRegistry(NS_I + '.Bodega');
    await bodegasRegistry.addAll([bodega_clinica, bodega_servicio]);

  	// Agregar Pacientes
    const pacienteRegistry = await getParticipantRegistry(NS_I + '.Paciente');
    await pacienteRegistry.addAll([paciente]);

    // Agregar Contratos
    const contractRegistry = await getAssetRegistry(NS_I + '.Contract_Interna');
    await contractRegistry.addAll([contract1]);

    // Agregar Encargos
    const shipmentRegistry = await getAssetRegistry(NS_I + '.Encargo');
    await shipmentRegistry.addAll([encargo]);



    // CADENA EXTERNA

    var proveedor = factory.newResource(NS, 'Proveedor', 'proveedor001');
    var proveedorAddress = factory.newConcept(NS, 'Address');
    proveedorAddress.country = 'USA';
    proveedor.address = proveedorAddress;
    proveedor.accountBalance = 0.0;
  	var Stocks = factory.newConcept(NS, 'listaStock');
    Stocks.insumos = ['GASA', 'JERINGA', 'INSULINA', 'ADRENALINA'];
    Stocks.cantidades = [100000, 1000000, 20000000, 50000000];
	proveedor.stock = Stocks

    // create the importer
    var transportista = factory.newResource(NS, 'Transportista', 'transp001');
    var transportistaAddress = factory.newConcept(NS, 'Address');
    transportistaAddress.country = 'UK';
    transportista.address = transportistaAddress;
    transportista.accountBalance = 0.0;

    // create the contract
    var contract = factory.newResource(NS, 'Contract_Proveedores_Clinica', 'CON_002');
    contract.origen = factory.newRelationship(NS, 'Proveedor', 'proveedor001');
    contract.transporte = factory.newRelationship(NS, 'Transportista', 'transp001');
    contract.clinica = factory.newRelationship(NS_I, 'Bodega', 'clinica001');
    var tomorrow = setupDemo.timestamp;
    tomorrow.setDate(tomorrow.getDate() + 1);
    contract.arrivalDateTime = tomorrow; // the shipment has to arrive tomorrow

    var prices = factory.newConcept(NS, 'PreciosAcordados');
    prices.productos = ['GASA', 'INSULINA', 'JERINGA', 'ADRENALINA'];
    prices.precios = [1000, 2500, 500, 5000]; // En pesos
  	contract.Unitprices = prices

    contract.minTemperature = 2; // min temperature for the cargo
    contract.maxTemperature = 10; // max temperature for the cargo
    contract.minPenaltyFactor = 0.2; // we reduce the price by 20 cents for every degree below the min temp
    contract.maxPenaltyFactor = 0.1; // we reduce the price by 10 cents for every degree above the max temp

    // create the shipment
    var shipment = factory.newResource(NS, 'Shipment', 'SHIP_001');
    shipment.status = 'EN_CAMINO';
  	var listapedido = factory.newConcept(NS, 'listaStock');
    listapedido.insumos = ['GASA', 'JERINGA', 'INSULINA', 'ADRENALINA'];
    listapedido.cantidades = [1000, 10000, 200000, 50000];
  	shipment.listaPedido = listapedido;
    shipment.contract = factory.newRelationship(NS, 'Contract_Proveedores_Clinica', 'CON_002');

    return getParticipantRegistry(NS + '.Proveedor')
        .then(function (proveedorRegistry) {
            // add the growers
            return proveedorRegistry.addAll([proveedor]);
        })
        .then(function() {
            return getParticipantRegistry(NS + '.Transportista');
        })
        .then(function(transportistaRegistry) {
            // add the importers
            return transportistaRegistry.addAll([transportista]);
        })
        .then(function() {
            return getParticipantRegistry(NS_I + '.Bodega');
        })
        .then(function(bodegaRegistry) {
            // add the shippers
            return bodegaRegistry.addAll([bodega_clinica]);
        })
        .then(function() {
            return getAssetRegistry(NS + '.Contract_Proveedores_Clinica');
        })
        .then(function(contractRegistry) {
            // add the contracts
            return contractRegistry.addAll([contract]);
        })
        .then(function() {
            return getAssetRegistry(NS + '.Shipment');
        })
        .then(function(shipmentRegistry) {
            // add the shipments
            return shipmentRegistry.addAll([shipment]);
        });

}
