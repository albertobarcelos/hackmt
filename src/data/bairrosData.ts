
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

// Coordenadas atualizadas e mais precisas para Cáceres-MT
export const bairrosData: Bairro[] = [
  { id: "1", nome: "Centro", center: { lat: -16.0731, lng: -57.6824 } },
  { id: "2", nome: "Santa Luzia", center: { lat: -16.0648, lng: -57.6732 } },
  { id: "3", nome: "Jardim São Paulo", center: { lat: -16.0789, lng: -57.6756 } },
  { id: "4", nome: "Vila Nova", center: { lat: -16.0815, lng: -57.6891 } },
  { id: "5", nome: "Santo Antônio", center: { lat: -16.0596, lng: -57.6928 } },
];

// Renomeando para bairros para ser usado na importação
export const bairros = bairrosData;

// Atualizando as casas para serem mais próximas das coordenadas de cada bairro
export const casasPorBairro: Record<string, Casa[]> = {
  "1": [
    { id: "101", endereco: "Rua Principal", numero: "123", referencia: "Próximo à praça", position: { lat: -16.0731, lng: -57.6824 } },
    { id: "102", endereco: "Avenida Central", numero: "45", position: { lat: -16.0741, lng: -57.6834 } },
    { id: "103", endereco: "Rua das Flores", numero: "78", referencia: "Em frente ao mercado", position: { lat: -16.0721, lng: -57.6814 } }
  ],
  "2": [
    { id: "201", endereco: "Rua Santa Luzia", numero: "55", position: { lat: -16.0648, lng: -57.6732 } },
    { id: "202", endereco: "Travessa dos Santos", numero: "22", referencia: "Ao lado da igreja", position: { lat: -16.0658, lng: -57.6742 } }
  ],
  "3": [
    { id: "301", endereco: "Rua São Paulo", numero: "100", position: { lat: -16.0789, lng: -57.6756 } },
    { id: "302", endereco: "Avenida Jardim", numero: "200", referencia: "Próximo ao parque", position: { lat: -16.0799, lng: -57.6766 } }
  ],
  "4": [
    { id: "401", endereco: "Rua Nova", numero: "15", position: { lat: -16.0815, lng: -57.6891 } },
    { id: "402", endereco: "Travessa Vila", numero: "30", referencia: "Perto da escola", position: { lat: -16.0825, lng: -57.6901 } }
  ],
  "5": [
    { id: "501", endereco: "Rua Santo Antônio", numero: "88", position: { lat: -16.0586, lng: -57.6918 } },
    { id: "502", endereco: "Avenida Principal", numero: "120", referencia: "Em frente à farmácia", position: { lat: -16.0606, lng: -57.6938 } }
  ]
};
