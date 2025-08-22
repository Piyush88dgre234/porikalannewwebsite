export type Student = {
  id: string;
  name: string;
  roll: string;
  course: string;
  issuedOn: string;
  certId: string;
};
export type User = { role: 'admin' | 'viewer'; name: string } | null;