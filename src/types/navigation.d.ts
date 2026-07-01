// ============================================
// TYPES DE NAVIGATION
// ============================================

export type RootStackParamList = {
  AuthStack: undefined;
  AppStack: undefined;
  MainTabs: undefined;
  AdminStack: undefined;
  LicenceBlock: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Caisse: undefined;
  Stock: undefined;
  Clients: undefined;
  Parametres: undefined;
};

export type AdminStackParamList = {
  LicenceManagement: undefined;
  SystemLogs: undefined;
  Users: undefined;
};
