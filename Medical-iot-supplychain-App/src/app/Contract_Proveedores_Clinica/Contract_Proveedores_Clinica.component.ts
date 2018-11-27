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
import { Contract_Proveedores_ClinicaService } from './Contract_Proveedores_Clinica.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-contract_proveedores_clinica',
  templateUrl: './Contract_Proveedores_Clinica.component.html',
  styleUrls: ['./Contract_Proveedores_Clinica.component.css'],
  providers: [Contract_Proveedores_ClinicaService]
})
export class Contract_Proveedores_ClinicaComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  contractId = new FormControl('', Validators.required);
  origen = new FormControl('', Validators.required);
  transporte = new FormControl('', Validators.required);
  clinica = new FormControl('', Validators.required);
  arrivalDateTime = new FormControl('', Validators.required);
  Unitprices = new FormControl('', Validators.required);
  minTemperature = new FormControl('', Validators.required);
  maxTemperature = new FormControl('', Validators.required);
  minPenaltyFactor = new FormControl('', Validators.required);
  maxPenaltyFactor = new FormControl('', Validators.required);

  constructor(public serviceContract_Proveedores_Clinica: Contract_Proveedores_ClinicaService, fb: FormBuilder) {
    this.myForm = fb.group({
      contractId: this.contractId,
      origen: this.origen,
      transporte: this.transporte,
      clinica: this.clinica,
      arrivalDateTime: this.arrivalDateTime,
      Unitprices: this.Unitprices,
      minTemperature: this.minTemperature,
      maxTemperature: this.maxTemperature,
      minPenaltyFactor: this.minPenaltyFactor,
      maxPenaltyFactor: this.maxPenaltyFactor
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceContract_Proveedores_Clinica.getAll()
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
      $class: 'org.acme.shipping.externalchain.Contract_Proveedores_Clinica',
      'contractId': this.contractId.value,
      'origen': this.origen.value,
      'transporte': this.transporte.value,
      'clinica': this.clinica.value,
      'arrivalDateTime': this.arrivalDateTime.value,
      'Unitprices': this.Unitprices.value,
      'minTemperature': this.minTemperature.value,
      'maxTemperature': this.maxTemperature.value,
      'minPenaltyFactor': this.minPenaltyFactor.value,
      'maxPenaltyFactor': this.maxPenaltyFactor.value
    };

    this.myForm.setValue({
      'contractId': null,
      'origen': null,
      'transporte': null,
      'clinica': null,
      'arrivalDateTime': null,
      'Unitprices': null,
      'minTemperature': null,
      'maxTemperature': null,
      'minPenaltyFactor': null,
      'maxPenaltyFactor': null
    });

    return this.serviceContract_Proveedores_Clinica.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'contractId': null,
        'origen': null,
        'transporte': null,
        'clinica': null,
        'arrivalDateTime': null,
        'Unitprices': null,
        'minTemperature': null,
        'maxTemperature': null,
        'minPenaltyFactor': null,
        'maxPenaltyFactor': null
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
      $class: 'org.acme.shipping.externalchain.Contract_Proveedores_Clinica',
      'origen': this.origen.value,
      'transporte': this.transporte.value,
      'clinica': this.clinica.value,
      'arrivalDateTime': this.arrivalDateTime.value,
      'Unitprices': this.Unitprices.value,
      'minTemperature': this.minTemperature.value,
      'maxTemperature': this.maxTemperature.value,
      'minPenaltyFactor': this.minPenaltyFactor.value,
      'maxPenaltyFactor': this.maxPenaltyFactor.value
    };

    return this.serviceContract_Proveedores_Clinica.updateAsset(form.get('contractId').value, this.asset)
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

    return this.serviceContract_Proveedores_Clinica.deleteAsset(this.currentId)
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

    return this.serviceContract_Proveedores_Clinica.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'contractId': null,
        'origen': null,
        'transporte': null,
        'clinica': null,
        'arrivalDateTime': null,
        'Unitprices': null,
        'minTemperature': null,
        'maxTemperature': null,
        'minPenaltyFactor': null,
        'maxPenaltyFactor': null
      };

      if (result.contractId) {
        formObject.contractId = result.contractId;
      } else {
        formObject.contractId = null;
      }

      if (result.origen) {
        formObject.origen = result.origen;
      } else {
        formObject.origen = null;
      }

      if (result.transporte) {
        formObject.transporte = result.transporte;
      } else {
        formObject.transporte = null;
      }

      if (result.clinica) {
        formObject.clinica = result.clinica;
      } else {
        formObject.clinica = null;
      }

      if (result.arrivalDateTime) {
        formObject.arrivalDateTime = result.arrivalDateTime;
      } else {
        formObject.arrivalDateTime = null;
      }

      if (result.Unitprices) {
        formObject.Unitprices = result.Unitprices;
      } else {
        formObject.Unitprices = null;
      }

      if (result.minTemperature) {
        formObject.minTemperature = result.minTemperature;
      } else {
        formObject.minTemperature = null;
      }

      if (result.maxTemperature) {
        formObject.maxTemperature = result.maxTemperature;
      } else {
        formObject.maxTemperature = null;
      }

      if (result.minPenaltyFactor) {
        formObject.minPenaltyFactor = result.minPenaltyFactor;
      } else {
        formObject.minPenaltyFactor = null;
      }

      if (result.maxPenaltyFactor) {
        formObject.maxPenaltyFactor = result.maxPenaltyFactor;
      } else {
        formObject.maxPenaltyFactor = null;
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
      'contractId': null,
      'origen': null,
      'transporte': null,
      'clinica': null,
      'arrivalDateTime': null,
      'Unitprices': null,
      'minTemperature': null,
      'maxTemperature': null,
      'minPenaltyFactor': null,
      'maxPenaltyFactor': null
      });
  }

}
