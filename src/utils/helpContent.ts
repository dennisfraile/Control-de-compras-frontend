export interface SectionHelp {
  title: string;
  description: string;
  tips: string[];
}

export const sectionHelp: Record<string, SectionHelp> = {
  dashboard: {
    title: 'Dashboard',
    description: 'Vista general de tus compras, inventario y gastos del hogar.',
    tips: [
      'Revisa el gasto del mes actual vs el mes anterior para detectar tendencias.',
      'Los productos con stock bajo aparecen como alerta para que no olvides comprarlos.',
      'La grafica de gasto mensual te ayuda a identificar en que meses gastas mas.',
    ],
  },
  products: {
    title: 'Productos',
    description: 'Catalogo de todos los productos que compras regularmente.',
    tips: [
      'Agrega marca y codigo de barras para identificar productos facilmente.',
      'Cada producto tiene una categoria y unidad de medida predeterminada.',
      'Los productos se comparten entre todas tus listas y compras.',
    ],
  },
  purchases: {
    title: 'Compras',
    description: 'Historial de todas las compras que has realizado en diferentes tiendas.',
    tips: [
      'Registra cada compra con la tienda, fecha y todos los productos que compraste.',
      'Al registrar una compra puedes agregar automaticamente los items al inventario.',
      'Exporta tu historial a Excel para analisis mas detallados.',
    ],
  },
  inventory: {
    title: 'Inventario',
    description: 'Control del stock actual de productos en tu hogar.',
    tips: [
      'Establece un umbral minimo para cada producto y recibe alertas cuando este bajo.',
      'Actualiza las cantidades conforme consumas productos para mantener datos precisos.',
      'Los productos con fecha de vencimiento proxima se resaltan automaticamente.',
    ],
  },
  shoppingList: {
    title: 'Lista de Compras',
    description: 'Lista inteligente que sugiere que comprar basandose en tu inventario y consumo.',
    tips: [
      'La lista se genera automaticamente analizando tu stock actual y tu historial de consumo.',
      'Marca los items como comprados conforme los vayas agregando al carrito.',
      'Ajusta las cantidades sugeridas con los botones + y - segun necesites.',
      'Filtra por "Urgentes" para ver solo lo que necesitas comprar de inmediato.',
    ],
  },
  prices: {
    title: 'Comparacion de Precios',
    description: 'Compara precios de productos entre diferentes tiendas y meses.',
    tips: [
      'Selecciona un producto para ver como ha variado su precio en el tiempo.',
      'Identifica en que tienda es mas barato cada producto.',
      'Usa esta informacion para decidir donde hacer tus compras.',
    ],
  },
  community: {
    title: 'Precios de Comunidad',
    description: 'Precios reportados de forma anonima por otros usuarios.',
    tips: [
      'Los precios son anonimos, nunca se muestra quien los reporto.',
      'Al registrar una compra, los precios se comparten automaticamente con la comunidad.',
      'Busca los mejores precios antes de ir al supermercado.',
    ],
  },
  savings: {
    title: 'Ahorro',
    description: 'Analisis de cuanto puedes ahorrar comprando en las tiendas mas baratas.',
    tips: [
      'Compara tu gasto actual con lo que hubieras gastado en otras tiendas.',
      'Identifica productos donde la diferencia de precio entre tiendas es mayor.',
      'Planifica tus compras en las tiendas que te ofrecen mejor precio por producto.',
    ],
  },
  recipes: {
    title: 'Recetas',
    description: 'Sugerencias de recetas basadas en los ingredientes que ya tienes en casa.',
    tips: [
      'Las recetas se ordenan por porcentaje de ingredientes que ya tienes.',
      'Los ingredientes que te faltan se marcan en rojo para que sepas que comprar.',
      'Reduce el desperdicio de alimentos cocinando con lo que ya tienes.',
    ],
  },
  restockAlerts: {
    title: 'Alertas de Reabastecimiento',
    description: 'Alertas inteligentes basadas en tu patron de consumo real.',
    tips: [
      'Las alertas criticas (rojo) significan que el producto se acabara en menos de 3 dias.',
      'Las de advertencia (amarillo) indican menos de 7 dias de stock.',
      'La cantidad recomendada se calcula basandose en tu consumo promedio de 2 semanas.',
    ],
  },
  scanReceipt: {
    title: 'Escanear Ticket',
    description: 'Escanea un ticket de compra con la camara para registrar los productos automaticamente.',
    tips: [
      'Toma la foto con buena iluminacion y sin arrugas en el ticket.',
      'Verifica los datos extraidos antes de crear la compra.',
      'Funciona mejor con tickets impresos de supermercados grandes.',
    ],
  },
  templates: {
    title: 'Plantillas de Compra',
    description: 'Guarda listas predefinidas de productos que compras regularmente.',
    tips: [
      'Crea una plantilla para tu "compra semanal basica" con los productos que siempre llevas.',
      'Usa una plantilla para agregar todos sus items a la lista de compras con un click.',
      'Puedes tener varias plantillas para diferentes ocasiones (semanal, quincenal, fiesta).',
    ],
  },
  stores: {
    title: 'Tiendas',
    description: 'Registro de los supermercados y tiendas donde realizas tus compras.',
    tips: [
      'Agrega la direccion para recordar la ubicacion de cada tienda.',
      'Las tiendas se usan al registrar compras y comparar precios.',
    ],
  },
  profile: {
    title: 'Mi Perfil',
    description: 'Informacion de tu cuenta y configuracion personal.',
    tips: [
      'Tu perfil se sincroniza con tu cuenta de Google.',
      'Configura la frecuencia de compras (semanal, quincenal, mensual) para mejores sugerencias.',
    ],
  },
};

