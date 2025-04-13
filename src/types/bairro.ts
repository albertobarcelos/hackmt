
export interface Bairro {
  id: string;
  nome: string;
  center: { lat: number; lng: number };
}

export interface Casa {
  id: string;
  endereco: string;
  numero: string;
  referencia?: string;
  position: { lat: number; lng: number };
}
