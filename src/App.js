import React from 'react';

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  WithSearch,
  SearchBox,
  Results,
  Result,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
} from '@elastic/react-search-ui';
import { Layout, SingleSelectFacet } from '@elastic/react-search-ui-views';
import '@elastic/react-search-ui-views/lib/styles/styles.css';
import config from './registry';

const Item = (props) => {
  const { result } = props;
  console.log('item props', props);
  return (
    <div>
      <h4>{result.Measure_name.raw}</h4>
      <p>
        <strong>Origin of measure:</strong>{' '}
        <em>{result.Origin_of_the_measure.raw}</em>
      </p>
      <p>
        <strong>MSFD Descriptor:</strong> <em>{result.Descriptors.raw}</em>
      </p>
    </div>
  );
};

export default function App() {
  const appName = 'wise';

  const appConfig = React.useMemo(() => {
    return config.searchui[appName].get();
  }, []);

  return (
    <SearchProvider config={appConfig}>
      <WithSearch mapContextToProps={(context) => context}>
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
                      value: 'Measure_name',
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
              {/* <Facet field="Country" label="Country" view={SingleSelectFacet} /> */}
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
            </div>
          }
          bodyContent={
            <Results
              titleField="Measure name"
              urlField="CodeCatalogue"
              shouldTrackClickThrough={true}
              resultView={(props) => <Result {...props} view={Item} />}
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
  );
};
