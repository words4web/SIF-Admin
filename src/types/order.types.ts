export type OrderStatus = "IN_PROCESS" | "DELIVERED";

export interface DeliveryDetails {
  businessName: string;
  contactPerson: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface OrderItem {
  productId:
    | {
        _id: string;
        name: string;
        pack?: string;
        price?: number;
        unit?: string;
        images?: string[];
        isActive?: boolean;
      }
    | string;
  weight?: number;
  quantity: number;
  price: number;
}

export interface OrderRow {
  _id: string;
  orderId: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    business?: string;
    phone?: string;
  };
  items: OrderItem[];
  subtotal: number;
  total: number;
  totalWeightKg?: number;
  charges?: Array<{
    type?: string;
    name: string;
    amount: number;
  }>;
  delivery: DeliveryDetails;
  status: OrderStatus;
  deliveryNoteUrl?: string;
  invoiceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderConfirmation {
  orderId: string;
  placedAt: string;
  itemCount: number;
  total: number;
  delivery: DeliveryDetails;
}

export interface OrderHeaderProps {
  orderId?: string;
  createdAt?: string;
  status?: string;
  total?: number;
  isDelivered: boolean;
  isUpdating: boolean;
  deliveryNoteUrl?: string;
  invoiceUrl?: string;
  onUpdateStatus: (status: "DELIVERED" | "IN_PROCESS") => void;
}

export interface OrderCustomerDetailsProps {
  delivery?: {
    contactPerson?: string;
    businessName?: string;
    phone?: string;
    address?: string;
    notes?: string;
  };
  userId?: {
    _id?: string;
    name?: string;
    business?: string;
    email?: string;
    phone?: string;
  };
}

export interface OrderItemsTableProps {
  items: Array<{
    productId?: {
      _id?: string;
      name?: string;
      pack?: string;
      unit?: string;
      images?: string[];
      isActive?: boolean;
    };
    weight?: number;
    quantity: number;
    price: number;
  }>;
  subtotal?: number;
  total?: number;
  totalWeightKg?: number;
  charges?: Array<{
    type?: string;
    name: string;
    amount: number;
  }>;
}

export interface SelectedOrderItem {
  productId: string;
  name: string;
  price: number;
  weight?: number;
  pack?: string;
  unit?: string;
  image?: string;
  quantity: number;
}

export interface CustomerSelectorProps {
  selectedUserId: string;
  selectedAddressId: string;
  onSelectCustomer: (userId: string) => void;
  onSelectAddress: (addressId: string) => void;
}

export interface ProductSelectorProps {
  selectedItems: SelectedOrderItem[];
  onAddItem: (
    product: any,
    variant?: { weight: number; price: number },
  ) => void;
  onUpdateQuantity: (
    productId: string,
    weight: number | undefined,
    quantity: number,
  ) => void;
  onRemoveItem: (productId: string, weight?: number) => void;
}

export interface OrderSummaryCardProps {
  selectedItems: SelectedOrderItem[];
  notes: string;
  onNotesChange: (notes: string) => void;
  onSubmitOrder: () => void;
  isValid: boolean;
  isSubmitting: boolean;
}
