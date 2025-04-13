import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Temporizador } from "./Temporizador";
import { useToast } from "@/hooks/use-toast";
import { Camera, X, FileVideo, Upload, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const visitaFormSchema = z.object({
  tipo_imovel: z.enum(["R", "C", "P", "T", "O"]),
  situacao_imovel: z.enum(["F", "R", "N", "P", "T"]),
  depositos_A1: z.number().min(0).default(0),
  depositos_A2: z.number().min(0).default(0),
  depositos_B: z.number().min(0).default(0),
  depositos_C: z.number().min(0).default(0),
  depositos_D1: z.number().min(0).default(0),
  depositos_D2: z.number().min(0).default(0),
  depositos_E: z.number().min(0).default(0),
  pendencia: z.string().optional(),
  larvicida_utilizado: z.enum(["Sim", "Não"]),
  adulticida_utilizado: z.enum(["Sim", "Não"]),
  quantidade_larvicida: z.number().min(0).default(0),
  depositos_tratados: z.number().min(0).default(0),
  coleta_amostras: z.enum(["Sim", "Não"]),
  amostras_enviadas: z.number().min(0).default(0),
  nome_agente: z.string().min(1, { message: "Nome do agente é obrigatório" }),
  supervisor: z.string().min(1, { message: "Nome do supervisor é obrigatório" }),
  observacoes_gerais: z.string().optional(),
});

type VisitaFormValues = z.infer<typeof visitaFormSchema>;

interface FormularioVisitaProps {
  casaId: string;
  endereco: string;
  onSalvar: (dados: VisitaFormValues & { 
    tempoVisita: number, 
    dataVisita: Date, 
    casaId: string,
    arquivos?: { url: string, tipo: 'foto' | 'video' }[] 
  }) => void;
  onCancelar: () => void;
  isMobile?: boolean;
}

const FormularioVisita = ({ casaId, endereco, onSalvar, onCancelar, isMobile = false }: FormularioVisitaProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [arquivos, setArquivos] = useState<Array<{ 
    arquivo: File, 
    previewUrl: string, 
    tipo: 'foto' | 'video',
    uploading: boolean 
  }>>([]);
  const [uploadingArquivos, setUploadingArquivos] = useState(false);
  
  const form = useForm<VisitaFormValues>({
    resolver: zodResolver(visitaFormSchema),
    defaultValues: {
      tipo_imovel: "R",
      situacao_imovel: "N",
      depositos_A1: 0,
      depositos_A2: 0,
      depositos_B: 0,
      depositos_C: 0,
      depositos_D1: 0,
      depositos_D2: 0,
      depositos_E: 0,
      pendencia: "",
      larvicida_utilizado: "Não",
      adulticida_utilizado: "Não",
      quantidade_larvicida: 0,
      depositos_tratados: 0,
      coleta_amostras: "Não",
      amostras_enviadas: 0,
      nome_agente: "",
      supervisor: "",
      observacoes_gerais: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileType = file.type.startsWith('image/') ? 'foto' : 'video';
    
    const previewUrl = URL.createObjectURL(file);
    
    setArquivos([...arquivos, {
      arquivo: file,
      previewUrl,
      tipo: fileType,
      uploading: false
    }]);

    e.target.value = '';
  };

  const removerArquivo = (index: number) => {
    const novaListaArquivos = [...arquivos];
    URL.revokeObjectURL(novaListaArquivos[index].previewUrl);
    novaListaArquivos.splice(index, 1);
    setArquivos(novaListaArquivos);
  };

  const uploadArquivos = async () => {
    if (arquivos.length === 0) return [];
    
    setUploadingArquivos(true);
    const arquivosUpload = [...arquivos];
    const arquivosUrls: Array<{ url: string, tipo: 'foto' | 'video' }> = [];
    
    try {
      for (let i = 0; i < arquivosUpload.length; i++) {
        const arquivo = arquivosUpload[i];
        
        arquivosUpload[i] = { ...arquivo, uploading: true };
        setArquivos([...arquivosUpload]);
        
        const timestamp = new Date().getTime();
        const fileName = `visita_${casaId}_${timestamp}_${i}${arquivo.tipo === 'foto' ? '.jpg' : '.mp4'}`;
        
        const { data, error } = await supabase.storage
          .from('visitas')
          .upload(`visitas/${casaId}/${fileName}`, arquivo.arquivo);
          
        if (error) {
          throw new Error(`Erro ao fazer upload do arquivo ${i+1}: ${error.message}`);
        }
        
        const { data: urlData } = supabase.storage
          .from('visitas')
          .getPublicUrl(`visitas/${casaId}/${fileName}`);
          
        arquivosUrls.push({
          url: urlData.publicUrl,
          tipo: arquivo.tipo
        });
        
        arquivosUpload[i] = { ...arquivo, uploading: false };
        setArquivos([...arquivosUpload]);
      }
      
      return arquivosUrls;
    } catch (error) {
      console.error('Erro ao fazer upload dos arquivos:', error);
      toast({
        title: "Erro ao fazer upload",
        description: error instanceof Error ? error.message : "Erro ao fazer upload dos arquivos",
        variant: "destructive"
      });
      return [];
    } finally {
      setUploadingArquivos(false);
    }
  };

  const handleSubmit = async (values: VisitaFormValues) => {
    try {
      const arquivosUrls = await uploadArquivos();
      
      const dadosVisita = {
        ...values,
        tempoVisita: tempoDecorrido,
        dataVisita: new Date(),
        casaId,
        arquivos: arquivosUrls.length > 0 ? arquivosUrls : undefined
      };

      onSalvar(dadosVisita);
      
      toast({
        title: "Visita registrada com sucesso!",
        description: `Visita à ${endereco} registrada em ${Math.floor(tempoDecorrido / 60)} minutos e ${tempoDecorrido % 60} segundos.`
      });
      
      if (isMobile) {
        navigate("/app-ace/visitas");
      } else {
        navigate("/localizacao");
      }
    } catch (error) {
      console.error('Erro ao salvar visita:', error);
      toast({
        title: "Erro ao salvar visita",
        description: "Ocorreu um erro ao registrar a visita",
        variant: "destructive"
      });
    }
  };

  const containerClassNames = isMobile 
    ? "container mx-auto max-w-[375px] p-0 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen"
    : "container mx-auto max-w-3xl p-4 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen";

  const cardClassNames = isMobile
    ? "shadow-md rounded-lg overflow-hidden"
    : "shadow-lg";

  const gridColumnClasses = isMobile
    ? "grid grid-cols-1 gap-4"
    : "grid grid-cols-1 md:grid-cols-2 gap-4";

  const gridColumnClasses3 = isMobile 
    ? "grid grid-cols-2 gap-4"
    : "grid grid-cols-2 md:grid-cols-3 gap-4";

  return (
    <div className={containerClassNames}>
      <Card className={cardClassNames}>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-xl text-center text-blue-900">Registro de Visita</CardTitle>
          <p className="text-sm text-center text-gray-600 break-words">{endereco}</p>
          <Temporizador onTempoAtualizado={setTempoDecorrido} />
        </CardHeader>
        
        <CardContent className="p-4 md:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className={gridColumnClasses}>
                <FormField
                  control={form.control}
                  name="tipo_imovel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Imóvel</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="R">Residencial (R)</SelectItem>
                          <SelectItem value="C">Comercial (C)</SelectItem>
                          <SelectItem value="P">Ponto Estratégico (P)</SelectItem>
                          <SelectItem value="T">Terreno Baldio (T)</SelectItem>
                          <SelectItem value="O">Outros (O)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="situacao_imovel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Situação do Imóvel</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="F">Fechado (F)</SelectItem>
                          <SelectItem value="R">Recusado (R)</SelectItem>
                          <SelectItem value="N">Normal (N)</SelectItem>
                          <SelectItem value="P">Ponto Estratégico (P)</SelectItem>
                          <SelectItem value="T">Terreno Baldio (T)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator className="my-4" />
              <h3 className="text-md font-medium mb-2">Depósitos Encontrados</h3>
              
              <div className={gridColumnClasses3}>
                <FormField
                  control={form.control}
                  name="depositos_A1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>A1</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="depositos_A2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>A2</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="depositos_B"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>B</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="depositos_C"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>C</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="depositos_D1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>D1</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="depositos_D2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>D2</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="depositos_E"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-4" />
              <h3 className="text-md font-medium mb-2">Tratamento</h3>

              <div className={gridColumnClasses}>
                <FormField
                  control={form.control}
                  name="larvicida_utilizado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Larvicida Utilizado</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sim">Sim</SelectItem>
                          <SelectItem value="Não">Não</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adulticida_utilizado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adulticida Utilizado</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sim">Sim</SelectItem>
                          <SelectItem value="Não">Não</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantidade_larvicida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade de Larvicida (g)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="depositos_tratados"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Depósitos Tratados</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-4" />
              <h3 className="text-md font-medium mb-2">Amostras e Coleta</h3>

              <div className={gridColumnClasses}>
                <FormField
                  control={form.control}
                  name="coleta_amostras"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coleta de Amostras</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sim">Sim</SelectItem>
                          <SelectItem value="Não">Não</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amostras_enviadas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amostras Enviadas</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-4" />
              <h3 className="text-md font-medium mb-2">Responsáveis e Observações</h3>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="pendencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pendência</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Registre pendências encontradas..."
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className={gridColumnClasses}>
                  <FormField
                    control={form.control}
                    name="nome_agente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Agente</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supervisor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supervisor</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="observacoes_gerais"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações Gerais</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Observações complementares..."
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-4" />
              <h3 className="text-md font-medium mb-2">Fotos e Vídeos</h3>

              <div className="space-y-4">
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-md p-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <div className="relative">
                        <Input
                          type="file"
                          id="foto-upload"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                          aria-label="Adicionar foto"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex items-center gap-1.5"
                        >
                          <Camera size={16} />
                          <span>Foto</span>
                        </Button>
                      </div>
                      
                      <div className="relative">
                        <Input
                          type="file"
                          id="video-upload"
                          accept="video/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                          aria-label="Adicionar vídeo"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex items-center gap-1.5"
                        >
                          <FileVideo size={16} />
                          <span>Vídeo</span>
                        </Button>
                      </div>
                    </div>
                    
                    {arquivos.length === 0 && (
                      <p className="text-sm text-gray-500 text-center mt-3">
                        Adicione fotos ou vídeos relacionados à visita
                      </p>
                    )}
                    
                    {arquivos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                        {arquivos.map((arquivo, index) => (
                          <div 
                            key={index} 
                            className="relative group border border-gray-200 rounded-md overflow-hidden bg-white"
                          >
                            {arquivo.tipo === 'foto' ? (
                              <img 
                                src={arquivo.previewUrl} 
                                alt={`Foto ${index + 1}`} 
                                className="w-full h-24 object-cover"
                              />
                            ) : (
                              <div className="w-full h-24 bg-gray-900 flex items-center justify-center">
                                <video 
                                  src={arquivo.previewUrl} 
                                  className="max-h-full max-w-full" 
                                  controls
                                />
                              </div>
                            )}
                            
                            <button
                              type="button"
                              onClick={() => removerArquivo(index)}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition-opacity"
                              aria-label="Remover arquivo"
                            >
                              <Trash2 size={14} />
                            </button>
                            
                            {arquivo.uploading && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                              </div>
                            )}
                            
                            <span className="text-xs bg-gray-100 absolute bottom-0 left-0 right-0 py-0.5 px-2 truncate">
                              {arquivo.tipo === 'foto' ? 'Foto' : 'Vídeo'} {index + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onCancelar}
                  disabled={uploadingArquivos}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={uploadingArquivos}
                  className="relative"
                >
                  {uploadingArquivos ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></span>
                      Enviando...
                    </>
                  ) : 'Salvar Visita'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormularioVisita;
