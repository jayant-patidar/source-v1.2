
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Feed: undefined;
  Activity: undefined;
  Post: undefined;
  Notifications: undefined;
  Jobs: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  AuthStack: undefined;
  JobDetails: { jobId: string };
  Chat: { negotiationId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
