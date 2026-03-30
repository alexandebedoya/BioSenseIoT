export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DiagnosticResponse {
  diagnosticText: string;
  severity: Severity;
  recommendation: string;
  timestamp: string;
  mq4: number;   // CH4/Gas Natural
  mq7: number;   // CO
  mq135: number; // Air Quality
}

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  healthConditions: string[];
  pets: PetProfile[];
}

export interface AuthResponse {
  accessToken: string;
  email: string;
  fullName: string;
}

export interface GoogleUser {
  idToken: string;
  email: string;
  name?: string;
}

export interface PetProfile {
  name: string;
  species: string;
  breed: string;
  vulnerabilities: string;
}
