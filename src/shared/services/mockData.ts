import type {
  Product,
  Order,
  TeamMember,
  ProjectPhase,
  WeeklyRevenue,
  PricingPlan,
  Competitor,
  CostBreakdown,
  PlanDetail,
  Testimonial,
  FAQItem,
  ChatQuickAction,
} from '../types/common.types';


const productImages = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400',
  'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
  'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400',
];

const categories = ['Electr├│nicos', 'Ropa', 'Hogar', 'Deportes', 'Accesorios'];

const productNames: string[] = [
  'Aud├¡fonos Bluetooth Pro', 'Smartwatch Deportivo X1', 'C├ímara de Seguridad WiFi',
  'Teclado Mec├ínico RGB', 'Mouse Ergon├│mico Inal├ímbrico', 'Monitor Curvo 27"',
  'Parlante Port├ítil Bass+', 'Tablet Android 10"', 'Cargador Solar Port├ítil',
  'Hub USB-C 8 en 1', 'Playera Premium Algod├│n', 'Sudadera Urban Style',
  'Jeans Slim Fit Classic', 'Chamarra Impermeable', 'Gorra Deportiva Ajustable',
  'Tenis Running Pro', 'Camisa Oxford Elegante', 'Shorts Deportivos Dry-Fit',
  'Vestido Casual Verano', 'Mochila Urban Explorer', 'L├ímpara LED Escritorio',
  'Set de Sartenes Antiadherentes', 'Organizador de Escritorio', 'Almohada Memory Foam',
  'Cafetera Express Autom├ítica', 'Aspiradora Robot Smart', 'Espejo LED Ba├▒o',
  'Set de Toallas Premium', 'Reloj de Pared Moderno', 'Maceta Decorativa Cer├ímica',
  'Bal├│n de F├║tbol Pro', 'Banda de Resistencia Set', 'Tapete de Yoga Premium',
  'Guantes de Entrenamiento', 'Botella Deportiva 1L', 'Bicicleta Est├ítica Plegable',
  'Cuerda para Saltar Pro', 'Rodillera Deportiva', 'Prote├¡na Whey 2kg',
  'Mancuerna Ajustable 20kg', 'Funda iPhone Premium', 'Billetera RFID Cuero',
  'Lentes de Sol Polarizados', 'Pulsera Inteligente', 'Anillo Smart NFC',
  'Cintur├│n de Cuero Premium', 'Portafolios Ejecutivo', 'Power Bank 20000mAh',
  'Cable USB-C Trenzado 2m', 'Soporte Laptop Ajustable',
];

export const products: Product[] = productNames.map((name, i) => ({
  id: `prod-${String(i + 1).padStart(3, '0')}`,
  name,
  description: `Producto de alta calidad: ${name}. Dise├▒ado para satisfacer las necesidades del consumidor moderno.`,
  price: Math.round((Math.random() * 4500 + 199) * 100) / 100,
  comparePrice: Math.random() > 0.5 ? Math.round((Math.random() * 5000 + 500) * 100) / 100 : undefined,
  category: categories[i % categories.length],
  stock: Math.floor(Math.random() * 200),
  image: productImages[i % productImages.length],
  status: (i < 40 ? 'active' : i < 45 ? 'draft' : 'archived') as Product['status'],
  sku: `SKU-${String(i + 1).padStart(5, '0')}`,
  rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
  reviews: Math.floor(Math.random() * 500),
  createdAt: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
}));



const customerNames = [
  'Mar├¡a Garc├¡a L├│pez', 'Carlos Hern├índez', 'Ana Mart├¡nez Ruiz',
  'Jorge D├¡az P├®rez', 'Sof├¡a Ram├¡rez', 'Diego L├│pez S├ínchez',
  'Valentina Torres', 'Andr├®s Morales', 'Camila Reyes',
  'Fernando Cruz', 'Isabella Flores', 'Roberto Mendoza',
  'Luc├¡a Castillo', 'Alejandro Vargas', 'Gabriela Romero',
];

const statuses: Array<'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'> = [
  'pending', 'processing', 'shipped', 'delivered', 'cancelled',
];

