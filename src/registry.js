import {
  buildRequest,
  runRequest,
  applyDisjunctiveFaceting,
  buildState,
} from './lib/search';
import { Facet } from '@elastic/react-search-ui';
import { simpleFacet } from '@eeacms/search/components/factories';
import { SimpleResult } from '@eeacms/search/components';

const wise_config = {
  facets: [
    simpleFacet({ field: 'Country', isFilterable: true }),
    simpleFacet({ field: 'Sector' }),
    simpleFacet({ field: 'Use_or_activity', label: 'Use or activity' }),
    simpleFacet({ field: 'Status' }),
    simpleFacet({
      field: 'Origin_of_the_measure',
      label: 'Origin of the measure',
    }),
    simpleFacet({
      field: 'Nature_of_the_measure',
      label: 'Nature of the measure',
    }),
    simpleFacet({ field: 'Water_body_category', label: 'Water body category' }),
    simpleFacet({ field: 'Spatial_scope', label: 'Spatial scope' }),
    simpleFacet({ field: 'Measure_Impacts_to', label: 'Measure impacts' }),
    simpleFacet({ field: 'Descriptors' }),
  ],
  sortOptions: [
    {
      name: 'Relevance',
      value: '',
      direction: '',
    },
    {
      name: 'Title',
      value: 'Measure_name',
      direction: 'asc',
    },
  ],
  listingViews: [
    {
      title: 'Items',
      icon: null,
      component: SimpleResult,
      params: {
        titleField: 'Measure_name',
        urlField: null,
        summaryField: null,
        extraFields: [
          {
            field: 'Origin_of_the_measure',
            label: 'Origin of the measure',
          },
          {
            field: 'Nature_of_the_measure',
            label: 'Nature of the measure',
          },
          {
            field: 'Spatial_scope',
            label: 'Spatial scope',
          },
        ],
      },
    },
  ],
};

const config = {
  componentFactories: {
    'searchui.Facet': Facet,
  },
  searchui: {
    default: {
      config: {
        // debug: true,
        hasA11yNotifications: true,
        onResultClick: () => {
          /* Not implemented */
        },
        onAutocompleteResultClick: () => {
          /* Not implemented */
        },
        onAutocomplete: async (props) => {
          // console.log('on autocomplete', props);
          const { searchTerm } = props;
          const resultsPerPage = 20;
          const requestBody = buildRequest({ searchTerm });
          const json = await runRequest(requestBody);
          const state = buildState(json.body, resultsPerPage);
          return {
            autocompletedResults: state.results,
          };
        },
        onSearch: async (state) => {
          const { resultsPerPage } = state;
          const requestBody = buildRequest(state);
          // Note that this could be optimized by running all of these requests
          // at the same time. Kept simple here for clarity.
          const responseJson = await runRequest(requestBody);
          const { body } = responseJson;
          const responseJsonWithDisjunctiveFacetCounts = await applyDisjunctiveFaceting(
            body,
            state,
            [],
          );

          const newState = buildState(
            responseJsonWithDisjunctiveFacetCounts,
            resultsPerPage,
          );
          return newState;
        },
      },

      get() {
        return this.config;
      },
    },
    wise: {
      config: wise_config,
      get() {
        return {
          ...config.searchui.default.config,
          ...this.config,
        };
      },
    },
  },
};

export default config;
