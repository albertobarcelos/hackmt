
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import MobileNavbar from "@/components/mobile/MobileNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, MapPin, Save } from "lucide-react";

const AcePerfilPage: React.FC = () => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  
  // Dados fictícios do agente
  const [perfilData, setPerfilData] = useState({
    nome: "João da Silva",
    email: "joao.silva@saude.gov.br",
    telefone: "(11) 98765-4321",
    setor: "Zona Leste",
    matricula: "ACE-2023-0042",
    dataInicio: "15/03/2022"
  });
  
  const [formData, setFormData] = useState({...perfilData});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSave = () => {
    setPerfilData({...formData});
    setEditMode(false);
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
  };
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen pb-16">
      <div className="max-w-md mx-auto p-4">
        <div className="py-4">
          <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">Perfil do Agente</h1>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Cabeçalho do perfil */}
            <div className="bg-blue-600 p-6 text-white">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-white text-blue-600 flex items-center justify-center text-4xl font-bold">
                  {perfilData.nome.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <h2 className="text-xl font-semibold text-center">{perfilData.nome}</h2>
              <p className="text-center text-blue-100">{perfilData.matricula}</p>
            </div>
            
            {/* Informações do perfil */}
            <div className="p-6">
              {!editMode ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail size={18} className="text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">E-mail</p>
                      <p className="font-medium">{perfilData.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone size={18} className="text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="font-medium">{perfilData.telefone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin size={18} className="text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Setor</p>
                      <p className="font-medium">{perfilData.setor}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <User size={18} className="text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Data de início</p>
                      <p className="font-medium">{perfilData.dataInicio}</p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => setEditMode(true)}
                  >
                    Editar Perfil
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Nome</label>
                    <Input 
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">E-mail</label>
                    <Input 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Telefone</label>
                    <Input 
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Setor</label>
                    <Input 
                      name="setor"
                      value={formData.setor}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <Button 
                    className="w-full mt-4 bg-green-600 hover:bg-green-700"
                    onClick={handleSave}
                  >
                    <Save size={16} className="mr-2" />
                    Salvar Alterações
                  </Button>
                  
                  <Button 
                    className="w-full mt-2" 
                    variant="outline"
                    onClick={() => {
                      setFormData({...perfilData});
                      setEditMode(false);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Menu de navegação inferior fixo */}
      <MobileNavbar currentPath="perfil" />
    </div>
  );
};

export default AcePerfilPage;
