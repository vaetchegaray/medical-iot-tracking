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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { ShipmentComponent } from './Shipment/Shipment.component';
import { Contract_Proveedores_ClinicaComponent } from './Contract_Proveedores_Clinica/Contract_Proveedores_Clinica.component';
import { EncargoComponent } from './Encargo/Encargo.component';
import { Contract_InternaComponent } from './Contract_Interna/Contract_Interna.component';

import { ProveedorComponent } from './Proveedor/Proveedor.component';
import { TransportistaComponent } from './Transportista/Transportista.component';
import { BodegaComponent } from './Bodega/Bodega.component';
import { EnfermeroComponent } from './Enfermero/Enfermero.component';
import { EstafetaComponent } from './Estafeta/Estafeta.component';
import { BodegueroComponent } from './Bodeguero/Bodeguero.component';
import { PacienteComponent } from './Paciente/Paciente.component';

import { TemperatureReadingComponent } from './TemperatureReading/TemperatureReading.component';
import { GpsReadingComponent } from './GpsReading/GpsReading.component';
import { EncargoRecibido_BodegaComponent } from './EncargoRecibido_Bodega/EncargoRecibido_Bodega.component';
import { SolicitarPedidoProveedorComponent } from './SolicitarPedidoProveedor/SolicitarPedidoProveedor.component';
import { SolicitarPedidoBodegaComponent } from './SolicitarPedidoBodega/SolicitarPedidoBodega.component';
import { EncargoRecibido_ServicioComponent } from './EncargoRecibido_Servicio/EncargoRecibido_Servicio.component';
import { SetupDemoComponent } from './SetupDemo/SetupDemo.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Shipment', component: ShipmentComponent },
  { path: 'Contract_Proveedores_Clinica', component: Contract_Proveedores_ClinicaComponent },
  { path: 'Encargo', component: EncargoComponent },
  { path: 'Contract_Interna', component: Contract_InternaComponent },
  { path: 'Proveedor', component: ProveedorComponent },
  { path: 'Transportista', component: TransportistaComponent },
  { path: 'Bodega', component: BodegaComponent },
  { path: 'Enfermero', component: EnfermeroComponent },
  { path: 'Estafeta', component: EstafetaComponent },
  { path: 'Bodeguero', component: BodegueroComponent },
  { path: 'Paciente', component: PacienteComponent },
  { path: 'TemperatureReading', component: TemperatureReadingComponent },
  { path: 'GpsReading', component: GpsReadingComponent },
  { path: 'EncargoRecibido_Bodega', component: EncargoRecibido_BodegaComponent },
  { path: 'SolicitarPedidoProveedor', component: SolicitarPedidoProveedorComponent },
  { path: 'SolicitarPedidoBodega', component: SolicitarPedidoBodegaComponent },
  { path: 'EncargoRecibido_Servicio', component: EncargoRecibido_ServicioComponent },
  { path: 'SetupDemo', component: SetupDemoComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
