export interface Customer {
  CustomerID: number;
  Recency: number;      // Días desde la última compra
  Frequency: number;    // Número total de compras
  Monetary: number;     // Gasto total histórico
  ticket_promedio: number;
  dias_desde_primera_compra: number;
  probabilidad_alto_valor: number; // Un float entre 0.0 y 1.0
} 