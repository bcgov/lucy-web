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
    AddObservation = 'create',
    ViewObservation = 'view/:id',
    EditObservation = 'edit/:id',
}

export enum AppRoutesParams {
    DetailAdd = 'add',
    DetailEdit = 'edit',
    DetailView = 'view'
}