export const orders: Order[] = Array.from({ length: 30 }, (_, i) => {
  const numItems = Math.floor(Math.random() * 3) + 1;
  const items = Array.from({ length: numItems }, () => {
    const p = products[Math.floor(Math.random() * products.length)];
    return {
      productId: p.id,
      productName: p.name,
      quantity: Math.floor(Math.random() * 3) + 1,
      price: p.price,
    };
  });

  return {
    id: `ORD-${String(i + 1001).padStart(5, '0')}`,
    customerName: customerNames[i % customerNames.length],
    customerEmail: `cliente${i + 1}@mail.com`,
    items,
    total: items.reduce((s, it) => s + it.price * it.quantity, 0),
    status: statuses[i % statuses.length],
    date: new Date(2026, 0, Math.floor(Math.random() * 78) + 1).toISOString(),
    shippingAddress: `Calle ${i + 1} #${Math.floor(Math.random() * 999)}, Col. Centro, Tuxtla Guti├®rrez, Chiapas`,
    paymentMethod: i % 3 === 0 ? 'Tarjeta de cr├®dito' : i % 3 === 1 ? 'PayPal' : 'Transferencia',
  };
});


export const teamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Jose Manuel Cruz Sanchez',
    role: 'Back End Developer',
    hourlyRate: 250,
    avatar: '',
    email: 'jose.cruz@upchiapas.edu.mx',
  },
  {
    id: 'tm-2',
    name: 'Manuel de Jesus Hernandez Zacarias',
    role: 'Project Manager',
    hourlyRate: 250,
    avatar: '',
    email: 'manuel.hernandez@upchiapas.edu.mx',
  },
  {
    id: 'tm-3',
    name: 'Ulises Gutierrez Maldonado',
    role: 'Front End Developer',
    hourlyRate: 200,
    avatar: '',
    email: 'ulises.gutierrez@upchiapas.edu.mx',
  },
  {
    id: 'tm-4',
    name: 'Miguel Angel Alavazares Hernandez',
    role: 'DevOps',
    hourlyRate: 200,
    avatar: '',
    email: 'miguel.alavazares@upchiapas.edu.mx',
  },
];


export const projectPhases: ProjectPhase[] = [
  {
    name: 'Inicio',
    activities: [
      { name: 'Reuni├│n de arranque', cost: 900, hours: 4, responsible: 'Project Manager' },
      { name: 'Asignaci├│n de roles', cost: 250, hours: 1, responsible: 'Project Manager' },
    ],
  },
  {
    name: 'An├ílisis',
    activities: [
      { name: 'Definici├│n de requerimientos', cost: 3000, hours: 12, responsible: 'Project Manager' },
    ],
  },
  {
    name: 'Dise├▒o',
    activities: [
      { name: 'Dise├▒o de Base de Datos', cost: 2600, hours: 13, responsible: 'Back End Developer' },
      { name: 'Maquetado UI/UX', cost: 2400, hours: 12, responsible: 'Front End Developer' },
      { name: 'Arquitectura del sistema', cost: 2000, hours: 10, responsible: 'DevOps' },
    ],
  },
  {
    name: 'Construcci├│n',
    activities: [
      { name: 'Desarrollo Backend', cost: 15000, hours: 60, responsible: 'Back End Developer' },
      { name: 'Desarrollo Frontend', cost: 8000, hours: 40, responsible: 'Front End Developer' },
    ],
  },
  {
    name: 'Pruebas',
    activities: [
      { name: 'QA y Testing', cost: 3000, hours: 15, responsible: 'DevOps' },
    ],
  },
  {
    name: 'Despliegue',
    activities: [
      { name: 'Configuraci├│n de Servidores', cost: 1200, hours: 6, responsible: 'DevOps' },
      { name: 'Certificado SSL y dominio', cost: 1200, hours: 6, responsible: 'DevOps' },
    ],
  },
  {
    name: 'Cierre',
    activities: [
      { name: 'Documentaci├│n', cost: 2000, hours: 10, responsible: 'Front End Developer' },
      { name: 'Direcci├│n de proyecto', cost: 900, hours: 4, responsible: 'Project Manager' },
    ],
  },
];

export const budgetSummary = {
  baseCost: 42450,
  infrastructure: 2500,
  subtotal: 44950,
  profitMargin: 0.15,
  profitAmount: 6742.50,
  subtotalWithProfit: 51692.50,
  taxRate: 0.16,
  taxAmount: 8270.80,
  grandTotal: 59963.30,
};


export const weeklyRevenue: WeeklyRevenue[] = [
  { week: 'S1', revenue: 12500, orders: 18 },
  { week: 'S2', revenue: 18200, orders: 24 },
  { week: 'S3', revenue: 15800, orders: 21 },
  { week: 'S4', revenue: 22400, orders: 32 },
  { week: 'S5', revenue: 28100, orders: 38 },
  { week: 'S6', revenue: 25600, orders: 35 },
  { week: 'S7', revenue: 31200, orders: 42 },
  { week: 'S8', revenue: 35800, orders: 48 },
];


