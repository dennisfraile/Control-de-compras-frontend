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

// Maps frontend enums to backend DB IDs
// Categories: 1=Lácteos, 2=Carnes, 3=Frutas y Verduras, 4=Cereales y Granos, 5=Bebidas, 6=Limpieza, 7=Higiene Personal, 8=Enlatados, 9=Condimentos, 10=Panadería
export const CategoryToId: Record<Category, number> = {
  [Category.LACTEOS]: 1,
  [Category.CARNES]: 2,
  [Category.FRUTAS]: 3,
  [Category.VERDURAS]: 3,
  [Category.PANADERIA]: 10,
  [Category.BEBIDAS]: 5,
  [Category.LIMPIEZA]: 6,
  [Category.HIGIENE]: 7,
  [Category.CONGELADOS]: 8,
  [Category.ENLATADOS]: 8,
  [Category.CEREALES]: 4,
  [Category.SNACKS]: 4,
  [Category.CONDIMENTOS]: 9,
  [Category.OTROS]: 10,
};

// UnitTypes: 1=ml, 2=L, 3=g, 4=kg, 5=unidad, 6=pz
export const UnitTypeToId: Record<UnitType, number> = {
  [UnitType.UNIDAD]: 5,
  [UnitType.KILOGRAMO]: 4,
  [UnitType.GRAMO]: 3,
  [UnitType.LITRO]: 2,
  [UnitType.MILILITRO]: 1,
  [UnitType.PAQUETE]: 5,
  [UnitType.DOCENA]: 5,
  [UnitType.LIBRA]: 4,
};

// Reverse maps: ID to enum
export const IdToCategory: Record<number, Category> = Object.fromEntries(
  Object.entries(CategoryToId).map(([k, v]) => [v, k as Category])
) as Record<number, Category>;

export const IdToUnitType: Record<number, UnitType> = Object.fromEntries(
  Object.entries(UnitTypeToId).map(([k, v]) => [v, k as UnitType])
) as Record<number, UnitType>;

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
