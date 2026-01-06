
import React, { createContext, useContext } from "react";
import { useCart } from "../hooks/useCart";

// 1. Definimos el "contrato" o Tipo de nuestro Contexto.
// Esto le dice a TypeScript qué funciones y datos estarán disponibles globalmente.
// Usamos ReturnType<typeof useCart> para no tener que reescribir la interfaz manualmente.
// ¡Es un truco muy útil!
type CartContextType = ReturnType<typeof useCart>;

// 2. Creamos el Contexto en sí.
// Inicialmente es undefined porque el Provider aún no se ha montado.
const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. Creamos el Componente "Provider".
// Este componente envolverá a nuestra App (o partes de ella) y les "proveerá" la información.
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Aquí es donde ocurre la magia: Usamos nuestro hook existente.
    // El Provider se encarga de llamar al hook y guardar el resultado.
    const cartLogic = useCart();

    return (
        // Pasamos todo lo que devuelve useCart (cartLogic) a la propiedad 'value'.
        // Así, cualquier componente hijo podrá acceder a estas funciones.
        <CartContext.Provider value={cartLogic}>
            {children}
        </CartContext.Provider>
    );
};

// 4. Creamos un Hook personalizado para consumir el contexto fácilmente.
// Esto nos protege de usar el contexto fuera del Provider y limpia el código en los componentes.
export const useCartContext = () => {
    const context = useContext(CartContext);

    // Si intentamos usar este hook fuera de <CartProvider>, lanzamos un error para avisar al desarrollador.
    if (context === undefined) {
        throw new Error("useCartContext debe ser usado dentro de un CartProvider");
    }

    return context;
};
