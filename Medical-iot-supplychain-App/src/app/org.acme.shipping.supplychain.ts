import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.acme.shipping.supplychain{
   export enum TipoProducto {
      INSULINA,
      ADRENALINA,
      GASA,
      JERINGA,
   }
   export enum EstadoEncargo {
      SOLICITADO,
      EN_CAMINO,
      RECIBIDO,
   }
   export enum UrgenciaEncargo {
      ALTA,
      MEDIA,
      BAJA,
   }
   export abstract class EncargoTransaction extends Transaction {
      shipment: Encargo;
   }
   export class SolicitarPedidoBodega extends Transaction {
      encargoId: string;
      urgencia: UrgenciaEncargo;
      listaPedido: listaStock;
      contract: Contract_Interna;
   }
   export class EncargoRecibido_Servicio extends EncargoTransaction {
   }
   export class listaStock {
      insumos: TipoProducto[];
      cantidades: number[];
   }
   export class Encargo extends Asset {
      encargoId: string;
      status: EstadoEncargo;
      urgencia: UrgenciaEncargo;
      listaPedido: listaStock;
      contract: Contract_Interna;
   }
   export class Contract_Interna extends Asset {
      contractId: string;
      enfermero: Enfermero;
      receptor: Bodega;
      emisor: Bodega;
      arrivalDateTime: Date;
   }
   export class PersonalData {
      nombre: string;
      apellido: string;
      cargo: string;
      mail: string;
   }
   export class Bodega extends Participant {
      servicioId: string;
      stock: listaStock;
      accountBalance: number;
   }
   export abstract class TrabajadorClinica extends Participant {
      trabajadorId: string;
      data: PersonalData;
   }
   export class Enfermero extends TrabajadorClinica {
      ServicioID: string;
   }
   export class Estafeta extends TrabajadorClinica {
   }
   export class Bodeguero extends TrabajadorClinica {
   }
   export class Paciente extends Participant {
      pacienteId: string;
      cobroPendiente: number;
   }
   export class SetupDemo extends Transaction {
   }
   export class ShipmentSolicitado extends Event {
      message: string;
      shipment: Encargo;
   }
   export class ShipmentRecibido extends Event {
      message: string;
      shipment: Encargo;
   }
   export class ShipmentCreated extends Event {
      message: string;
      shipment: Encargo;
   }
// }
