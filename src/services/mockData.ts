import type {
  Product,
  Order,
  TeamMember,
  ProjectPhase,
  WeeklyRevenue,
  PricingPlan,
  Competitor,
  CostBreakdown,
} from '../types';

// ═══════════════════════════════════════════
// PRODUCTOS (50)
// ═══════════════════════════════════════════

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

const categories = ['Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Accesorios'];

const productNames: string[] = [
  'Audífonos Bluetooth Pro', 'Smartwatch Deportivo X1', 'Cámara de Seguridad WiFi',
  'Teclado Mecánico RGB', 'Mouse Ergonómico Inalámbrico', 'Monitor Curvo 27"',
  'Parlante Portátil Bass+', 'Tablet Android 10"', 'Cargador Solar Portátil',
  'Hub USB-C 8 en 1', 'Playera Premium Algodón', 'Sudadera Urban Style',
  'Jeans Slim Fit Classic', 'Chamarra Impermeable', 'Gorra Deportiva Ajustable',
  'Tenis Running Pro', 'Camisa Oxford Elegante', 'Shorts Deportivos Dry-Fit',
  'Vestido Casual Verano', 'Mochila Urban Explorer', 'Lámpara LED Escritorio',
  'Set de Sartenes Antiadherentes', 'Organizador de Escritorio', 'Almohada Memory Foam',
  'Cafetera Express Automática', 'Aspiradora Robot Smart', 'Espejo LED Baño',
  'Set de Toallas Premium', 'Reloj de Pared Moderno', 'Maceta Decorativa Cerámica',
  'Balón de Fútbol Pro', 'Banda de Resistencia Set', 'Tapete de Yoga Premium',
  'Guantes de Entrenamiento', 'Botella Deportiva 1L', 'Bicicleta Estática Plegable',
  'Cuerda para Saltar Pro', 'Rodillera Deportiva', 'Proteína Whey 2kg',
  'Mancuerna Ajustable 20kg', 'Funda iPhone Premium', 'Billetera RFID Cuero',
  'Lentes de Sol Polarizados', 'Pulsera Inteligente', 'Anillo Smart NFC',
  'Cinturón de Cuero Premium', 'Portafolios Ejecutivo', 'Power Bank 20000mAh',
  'Cable USB-C Trenzado 2m', 'Soporte Laptop Ajustable',
];

export const products: Product[] = productNames.map((name, i) => ({
  id: `prod-${String(i + 1).padStart(3, '0')}`,
  name,
  description: `Producto de alta calidad: ${name}. Diseñado para satisfacer las necesidades del consumidor moderno.`,
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

// ═══════════════════════════════════════════
// ÓRDENES (30)
// ═══════════════════════════════════════════

const customerNames = [
  'María García López', 'Carlos Hernández', 'Ana Martínez Ruiz',
  'Jorge Díaz Pérez', 'Sofía Ramírez', 'Diego López Sánchez',
  'Valentina Torres', 'Andrés Morales', 'Camila Reyes',
  'Fernando Cruz', 'Isabella Flores', 'Roberto Mendoza',
  'Lucía Castillo', 'Alejandro Vargas', 'Gabriela Romero',
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
    shippingAddress: `Calle ${i + 1} #${Math.floor(Math.random() * 999)}, Col. Centro, Tuxtla Gutiérrez, Chiapas`,
    paymentMethod: i % 3 === 0 ? 'Tarjeta de crédito' : i % 3 === 1 ? 'PayPal' : 'Transferencia',
  };
});

// ═══════════════════════════════════════════
// EQUIPO
// ═══════════════════════════════════════════

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

// ═══════════════════════════════════════════
// DATOS DEL PROYECTO — FASES Y COSTOS
// ═══════════════════════════════════════════

export const projectPhases: ProjectPhase[] = [
  {
    name: 'Inicio',
    activities: [
      { name: 'Reunión de arranque', cost: 900, hours: 4, responsible: 'Project Manager' },
      { name: 'Asignación de roles', cost: 250, hours: 1, responsible: 'Project Manager' },
    ],
  },
  {
    name: 'Análisis',
    activities: [
      { name: 'Definición de requerimientos', cost: 3000, hours: 12, responsible: 'Project Manager' },
    ],
  },
  {
    name: 'Diseño',
    activities: [
      { name: 'Diseño de Base de Datos', cost: 2600, hours: 13, responsible: 'Back End Developer' },
      { name: 'Maquetado UI/UX', cost: 2400, hours: 12, responsible: 'Front End Developer' },
      { name: 'Arquitectura del sistema', cost: 2000, hours: 10, responsible: 'DevOps' },
    ],
  },
  {
    name: 'Construcción',
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
      { name: 'Configuración de Servidores', cost: 1200, hours: 6, responsible: 'DevOps' },
      { name: 'Certificado SSL y dominio', cost: 1200, hours: 6, responsible: 'DevOps' },
    ],
  },
  {
    name: 'Cierre',
    activities: [
      { name: 'Documentación', cost: 2000, hours: 10, responsible: 'Front End Developer' },
      { name: 'Dirección de proyecto', cost: 900, hours: 4, responsible: 'Project Manager' },
    ],
  },
];

