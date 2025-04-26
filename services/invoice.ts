'use client';

// API response type for invoice creation
interface InvoiceApiResponse {
  message: string;
  data: {
    invoiceReferenceId: string;
    reference: string;
    invoiceHash: string;
    amountCurrency: string;
    btcEquivalentOfTokens: string;
    description: string;
    expiryDate: string;
    originalAmount: number;
    totalAmountWithFees: number;
    status: InvoiceStatus;
    feeDetails: {
      ejaraFee: number;
      partnerCommission: number;
      totalFee: number;
    };
  }
}

/* lnbt102-mocked-21caae94c3b4cf9785d1d62490426aba1912556a88cead09940e2408b2033d67801a84409bb829e14122b7d0813d4d8152f4c58bb27c3db7913b97daf51a4064eb9740f49271qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq6e4369e16e97608f844f618bb5151ae0a7780074e37b41c6c6c854d8f766ff01b8b5ed871bd8b948f456ece49016b18771ede08ac323611b904434d33859b620ae0706847afa */

export type InvoiceStatus = "pending" | "paid" | "expired";

// API request type for invoice creation
export interface CreateInvoiceParams {
  amount: number;
  amountCurrency: 'SATs' | 'XAF';
  description?: string;
  reference?: string;
}

// API response type for invoice status
export interface InvoiceStatusResponse {
  status: 'pending' | 'paid' | 'expired' | 'failed';
  updatedAt: string;
}

export interface InvoiceResponse {
  invoice: string;
  reference: string;
  amount: number;
  status: InvoiceStatus;
  invoiceHash: string;
}

/**
 * Create a new LNBTC invoice
 * @param params Invoice creation parameters
 * @returns Invoice response
 */
export async function createInvoice(params: CreateInvoiceParams): Promise<InvoiceResponse> {
  try {
    // Ensure amount is at least 100 for both currencies
    if (params.amount < 100) {
      throw new Error(`Amount must be at least 100 ${params.amountCurrency}`);
    }

    const response = await fetch('/api/lnbtc-invoice/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create invoice');
    }

    const apiResponse: InvoiceApiResponse = await response.json();
    console.log('Raw API response:', apiResponse);
    
    if (!apiResponse.data?.invoiceHash || !apiResponse.data?.reference) {
      throw new Error('Invalid API response: Missing required fields');
    }
    
    // Return formatted response with the actual invoice data
    return {
      invoice: apiResponse.data.invoiceHash,
      reference: apiResponse.data.reference,
      amount: apiResponse.data.totalAmountWithFees,
      status: apiResponse.data.status,
      invoiceHash: apiResponse.data.invoiceHash
    };
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
}

/**
 * Get the status of an invoice by reference
 */
export async function getInvoiceStatus(reference: string): Promise<{ status: InvoiceStatus }> {
  try {
    const response = await fetch(`/api/lnbtc-invoice/status?reference=${reference}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to get invoice status');
    }
    
    const data = await response.json();
    return { status: data.status };
  } catch (error) {
    console.error('Invoice status check error:', error);
    throw error;
  }
}

/**
 * Poll for invoice status changes
 */
export function pollInvoiceStatus(
  reference: string, 
  onStatus: (status: { status: InvoiceStatus }) => void,
  onError: (error: Error) => void,
  interval = 3000
): () => void {
  let timeoutId: NodeJS.Timeout;
  
  const checkStatus = async () => {
    try {
      const status = await getInvoiceStatus(reference);
      onStatus(status);
      
      // If not in a final state, continue polling
      if (status.status === 'pending') {
        timeoutId = setTimeout(checkStatus, interval);
      }
    } catch (error) {
      if (error instanceof Error) {
        onError(error);
      } else {
        onError(new Error('Unknown error checking invoice status'));
      }
    }
  };
  
  // Start the polling
  timeoutId = setTimeout(checkStatus, 0);
  
  // Return function to cancel polling
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
} 
