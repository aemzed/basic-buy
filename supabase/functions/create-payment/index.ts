const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, amount, customerName, customerEmail, items } = await req.json();

    console.log('Create payment request:', { orderId, amount, customerName });

    if (!orderId || !amount || !customerName) {
      throw new Error('Missing required parameters');
    }

    // Mock Xendit invoice creation
    const mockInvoice = {
      id: `inv_${Date.now()}`,
      external_id: orderId,
      user_id: 'mock_user',
      status: 'PENDING',
      merchant_name: 'TokoKu',
      amount,
      payer_email: customerEmail || 'customer@example.com',
      description: `Payment for order ${orderId}`,
      invoice_url: `https://checkout.xendit.co/web/${orderId}`,
      expiry_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created: new Date().toISOString(),
    };

    console.log('Mock invoice created:', mockInvoice.id);

    return new Response(JSON.stringify({ success: true, data: mockInvoice }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in create-payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
