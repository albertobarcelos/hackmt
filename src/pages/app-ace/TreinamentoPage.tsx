
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileVideo, FileText, ExternalLink, Play, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dados de exemplo para materiais de treinamento
const videos = [
  {
    id: "v1",
    titulo: "Introdução ao Sistema ACE",
    duracao: "15:30",
    thumbnail: "https://picsum.photos/seed/video1/300/200",
    url: "#"
  },
  {
    id: "v2",
    titulo: "Como registrar visitas corretamente",
    duracao: "12:45",
    thumbnail: "https://picsum.photos/seed/video2/300/200",
    url: "#"
  },
  {
    id: "v3",
    titulo: "Identificação de focos do Aedes aegypti",
    duracao: "20:18",
    thumbnail: "https://picsum.photos/seed/video3/300/200",
    url: "#"
  }
];

const documentos = [
  {
    id: "d1",
    titulo: "Manual do Agente Comunitário",
    tipo: "PDF",
    tamanho: "2.5MB",
    url: "#"
  },
  {
    id: "d2",
    titulo: "Protocolo de visitação",
    tipo: "PDF",
    tamanho: "1.8MB",
    url: "#"
  },
  {
    id: "d3",
    titulo: "Guia de prevenção da dengue",
    tipo: "PDF",
    tamanho: "3.2MB",
    url: "#"
  },
  {
    id: "d4",
    titulo: "Principais criadouros do mosquito",
    tipo: "PDF",
    tamanho: "1.5MB",
    url: "#"
  }
];

const TreinamentoPage = () => {
  const [videoSelecionado, setVideoSelecionado] = useState<string | null>(null);

  const abrirVideo = (videoId: string) => {
    setVideoSelecionado(videoId);
    // Em uma implementação real, aqui abriria o player de vídeo ou redirecionaria
    // para a URL do vídeo
  };

  const abrirDocumento = (url: string) => {
    // Em uma implementação real, aqui abriria o documento em uma nova aba
    // ou faria o download
    window.open(url, "_blank");
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-blue-800">Treinamentos</h2>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="videos" className="flex-1 flex items-center justify-center">
            <FileVideo className="mr-2 h-4 w-4" />
            Vídeos
          </TabsTrigger>
          <TabsTrigger value="documentos" className="flex-1 flex items-center justify-center">
            <FileText className="mr-2 h-4 w-4" />
            Documentos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="videos" className="space-y-4">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div className="relative h-40 bg-gray-100">
                <img 
                  src={video.thumbnail} 
                  alt={`Thumbnail do vídeo ${video.titulo}`}
                  className="object-cover w-full h-full"
                />
                <Button 
                  variant="secondary" 
                  size="icon"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary/80 hover:bg-primary text-white rounded-full w-12 h-12"
                  onClick={() => abrirVideo(video.id)}
                >
                  <Play size={24} />
                </Button>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-medium text-base">{video.titulo}</h3>
                <p className="text-sm text-muted-foreground flex items-center mt-1">
                  <Clock size={14} className="mr-1" />
                  {video.duracao}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="documentos" className="space-y-2">
          {documentos.map((doc) => (
            <Card key={doc.id} className="overflow-hidden">
              <div className="flex items-center p-4">
                <div className="bg-blue-50 p-3 rounded-lg mr-4">
                  <FileText className="text-blue-600 h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-base">{doc.titulo}</h3>
                  <p className="text-sm text-muted-foreground">
                    {doc.tipo} • {doc.tamanho}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => abrirDocumento(doc.url)}
                  className="text-blue-600"
                >
                  <ExternalLink size={18} />
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Seção de Material Recente */}
      <div className="mt-8">
        <h3 className="text-base font-medium mb-3 flex items-center">
          <BookOpen className="mr-2 h-4 w-4 text-blue-600" />
          Material Recente
        </h3>
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium">Atualização do Protocolo</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Novo guia de procedimentos para áreas com alta incidência de casos.
          </p>
          <Button 
            variant="link" 
            className="text-blue-600 p-0 h-auto mt-2"
            onClick={() => abrirDocumento("#")}
          >
            Ler documento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TreinamentoPage;
