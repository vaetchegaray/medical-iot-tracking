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

import { AngularTestPage } from './app.po';
import { ExpectedConditions, browser, element, by } from 'protractor';
import {} from 'jasmine';


describe('Starting tests for Medical-iot-supplychain-App', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be Medical-iot-supplychain-App', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('Medical-iot-supplychain-App');
    })
  });

  it('network-name should be medical-iot-tracking@0.1.13',() => {
    element(by.css('.network-name')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('medical-iot-tracking@0.1.13.bna');
    });
  });

  it('navbar-brand should be Medical-iot-supplychain-App',() => {
    element(by.css('.navbar-brand')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('Medical-iot-supplychain-App');
    });
  });

  
    it('Shipment component should be loadable',() => {
      page.navigateTo('/Shipment');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Shipment');
      });
    });

    it('Shipment table should have 7 columns',() => {
      page.navigateTo('/Shipment');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(7); // Addition of 1 for 'Action' column
      });
    });
  
    it('Contract_Proveedores_Clinica component should be loadable',() => {
      page.navigateTo('/Contract_Proveedores_Clinica');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Contract_Proveedores_Clinica');
      });
    });

    it('Contract_Proveedores_Clinica table should have 11 columns',() => {
      page.navigateTo('/Contract_Proveedores_Clinica');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(11); // Addition of 1 for 'Action' column
      });
    });
  
    it('Encargo component should be loadable',() => {
      page.navigateTo('/Encargo');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Encargo');
      });
    });

    it('Encargo table should have 6 columns',() => {
      page.navigateTo('/Encargo');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(6); // Addition of 1 for 'Action' column
      });
    });
  
    it('Contract_Interna component should be loadable',() => {
      page.navigateTo('/Contract_Interna');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Contract_Interna');
      });
    });

    it('Contract_Interna table should have 6 columns',() => {
      page.navigateTo('/Contract_Interna');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(6); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('Proveedor component should be loadable',() => {
      page.navigateTo('/Proveedor');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Proveedor');
      });
    });

    it('Proveedor table should have 5 columns',() => {
      page.navigateTo('/Proveedor');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(5); // Addition of 1 for 'Action' column
      });
    });
  
    it('Transportista component should be loadable',() => {
      page.navigateTo('/Transportista');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Transportista');
      });
    });

    it('Transportista table should have 4 columns',() => {
      page.navigateTo('/Transportista');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(4); // Addition of 1 for 'Action' column
      });
    });
  
    it('Bodega component should be loadable',() => {
      page.navigateTo('/Bodega');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Bodega');
      });
    });

    it('Bodega table should have 4 columns',() => {
      page.navigateTo('/Bodega');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(4); // Addition of 1 for 'Action' column
      });
    });
  
    it('Enfermero component should be loadable',() => {
      page.navigateTo('/Enfermero');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Enfermero');
      });
    });

    it('Enfermero table should have 4 columns',() => {
      page.navigateTo('/Enfermero');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(4); // Addition of 1 for 'Action' column
      });
    });
  
    it('Estafeta component should be loadable',() => {
      page.navigateTo('/Estafeta');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Estafeta');
      });
    });

    it('Estafeta table should have 3 columns',() => {
      page.navigateTo('/Estafeta');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(3); // Addition of 1 for 'Action' column
      });
    });
  
    it('Bodeguero component should be loadable',() => {
      page.navigateTo('/Bodeguero');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Bodeguero');
      });
    });

    it('Bodeguero table should have 3 columns',() => {
      page.navigateTo('/Bodeguero');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(3); // Addition of 1 for 'Action' column
      });
    });
  
    it('Paciente component should be loadable',() => {
      page.navigateTo('/Paciente');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Paciente');
      });
    });

    it('Paciente table should have 3 columns',() => {
      page.navigateTo('/Paciente');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(3); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('TemperatureReading component should be loadable',() => {
      page.navigateTo('/TemperatureReading');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('TemperatureReading');
      });
    });
  
    it('GpsReading component should be loadable',() => {
      page.navigateTo('/GpsReading');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('GpsReading');
      });
    });
  
    it('EncargoRecibido_Bodega component should be loadable',() => {
      page.navigateTo('/EncargoRecibido_Bodega');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('EncargoRecibido_Bodega');
      });
    });
  
    it('SolicitarPedidoProveedor component should be loadable',() => {
      page.navigateTo('/SolicitarPedidoProveedor');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('SolicitarPedidoProveedor');
      });
    });
  
    it('SolicitarPedidoBodega component should be loadable',() => {
      page.navigateTo('/SolicitarPedidoBodega');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('SolicitarPedidoBodega');
      });
    });
  
    it('EncargoRecibido_Servicio component should be loadable',() => {
      page.navigateTo('/EncargoRecibido_Servicio');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('EncargoRecibido_Servicio');
      });
    });
  
    it('SetupDemo component should be loadable',() => {
      page.navigateTo('/SetupDemo');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('SetupDemo');
      });
    });
  

});