export enum Category {
  LACTEOS = 'LACTEOS',
  CARNES = 'CARNES',
  FRUTAS = 'FRUTAS',
  VERDURAS = 'VERDURAS',
  PANADERIA = 'PANADERIA',
  BEBIDAS = 'BEBIDAS',
  LIMPIEZA = 'LIMPIEZA',
  HIGIENE = 'HIGIENE',
  CONGELADOS = 'CONGELADOS',
  ENLATADOS = 'ENLATADOS',
  CEREALES = 'CEREALES',
  SNACKS = 'SNACKS',
  CONDIMENTOS = 'CONDIMENTOS',
  OTROS = 'OTROS',
}

export const CategoryLabels: Record<Category, string> = {
  [Category.LACTEOS]: 'Lácteos',
  [Category.CARNES]: 'Carnes',
  [Category.FRUTAS]: 'Frutas',
  [Category.VERDURAS]: 'Verduras',
  [Category.PANADERIA]: 'Panadería',
  [Category.BEBIDAS]: 'Bebidas',
  [Category.LIMPIEZA]: 'Limpieza',
  [Category.HIGIENE]: 'Higiene',
  [Category.CONGELADOS]: 'Congelados',
  [Category.ENLATADOS]: 'Enlatados',
  [Category.CEREALES]: 'Cereales',
  [Category.SNACKS]: 'Snacks',
  [Category.CONDIMENTOS]: 'Condimentos',
  [Category.OTROS]: 'Otros',
};

export enum Frequency {
  DIARIO = 'DIARIO',
  SEMANAL = 'SEMANAL',
  QUINCENAL = 'QUINCENAL',
  MENSUAL = 'MENSUAL',
  BIMESTRAL = 'BIMESTRAL',
  TRIMESTRAL = 'TRIMESTRAL',
  OCASIONAL = 'OCASIONAL',
}

export const FrequencyLabels: Record<Frequency, string> = {
  [Frequency.DIARIO]: 'Diario',
  [Frequency.SEMANAL]: 'Semanal',
  [Frequency.QUINCENAL]: 'Quincenal',
  [Frequency.MENSUAL]: 'Mensual',
  [Frequency.BIMESTRAL]: 'Bimestral',
  [Frequency.TRIMESTRAL]: 'Trimestral',
  [Frequency.OCASIONAL]: 'Ocasional',
};

export enum UnitType {
  UNIDAD = 'UNIDAD',
  KILOGRAMO = 'KILOGRAMO',
  GRAMO = 'GRAMO',
  LITRO = 'LITRO',
  MILILITRO = 'MILILITRO',
  PAQUETE = 'PAQUETE',
  DOCENA = 'DOCENA',
  LIBRA = 'LIBRA',
}

export const UnitTypeLabels: Record<UnitType, string> = {
  [UnitType.UNIDAD]: 'Unidad',
  [UnitType.KILOGRAMO]: 'Kilogramo',
  [UnitType.GRAMO]: 'Gramo',
  [UnitType.LITRO]: 'Litro',
  [UnitType.MILILITRO]: 'Mililitro',
  [UnitType.PAQUETE]: 'Paquete',
  [UnitType.DOCENA]: 'Docena',
  [UnitType.LIBRA]: 'Libra',
};

export const UnitTypeAbbreviations: Record<UnitType, string> = {
  [UnitType.UNIDAD]: 'ud',
  [UnitType.KILOGRAMO]: 'kg',
  [UnitType.GRAMO]: 'g',
  [UnitType.LITRO]: 'L',
  [UnitType.MILILITRO]: 'mL',
  [UnitType.PAQUETE]: 'paq',
  [UnitType.DOCENA]: 'doc',
  [UnitType.LIBRA]: 'lb',
};

export const DRAWER_WIDTH = 260;

export const QUERY_KEYS = {
  products: 'products',
  purchases: 'purchases',
  inventory: 'inventory',
  shoppingList: 'shoppingList',
  prices: 'prices',
  stores: 'stores',
  dashboard: 'dashboard',
} as const;
