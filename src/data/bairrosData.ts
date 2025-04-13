
// Dados fictícios de bairros
export const bairros = [
  { id: "1", nome: "Centro", center: { lat: -23.550520, lng: -46.633308 } },
  { id: "2", nome: "Santa Luzia", center: { lat: -23.555520, lng: -46.643308 } },
  { id: "3", nome: "Jardim São Paulo", center: { lat: -23.540520, lng: -46.623308 } },
  { id: "4", nome: "Vila Nova", center: { lat: -23.560520, lng: -46.613308 } },
  { id: "5", nome: "Santo Antônio", center: { lat: -23.545520, lng: -46.653308 } },
];

// Dados fictícios de casas por bairro com coordenadas geográficas
export const casasPorBairro: Record<string, Array<{ 
  id: string; 
  endereco: string; 
  numero: string; 
  referencia?: string;
  position: { lat: number; lng: number };
}>> = {
  "1": [
    { id: "101", endereco: "Rua Principal", numero: "123", referencia: "Próximo à praça", position: { lat: -23.550520, lng: -46.634308 } },
    { id: "102", endereco: "Avenida Central", numero: "456", referencia: "Em frente ao banco", position: { lat: -23.551520, lng: -46.632308 } },
    { id: "103", endereco: "Rua das Flores", numero: "789", position: { lat: -23.549520, lng: -46.631308 } },
  ],
  "2": [
    { id: "201", endereco: "Rua São José", numero: "234", referencia: "Casa amarela", position: { lat: -23.554520, lng: -46.644308 } },
    { id: "202", endereco: "Avenida Santa Maria", numero: "567", position: { lat: -23.556520, lng: -46.642308 } },
    { id: "203", endereco: "Rua do Comércio", numero: "890", referencia: "Próximo ao mercado", position: { lat: -23.557520, lng: -46.641308 } },
  ],
  "3": [
    { id: "301", endereco: "Avenida Paulista", numero: "345", position: { lat: -23.539520, lng: -46.622308 } },
    { id: "302", endereco: "Rua dos Ipês", numero: "678", referencia: "Casa com portão verde", position: { lat: -23.541520, lng: -46.624308 } },
    { id: "303", endereco: "Rua das Acácias", numero: "901", position: { lat: -23.542520, lng: -46.625308 } },
  ],
  "4": [
    { id: "401", endereco: "Rua Nova", numero: "111", referencia: "Esquina com farmácia", position: { lat: -23.559520, lng: -46.614308 } },
    { id: "402", endereco: "Avenida Principal", numero: "222", position: { lat: -23.561520, lng: -46.612308 } },
    { id: "403", endereco: "Rua das Palmeiras", numero: "333", referencia: "Casa com muro azul", position: { lat: -23.562520, lng: -46.611308 } },
  ],
  "5": [
    { id: "501", endereco: "Rua Santo Antônio", numero: "444", position: { lat: -23.546520, lng: -46.654308 } },
    { id: "502", endereco: "Avenida da Igreja", numero: "555", referencia: "Próximo à escola", position: { lat: -23.544520, lng: -46.652308 } },
    { id: "503", endereco: "Rua das Mangueiras", numero: "666", position: { lat: -23.543520, lng: -46.651308 } },
  ],
};
