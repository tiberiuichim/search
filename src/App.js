import React from 'react';

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  WithSearch,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
} from '@elastic/react-search-ui';
import { Layout, SingleSelectFacet } from '@elastic/react-search-ui-views';
import '@elastic/react-search-ui-views/lib/styles/styles.css';

import {
  buildRequest,
  runRequest,
  applyDisjunctiveFaceting,
  buildState,
} from './lib/search';

export default function App() {
  const config = React.useMemo(() => {
    return {
      debug: true,
      hasA11yNotifications: true,
      onResultClick: () => {
        /* Not implemented */
      },
      onAutocompleteResultClick: () => {
        /* Not implemented */
      },
      onAutocomplete: async ({ searchTerm }) => {
        const requestBody = buildRequest({ searchTerm });
        const json = await runRequest(requestBody);
        const state = buildState(json);
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
        console.log('responseJson', body);
        const responseJsonWithDisjunctiveFacetCounts = await applyDisjunctiveFaceting(
          body,
          state,
          ['Country'],
        );
        console.log('disj', responseJsonWithDisjunctiveFacetCounts);

        return buildState(
          responseJsonWithDisjunctiveFacetCounts,
          resultsPerPage,
        );
      },
    };
  }, []);
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => (
          <div className="App">
            <ErrorBoundary>
              <Layout
                header={
                  <SearchBox
                    autocompleteMinimumCharacters={3}
                    autocompleteSuggestions={true}
                  />
                }
                sideContent={
                  <div>
                    {wasSearched && (
                      <Sorting
                        label={'Sort by'}
                        sortOptions={[
                          {
                            name: 'Relevance',
                            value: '',
                            direction: '',
                          },
                          {
                            name: 'Title',
                            value: 'title',
                            direction: 'asc',
                          },
                        ]}
                      />
                    )}
                    <Facet
                      field="Country"
                      label="Country"
                      filterType="any"
                      isFilterable={true}
                    />

                    {/* <Facet */}
                    {/*   field="world_heritage_site" */}
                    {/*   label="World Heritage Site?" */}
                    {/* /> */}
                    {/* <Facet field="visitors" label="Visitors" filterType="any" /> */}
                    {/* <Facet */}
                    {/*   field="acres" */}
                    {/*   label="Acres" */}
                    {/*   view={SingleSelectFacet} */}
                    {/* /> */}
                  </div>
                }
                bodyContent={
                  <Results
                    titleField="Country"
                    urlField="CodeCatalogue"
                    shouldTrackClickThrough={true}
                  />
                }
                bodyHeader={
                  <React.Fragment>
                    <PagingInfo />
                    <ResultsPerPage />
                  </React.Fragment>
                }
                bodyFooter={<Paging />}
              />
            </ErrorBoundary>
          </div>
        )}
      </WithSearch>
    </SearchProvider>
  );
}
