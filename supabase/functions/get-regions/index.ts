const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock data regional Indonesia
const mockProvinces = [
  { id: "11", name: "ACEH" },
  { id: "12", name: "SUMATERA UTARA" },
  { id: "31", name: "DKI JAKARTA" },
  { id: "32", name: "JAWA BARAT" },
  { id: "33", name: "JAWA TENGAH" },
  { id: "35", name: "JAWA TIMUR" },
];

const mockCities: Record<string, Array<{ id: string; name: string }>> = {
  "31": [
    { id: "3171", name: "JAKARTA SELATAN" },
    { id: "3172", name: "JAKARTA TIMUR" },
    { id: "3173", name: "JAKARTA PUSAT" },
    { id: "3174", name: "JAKARTA BARAT" },
    { id: "3175", name: "JAKARTA UTARA" },
  ],
  "32": [
    { id: "3201", name: "BOGOR" },
    { id: "3204", name: "BANDUNG" },
    { id: "3273", name: "BANDUNG KOTA" },
  ],
  "33": [
    { id: "3374", name: "SEMARANG" },
    { id: "3310", name: "SOLO" },
  ],
};

const mockDistricts: Record<string, Array<{ id: string; name: string }>> = {
  "3171": [
    { id: "317101", name: "KEBAYORAN BARU" },
    { id: "317102", name: "KEBAYORAN LAMA" },
    { id: "317103", name: "PESANGGRAHAN" },
  ],
  "3204": [
    { id: "320401", name: "BANDUNG WETAN" },
    { id: "320402", name: "SUMUR BANDUNG" },
    { id: "320403", name: "CIBEUNYING KALER" },
  ],
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, parentId } = await req.json();

    console.log('Get regions request:', { type, parentId });

    let data;

    switch (type) {
      case 'province':
        data = mockProvinces;
        break;
      case 'city':
        data = mockCities[parentId || ''] || [];
        break;
      case 'district':
        data = mockDistricts[parentId || ''] || [];
        break;
      default:
        throw new Error('Invalid type parameter');
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-regions:', error);
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
