const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock shipping cost calculation
const calculateMockShipping = (courier: string, weight: number, destination: string) => {
  const baseRates: Record<string, number> = {
    'JNE': 10000,
    'TIKI': 12000,
    'POS': 8000,
  };

  const baseRate = baseRates[courier] || 10000;
  const weightCost = Math.ceil(weight / 1000) * baseRate;
  const destinationMultiplier = destination.includes('JAKARTA') ? 1 : 1.5;

  return Math.round(weightCost * destinationMultiplier);
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { courier, weight, destination } = await req.json();

    console.log('Calculate shipping request:', { courier, weight, destination });

    if (!courier || !weight || !destination) {
      throw new Error('Missing required parameters');
    }

    const cost = calculateMockShipping(courier, weight, destination);

    const response = {
      success: true,
      data: {
        courier,
        service: courier === 'JNE' ? 'REG' : courier === 'TIKI' ? 'ECO' : 'Paket Kilat',
        description: `Layanan regular ${courier}`,
        cost,
        etd: '2-3 hari',
      },
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in calculate-shipping:', error);
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