export const pricingPlans: PricingPlan[] = [
  {
    name: 'B├ísico',
    slug: 'basico',
    price: 299,
    period: '/mes',
    highlighted: false,
    features: [
      'Hasta 100 productos',
      'Panel de anal├¡tica b├ísico',
      'Soporte por email',
      '1 usuario administrador',
      'Pasarela de pagos (2.9% + $5)',
      'Reportes mensuales',
    ],
  },
  {
    name: 'Pro',
    slug: 'pro',
    price: 799,
    period: '/mes',
    highlighted: true,
    badge: 'M├ís popular',
    features: [
      'Productos ilimitados',
      'Dashboard avanzado con IA',
      'Soporte prioritario 24/7',
      'Hasta 5 usuarios',
      'Pasarela de pagos (1.9% + $3)',
      'Reportes en tiempo real',
      'Integraciones API',
      'Multi-moneda',
    ],
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    price: 1499,
    period: '/mes',
    highlighted: false,
    features: [
      'Todo lo del plan Pro',
      'Usuarios ilimitados',
      'Infraestructura dedicada',
      'SLA 99.9% uptime',
      'Account manager dedicado',
      'Pasarela de pagos (0.9% + $2)',
      'White-label branding',
      'API privada',
      'Onboarding personalizado',
    ],
  },
];

// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// COMPARATIVA VS COMPETIDORES
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

export const competitors: Competitor[] = [
  {
    name: 'Shopify',
    monthlyFee: 'US$39 - $399',
    commission: '2.9% + 30┬ó',
    customDomain: true,
    analytics: true,
    multiPayment: true,
    support: '24/7 (ingl├®s)',
  },
  {
    name: 'Amazon Seller',
    monthlyFee: 'US$39.99',
    commission: '8% - 15%',
    customDomain: false,
    analytics: true,
    multiPayment: false,
    support: 'Email',
  },
  {
    name: 'VTEX',
    monthlyFee: 'Personalizado',
    commission: 'Variable',
    customDomain: true,
    analytics: true,
    multiPayment: true,
    support: 'Enterprise',
  },
  {
    name: 'Tiendanube',
    monthlyFee: '$499 - $1,999 MXN',
    commission: '2% - 0%',
    customDomain: true,
    analytics: true,
    multiPayment: true,
    support: 'Chat + Email',
  },
  {
    name: 'E-MARKET PRO',
    monthlyFee: '$299 - $1,499 MXN',
    commission: '0.9% - 2.9%',
    customDomain: true,
    analytics: true,
    multiPayment: true,
    support: '24/7 Espa├▒ol',
    highlighted: true,
  },
];

// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// COSTOS POR ROL (para donut chart)
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

export const costByRole: CostBreakdown[] = [
  { role: 'Project Manager', amount: 5050, color: '#6366F1' },
  { role: 'Back End Developer', amount: 17600, color: '#8B5CF6' },
  { role: 'Front End Developer', amount: 12400, color: '#06B6D4' },
  { role: 'DevOps', amount: 7400, color: '#10B981' },
];

// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// ACTIVIDADES POR FASE (para bar chart)
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

export const phaseActivityData = projectPhases.map((phase) => ({
  phase: phase.name,
  hours: phase.activities.reduce((s, a) => s + (a.hours ?? 0), 0),
  cost: phase.activities.reduce((s, a) => s + (a.cost ?? 0), 0),
}));

// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// ACTIVIDADES RECIENTES
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

export const recentActivities = [
  { id: 1, action: 'Nuevo pedido', description: 'ORD-01025 ÔÇö Mar├¡a Garc├¡a L├│pez', time: 'Hace 5 min', type: 'order' as const },
  { id: 2, action: 'Producto actualizado', description: 'Aud├¡fonos Bluetooth Pro ÔÇö Stock: 45', time: 'Hace 12 min', type: 'product' as const },
  { id: 3, action: 'Pago recibido', description: '$2,450.00 MXN ÔÇö PayPal', time: 'Hace 30 min', type: 'payment' as const },
  { id: 4, action: 'Cliente registrado', description: 'carlos.hdz@mail.com', time: 'Hace 1 hr', type: 'user' as const },
  { id: 5, action: 'Env├¡o confirmado', description: 'ORD-01022 ÔÇö DHL Express', time: 'Hace 2 hr', type: 'shipping' as const },
  { id: 6, action: 'Rese├▒a recibida', description: 'Smartwatch X1 ÔÇö ÔÿàÔÿàÔÿàÔÿàÔÿà', time: 'Hace 3 hr', type: 'review' as const },
  { id: 7, action: 'Producto agotado', description: 'Monitor Curvo 27" ÔÇö Stock: 0', time: 'Hace 4 hr', type: 'product' as const },
  { id: 8, action: 'Nuevo pedido', description: 'ORD-01024 ÔÇö Jorge D├¡az P├®rez', time: 'Hace 5 hr', type: 'order' as const },
  { id: 9, action: 'Devoluci├│n solicitada', description: 'ORD-01018 ÔÇö Cable USB-C', time: 'Hace 6 hr', type: 'return' as const },
  { id: 10, action: 'Cup├│n creado', description: 'PRIMAVERA2026 ÔÇö 15% desc.', time: 'Hace 8 hr', type: 'promo' as const },
];

// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// TIMELINE DEL PROYECTO (S1-S8)
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

export const projectTimeline = [
  { week: 'S1', title: 'Inicio del Proyecto', description: 'Reuni├│n de arranque, asignaci├│n de roles y definici├│n del alcance', status: 'completed' as const },
  { week: 'S2', title: 'An├ílisis y Requerimientos', description: 'Levantamiento de requerimientos funcionales y no funcionales', status: 'completed' as const },
  { week: 'S3', title: 'Dise├▒o del Sistema', description: 'Dise├▒o de BD, maquetado UI/UX y arquitectura del sistema', status: 'completed' as const },
  { week: 'S4', title: 'Construcci├│n ÔÇö Backend', description: 'Desarrollo de APIs, modelos de datos y l├│gica de negocio', status: 'completed' as const },
  { week: 'S5', title: 'Construcci├│n ÔÇö Frontend', description: 'Desarrollo de interfaz de usuario y componentes React', status: 'completed' as const },
  { week: 'S6', title: 'Pruebas e Integraci├│n', description: 'QA, testing unitario e integraci├│n frontend-backend', status: 'current' as const },
  { week: 'S7', title: 'Despliegue', description: 'Configuraci├│n de servidores, SSL y puesta en producci├│n', status: 'upcoming' as const },
  { week: 'S8', title: 'Cierre y Documentaci├│n', description: 'Documentaci├│n t├®cnica, entrega final y cierre de proyecto', status: 'upcoming' as const },
];

// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// DETALLES POR PLAN (Cliente)
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

