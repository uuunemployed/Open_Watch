import express from "express";
import cors from "cors";
import {
  getRecentTenders,
  getTenderById,
} from './services/prozoro.js';

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "OpenWatch API is running",
  });
});

app.get('/api/tenders', async (_req, res) => {
  try {
    const result = await getRecentTenders();

    const tenders = await Promise.all(
      result.data.map(async (item) => {
        const tender = await getTenderById(item.id);

        return {
          id: tender.id,
          tenderID: tender.tenderID,
          title: tender.title,
          status: tender.status,
          dateModified: tender.dateModified ?? item.dateModified,
          amount: tender.value?.amount ?? null,
          currency: tender.value?.currency ?? null,
          buyer: tender.procuringEntity?.name ?? null,
          procurementMethodType:
            tender.procurementMethodType ?? null,
          suppliers:
            tender.awards?.flatMap((award) =>
              award.suppliers?.map((supplier) => supplier.name) ?? [],
            ) ?? [],
        };
      }),
    );

    res.json({
      count: tenders.length,
      data: tenders,
    });
  } catch (error) {
    console.error('Failed to fetch tenders:', error);

    res.status(502).json({
      message: 'Failed to fetch data from Prozorro',
    });
  }
});

app.get('/api/tenders/:id', async (req, res) => {
  try {
    const tender = await getTenderById(req.params.id);

    res.json({
      id: tender.id,
      tenderID: tender.tenderID,
      title: tender.title,
      status: tender.status,
      dateModified: tender.dateModified,
      amount: tender.value?.amount ?? null,
      currency: tender.value?.currency ?? null,
      buyer: tender.procuringEntity?.name ?? null,
      procurementMethodType: tender.procurementMethodType ?? null,
      suppliers:
        tender.awards?.flatMap(
          (award) =>
            award.suppliers?.map((supplier) => supplier.name) ?? [],
        ) ?? [],
    });
  } catch (error) {
    console.error('Failed to fetch tender:', error);

    res.status(502).json({
      message: 'Не вдалося отримати закупівлю з Prozorro. Перевірте ID.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`OpenWatch API: http://localhost:${PORT}`);
});
