import React, { useState, useMemo } from 'react';
import { OrderForm } from '../types';
import { AlertCircle, ArrowLeft, FileText, MapPin, Phone, User } from 'lucide-react';
import Button from '../components/Button';
import { useCartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

type Props = {
    onPlaceOrder: (form: OrderForm) => void;
}

export const Checkout = ({ onPlaceOrder }: Props) => {
    const { cartTotal } = useCartContext();
    const navigate = useNavigate();
    const [form, setForm] = useState<OrderForm>({ name: '', phone: '', address: '', notes: '' });
    const [touched, setTouched] = useState<Record<keyof OrderForm, boolean>>({
        name: false,
        phone: false,
        address: false,
        notes: false
    });

    const errors = useMemo(() => {
        const newErrors: Partial<Record<keyof OrderForm, string>> = {};

        if (!form.name.trim()) {
            newErrors.name = 'El nombre es obligatorio.';
        } else if (form.name.trim().length < 3) {
            newErrors.name = 'El nombre debe tener al menos 3 caracteres.';
        }

        const phoneRegex = /^[\d\s\-+()]{7,}$/;
        if (!form.phone.trim()) {
            newErrors.phone = 'El teléfono es obligatorio.';
        } else if (!phoneRegex.test(form.phone.trim())) {
            newErrors.phone = 'Ingresa un teléfono válido (mín. 7 dígitos).';
        }

        if (!form.address.trim()) {
            newErrors.address = 'La dirección es obligatoria.';
        } else if (form.address.trim().length < 5) {
            newErrors.address = 'La dirección es demasiado corta.';
        }

        return newErrors;
    }, [form]);

    const isFormValid = Object.keys(errors).length === 0;

    const handleBlur = (field: keyof OrderForm) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleChange = (field: keyof OrderForm, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            onPlaceOrder(form);
            navigate('/success');
        } else {
            setTouched({
                name: true,
                phone: true,
                address: true,
                notes: true
            });
        }
    };

    const getInputClass = (field: keyof OrderForm) => {
        const base = "w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 outline-none transition-colors";
        if (touched[field] && errors[field]) {
            return `${base} border-red-300 text-red-900 placeholder-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50`;
        }
        return `${base} border-gray-200 focus:ring-brand-orange focus:border-transparent`;
    };

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-8">
            <Link to="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-orange mb-6 transition-colors">
                <ArrowLeft size={20} /> Volver al carrito
            </Link>

            <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-brand-orange">
                <h2 className="text-2xl font-serif font-bold mb-6">Detalles de Entrega</h2>
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                        <div className="relative">
                            <User className={`absolute left-3 top-3 ${touched.name && errors.name ? 'text-red-400' : 'text-gray-400'}`} size={20} />
                            <input
                                type="text"
                                className={getInputClass('name')}
                                placeholder="Juan Pérez"
                                value={form.name}
                                onChange={e => handleChange('name', e.target.value)}
                                onBlur={() => handleBlur('name')}
                            />
                        </div>
                        {touched.name && errors.name && (
                            <div className="flex items-center gap-1 mt-1 text-red-500 text-xs animate-fade-in-up">
                                <AlertCircle size={12} />
                                <span>{errors.name}</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <div className="relative">
                                <Phone className={`absolute left-3 top-3 ${touched.phone && errors.phone ? 'text-red-400' : 'text-gray-400'}`} size={20} />
                                <input
                                    type="tel"
                                    className={getInputClass('phone')}
                                    placeholder="555-0000"
                                    value={form.phone}
                                    onChange={e => handleChange('phone', e.target.value)}
                                    onBlur={() => handleBlur('phone')}
                                />
                            </div>
                            {touched.phone && errors.phone && (
                                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs animate-fade-in-up">
                                    <AlertCircle size={12} />
                                    <span>{errors.phone}</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                            <div className="relative">
                                <MapPin className={`absolute left-3 top-3 ${touched.address && errors.address ? 'text-red-400' : 'text-gray-400'}`} size={20} />
                                <input
                                    type="text"
                                    className={getInputClass('address')}
                                    placeholder="Calle Principal 123"
                                    value={form.address}
                                    onChange={e => handleChange('address', e.target.value)}
                                    onBlur={() => handleBlur('address')}
                                />
                            </div>
                            {touched.address && errors.address && (
                                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs animate-fade-in-up">
                                    <AlertCircle size={12} />
                                    <span>{errors.address}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notas Especiales (Opcional)</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                            <textarea
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none resize-none"
                                rows={3}
                                placeholder="Sin cebolla, código de puerta..."
                                value={form.notes}
                                onChange={e => handleChange('notes', e.target.value)}
                                onBlur={() => handleBlur('notes')}
                            />
                        </div>
                    </div>

                    <Button type="submit" fullWidth className="mt-4 text-lg" disabled={!isFormValid}>
                        {isFormValid ? `Confirmar Pedido - $${(cartTotal + 2.50).toFixed(2)}` : 'Completa el formulario'}
                    </Button>
                </form>
            </div>
        </div>
    );
};