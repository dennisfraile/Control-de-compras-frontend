import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Camera, Upload, Loader2, Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import PageHeader from '../components/common/PageHeader';
import { scanReceipt } from '../api/purchases.api';
import { purchasesApi } from '../api/purchases.api';
import { formatCurrency } from '../utils/format';

interface ScannedItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ScanResult {
  storeName: string;
  date: string;
  items: ScannedItem[];
  total: number;
}

export default function ScanReceiptPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scanMutation = useMutation({
    mutationFn: scanReceipt,
    onSuccess: (data: ScanResult) => {
      setScanResult(data);
      toast.success('Ticket escaneado correctamente');
    },
    onError: () => {
      toast.error('Error al escanear el ticket');
    },
  });

  const createPurchaseMutation = useMutation({
    mutationFn: (data: any) => purchasesApi.create(data),
    onSuccess: () => {
      toast.success('Compra creada exitosamente');
      setScanResult(null);
      setSelectedFile(null);
      setPreview(null);
    },
    onError: () => {
      toast.error('Error al crear la compra');
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setScanResult(null);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleScan = () => {
    if (selectedFile) {
      scanMutation.mutate(selectedFile);
    }
  };

  const handleCreatePurchase = () => {
    if (!scanResult) return;
    createPurchaseMutation.mutate({
      storeName: scanResult.storeName,
      date: scanResult.date,
      items: scanResult.items.map((item) => ({
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setScanResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
      <PageHeader
        title="Escanear ticket"
        helpKey="scanReceipt"
        subtitle="Sube una foto de tu ticket de compra para registrarla automaticamente"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Subir imagen
          </h2>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!preview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            >
              <Camera className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Toca para tomar foto o seleccionar imagen
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                JPG, PNG o WEBP
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={preview}
                  alt="Vista previa del ticket"
                  className="w-full max-h-64 sm:max-h-96 object-contain"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleScan}
                  disabled={scanMutation.isPending}
                  className="flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors px-4 py-2.5 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {scanMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Escaneando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Escanear
                    </>
                  )}
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Resultado del escaneo
          </h2>

          {!scanResult && !scanMutation.isPending ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                Los resultados apareceran aqui despues de escanear
              </p>
            </div>
          ) : scanMutation.isPending ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 rounded" />
              ))}
            </div>
          ) : scanResult ? (
            <div>
              {/* Store info */}
              <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tienda: <span className="font-medium text-gray-800 dark:text-white">{scanResult.storeName}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Fecha: <span className="font-medium text-gray-800 dark:text-white">{scanResult.date}</span>
                </p>
              </div>

              {/* Items table */}
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 px-1 text-gray-500 dark:text-gray-400 font-medium">Producto</th>
                      <th className="text-right py-2 px-1 text-gray-500 dark:text-gray-400 font-medium">Cant.</th>
                      {!isMobile && <th className="text-right py-2 px-1 text-gray-500 dark:text-gray-400 font-medium">P. Unit.</th>}
                      <th className="text-right py-2 px-1 text-gray-500 dark:text-gray-400 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scanResult.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="py-2 px-1 text-gray-800 dark:text-white">{item.name}</td>
                        <td className="py-2 px-1 text-right text-gray-600 dark:text-gray-300">{item.quantity}</td>
                        {!isMobile && <td className="py-2 px-1 text-right text-gray-600 dark:text-gray-300">{formatCurrency(item.unitPrice)}</td>}
                        <td className="py-2 px-1 text-right font-medium text-gray-800 dark:text-white">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300 dark:border-gray-600">
                      <td colSpan={isMobile ? 2 : 3} className="py-2 px-1 font-bold text-gray-800 dark:text-white">Total</td>
                      <td className="py-2 px-1 text-right font-bold text-gray-800 dark:text-white">{formatCurrency(scanResult.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <button
                onClick={handleCreatePurchase}
                disabled={createPurchaseMutation.isPending}
                className="w-full bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors px-4 py-2.5 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {createPurchaseMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creando compra...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Crear compra
                  </>
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>
      </div>
    </div>
  );
}
