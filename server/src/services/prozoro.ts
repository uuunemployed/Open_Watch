import type {
  TenderDetails,
  TenderDetailsResponse,
  TenderListResponse,
} from '../types/tender.js';

const API_URL = 'https://public-api.prozorro.gov.ua/api/2.5';

export async function getRecentTenders(): Promise<TenderListResponse> {
  const response = await fetch(
    `${API_URL}/tenders?limit=5&descending=1`,
  );

  if (!response.ok) {
    throw new Error(`Prozorro API error: ${response.status}`);
  }

  return (await response.json()) as TenderListResponse;
}

export async function getTenderById(
  id: string,
): Promise<TenderDetails> {
  // Якщо введено внутрішній ID Prozorro, одразу отримуємо деталі.
  if (/^[a-f0-9]{32}$/i.test(id)) {
    return fetchTenderDetails(id);
  }

  // Шукаємо публічний ID серед останніх закупівель.
  let offset: string | undefined;

  for (let page = 0; page < 20; page++) {
    const url = new URL(`${API_URL}/tenders`);
    url.searchParams.set('limit', '100');
    url.searchParams.set('descending', '1');

    if (offset) {
      url.searchParams.set('offset', offset);
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Prozorro API error: ${response.status}`);
    }

    const result = (await response.json()) as TenderListResponse;

    // У списку є внутрішні ID, тому завантажуємо деталі
    // і перевіряємо публічний tenderID.
    for (const item of result.data) {
      const tender = await fetchTenderDetails(item.id);

      if (tender.tenderID?.toLowerCase() === id.toLowerCase()) {
        return tender;
      }
    }

    const nextOffset = result.next_page?.offset;

    if (!nextOffset || nextOffset === offset || result.data.length === 0) {
      break;
    }

    offset = nextOffset;
  }

  throw new Error(`Tender not found: ${id}`);
}

async function fetchTenderDetails(id: string): Promise<TenderDetails> {
  const response = await fetch(
    `${API_URL}/tenders/${encodeURIComponent(id)}`,
  );

  if (!response.ok) {
    throw new Error(`Prozorro API error: ${response.status}`);
  }

  const result = (await response.json()) as TenderDetailsResponse;
  return result.data;
}