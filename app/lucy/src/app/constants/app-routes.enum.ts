export enum AppRoutes {
    Error = 'error',
    Root = '',
    Login = 'login',
    // User Routes
    UserInfo = 'info',
    Profile = 'profile',
    // Admin Routes
    AdminTools = 'admin',
    // Inventory
    Inventory = 'inventory',
    // Observation Routes
    AddEntry = 'add',

    AddChemicalTreatment = 'create/chemical',
    ViewChemicalTreatment = 'view/chemical/:id',
    EditChemicalTreatment = 'edit/chemical/:id',
  
    AddMechanicalTreatment = 'create/mechnical',
    ViewMechanicalTreatment = 'view/mechnical/:id',
    EditMechanicalTreatment = 'edit/mechnical/:id',

    AddObservation = 'create/observation',
    ViewObservation = 'view/observation/:id',
    EditObservation = 'edit/observation/:id',

    base = 'base',
}

export enum AppRoutesParams {
    DetailAdd = 'add',
    DetailEdit = 'edit',
    DetailView = 'view'
}