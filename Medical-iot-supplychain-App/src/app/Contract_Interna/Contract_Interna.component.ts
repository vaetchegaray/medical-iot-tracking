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
import { Contract_InternaService } from './Contract_Interna.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-contract_interna',
  templateUrl: './Contract_Interna.component.html',
  styleUrls: ['./Contract_Interna.component.css'],
  providers: [Contract_InternaService]
})
export class Contract_InternaComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  contractId = new FormControl('', Validators.required);
  enfermero = new FormControl('', Validators.required);
  receptor = new FormControl('', Validators.required);
  emisor = new FormControl('', Validators.required);
  arrivalDateTime = new FormControl('', Validators.required);

  constructor(public serviceContract_Interna: Contract_InternaService, fb: FormBuilder) {
    this.myForm = fb.group({
      contractId: this.contractId,
      enfermero: this.enfermero,
      receptor: this.receptor,
      emisor: this.emisor,
      arrivalDateTime: this.arrivalDateTime
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceContract_Interna.getAll()
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
      $class: 'org.acme.shipping.supplychain.Contract_Interna',
      'contractId': this.contractId.value,
      'enfermero': this.enfermero.value,
      'receptor': this.receptor.value,
      'emisor': this.emisor.value,
      'arrivalDateTime': this.arrivalDateTime.value
    };

    this.myForm.setValue({
      'contractId': null,
      'enfermero': null,
      'receptor': null,
      'emisor': null,
      'arrivalDateTime': null
    });

    return this.serviceContract_Interna.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'contractId': null,
        'enfermero': null,
        'receptor': null,
        'emisor': null,
        'arrivalDateTime': null
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
      $class: 'org.acme.shipping.supplychain.Contract_Interna',
      'enfermero': this.enfermero.value,
      'receptor': this.receptor.value,
      'emisor': this.emisor.value,
      'arrivalDateTime': this.arrivalDateTime.value
    };

    return this.serviceContract_Interna.updateAsset(form.get('contractId').value, this.asset)
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

    return this.serviceContract_Interna.deleteAsset(this.currentId)
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

    return this.serviceContract_Interna.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'contractId': null,
        'enfermero': null,
        'receptor': null,
        'emisor': null,
        'arrivalDateTime': null
      };

      if (result.contractId) {
        formObject.contractId = result.contractId;
      } else {
        formObject.contractId = null;
      }

      if (result.enfermero) {
        formObject.enfermero = result.enfermero;
      } else {
        formObject.enfermero = null;
      }

      if (result.receptor) {
        formObject.receptor = result.receptor;
      } else {
        formObject.receptor = null;
      }

      if (result.emisor) {
        formObject.emisor = result.emisor;
      } else {
        formObject.emisor = null;
      }

      if (result.arrivalDateTime) {
        formObject.arrivalDateTime = result.arrivalDateTime;
      } else {
        formObject.arrivalDateTime = null;
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
      'enfermero': null,
      'receptor': null,
      'emisor': null,
      'arrivalDateTime': null
      });
  }

}
