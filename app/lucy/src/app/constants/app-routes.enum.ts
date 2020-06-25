/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */
export enum AppRoutes {
    Error = 'error',
    Root = '',
    Login = 'login',
    // User Routes
    UserInfo = 'info',
    Profile = 'profile',
    // Help Routes
    About = 'about',
    // Admin Routes
    AdminTools = 'admin',
    // Inventory
    Inventory = 'inventory',
    // Observation Routes
    AddEntry = 'add',

    AddChemicalTreatment = 'create/chemical',
    ViewChemicalTreatment = 'view/chemical/:id',
    EditChemicalTreatment = 'edit/chemical/:id',

    AddMechanicalTreatment = 'create/mechanical',
    ViewMechanicalTreatment = 'view/mechanical/:id',
    EditMechanicalTreatment = 'edit/mechanical/:id',

    AddMechanicalMonitor = 'create/monitor/mechanical',
    ViewMechanicalMonitor = 'view/monitor/mechanical/:id',
    EditMechanicalMonitor = 'edit/monitor/mechanical/:id',

    AddObservation = 'create/observation',
    ViewObservation = 'view/observation/:id',
    EditObservation = 'edit/observation/:id',

    AddAnimalObservation = 'create/animal/observation',
    ViewAnimalObservation = 'view/animal/observation/:id',
    EditAnimalObservation = 'edit/animal/observation/:id',

    base = 'base',
}

export enum AppRoutesParams {
    DetailAdd = 'add',
    DetailEdit = 'edit',
    DetailView = 'view'
}