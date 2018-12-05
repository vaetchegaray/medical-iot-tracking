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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { ShipmentComponent } from './Shipment/Shipment.component';
import { Contract_Proveedores_ClinicaComponent } from './Contract_Proveedores_Clinica/Contract_Proveedores_Clinica.component';
import { EncargoComponent } from './Encargo/Encargo.component';
import { Contract_InternaComponent } from './Contract_Interna/Contract_Interna.component';
import { DemoComponent } from './Demo/Demo.component'

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

  @NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ShipmentComponent,
    Contract_Proveedores_ClinicaComponent,
    EncargoComponent,
    Contract_InternaComponent,
    ProveedorComponent,
    TransportistaComponent,
    BodegaComponent,
    EnfermeroComponent,
    EstafetaComponent,
    BodegueroComponent,
    PacienteComponent,
    TemperatureReadingComponent,
    GpsReadingComponent,
    EncargoRecibido_BodegaComponent,
    SolicitarPedidoProveedorComponent,
    SolicitarPedidoBodegaComponent,
    EncargoRecibido_ServicioComponent,
    SetupDemoComponent,
    DemoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