export interface EmptyStateContent {
  title: string;
  description: string;
  actionLabel: string;
  actionPath: string;
}

export const emptyStates: Record<string, EmptyStateContent> = {
  products: {
    title: 'Sin productos registrados',
    description: 'Empieza agregando los productos que compras regularmente. Esto permitira rastrear precios, inventario y generar listas inteligentes.',
    actionLabel: 'Agregar primer producto',
    actionPath: '/products',
  },
  purchases: {
    title: 'Sin compras registradas',
    description: 'Registra tu primera compra para comenzar a rastrear gastos, comparar precios y generar sugerencias de ahorro.',
    actionLabel: 'Registrar primera compra',
    actionPath: '/purchases',
  },
  inventory: {
    title: 'Inventario vacio',
    description: 'Agrega productos a tu inventario para saber que tienes en casa, recibir alertas de stock bajo y generar listas de compras automaticas.',
    actionLabel: 'Agregar al inventario',
    actionPath: '/inventory',
  },
  shoppingList: {
    title: 'Lista vacia',
    description: 'Genera una lista de compras basada en tu inventario actual. El sistema analiza tu stock y consumo para sugerirte que comprar.',
    actionLabel: 'Generar lista',
    actionPath: '/shopping-list',
  },
  stores: {
    title: 'Sin tiendas registradas',
    description: 'Agrega las tiendas donde compras para comparar precios y saber donde te conviene comprar cada producto.',
    actionLabel: 'Agregar tienda',
    actionPath: '/stores',
  },
  templates: {
    title: 'Sin plantillas',
    description: 'Crea plantillas con los productos que siempre compras para agregarlos a tu lista de compras con un solo click.',
    actionLabel: 'Crear plantilla',
    actionPath: '/templates',
  },
  recipes: {
    title: 'Sin sugerencias',
    description: 'Las recetas se sugieren automaticamente basandose en tu inventario. Agrega productos a tu inventario para recibir sugerencias.',
    actionLabel: 'Ir al inventario',
    actionPath: '/inventory',
  },
};

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  { term: 'Stock', definition: 'Cantidad disponible de un producto en tu hogar. Se reduce conforme consumes y se incrementa al registrar compras.' },
  { term: 'Umbral minimo', definition: 'Cantidad minima que deseas tener de un producto. Cuando el stock baja de este nivel, recibes una alerta.' },
  { term: 'Consumo promedio', definition: 'Cantidad promedio que consumes de un producto en un periodo. Se calcula automaticamente con tu historial de compras.' },
  { term: 'Lista inteligente', definition: 'Lista de compras generada automaticamente analizando tu stock actual, umbral minimo y patron de consumo.' },
  { term: 'Precio unitario', definition: 'Precio de una sola unidad de producto (1 litro, 1 kilo, 1 pieza). Permite comparar precios entre presentaciones diferentes.' },
  { term: 'Plantilla de compra', definition: 'Lista predefinida de productos y cantidades que puedes reutilizar para generar listas de compras rapidamente.' },
  { term: 'Categoria', definition: 'Agrupacion de productos por tipo: Lacteos, Carnes, Frutas, Granos, Limpieza, etc. Ayuda a organizar tus productos.' },
  { term: 'Fecha de vencimiento', definition: 'Fecha en que un producto caduca. El sistema te alerta cuando un producto esta proximo a vencer.' },
  { term: 'Ticket/Recibo', definition: 'Comprobante de compra del supermercado. Puedes escanearlo con la camara para registrar productos automaticamente.' },
  { term: 'Precios de comunidad', definition: 'Precios reportados de forma anonima por otros usuarios. Te ayuda a encontrar las mejores ofertas sin revelar quien los reporto.' },
  { term: 'Ahorro potencial', definition: 'Dinero que podrias ahorrar comprando productos en la tienda mas barata vs donde los compraste.' },
  { term: 'Alerta de reabastecimiento', definition: 'Notificacion que indica que un producto se acabara pronto basandose en tu velocidad de consumo.' },
  { term: 'Unidad de medida', definition: 'Forma de medir un producto: litros (L), kilogramos (kg), gramos (g), mililitros (ml), unidades (ud), piezas (pz).' },
  { term: 'Compra recurrente', definition: 'Compra que realizas periodicamente (semanal, quincenal, mensual). El sistema aprende tu patron para hacer mejores sugerencias.' },
  { term: 'Inventario', definition: 'Registro de todos los productos que tienes actualmente en casa, con sus cantidades y fechas de vencimiento.' },
];

