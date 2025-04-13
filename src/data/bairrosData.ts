
interface Bairro {
  id: string;
  nome: string;
  center: { lat: number; lng: number };
}

interface Casa {
  id: string;
  endereco: string;
  numero: string;
  referencia?: string;
  position: { lat: number; lng: number };
}

export const bairrosData: Bairro[] = [
  { id: "1", nome: "Centro", center: { lat: -22.906847, lng: -43.172896 } },
  { id: "2", nome: "Santa Luzia", center: { lat: -22.916847, lng: -43.182896 } },
  { id: "3", nome: "Jardim São Paulo", center: { lat: -22.926847, lng: -43.192896 } },
  { id: "4", nome: "Vila Nova", center: { lat: -22.936847, lng: -43.202896 } },
  { id: "5", nome: "Santo Antônio", center: { lat: -22.946847, lng: -43.212896 } },
];

// Renomeando para bairros para ser usado na importação
export const bairros = bairrosData;

// Adicionando casas para cada bairro
export const casasPorBairro: Record<string, Casa[]> = {
  "1": [
    { id: "101", endereco: "Rua Principal", numero: "123", referencia: "Próximo à praça", position: { lat: -22.905847, lng: -43.171896 } },
    { id: "102", endereco: "Avenida Central", numero: "45", position: { lat: -22.907847, lng: -43.173896 } },
    { id: "103", endereco: "Rua das Flores", numero: "78", referencia: "Em frente ao mercado", position: { lat: -22.908847, lng: -43.174896 } }
  ],
  "2": [
    { id: "201", endereco: "Rua Santa Luzia", numero: "55", position: { lat: -22.915847, lng: -43.181896 } },
    { id: "202", endereco: "Travessa dos Santos", numero: "22", referencia: "Ao lado da igreja", position: { lat: -22.917847, lng: -43.183896 } }
  ],
  "3": [
    { id: "301", endereco: "Rua São Paulo", numero: "100", position: { lat: -22.925847, lng: -43.191896 } },
    { id: "302", endereco: "Avenida Jardim", numero: "200", referencia: "Próximo ao parque", position: { lat: -22.927847, lng: -43.193896 } }
  ],
  "4": [
    { id: "401", endereco: "Rua Nova", numero: "15", position: { lat: -22.935847, lng: -43.201896 } },
    { id: "402", endereco: "Travessa Vila", numero: "30", referencia: "Perto da escola", position: { lat: -22.937847, lng: -43.203896 } }
  ],
  "5": [
    { id: "501", endereco: "Rua Santo Antônio", numero: "88", position: { lat: -22.945847, lng: -43.211896 } },
    { id: "502", endereco: "Avenida Principal", numero: "120", referencia: "Em frente à farmácia", position: { lat: -22.947847, lng: -43.213896 } }
  ]
};