export const budgetSummary = {
  baseCost: 36872,
  infrastructure: 2500,
  subtotal: 39372,
  profitMargin: 0.15,
  profitAmount: 5905.80,
  subtotalWithProfit: 45277.80,
  taxRate: 0.16,
  taxAmount: 7244.44,
  grandTotal: 52522.24,
};

// ═══════════════════════════════════════════
// INGRESOS SEMANALES (S1 - S8)
// ═══════════════════════════════════════════

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

// ═══════════════════════════════════════════
// PLANES DE PRECIOS
// ═══════════════════════════════════════════

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Básico',
    price: 299,
    period: '/mes',
    highlighted: false,
    features: [
      'Hasta 100 productos',
      'Panel de analítica básico',
      'Soporte por email',
      '1 usuario administrador',
      'Pasarela de pagos (2.9% + $5)',
      'Reportes mensuales',
    ],
  },
  {
    name: 'Pro',
    price: 799,
    period: '/mes',
    highlighted: true,
    badge: 'Más popular',
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

// ═══════════════════════════════════════════
// COMPARATIVA VS COMPETIDORES
// ═══════════════════════════════════════════

export const competitors: Competitor[] = [
  {
    name: 'Shopify',
    monthlyFee: 'US$39 - $399',
    commission: '2.9% + 30¢',
    customDomain: true,
    analytics: true,
    multiPayment: true,
    support: '24/7 (inglés)',
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
    support: '24/7 Español',
    highlighted: true,
  },
];

// ═══════════════════════════════════════════
// COSTOS POR ROL (para donut chart)
// ═══════════════════════════════════════════

export const costByRole: CostBreakdown[] = [
  { role: 'Project Manager', amount: 5050, color: '#6366F1' },
  { role: 'Back End Developer', amount: 17600, color: '#8B5CF6' },
  { role: 'Front End Developer', amount: 12400, color: '#06B6D4' },
  { role: 'DevOps', amount: 7400, color: '#10B981' },
];

// ═══════════════════════════════════════════
// ACTIVIDADES POR FASE (para bar chart)
// ═══════════════════════════════════════════

export const phaseActivityData = projectPhases.map((phase) => ({
  phase: phase.name,
  hours: phase.activities.reduce((s, a) => s + a.hours, 0),
  cost: phase.activities.reduce((s, a) => s + a.cost, 0),
}));

// ═══════════════════════════════════════════
// ACTIVIDADES RECIENTES
// ═══════════════════════════════════════════

export const recentActivities = [
  { id: 1, action: 'Nuevo pedido', description: 'ORD-01025 — María García López', time: 'Hace 5 min', type: 'order' as const },
  { id: 2, action: 'Producto actualizado', description: 'Audífonos Bluetooth Pro — Stock: 45', time: 'Hace 12 min', type: 'product' as const },
  { id: 3, action: 'Pago recibido', description: '$2,450.00 MXN — PayPal', time: 'Hace 30 min', type: 'payment' as const },
  { id: 4, action: 'Cliente registrado', description: 'carlos.hdz@mail.com', time: 'Hace 1 hr', type: 'user' as const },
  { id: 5, action: 'Envío confirmado', description: 'ORD-01022 — DHL Express', time: 'Hace 2 hr', type: 'shipping' as const },
  { id: 6, action: 'Reseña recibida', description: 'Smartwatch X1 — ★★★★★', time: 'Hace 3 hr', type: 'review' as const },
  { id: 7, action: 'Producto agotado', description: 'Monitor Curvo 27" — Stock: 0', time: 'Hace 4 hr', type: 'product' as const },
  { id: 8, action: 'Nuevo pedido', description: 'ORD-01024 — Jorge Díaz Pérez', time: 'Hace 5 hr', type: 'order' as const },
  { id: 9, action: 'Devolución solicitada', description: 'ORD-01018 — Cable USB-C', time: 'Hace 6 hr', type: 'return' as const },
  { id: 10, action: 'Cupón creado', description: 'PRIMAVERA2026 — 15% desc.', time: 'Hace 8 hr', type: 'promo' as const },
];

// ═══════════════════════════════════════════
// TIMELINE DEL PROYECTO (S1-S8)
// ═══════════════════════════════════════════

export const projectTimeline = [
  { week: 'S1', title: 'Inicio del Proyecto', description: 'Reunión de arranque, asignación de roles y definición del alcance', status: 'completed' as const },
  { week: 'S2', title: 'Análisis y Requerimientos', description: 'Levantamiento de requerimientos funcionales y no funcionales', status: 'completed' as const },
  { week: 'S3', title: 'Diseño del Sistema', description: 'Diseño de BD, maquetado UI/UX y arquitectura del sistema', status: 'completed' as const },
  { week: 'S4', title: 'Construcción — Backend', description: 'Desarrollo de APIs, modelos de datos y lógica de negocio', status: 'completed' as const },
  { week: 'S5', title: 'Construcción — Frontend', description: 'Desarrollo de interfaz de usuario y componentes React', status: 'completed' as const },
  { week: 'S6', title: 'Pruebas e Integración', description: 'QA, testing unitario e integración frontend-backend', status: 'current' as const },
  { week: 'S7', title: 'Despliegue', description: 'Configuración de servidores, SSL y puesta en producción', status: 'upcoming' as const },
  { week: 'S8', title: 'Cierre y Documentación', description: 'Documentación técnica, entrega final y cierre de proyecto', status: 'upcoming' as const },
];
