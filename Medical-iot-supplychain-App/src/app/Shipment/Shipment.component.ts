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

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ShipmentService } from './Shipment.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-shipment',
  templateUrl: './Shipment.component.html',
  styleUrls: ['./Shipment.component.css'],
  providers: [ShipmentService]
})
export class ShipmentComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  shipmentId = new FormControl('', Validators.required);
  status = new FormControl('', Validators.required);
  listaPedido = new FormControl('', Validators.required);
  temperatureReadings = new FormControl('', Validators.required);
  gpsReadings = new FormControl('', Validators.required);
  contract = new FormControl('', Validators.required);

  constructor(public serviceShipment: ShipmentService, fb: FormBuilder) {
    this.myForm = fb.group({
      shipmentId: this.shipmentId,
      status: this.status,
      listaPedido: this.listaPedido,
      temperatureReadings: this.temperatureReadings,
      gpsReadings: this.gpsReadings,
      contract: this.contract
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceShipment.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.acme.shipping.externalchain.Shipment',
      'shipmentId': this.shipmentId.value,
      'status': this.status.value,
      'listaPedido': this.listaPedido.value,
      'temperatureReadings': this.temperatureReadings.value,
      'gpsReadings': this.gpsReadings.value,
      'contract': this.contract.value
    };

    this.myForm.setValue({
      'shipmentId': null,
      'status': null,
      'listaPedido': null,
      'temperatureReadings': null,
      'gpsReadings': null,
      'contract': null
    });

    return this.serviceShipment.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'shipmentId': null,
        'status': null,
        'listaPedido': null,
        'temperatureReadings': null,
        'gpsReadings': null,
        'contract': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.acme.shipping.externalchain.Shipment',
      'status': this.status.value,
      'listaPedido': this.listaPedido.value,
      'temperatureReadings': this.temperatureReadings.value,
      'gpsReadings': this.gpsReadings.value,
      'contract': this.contract.value
    };

    return this.serviceShipment.updateAsset(form.get('shipmentId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceShipment.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceShipment.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'shipmentId': null,
        'status': null,
        'listaPedido': null,
        'temperatureReadings': null,
        'gpsReadings': null,
        'contract': null
      };

      if (result.shipmentId) {
        formObject.shipmentId = result.shipmentId;
      } else {
        formObject.shipmentId = null;
      }

      if (result.status) {
        formObject.status = result.status;
      } else {
        formObject.status = null;
      }

      if (result.listaPedido) {
        formObject.listaPedido = result.listaPedido;
      } else {
        formObject.listaPedido = null;
      }

      if (result.temperatureReadings) {
        formObject.temperatureReadings = result.temperatureReadings;
      } else {
        formObject.temperatureReadings = null;
      }

      if (result.gpsReadings) {
        formObject.gpsReadings = result.gpsReadings;
      } else {
        formObject.gpsReadings = null;
      }

      if (result.contract) {
        formObject.contract = result.contract;
      } else {
        formObject.contract = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'shipmentId': null,
      'status': null,
      'listaPedido': null,
      'temperatureReadings': null,
      'gpsReadings': null,
      'contract': null
      });
  }

}
