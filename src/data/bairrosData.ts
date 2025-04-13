
interface Bairro {
  id: string;
  nome: string;
  center: { lat: number; lng: number };
}

export const bairrosData: Bairro[] = [
  { id: "1", nome: "Centro", center: { lat: -22.906847, lng: -43.172896 } },
  { id: "2", nome: "Santa Luzia", center: { lat: -22.916847, lng: -43.182896 } },
  { id: "3", nome: "Jardim São Paulo", center: { lat: -22.926847, lng: -43.192896 } },
  { id: "4", nome: "Vila Nova", center: { lat: -22.936847, lng: -43.202896 } },
  { id: "5", nome: "Santo Antônio", center: { lat: -22.946847, lng: -43.212896 } },
];
