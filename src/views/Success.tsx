import React from 'react'
import { CheckCircle } from 'lucide-react'
import Button from '../components/Button'
import { OrderSummary } from '../types'
import { useNavigate } from 'react-router-dom'
import { SEO } from '../components/SEO'

type Props = {
  orderSummary: OrderSummary;
}

export const Success = ({ orderSummary }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
      <SEO
        title="Pasta Prè-gō | Pedido Exitoso"
        description="Tu pedido ha sido recibido."
        noIndex={true}
      />
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100 relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-orange/10 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-orange/10 rounded-full"></div>

        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-500" size={40} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-brand-dark mb-2">¡Grazie Mille!</h2>
        <p className="text-gray-500 mb-6">Tu pedido ha sido recibido y la cocina ya está trabajando en ello.</p>

        <div className="bg-gray-50 rounded-xl p-4 mb-8">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Número de Orden</p>
          <p className="text-2xl font-mono font-bold text-brand-orange">{orderSummary?.orderNumber}</p>
        </div>

        <div className="space-y-2 text-left text-sm text-gray-600 mb-8 border-t border-b border-gray-100 py-4">
          <div className="flex justify-between">
            <span>Cliente:</span>
            <span className="font-medium">{orderSummary?.customer.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Dirección:</span>
            <span className="font-medium">{orderSummary?.customer.address}</span>
          </div>
          <div className="flex justify-between">
            <span>Total:</span>
            <span className="font-medium">${((orderSummary?.total || 0) + 2.50).toFixed(2)}</span>
          </div>
        </div>

        <Button fullWidth variant="secondary" onClick={() => navigate('/')}>
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
};