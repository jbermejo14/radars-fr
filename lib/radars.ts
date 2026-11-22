import radarsData from '@/data/radars.json';
import departementsData from '@/data/departements.json';

export interface RadarItem {
  id: string;
  dept: string;
  lat: number;
  lng: number;
  type: string;
  route: string;
  direction: string;
  emplacement: string;
  vitesse: number | null;
  dateInstall: string | null;
}

export interface DepartementItem {
  code: string;
  name: string;
  regionSlug: string;
  regionName: string;
  radarCount: number;
}

export const RADARS: RadarItem[] = radarsData as RadarItem[];
export const DEPARTEMENTS: DepartementItem[] = departementsData as DepartementItem[];

const departementsByCode = new Map<string, DepartementItem>(
  DEPARTEMENTS.map((d) => [d.code, d])
);

export function getAllDepartements(): DepartementItem[] {
  return DEPARTEMENTS;
}

export function getDepartementByCode(code: string): DepartementItem | undefined {
  const normalized = code.length === 1 ? `0${code}` : code;
  return departementsByCode.get(normalized);
}

export function getRadarsByDepartement(deptCode: string): RadarItem[] {
  const normalized = deptCode.length === 1 ? `0${deptCode}` : deptCode;
  return RADARS.filter((r) => r.dept === normalized);
}

export function getTopDepartements(limit: number = 12): DepartementItem[] {
  return [...DEPARTEMENTS].sort((a, b) => b.radarCount - a.radarCount).slice(0, limit);
}

export function getTotalRadarsCount(): number {
  return RADARS.length;
}
