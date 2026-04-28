export const AILabsService = {
    // Simulator for "Visual Waste Analysis"
    // In a real app, this would upload the image to a Python backend (TensorFlow/YOLO)
    analyzeImage: async (file: File): Promise<any> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock result based on random chance or filename
                const isPlastic = file.name.toLowerCase().includes('plastic') || Math.random() > 0.5;

                if (isPlastic) {
                    resolve({
                        success: true,
                        material: 'PET Bottles (Clear)',
                        purity: '92% - Grade A',
                        estimatedWeight: 'Approx. 450-500 kg',
                        impurities: ['Labels (Paper)', 'Caps (HDPE)'],
                        confidence: 0.94
                    });
                } else {
                    resolve({
                        success: true,
                        material: 'Copper Wire (Insulated)',
                        purity: '85% - Mixed',
                        estimatedWeight: 'Approx. 120 kg',
                        impurities: ['Rubber Insulation', 'PVC'],
                        confidence: 0.88
                    });
                }
            }, 2500); // 2.5s simulated processing time
        });
    },

    // Simulator for "Predictive Pricing"
    // Connects to historical market data
    getPriceForecast: async (category: string) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const basePrice = category.includes('Copper') ? 720 : 45; // Copper vs Plastic
                const trend = Math.random() > 0.3 ? 'up' : 'stable';

                // Generate mock 7-day data
                const forecast = Array.from({ length: 7 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i + 1);
                    return {
                        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                        price: Math.floor(basePrice + (Math.random() * 10 - 2))
                    };
                });

                resolve({
                    currentPrice: basePrice,
                    trend: trend === 'up' ? 'Trending Up 📈' : 'Stable',
                    recommendation: trend === 'up' ? 'Hold for 3 days' : 'Sell Now',
                    forecast
                });
            }, 1500);
        });
    }
};
