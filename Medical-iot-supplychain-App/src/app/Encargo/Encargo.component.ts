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
import { EncargoService } from './Encargo.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-encargo',
  templateUrl: './Encargo.component.html',
  styleUrls: ['./Encargo.component.css'],
  providers: [EncargoService]
})
export class EncargoComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  encargoId = new FormControl('', Validators.required);
  status = new FormControl('', Validators.required);
  urgencia = new FormControl('', Validators.required);
  listaPedido = new FormControl('', Validators.required);
  contract = new FormControl('', Validators.required);

  constructor(public serviceEncargo: EncargoService, fb: FormBuilder) {
    this.myForm = fb.group({
      encargoId: this.encargoId,
      status: this.status,
      urgencia: this.urgencia,
      listaPedido: this.listaPedido,
      contract: this.contract
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceEncargo.getAll()
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
      $class: 'org.acme.shipping.supplychain.Encargo',
      'encargoId': this.encargoId.value,
      'status': this.status.value,
      'urgencia': this.urgencia.value,
      'listaPedido': this.listaPedido.value,
      'contract': this.contract.value
    };

    this.myForm.setValue({
      'encargoId': null,
      'status': null,
      'urgencia': null,
      'listaPedido': null,
      'contract': null
    });

    return this.serviceEncargo.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'encargoId': null,
        'status': null,
        'urgencia': null,
        'listaPedido': null,
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
      $class: 'org.acme.shipping.supplychain.Encargo',
      'status': this.status.value,
      'urgencia': this.urgencia.value,
      'listaPedido': this.listaPedido.value,
      'contract': this.contract.value
    };

    return this.serviceEncargo.updateAsset(form.get('encargoId').value, this.asset)
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

    return this.serviceEncargo.deleteAsset(this.currentId)
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

    return this.serviceEncargo.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'encargoId': null,
        'status': null,
        'urgencia': null,
        'listaPedido': null,
        'contract': null
      };

      if (result.encargoId) {
        formObject.encargoId = result.encargoId;
      } else {
        formObject.encargoId = null;
      }

      if (result.status) {
        formObject.status = result.status;
      } else {
        formObject.status = null;
      }

      if (result.urgencia) {
        formObject.urgencia = result.urgencia;
      } else {
        formObject.urgencia = null;
      }

      if (result.listaPedido) {
        formObject.listaPedido = result.listaPedido;
      } else {
        formObject.listaPedido = null;
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
      'encargoId': null,
      'status': null,
      'urgencia': null,
      'listaPedido': null,
      'contract': null
      });
  }

}
