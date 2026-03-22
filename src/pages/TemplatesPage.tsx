import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Plus, Trash2, ShoppingCart, X, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import PageHeader from '../components/common/PageHeader';
import { getTemplates, createTemplate, deleteTemplate } from '../api/templates.api';

interface TemplateItem {
  productName: string;
  quantity: number;
  unit: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  items: TemplateItem[];
  createdAt: string;
}

export default function TemplatesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formItems, setFormItems] = useState<TemplateItem[]>([
    { productName: '', quantity: 1, unit: 'unidad' },
  ]);

  const { data, isLoading } = useQuery<Template[]>({
    queryKey: ['templates'],
    queryFn: getTemplates,
  });

  const createMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Plantilla creada');
      resetForm();
    },
    onError: () => {
      toast.error('Error al crear la plantilla');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Plantilla eliminada');
    },
    onError: () => {
      toast.error('Error al eliminar la plantilla');
    },
  });

  const templates = data ?? [];

  const resetForm = () => {
    setShowForm(false);
    setFormName('');
    setFormDescription('');
    setFormItems([{ productName: '', quantity: 1, unit: 'unidad' }]);
  };

  const addItem = () => {
    setFormItems([...formItems, { productName: '', quantity: 1, unit: 'unidad' }]);
  };

  const removeItem = (index: number) => {
    setFormItems(formItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof TemplateItem, value: string | number) => {
    const updated = [...formItems];
    updated[index] = { ...updated[index], [field]: value };
    setFormItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = formItems.filter((i) => i.productName.trim());
    if (!formName.trim() || validItems.length === 0) {
      toast.warn('Agrega un nombre y al menos un producto');
      return;
    }
    createMutation.mutate({
      name: formName.trim(),
      description: formDescription.trim(),
      items: validItems,
    });
  };

  const handleUseTemplate = (template: Template) => {
    // Copy items to clipboard or navigate to shopping list
    const text = template.items.map((i) => `${i.quantity} ${i.unit} - ${i.productName}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Items copiados al portapapeles. Pegalos en tu lista de compras.');
    }).catch(() => {
      toast.info('Plantilla seleccionada: ' + template.name);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
      <PageHeader
        title="Plantillas de compra"
        helpKey="templates"
        subtitle="Crea y reutiliza listas de compras frecuentes"
        actionLabel="Crear plantilla"
        actionIcon={<Plus className="w-4 h-4" />}
        onAction={() => setShowForm(true)}
      />

      {/* Create template modal/form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 pb-0">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                Nueva plantilla
              </h2>
              <button
                onClick={resetForm}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: Compra semanal"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripcion (opcional)
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ej: Lo basico de cada semana"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Productos
                  </label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                  >
                    + Agregar
                  </button>
                </div>
                <div className="space-y-2">
                  {formItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={item.productName}
                        onChange={(e) => updateItem(idx, 'productName', e.target.value)}
                        placeholder="Producto"
                        className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                        min={1}
                        className="w-20 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => updateItem(idx, 'unit', e.target.value)}
                        placeholder="unidad"
                        className="w-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors px-4 py-2.5 font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Crear'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Templates List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-6 w-2/3 rounded mb-3" />
              <div className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded mb-4" />
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="bg-gray-200 dark:bg-gray-700 h-4 w-3/4 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center animate-fade-in">
          <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No tienes plantillas aun
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Crea una plantilla para reutilizar tus listas de compras
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {template.name}
                </h3>
                <button
                  onClick={() => deleteMutation.mutate(template.id)}
                  disabled={deleteMutation.isPending}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {template.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {template.description}
                </p>
              )}
              <div className="space-y-1 mb-4">
                {template.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span>{item.quantity} {item.unit} - {item.productName}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleUseTemplate(template)}
                className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors px-4 py-2 text-sm font-medium flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Usar plantilla
              </button>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
