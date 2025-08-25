interface StripeInvoice {
    created: number;
    amount: number;
    description: any;
    id: string;
    invoice: any;
    status: string;
  }
  
  export interface UserType {
    email: string;
    username: string;
    plan: string;
    stripeCustomerId: string;
    stripeInvoices: StripeInvoice[] | [];
  }
  
  export interface UserProfileProps {
    user: {
      name: string;
      surname: string;
      email: string;
      phone: string;
      vistits: any[];
    };
  }