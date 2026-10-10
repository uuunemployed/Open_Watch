
import { useState } from 'react';
import './App.css';

type Tender = {
  id: string;
  tenderID?: string;
  title?: string;
  status?: string;
  dateModified?: string;
  amount?: number | null;
  currency?: string | null;
  buyer?: string | null;
  procurementMethodType?: string | null;
  suppliers?: string[];
};

function App() {
  const [tenderId, setTenderId] = useState('');
  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const id = tenderId.trim();

    if (!id) {
      setError('Введіть ID закупівлі.');
      setTender(null);
      return;
    }

    setLoading(true);
    setError('');
    setTender(null);

    try {
      const response = await fetch(
        `http://localhost:3000/api/tenders/${encodeURIComponent(id)}`,
      );

      if (!response.ok) {
        throw new Error('Не вдалося знайти закупівлю. Перевірте ID.');
      }

      const data: Tender = await response.json();
      setTender(data);
    } catch {
      setError(
        'Не вдалося отримати дані. Перевірте ID та переконайтеся, що сервер запущений.',
      );
    } finally {
      setLoading(false);
    }
  }

  const formattedAmount =
    tender?.amount != null
      ? new Intl.NumberFormat('uk-UA', {
          maximumFractionDigits: 2,
        }).format(tender.amount) +
        ' ' +
        (tender.currency === 'UAH' ? '₴' : tender.currency ?? '')
      : 'Не вказано';

  const formattedDate = tender?.dateModified
    ? new Date(tender.dateModified).toLocaleString('uk-UA')
    : 'Не вказано';

  return (
    <main className="app">
      <header className="header">
        <a className="logo" href="/">
          <span className="logo-icon">O</span>
          <span>OpenWatch</span>
        </a>
        <span className="header-label">Відкриті державні закупівлі</span>
      </header>

      <section className="hero">
        <span className="eyebrow">ПРОЗОРІСТЬ ПОЧИНАЄТЬСЯ З ДАНИХ</span>

        <h1>
          Державні закупівлі.
          <br />
          <span>Відкриті для кожного.</span>
        </h1>

        <p className="description">
          Знайдіть закупівлю та перегляньте інформацію про
          замовника, вартість і постачальника.
        </p>

        <form className="search-form" onSubmit={handleSearch}>
          <label htmlFor="tender-id">Ідентифікатор закупівлі</label>

          <div className="search-row">
            <input
              id="tender-id"
              type="text"
              placeholder="Наприклад, UA-2026-10-09-008837-a"
              value={tenderId}
              onChange={(event) => setTenderId(event.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Шукаємо...' : 'Знайти закупівлю →'}
            </button>
          </div>

          <span className="hint">
            Введіть ID закупівлі з системи Prozorro
          </span>
        </form>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {tender && (
          <section className="result-card" aria-live="polite">
            <div className="result-top">
              <div>
                <span className="eyebrow">РЕЗУЛЬТАТ ПОШУКУ</span>
                <h2>{tender.title || 'Назва не вказана'}</h2>
              </div>
              <span className="status-badge">
                {tender.status || 'Невідомо'}
              </span>
            </div>

            <div className="tender-id">
              ID: {tender.tenderID || tender.id}
            </div>

            <div className="result-grid">
              <div className="result-field amount-field">
                <span>Вартість закупівлі</span>
                <strong>{formattedAmount}</strong>
              </div>

              <div className="result-field">
                <span>Статус</span>
                <strong>{tender.status || 'Не вказано'}</strong>
              </div>

              <div className="result-field">
                <span>Замовник</span>
                <strong>{tender.buyer || 'Не вказано'}</strong>
              </div>

              <div className="result-field">
                <span>Спосіб закупівлі</span>
                <strong>
                  {tender.procurementMethodType || 'Не вказано'}
                </strong>
              </div>

              <div className="result-field">
                <span>Постачальник</span>
                <strong>
                  {tender.suppliers?.length
                    ? tender.suppliers.join(', ')
                    : 'Не вказано'}
                </strong>
              </div>

              <div className="result-field">
                <span>Останнє оновлення</span>
                <strong>{formattedDate}</strong>
              </div>
            </div>

            <p className="result-note">
              Інформацію отримано з API Prozorro через OpenWatch.
              Наявність закупівлі в системі не означає наявності порушень.
            </p>
          </section>
        )}
      </section>

      <section className="info-section">
        <div className="section-heading">
          <span className="eyebrow">OPENWATCH</span>
          <h2>Публічна інформація — доступна інформація</h2>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-number">01</span>
            <h3>Дані закупівлі</h3>
            <p>Назва, ідентифікатор, статус і дата останнього оновлення.</p>
          </article>

          <article className="feature-card">
            <span className="feature-number">02</span>
            <h3>Державний замовник</h3>
            <p>Дізнайтеся, яка установа проводить закупівлю.</p>
          </article>

          <article className="feature-card">
            <span className="feature-number">03</span>
            <h3>Вартість і постачальник</h3>
            <p>Перегляньте суму закупівлі та інформацію про постачальника.</p>
          </article>
        </div>
      </section>

      <footer className="footer">
        <span>OpenWatch © 2026</span>
        <span>Відкриті дані для суспільного контролю</span>
      </footer>
    </main>
  );
}

export default App;