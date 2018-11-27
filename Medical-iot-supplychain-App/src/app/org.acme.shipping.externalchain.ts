import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
import {TipoProducto,EstadoEncargo,Bodega} from './org.acme.shipping.supplychain';
// export namespace org.acme.shipping.externalchain{
   export enum CompassDirection {
      N,
      S,
      E,
      W,
   }
   export abstract class ShipmentTransaction extends Transaction {
      shipment: Shipment;
   }
   export class TemperatureReading extends ShipmentTransaction {
      centigrade: number;
   }
   export class GpsReading extends ShipmentTransaction {
      readingTime: string;
      readingDate: string;
      latitude: string;
      latitudeDir: CompassDirection;
      longitude: string;
      longitudeDir: CompassDirection;
   }
   export class EncargoRecibido_Bodega extends ShipmentTransaction {
   }
   export class SolicitarPedidoProveedor extends Transaction {
      shipmentId: string;
      listaPedido: listaStock;
      temperatureReadings: TemperatureReading[];
      gpsReadings: GpsReading[];
      contract: Contract_Proveedores_Clinica;
   }
   export class listaStock {
      insumos: TipoProducto[];
      cantidades: number[];
   }
   export class PreciosAcordados {
      productos: TipoProducto[];
      precios: number[];
   }
   export class Shipment extends Asset {
      shipmentId: string;
      status: EstadoEncargo;
      listaPedido: listaStock;
      temperatureReadings: TemperatureReading[];
      gpsReadings: GpsReading[];
      contract: Contract_Proveedores_Clinica;
   }
   export class Contract_Proveedores_Clinica extends Asset {
      contractId: string;
      origen: Proveedor;
      transporte: Transportista;
      clinica: Bodega;
      arrivalDateTime: Date;
      Unitprices: PreciosAcordados;
      minTemperature: number;
      maxTemperature: number;
      minPenaltyFactor: number;
      maxPenaltyFactor: number;
   }
   export class Address {
      city: string;
      country: string;
      street: string;
      zip: string;
   }
   export abstract class Business extends Participant {
      email: string;
      address: Address;
      accountBalance: number;
   }
   export class Proveedor extends Business {
      stock: listaStock;
   }
   export class Transportista extends Business {
   }
   export class TemperatureThresholdEvent extends Event {
      message: string;
      temperature: number;
      shipment: Shipment;
   }
   export class ShipmentInPortEvent extends Event {
      message: string;
      shipment: Shipment;
   }
   export class ShipmentCreated extends Event {
      message: string;
      shipment: Shipment;
   }
// }