export interface WorkflowStep {
  title: string;
  description: string;
  link?: string;
}

export interface Workflow {
  title: string;
  icon: string;
  steps: WorkflowStep[];
}

export const workflows: Workflow[] = [
  {
    title: 'Primeros pasos',
    icon: '🚀',
    steps: [
      { title: 'Agrega tus tiendas', description: 'Registra los supermercados donde compras habitualmente.', link: '/stores' },
      { title: 'Crea tus productos', description: 'Agrega los productos que compras regularmente con su categoria y unidad.', link: '/products' },
      { title: 'Registra tu inventario', description: 'Indica que tienes actualmente en casa y establece umbrales minimos.', link: '/inventory' },
      { title: 'Registra tu primera compra', description: 'Captura una compra real con precios para empezar a generar estadisticas.', link: '/purchases' },
      { title: 'Revisa tu dashboard', description: 'Ve el resumen de tus compras, stock bajo y gastos del mes.', link: '/' },
    ],
  },
  {
    title: 'Controlar gastos del supermercado',
    icon: '💰',
    steps: [
      { title: 'Registra todas tus compras', description: 'Cada vez que vayas al super, registra los productos y precios.', link: '/purchases' },
      { title: 'Compara precios entre tiendas', description: 'Revisa donde es mas barato cada producto que compras.', link: '/prices' },
      { title: 'Analiza tu ahorro', description: 'Ve cuanto podrias ahorrar comprando en la tienda mas barata.', link: '/savings' },
      { title: 'Optimiza tu lista', description: 'Usa la lista inteligente para comprar solo lo que necesitas.', link: '/shopping-list' },
    ],
  },
  {
    title: 'Evitar desperdicio de alimentos',
    icon: '♻️',
    steps: [
      { title: 'Registra fechas de vencimiento', description: 'Al agregar productos al inventario, incluye la fecha de caducidad.', link: '/inventory' },
      { title: 'Revisa alertas', description: 'Los productos proximos a vencer aparecen resaltados en el inventario.', link: '/inventory' },
      { title: 'Cocina con lo que tienes', description: 'Usa las recetas sugeridas basadas en tu inventario actual.', link: '/recipes' },
    ],
  },
  {
    title: 'Planificar compras eficientes',
    icon: '📋',
    steps: [
      { title: 'Crea plantillas', description: 'Guarda listas de productos que siempre compras para reutilizarlas.', link: '/templates' },
      { title: 'Genera tu lista inteligente', description: 'El sistema analiza tu stock y consumo para sugerirte que comprar.', link: '/shopping-list' },
      { title: 'Revisa precios de comunidad', description: 'Consulta los mejores precios antes de ir al supermercado.', link: '/prices/community' },
    ],
  },
  {
    title: 'Mantener inventario actualizado',
    icon: '📦',
    steps: [
      { title: 'Registra compras con inventario', description: 'Al registrar compras, activa "Agregar al inventario" para actualizar stock automaticamente.', link: '/purchases' },
      { title: 'Actualiza consumo', description: 'Reduce cantidades en el inventario conforme uses los productos.', link: '/inventory' },
      { title: 'Configura alertas', description: 'Revisa las alertas inteligentes para saber que se esta acabando.', link: '/restock-alerts' },
    ],
  },
  {
    title: 'Escanear tickets rapidamente',
    icon: '📸',
    steps: [
      { title: 'Toma foto del ticket', description: 'Usa la camara o selecciona una imagen del ticket de compra.', link: '/scan-receipt' },
      { title: 'Verifica los datos', description: 'Revisa que los productos, cantidades y precios sean correctos.' },
      { title: 'Crea la compra', description: 'Confirma para registrar la compra automaticamente con todos los items.' },
    ],
  },
  {
    title: 'Comparar precios como experto',
    icon: '📊',
    steps: [
      { title: 'Registra en varias tiendas', description: 'Compra el mismo producto en diferentes tiendas para comparar.', link: '/purchases' },
      { title: 'Revisa el historial', description: 'Ve como ha cambiado el precio de un producto en el tiempo.', link: '/prices' },
      { title: 'Consulta la comunidad', description: 'Los precios de otros usuarios te dan mas puntos de comparacion.', link: '/prices/community' },
    ],
  },
  {
    title: 'Usar la app en el supermercado',
    icon: '🛒',
    steps: [
      { title: 'Genera tu lista antes de salir', description: 'Revisa la lista inteligente y ajusta cantidades.', link: '/shopping-list' },
      { title: 'Marca items conforme compras', description: 'Usa los checkboxes para tachar lo que vas metiendo al carrito.' },
      { title: 'Escanea el ticket al pagar', description: 'Toma foto del ticket para registrar la compra sin escribir nada.', link: '/scan-receipt' },
    ],
  },
];
