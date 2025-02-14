export interface Product {
  id?: number,
  name: string,
  sku: string,
  category: string,
  detailed_description?: string,
  size: string,
  technical_information?: string,
  brand: string,
  origin: OriginEnum,
  model: string,
  attachments?: any[],
  purchase_cost: number,
  freight: number,
  total_cost: number,
  sale_price: number,
  taxes_fees: number,
  profit_margin: number,
  supplier_id: number,
}

export interface ProductHistorical {
  title?: string,
  description?: string,
  product_id?: number,
  product?: Product,
  created_at: Date
}

export enum OriginEnum {
  National = "Nacional",
  Imported = "Importado"
}
