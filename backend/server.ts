import express from 'express';
import cors from 'cors';
import fs from 'fs';
import csv from 'csv-parser';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let dealsData: any[] = [];

fs.createReadStream('deals.csv')
    .pipe(csv())
    .on('data', (row) => {
        dealsData.push(row);
    })
    .on('end', () => {
        console.log(`CSV File successfully read! Total deals found: ${dealsData.length}`);
    });

function calculateDaysBetween(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const difference = end.getTime() - start.getTime();
    return difference / (1000 * 3600 * 24); 

}

app.get('/api/baseline', (req, res) => {

    let totalClosedWon = 0;
    let totalClosedLost = 0;
    let totalWonValue = 0;
    let totalSalesCycleDays = 0;
    let closedWonCountForCycle = 0;

    dealsData.forEach(deal => {

        if (deal.stage === 'Closed Won') {
            totalClosedWon++;

            totalWonValue += parseFloat(deal.deal_value); 

            if (deal.created_date && deal.closed_date) {
                totalSalesCycleDays += calculateDaysBetween(deal.created_date, deal.closed_date);
                closedWonCountForCycle++;
            }
        } else if (deal.stage === 'Closed Lost') {
            totalClosedLost++;
        }
    });

    const totalClosedDeals = totalClosedWon + totalClosedLost;

    let conversionRate = 0;
    if (totalClosedDeals > 0) {
        conversionRate = (totalClosedWon / totalClosedDeals);
    }

    let avgDealSize = 0;
    if (totalClosedWon > 0) {
        avgDealSize = totalWonValue / totalClosedWon;
    }

    let avgSalesCycle = 0;
    if (closedWonCountForCycle > 0) {
        avgSalesCycle = totalSalesCycleDays / closedWonCountForCycle;
    }

    res.json({
        baseline: {
            conversion_rate: conversionRate,
            avg_deal_size: Math.round(avgDealSize), 

            avg_sales_cycle_days: Math.round(avgSalesCycle) 
        }
    });
});

app.post('/api/simulate', (req, res) => {

    const convChangePercent = req.body.conversion_change || 0; 
    const dealSizeChangePercent = req.body.deal_size_change || 0; 

    let openDealsCount = 0;
    dealsData.forEach(deal => {
        if (deal.stage !== 'Closed Won' && deal.stage !== 'Closed Lost') {
            openDealsCount++;
        }
    });

    const baseConversionRate = 0.4916; 
    const baseDealSize = 16675;

    const baseTotalRevenue = openDealsCount * baseConversionRate * baseDealSize;

    const newConversionRate = baseConversionRate * (1 + (convChangePercent / 100));
    const newDealSize = baseDealSize * (1 + (dealSizeChangePercent / 100));

    const newTotalRevenue = openDealsCount * newConversionRate * newDealSize;

    const absoluteImpact = newTotalRevenue - baseTotalRevenue;
    let percentageImpact = 0;
    if (baseTotalRevenue > 0) {
        percentageImpact = (absoluteImpact / baseTotalRevenue) * 100;
    }

    const baseWeekly = baseTotalRevenue / 4;
    const newWeekly = newTotalRevenue / 4;

    res.json({
        baseline: {
            weekly_revenue: [Math.round(baseWeekly), Math.round(baseWeekly), Math.round(baseWeekly), Math.round(baseWeekly)],
            total_revenue: Math.round(baseTotalRevenue)
        },
        scenario: {
            weekly_revenue: [Math.round(newWeekly), Math.round(newWeekly), Math.round(newWeekly), Math.round(newWeekly)],
            total_revenue: Math.round(newTotalRevenue)
        },
        impact: {
            absolute: Math.round(absoluteImpact),
            percentage: Number(percentageImpact.toFixed(1)) 

        },
        drivers: [
            `Conversion rate changed by ${convChangePercent}%`,
            `Average deal size changed by ${dealSizeChangePercent}%`
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});