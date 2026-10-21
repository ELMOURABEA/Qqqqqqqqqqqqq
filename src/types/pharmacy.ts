export interface Product {
  id: string;
  sku: string;
  nameEn: string;
  nameAr: string;
  category: string;
  categoryEn: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  dosageForm: string;
  descriptionAr: string;
  descriptionEn: string;
  activeIngredient: string;
  requiresPrescription: boolean;
  isPopular?: boolean;
  rating: number;
  reviewCount: number;
  imageEmoji: string;
  usageInstructionsAr: string;
  sideEffectsAr: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PrescriptionOrder {
  id: string;
  patientName: string;
  patientPhone: string;
  address: string;
  governorate: string;
  notes?: string;
  insuranceProvider?: string;
  insuranceCardNumber?: string;
  prescriptionImageName: string;
  prescriptionImageData?: string;
  status: 'received' | 'reviewing' | 'preparing' | 'dispatched' | 'delivered';
  createdAt: string;
  totalEstimate?: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  governorate: string;
  branchName: string;
  items: {
    product: Product;
    quantity: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'cash_on_delivery' | 'credit_card' | 'instapay_vodafone' | 'insurance';
  status: 'received' | 'pharmacy_review' | 'preparing' | 'out_for_delivery' | 'delivered';
  estimatedDeliveryMinutes: number;
  createdAt: string;
  prescriptionId?: string;
}

export interface Branch {
  id: string;
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
  addressAr: string;
  addressEn: string;
  phone: string;
  hotline: string;
  is24Hours: boolean;
  whatsapp: string;
  googleMapsQuery: string;
}

export interface InsuranceProvider {
  id: string;
  nameAr: string;
  nameEn: string;
  logoText: string;
  coverageRatio: string;
  hotline: string;
}
