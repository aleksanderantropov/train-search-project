import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types based on mock.json structure
interface Country {
  id: number;
  code: string;
}

interface Settlement {
  id: number;
  preposition: string;
  title: string;
  titleAccusative: string;
  titleGenitive: string;
  titleLocative: string;
  titlePrepositional: string;
  slug: string;
}

interface Station {
  id: string;
  title: string;
  country: Country;
  settlement: Settlement;
  timezone: string;
  railwayTimezone: string;
  slug: string;
}

interface Company {
  id: number;
  title: string;
}

interface Train {
  title: string;
  number: string;
  displayNumber: string;
}

interface NamedTrain {
  type: string;
  id: number;
  title: string;
  isDeluxe: boolean;
  isHighSpeed: boolean;
  shortTitle: string;
}

interface Features {
  eTicket?: { type: string };
  namedTrain?: NamedTrain;
}

interface Price {
  value: number;
  currency: string;
}

interface PlacesDetails {
  lower?: { quantity: number };
  upper?: { quantity: number };
  lowerSide?: { quantity: number };
  upperSide?: { quantity: number };
}

interface TariffClass {
  type: string;
  price: Price;
  seats: number;
  hasNonRefundableTariff: boolean;
  placesDetails: PlacesDetails;
  facilities: string[];
}

interface Tariffs {
  classes: {
    [key: string]: TariffClass;
  };
}

interface Segment {
  id: string;
  departure: string;
  arrival: string;
  duration: number;
  stationFrom: Station;
  stationTo: Station;
  company: Company;
  train: Train;
  features: Features;
  tariffs: Tariffs;
}

interface Variant {
  id: string;
  forward: Segment[];
  backward?: Segment[];
}

interface Point {
  key: string;
  title: string;
  titleWithType: string;
  titleGenitive: string;
  titleAccusative: string;
  titleLocative: string;
  preposition: string;
  popularTitle: string;
  shortTitle: string;
  slug: string;
}

interface SearchContext {
  isChanged: boolean;
  original: {
    nearest: boolean;
    pointFrom: Point;
    pointTo: Point;
  };
  search: {
    nearest: boolean;
    pointFrom: Point;
    pointTo: Point;
  };
  transportTypes: string[];
  latestDatetime: string;
}

interface MinPrice {
  forward: Price;
}

export interface SearchResponse {
  status: string;
  variants: Variant[];
  context: SearchContext;
  minPrice: MinPrice;
}

interface SearchState {
  data: SearchResponse | null;
  loading: boolean;
  error: string | null;
  minDuration: number | null;
}

const initialState: SearchState = {
  data: null,
  loading: false,
  error: null,
  minDuration: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchData: (state, action: PayloadAction<SearchResponse>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;

      // Calculate minimum duration across all segments
      let minDuration = Infinity;
      action.payload.variants.forEach((variant) => {
        variant.forward.forEach((segment) => {
          if (segment.duration < minDuration) {
            minDuration = segment.duration;
          }
        });
        if (variant.backward) {
          variant.backward.forEach((segment) => {
            if (segment.duration < minDuration) {
              minDuration = segment.duration;
            }
          });
        }
      });

      state.minDuration = minDuration !== Infinity ? minDuration : null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearSearch: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
      state.minDuration = null;
    },
  },
});

export const { setSearchData, setLoading, setError, clearSearch } =
  searchSlice.actions;
export default searchSlice.reducer;