export const planDetails: Record<string, PlanDetail> = {
  basico: {
    id: 'plan-basico',
    slug: 'basico',
    name: 'B├ísico',
    tagline: 'Ideal para empezar tu tienda online sin complicaciones',
    price: 299,
    period: '/mes',
    gradient: ['#6366F1', '#8B5CF6'],
    accentColor: '#6366F1',
    featureGroups: [
      {
        category: 'Anal├¡tica',
        icon: 'BarChart3',
        items: [
          { name: 'Panel de m├®tricas', description: 'Visualiza ventas, visitas y clientes en un panel sencillo', included: true },
          { name: 'Reportes mensuales', description: 'Recibe un resumen mensual autom├ítico por correo', included: true },
          { name: 'Dashboard con IA', description: 'Predicciones y recomendaciones inteligentes', included: false },
          { name: 'Reportes en tiempo real', description: 'Datos actualizados al instante', included: false },
        ],
      },
      {
        category: 'Pagos',
        icon: 'CreditCard',
        items: [
          { name: 'Pasarela integrada', description: 'Acepta tarjetas de cr├®dito y d├®bito', included: true },
          { name: 'PayPal y SPEI', description: 'M├®todos de pago adicionales', included: true },
          { name: 'Multi-moneda', description: 'Vende en diferentes divisas', included: false },
          { name: 'Comisi├│n reducida', description: 'Tarifa preferencial por transacci├│n', included: false },
        ],
      },
      {
        category: 'Soporte',
        icon: 'Headphones',
        items: [
          { name: 'Soporte por email', description: 'Respuesta en menos de 24 horas', included: true },
          { name: 'Base de conocimiento', description: 'Art├¡culos y tutoriales de ayuda', included: true },
          { name: 'Soporte 24/7', description: 'Atenci├│n prioritaria cualquier d├¡a, cualquier hora', included: false },
          { name: 'Account manager', description: 'Un asesor dedicado a tu cuenta', included: false },
        ],
      },
      {
        category: 'Integraciones',
        icon: 'Puzzle',
        items: [
          { name: 'Webhooks b├ísicos', description: 'Notificaciones autom├íticas de eventos', included: true },
          { name: 'API REST', description: 'Integra con tus sistemas existentes', included: false },
          { name: 'API privada', description: 'Endpoints exclusivos y personalizados', included: false },
          { name: 'White-label', description: 'Tu marca, tu dominio, sin rastro de E-Market', included: false },
        ],
      },
    ],
    limits: {
      products: 100,
      users: 1,
      storageMB: 500,
      apiCalls: 1000,
    },
    tools: [
      { name: 'Editor de productos', description: 'Crea y edita hasta 100 productos con foto y descripciones', icon: 'Package' },
      { name: 'Gestor de pedidos', description: 'Recibe, procesa y da seguimiento a los pedidos', icon: 'ShoppingCart' },
      { name: 'Panel de m├®tricas', description: 'Visualiza tus ventas y visitas del mes', icon: 'BarChart3' },
      { name: 'Notificaciones email', description: 'Alertas de nuevos pedidos y stock bajo', icon: 'Mail' },
    ],
    simulatedKPIs: [
      { label: 'Ingresos del mes', value: 28500, prefix: '$', trend: 5.2 },
      { label: 'Clientes activos', value: 85, trend: 3.1 },
      { label: '├ôrdenes del mes', value: 42, trend: 7.8 },
      { label: 'Ticket promedio', value: 678, prefix: '$', trend: 2.4 },
    ],
    simulatedRevenue: [
      { month: 'Ene', revenue: 18200, orders: 28 },
      { month: 'Feb', revenue: 21500, orders: 32 },
      { month: 'Mar', revenue: 19800, orders: 30 },
      { month: 'Abr', revenue: 24100, orders: 36 },
      { month: 'May', revenue: 26300, orders: 39 },
      { month: 'Jun', revenue: 28500, orders: 42 },
    ],
  },

  pro: {
    id: 'plan-pro',
    slug: 'pro',
    name: 'Pro',
    tagline: 'Potencia tu negocio con herramientas avanzadas e IA',
    price: 799,
    period: '/mes',
    gradient: ['#8B5CF6', '#06B6D4'],
    accentColor: '#8B5CF6',
    badge: 'M├ís popular',
    highlighted: true,
    featureGroups: [
      {
        category: 'Anal├¡tica',
        icon: 'BarChart3',
        items: [
          { name: 'Panel de m├®tricas', description: 'Visualiza ventas, visitas y clientes en un panel avanzado', included: true },
          { name: 'Reportes mensuales', description: 'Recibe res├║menes autom├íticos detallados', included: true },
          { name: 'Dashboard con IA', description: 'Predicciones de ventas y recomendaciones inteligentes', included: true },
          { name: 'Reportes en tiempo real', description: 'Datos actualizados al instante con alertas', included: true },
        ],
      },
      {
        category: 'Pagos',
        icon: 'CreditCard',
        items: [
          { name: 'Pasarela integrada', description: 'Acepta tarjetas de cr├®dito y d├®bito', included: true },
          { name: 'PayPal y SPEI', description: 'M├®todos de pago adicionales', included: true },
          { name: 'Multi-moneda', description: 'Vende en USD, EUR y m├ís divisas', included: true },
          { name: 'Comisi├│n reducida', description: '1.9% + $3 por transacci├│n', included: true },
        ],
      },
      {
        category: 'Soporte',
        icon: 'Headphones',
        items: [
          { name: 'Soporte por email', description: 'Respuesta en menos de 4 horas', included: true },
          { name: 'Base de conocimiento', description: 'Art├¡culos, tutoriales y videos', included: true },
          { name: 'Soporte 24/7', description: 'Chat en vivo y tel├®fono, cualquier d├¡a y hora', included: true },
          { name: 'Account manager', description: 'Un asesor dedicado a tu cuenta', included: false },
        ],
      },
      {
        category: 'Integraciones',
        icon: 'Puzzle',
        items: [
          { name: 'Webhooks avanzados', description: 'Notificaciones configurables por evento', included: true },
          { name: 'API REST', description: 'Documentaci├│n completa, 10,000 llamadas/mes', included: true },
          { name: 'API privada', description: 'Endpoints exclusivos y personalizados', included: false },
          { name: 'White-label', description: 'Tu marca, tu dominio, sin rastro de E-Market', included: false },
        ],
      },
    ],
    limits: {
      products: 'unlimited',
      users: 5,
      storageMB: 5000,
      apiCalls: 10000,
    },
    tools: [
      { name: 'Editor de productos', description: 'Productos ilimitados con variantes, SKUs y SEO', icon: 'Package' },
      { name: 'Gestor de pedidos', description: 'Flujo completo con estados, tracking y devoluciones', icon: 'ShoppingCart' },
      { name: 'Dashboard con IA', description: 'Predicciones de demanda y sugerencias de precios', icon: 'Brain' },
      { name: 'Integraciones API', description: 'Conecta con tu ERP, CRM o sistema de env├¡os', icon: 'Plug' },
      { name: 'Multi-moneda', description: 'Vende en la moneda que tus clientes prefieran', icon: 'Globe' },
      { name: 'Reportes en tiempo real', description: 'M├®tricas actualizadas al segundo con alertas', icon: 'Activity' },
    ],
    simulatedKPIs: [
      { label: 'Ingresos del mes', value: 189600, prefix: '$', trend: 12.5 },
      { label: 'Clientes activos', value: 1247, trend: 8.3 },
      { label: '├ôrdenes del mes', value: 384, trend: 15.2 },
      { label: 'Ticket promedio', value: 4726, prefix: '$', trend: 3.1 },
    ],
    simulatedRevenue: [
      { month: 'Ene', revenue: 95200, orders: 128 },
      { month: 'Feb', revenue: 112500, orders: 156 },
      { month: 'Mar', revenue: 138700, orders: 198 },
      { month: 'Abr', revenue: 155400, orders: 245 },
      { month: 'May', revenue: 172800, orders: 312 },
      { month: 'Jun', revenue: 189600, orders: 384 },
    ],
  },

  enterprise: {
    id: 'plan-enterprise',
    slug: 'enterprise',
    name: 'Enterprise',
    tagline: 'Infraestructura dedicada y soporte premium para operaciones a gran escala',
    price: 1499,
    period: '/mes',
    gradient: ['#06B6D4', '#10B981'],
    accentColor: '#06B6D4',
    featureGroups: [
      {
        category: 'Anal├¡tica',
        icon: 'BarChart3',
        items: [
          { name: 'Panel de m├®tricas', description: 'Dashboard empresarial con vistas personalizables', included: true },
          { name: 'Reportes mensuales', description: 'Reportes ejecutivos detallados y autom├íticos', included: true },
          { name: 'Dashboard con IA', description: 'Modelos predictivos avanzados y machine learning', included: true },
          { name: 'Reportes en tiempo real', description: 'Streaming de datos con dashboards en vivo', included: true },
        ],
      },
      {
        category: 'Pagos',
        icon: 'CreditCard',
        items: [
          { name: 'Pasarela integrada', description: 'Todas las tarjetas y m├®todos locales', included: true },
          { name: 'PayPal y SPEI', description: 'Todos los m├®todos de pago disponibles', included: true },
          { name: 'Multi-moneda', description: 'Soporte completo para comercio internacional', included: true },
          { name: 'Comisi├│n m├¡nima', description: '0.9% + $2 ÔÇö la tarifa m├ís baja del mercado', included: true },
        ],
      },
      {
        category: 'Soporte',
        icon: 'Headphones',
        items: [
          { name: 'Soporte por email', description: 'Respuesta garantizada en 1 hora', included: true },
          { name: 'Base de conocimiento', description: 'Documentaci├│n, videos y workshops privados', included: true },
          { name: 'Soporte 24/7', description: 'L├¡nea directa con ingenieros senior', included: true },
          { name: 'Account manager', description: 'Ejecutivo de cuenta dedicado y reuniones semanales', included: true },
        ],
      },
      {
        category: 'Integraciones',
        icon: 'Puzzle',
        items: [
          { name: 'Webhooks enterprise', description: 'Cola de mensajes garantizada y reintentos', included: true },
          { name: 'API REST', description: 'Sin l├¡mite de llamadas, SLA 99.9%', included: true },
          { name: 'API privada', description: 'Endpoints personalizados para tu operaci├│n', included: true },
          { name: 'White-label', description: 'Marca completamente personalizada en toda la plataforma', included: true },
        ],
      },
    ],
    limits: {
      products: 'unlimited',
      users: 'unlimited',
      storageMB: 'unlimited',
      apiCalls: 'unlimited',
    },
    tools: [
      { name: 'Editor de productos', description: 'Sin l├¡mites: variantes, bulk import, SEO avanzado', icon: 'Package' },
      { name: 'Gestor de pedidos', description: 'Multi-almac├®n, automatizaci├│n de fulfillment', icon: 'ShoppingCart' },
      { name: 'IA Empresarial', description: 'Modelos predictivos, segmentaci├│n y optimizaci├│n', icon: 'Brain' },
      { name: 'API privada', description: 'Endpoints personalizados y documentaci├│n dedicada', icon: 'Code' },
      { name: 'White-label', description: 'Tu marca en toda la experiencia, sin rastro de E-Market', icon: 'Palette' },
      { name: 'Infraestructura dedicada', description: 'Servidores aislados con SLA 99.9% uptime', icon: 'Server' },
      { name: 'Onboarding personalizado', description: 'Migraci├│n guiada y configuraci├│n a la medida', icon: 'UserCheck' },
      { name: 'Multi-moneda global', description: 'Comercio internacional con conversi├│n autom├ítica', icon: 'Globe' },
    ],
    simulatedKPIs: [
      { label: 'Ingresos del mes', value: 1250000, prefix: '$', trend: 18.7 },
      { label: 'Clientes activos', value: 12480, trend: 14.2 },
      { label: '├ôrdenes del mes', value: 4850, trend: 22.1 },
      { label: 'Ticket promedio', value: 8240, prefix: '$', trend: 6.5 },
    ],
    simulatedRevenue: [
      { month: 'Ene', revenue: 620000, orders: 2100 },
      { month: 'Feb', revenue: 745000, orders: 2650 },
      { month: 'Mar', revenue: 890000, orders: 3200 },
      { month: 'Abr', revenue: 985000, orders: 3800 },
      { month: 'May', revenue: 1120000, orders: 4350 },
      { month: 'Jun', revenue: 1250000, orders: 4850 },
    ],
  },
};

// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// TESTIMONIOS
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Laura M├®ndez',
    role: 'Fundadora',
    company: 'Artesan├¡as Chiapas',
    avatar: '',
    quote: 'Con el plan B├ísico pude digitalizar mi tienda de artesan├¡as en menos de una semana. Los reportes mensuales me ayudan a entender qu├® productos se venden m├ís.',
    plan: 'basico',
    rating: 5,
  },
  {
    id: 'test-2',
    name: 'Roberto Jim├®nez',
    role: 'Gerente General',
    company: 'TechShop MX',
    avatar: '',
    quote: 'Empezamos con el B├ísico y en 3 meses migramos al Pro. La diferencia en anal├¡tica es impresionante, las predicciones de IA nos ayudaron a reducir stock muerto un 40%.',
    plan: 'basico',
    rating: 4,
  },
  {
    id: 'test-3',
    name: 'Patricia Rodr├¡guez',
    role: 'Directora de E-commerce',
    company: 'ModaFit Studio',
    avatar: '',
    quote: 'El dashboard con IA del plan Pro es un game changer. Predijo la demanda de temporada y pudimos prepararnos. Nuestras ventas subieron 65% en Black Friday.',
    plan: 'pro',
    rating: 5,
  },
  {
    id: 'test-4',
    name: 'Alejandro Torres',
    role: 'CTO',
    company: 'ElectroMart',
    avatar: '',
    quote: 'Las integraciones API del plan Pro nos permitieron conectar nuestro ERP y sistema de env├¡os. Ahora todo est├í automatizado y ahorramos 20 horas semanales.',
    plan: 'pro',
    rating: 5,
  },
  {
    id: 'test-5',
    name: 'Carmen V├ízquez',
    role: 'VP de Operaciones',
    company: 'GrupoRetail Nacional',
    avatar: '',
    quote: 'Con Enterprise manejamos 15,000 SKUs en 3 almacenes. El SLA 99.9% y el account manager dedicado nos dan la tranquilidad que necesitamos a esta escala.',
    plan: 'enterprise',
    rating: 5,
  },
  {
    id: 'test-6',
    name: 'Fernando Casta├▒eda',
    role: 'CEO',
    company: 'MegaStore Online',
    avatar: '',
    quote: 'El white-label del Enterprise nos permite ofrecer la plataforma como propia a nuestros clientes B2B. La API privada y el onboarding personalizado fueron clave.',
    plan: 'enterprise',
    rating: 5,
  },
];

// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// PREGUNTAS FRECUENTES
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

export const faqItems: FAQItem[] = [
  {
    id: 'faq-1',
    question: '┬┐Puedo cambiar de plan en cualquier momento?',
    answer: 'S├¡, puedes subir o bajar de plan cuando quieras. Si subes de plan, solo pagar├ís la diferencia proporcional. Si bajas, el cambio se aplica en tu pr├│ximo ciclo de facturaci├│n.',
  },
  {
    id: 'faq-2',
    question: '┬┐Hay un periodo de prueba gratuito?',
    answer: 'Todos los planes incluyen 14 d├¡as de prueba gratuita sin necesidad de tarjeta de cr├®dito. Al finalizar, puedes elegir el plan que mejor se adapte a tu negocio.',
  },
  {
    id: 'faq-3',
    question: '┬┐C├│mo funciona la pasarela de pagos?',
    answer: 'E-MARKET PRO integra Stripe, PayPal y SPEI. Tus clientes pueden pagar con tarjeta de cr├®dito/d├®bito, transferencia bancaria o PayPal. Los fondos se depositan en tu cuenta en 2-3 d├¡as h├íbiles.',
  },
  {
    id: 'faq-4',
    question: '┬┐Mis datos est├ín seguros?',
    answer: 'Utilizamos encriptaci├│n AES-256, certificados SSL/TLS, y cumplimos con PCI DSS nivel 1. Tus datos y los de tus clientes est├ín protegidos con los m├ís altos est├índares de seguridad.',
  },
  {
    id: 'faq-5',
    question: '┬┐Puedo migrar mis datos desde otra plataforma?',
    answer: 'S├¡, ofrecemos herramientas de importaci├│n para CSV/Excel y migraciones guiadas desde Shopify, WooCommerce y Tiendanube. En el plan Enterprise, un equipo dedicado se encarga de la migraci├│n completa.',
  },
  {
    id: 'faq-6',
    question: '┬┐Hay permanencia m├¡nima o penalizaci├│n por cancelar?',
    answer: 'No hay permanencia m├¡nima ni penalizaciones. Puedes cancelar en cualquier momento y seguir├ís teniendo acceso hasta el final de tu periodo de facturaci├│n actual.',
  },
  {
    id: 'faq-7',
    question: '┬┐Qu├® m├®todos de pago aceptan para la suscripci├│n?',
    answer: 'Aceptamos tarjetas de cr├®dito/d├®bito (Visa, Mastercard, AMEX), PayPal y transferencia bancaria (SPEI). La facturaci├│n es mensual o anual con 20% de descuento.',
  },
  {
    id: 'faq-8',
    question: '┬┐Incluyen dominio personalizado?',
    answer: 'S├¡, todos los planes incluyen la posibilidad de conectar tu propio dominio. Nosotros nos encargamos de la configuraci├│n del certificado SSL gratuito.',
  },
];

// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// CHAT SOPORTE (respuestas predefinidas)
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

export const chatQuickActions: ChatQuickAction[] = [
  {
    label: '┬┐Qu├® plan me conviene?',
    response: '┬íExcelente pregunta! Depende del tama├▒o de tu negocio:\n\nÔÇó **B├ísico** ($299/mes): Ideal si tienes menos de 100 productos y est├ís empezando.\nÔÇó **Pro** ($799/mes): Perfecto si necesitas anal├¡tica avanzada, IA y API.\nÔÇó **Enterprise** ($1,499/mes): Para operaciones a gran escala con infraestructura dedicada.\n\n┬┐Te gustar├¡a m├ís detalles de alg├║n plan?',
  },
  {
    label: '┬┐Tienen prueba gratis?',
    response: '┬íS├¡! Todos los planes incluyen **14 d├¡as de prueba gratuita** sin necesidad de tarjeta de cr├®dito. Puedes explorar todas las funciones y decidir despu├®s. ­ƒÄë',
  },
  {
    label: '┬┐C├│mo migro mis datos?',
    response: 'Tenemos herramientas de importaci├│n para **CSV/Excel** y migraciones guiadas desde Shopify, WooCommerce y Tiendanube.\n\nEn el plan Enterprise, un equipo dedicado se encarga de todo el proceso de migraci├│n. ­ƒôª',
  },
  {
    label: '┬┐Puedo cancelar cuando quiera?',
    response: '┬íPor supuesto! No hay permanencia m├¡nima ni penalizaciones. Puedes cancelar en cualquier momento y seguir├ís teniendo acceso hasta el final de tu periodo de facturaci├│n. Ô£à',
  },
  {
    label: 'Necesito hablar con ventas',
    response: 'Con gusto te conecto con nuestro equipo de ventas. Puedes escribirnos a **ventas@emarketpro.mx** o llamar al **800-123-4567** de lunes a viernes de 9am a 6pm. Tambi├®n puedes agendar una demo personalizada. ­ƒô×',
  },
];
