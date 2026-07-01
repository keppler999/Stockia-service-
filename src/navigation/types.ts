// ============================================
// TYPES DE NAVIGATION
// ============================================

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';

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

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;
export type AdminStackNavigationProp = NativeStackNavigationProp<AdminStackParamList>;

export type RootStackRouteProp = RouteProp<RootStackParamList, keyof RootStackParamList>;
