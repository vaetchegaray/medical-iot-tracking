# Medical Supply Chain

> Cadena de negocio que muestra como Enfermeros, Operarios de Bodega y Estafetas definen contratos para llevar registro de suministros de bodega y su uso, así como facilitar su solicitud y automatizar procesos de eventos particulares.

La cadena de negocio define los siguientes contratos:

1. Cada cierto tiempo se hará una renovación automática de los suministros de la bodega de uso directo de los enfermeros, dichos suministros pasaran a ser posesión de un servicio, completando un stock mínimo. El transporte será realizado por un estafeta.
2. Una enfermera tiene la facultad de cheuqear el stock del servicio y solicitar nuevos suministros, específicos o la renovación de stock completo dependiendo de la disponibilidad, con diferentes grados de urgencia. La bodega tiene el deber de chequear el stock de suplementos y realizar la transferencia de bienes al servicio correspondiente. Un estafeta estará a cargo de transportar dichos suministros, llevando un registro del tiempo requerido en la tarea y actualización de los estados de solicitudes.
3. Cada vez que un enfermero haga uso de un suministro será restado del stock del servicio y podrá ser registrado su valor equivalente como cobro al paciente.

La cadena de negocios genera los siguientes documentos:
1. Nota automática de stock a renovar semanalmente.
2. Lista de suministros y stock solicitada por un enfermero indicando urgencia.
3. Registro de recepción y completitud del encargo, transferencia de stock al servicio.
4. Documento de cobro al paciente.

Se definen las siguientes entidades:

**Participantes**
`Enfermero` `Bodeguero` `Estafeta` `Paciente` `Bodegas` 

**Assets**
`Encargo`

**Transactions**
`EncargoRecibido` `ActualizacionStock` `SetupDemo`

Para probar esta cadena de negocio en la ventana **Test**:

Enviar una transacción `SetupDemo`:

```
{
  "$class": "org.acme.shipping.supplychain.SetupDemo"
}
```

Falta actualizar como se conportan las otras transacciones definidas e indicar su relevancia en los contratos definidos. Ejemplo: Submit a `ShipmentReceived` transaction for `SHIP_001` to trigger the payout to the grower, based on the parameters of the `CON_001` contract:

```
{
  "$class": "org.acme.shipping.perishable.ShipmentReceived",
  "shipment": "resource:org.acme.shipping.perishable.Shipment#SHIP_001"
}
```

If the date-time of the `ShipmentReceived` transaction is after the `arrivalDateTime` on `CON_001` then the grower will no receive any payment for the shipment.

---

## License <a name="license"></a>
Hyperledger Project source code files are made available under the Apache License, Version 2.0 (Apache-2.0), located in the LICENSE file. Hyperledger Project documentation files are made available under the Creative Commons Attribution 4.0 International License (CC-BY-4.0), available at http://creativecommons.org/licenses/by/4.0/.
