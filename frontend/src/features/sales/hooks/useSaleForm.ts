import { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { saleSchema, SaleFormData } from '../schemas/saleSchema';
import { createSale } from '../api/createSale';
import { getFormReferenceData } from '../api/getFormReferenceData';

export const useSaleForm = () => {
  const router = useRouter();

  // --- Reference data ---
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingRef, setIsLoadingRef] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getFormReferenceData();
        setCustomers(data.customers);
        setProducts(data.products);
        setDepots(data.depots);
        setCategories(data.categories);
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
      lines: [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'lines',
  });

  // --- Computed total ---
  const watchedLines = form.watch('lines');
  const totalAmount = watchedLines.reduce(
    (acc, line) => acc + (line.quantity || 0) * (line.unitPrice || 0),
    0
  );

  // --- Add product from search results (or increment if already exists) ---
  const addProductToInvoice = useCallback((productId: string) => {
    const existingIndex = watchedLines.findIndex(l => l.productId === productId);
    if (existingIndex >= 0) {
      // Product already in invoice → increment quantity
      const currentQty = watchedLines[existingIndex].quantity || 1;
      form.setValue(`lines.${existingIndex}.quantity`, currentQty + 1, { shouldValidate: true });
    } else {
      // New product → add line
      const product = products.find((p: any) => p.id === productId);
      if (product) {
        append({
          productId: product.id,
          quantity: 1,
          unitPrice: product.defaultPrice || 0,
        });
      }
    }
  }, [watchedLines, products, append, form]);

  // --- Increment quantity ---
  const incrementLine = useCallback((index: number) => {
    const currentQty = watchedLines[index]?.quantity || 1;
    form.setValue(`lines.${index}.quantity`, currentQty + 1, { shouldValidate: true });
  }, [watchedLines, form]);

  // --- Decrement quantity ---
  const decrementLine = useCallback((index: number) => {
    const currentQty = watchedLines[index]?.quantity || 1;
    if (currentQty > 1) {
      form.setValue(`lines.${index}.quantity`, currentQty - 1, { shouldValidate: true });
    }
  }, [watchedLines, form]);

  // --- Set quantity directly ---
  const setLineQuantity = useCallback((index: number, quantity: number) => {
    const safeQty = Math.max(1, Math.round(quantity));
    form.setValue(`lines.${index}.quantity`, safeQty, { shouldValidate: true });
  }, [form]);

  // --- Remove line ---
  const removeLine = useCallback((index: number) => {
    remove(index);
  }, [remove]);

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
    categories,
    isLoadingRef,
    // Actions
    addProductToInvoice,
    incrementLine,
    decrementLine,
    setLineQuantity,
    removeLine,
    // Computed
    totalAmount,
    // Errors
    submitError,
  };
};
