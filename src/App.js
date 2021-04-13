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
        const state = buildState(json, resultsPerPage);
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
    };
  }, []);
  return (
    <SearchProvider config={config}>
      <WithSearch
        mapContextToProps={(context) => {
          console.log('context', context);
          return context;
        }}
      >
        {(params) => <Search {...params} />}
      </WithSearch>
    </SearchProvider>
  );
}

const Search = (props) => {
  console.log('props', props);
  const { wasSearched, setSearchTerm } = props;

  React.useEffect(() => {
    if (!wasSearched) {
      setSearchTerm('');
    }
  }, [wasSearched, setSearchTerm]);

  return (
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
              <Facet field="Country" label="Country" view={SingleSelectFacet} />
              <Facet
                field="Sector"
                label="Sector"
                filterType="any"
                isFilterable={false}
              />
              <Facet
                field="Use_or_activity"
                label="Use or activity"
                filterType="any"
                isFilterable={false}
              />
              <Facet
                field="Status"
                label="Status"
                filterType="any"
                isFilterable={false}
              />
              <Facet
                field="Origin_of_the_measure"
                label="Origin of the measure"
                filterType="any"
                isFilterable={false}
              />
              <Facet
                field="Nature_of_the_measure"
                label="Nature of the measure"
                filterType="any"
                isFilterable={false}
              />
              <Facet
                field="Water_body_category"
                label="Water body category"
                filterType="any"
                isFilterable={false}
              />
              <Facet
                field="Spatial_scope"
                label="Spatial scope"
                filterType="any"
                isFilterable={false}
              />
              <Facet
                field="Measure_Impacts_to"
                label="Measure Impacts to"
                filterType="any"
                isFilterable={false}
              />
              <Facet
                field="Descriptors"
                label="Descriptors"
                filterType="any"
                isFilterable={false}
              />
              {/* <Facet */}
              {/*   field="world_heritage_site" */}
              {/*   label="World Heritage Site?" */}
              {/* /> */}
              {/* <Facet field="visitors" label="Visitors" filterType="any" /> */}
            </div>
          }
          bodyContent={
            <div>
              Body
              <Results
                titleField="Country"
                urlField="CodeCatalogue"
                shouldTrackClickThrough={true}
              />
            </div>
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
  );
};
