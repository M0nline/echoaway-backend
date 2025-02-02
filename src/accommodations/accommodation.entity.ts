export type ConnectivityLevel = 'None' | 'Low' | 'High';

export interface Accommodation {
  id: number;
  name: string;
  location: string;
  type: string;
  connectivity: ConnectivityLevel;
}
