import type {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import type {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type {
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  AuthStackScreen: undefined;
};

export type CompanyStackParamList = {
  AttachmentsScreen: {
    companyId?: number;
    propertyId?: number;
    buildingId?: number;
    tenantSpaceId?: number;
    image?: string;
    title?: string;
  };
  CompanyScreen: {id?: number; initialTabName?: string};
  PropertyScreen: {id: number; initialTabName?: string};
  BuildingScreen: {id: number; propertyId: number; initialTabName?: string};
  TenantSpaceScreen: {
    id: number;
    propertyId: number;
    companyId: number;
    buildingId: number;
    initialTabName?: string;
  };
  EditorScreen: {title: string; html: string};
};
export type DashboardStackParamList = {
  AttachmentsScreen: {
    companyId?: number;
    propertyId?: number;
    buildingId?: number;
    tenantSpaceId?: number;
    image?: string;
    title?: string;
  };
  PropertyScreen: {id: number; initialTabName?: string};
  BuildingScreen: {id: number; propertyId: number; initialTabName?: string};
  TenantSpaceScreen: {
    id: number;
    buildingId: number;
    propertyId: number;
    initialTabName?: string;
  };
  EditorScreen: {title: string; html: string};
};

export type MenuStackParamList = {
  FaqScreen: undefined;
  ProfileScreen: undefined;
  ProfileModalScreen: {
    menu?: boolean;
  };
};

export type HomeTabParamList = {
  Dashboard: NavigatorScreenParams<DashboardStackParamList>;
  CompanyStack: NavigatorScreenParams<CompanyStackParamList>;
  MenuStack: NavigatorScreenParams<MenuStackParamList>;
  Search: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<HomeTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabParamList, 'Dashboard'>,
  StackNavigationProp<DashboardStackParamList>
>;
export type CompanyScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabParamList, 'CompanyStack'>,
  StackNavigationProp<CompanyStackParamList>
>;
export type MenuScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabParamList, 'MenuStack'>,
  StackNavigationProp<MenuStackParamList>
>;
