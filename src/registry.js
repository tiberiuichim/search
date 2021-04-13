import {
  buildRequest,
  runRequest,
  applyDisjunctiveFaceting,
  buildState,
} from './lib/search';

const config = {
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
            ['Country'],
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
      config: {
        facets: [],
      },
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
