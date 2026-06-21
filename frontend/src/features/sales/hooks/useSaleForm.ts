import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { saleSchema, SaleFormData } from '../schemas/saleSchema';
import { createSale } from '../api/createSale';
import { getFormReferenceData } from '../api/getFormReferenceData';

export const useSaleForm = () => {
  const router = useRouter();

  // --- Reference data (dropdowns) ---
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [isLoadingRef, setIsLoadingRef] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getFormReferenceData();
        setCustomers(data.customers);
        setProducts(data.products);
        setDepots(data.depots);
      } catch (err) {
        console.error('Erreur lors du chargement des données de référence:', err);
      } finally {
        setIsLoadingRef(false);
      }
    };
    load();
  }, []);

  // --- React Hook Form + Zod ---
  const form = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      customerId: '',
      depotId: '',
      amountPaid: 0,
      lines: [{ productId: '', quantity: 1, unitPrice: 0 }],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lines',
  });

  // --- Computed total ---
  const watchedLines = form.watch('lines');
  const totalAmount = watchedLines.reduce(
    (acc, line) => acc + (line.quantity || 0) * (line.unitPrice || 0),
    0
  );

  // --- Auto-fill unit price when product changes ---
  const handleProductChange = (index: number, productId: string) => {
    form.setValue(`lines.${index}.productId`, productId, { shouldValidate: true });
    const product = products.find((p: any) => p.id === productId);
    if (product) {
      form.setValue(`lines.${index}.unitPrice`, product.defaultPrice || 0);
    }
  };

  // --- Add / remove lines ---
  const addLine = () => {
    append({ productId: '', quantity: 1, unitPrice: 0 });
  };

  const removeLine = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // --- Submission ---
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setSubmitError(null);
      await createSale(data);
      router.push('/dashboard/sales');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Erreur lors de la création de la facture. Vérifiez le stock disponible.';
      setSubmitError(message);
    }
  });

  return {
    // Form
    form,
    fields,
    onSubmit,
    // Reference data
    customers,
    products,
    depots,
    isLoadingRef,
    // Actions
    addLine,
    removeLine,
    handleProductChange,
    // Computed
    totalAmount,
    // Errors
    submitError,
  };
};
