export interface ImpactStats {
    treesSaved: number;
    waterSaved: number;
    co2Avoided: number;
    energySaved: number;
    oilSaved?: number;
}

export const ReportService = {

    parseWeightInKg(quantityString: string): number {
        if (!quantityString) return 0;
        const lower = quantityString.toLowerCase().trim();

        let multiplier = 1;
        if (lower.includes('ton') || lower.includes('tonne')) multiplier = 1000;
        if (lower.includes('kg')) multiplier = 1;
        // If just a number, assume KG or Units (if Units, we might need average weight per unit mapping)
        // For this demo, we assume the string is like "500 Kg" or "1 Ton"

        const match = lower.match(/[\d\.]+/);
        if (!match) return 0;

        return parseFloat(match[0]) * multiplier;
    },

    calculateImpact(category: string, quantityString: string): ImpactStats {
        const weightKg = this.parseWeightInKg(quantityString);
        const weightTons = weightKg / 1000;

        const stats: ImpactStats = {
            treesSaved: 0,
            waterSaved: 0,
            co2Avoided: 0,
            energySaved: 0,
            oilSaved: 0
        };

        const cat = category.toLowerCase();

        if (cat.includes('paper')) {
            // Paper: 17 Trees, 26,000 L Water, 900 kg CO2, 1,750 L Oil per Ton
            stats.treesSaved = Math.round(weightTons * 17);
            stats.waterSaved = Math.round(weightTons * 26000);
            stats.co2Avoided = Math.round(weightTons * 900);
            stats.oilSaved = Math.round(weightTons * 1750);
        } else if (cat.includes('plastic')) {
            // Plastic: 2,000 L Water (approx generic), 1,500 kg CO2, 5,774 kWh Energy
            stats.waterSaved = Math.round(weightTons * 2000);
            stats.co2Avoided = Math.round(weightTons * 1500);
            stats.energySaved = Math.round(weightTons * 5774);
        } else if (cat.includes('glass')) {
            // Glass: 315 kg CO2, 42 kWh Energy
            stats.co2Avoided = Math.round(weightTons * 315);
            stats.energySaved = Math.round(weightTons * 42);
        } else if (cat.includes('metal') || cat.includes('aluminum') || cat.includes('copper')) {
            // Metal: 4,000 kg CO2 (High savings)
            // Water reduction 40% (hard to quantify in Liters without baseline, skipping for specific formula)
            stats.co2Avoided = Math.round(weightTons * 4000);
            // Assume significant energy savings for metals too, e.g., Aluminum is massive (14,000 kWh/ton), Steel (600 kWh/ton)
            // Using a conservative average or just sticking to CO2 as requested primarily
            stats.energySaved = Math.round(weightTons * 4000); // Conservative placeholder
        } else {
            // Default/E-Waste (General):
            // E-Waste is often mixed. Let's use a generic rigorous composite:
            // ~1.5 Ton CO2 per Ton E-Waste recycled vs mined
            stats.co2Avoided = Math.round(weightTons * 1400);
            stats.energySaved = Math.round(weightTons * 500);
        }

        return stats;
    },

    generateCertificateId(category: string, date: Date = new Date()): string {
        const year = date.getFullYear();
        const catCode = category.substring(0, 2).toUpperCase();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `CERT-${year}-${catCode}-${random}`;
    },

    generateManifestId(): string {
        // e.g., MAN-2024-001
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        return `MAN-${year}-${random}`;
    },

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    }
};
