export interface TenderListItem {
  id: string;
  dateModified: string;
}

export interface TenderListResponse {
  data: TenderListItem[];
  next_page?: {
    offset: string;
    uri: string;
  };
}

export interface TenderDetails {
  id: string;
  tenderID?: string;
  title?: string;
  status?: string;
  date?: string;
  dateModified?: string;
  procurementMethodType?: string;
  mainProcurementCategory?: string;

  value?: {
    amount?: number;
    currency?: string;
    valueAddedTaxIncluded?: boolean;
  };

  procuringEntity?: {
    name?: string;
    identifier?: {
      id?: string;
      scheme?: string;
    };
  };

  items?: Array<{
    description?: string;
    quantity?: number;
    classification?: {
      id?: string;
      description?: string;
    };
  }>;

  awards?: Array<{
    status?: string;
    suppliers?: Array<{
      name?: string;
      identifier?: {
        id?: string;
        scheme?: string;
      };
    }>;
    value?: {
      amount?: number;
      currency?: string;
    };
  }>;

  contracts?: Array<{
    id?: string;
    status?: string;
    date?: string;
    value?: {
      amount?: number;
      currency?: string;
    };
  }>;
}

export interface TenderDetailsResponse {
  data: TenderDetails;
}