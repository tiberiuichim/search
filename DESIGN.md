Technology stack:
  - React
  - react-search-ui
  - react-search-ui-views
  - EEA SemanticSearch Monorepo

Monorepo
  - @eeacms/searchlib   - main library, React
  - @eeacms/searchlib-hierarchical-multifacet-x   - various addons
  - @eeacms/search-shell-react - Full-features standalone React app. Should be able to do SSR
  - @eeacms/search-shell-classic - Shell around the main library to use in plain Plone
  - @eeacms/search-shell-component - web component variant
  - @eeacms/searchlib-editor - TTW builder of Search Engine configuration

  - storybook
  - yo/github templates
  - docusaurus

Distribution and package setup:

  - use React/babel/webpack setup
  - all packages can be distributed as compiled libraries
  - To use the shells, include two distributed libs: main library + shell dist,
    then use from plan JS
  - main library can be used directly from React

Principles:

  - it should be possible to easily build a search engine using the high-level
    components of @eeacms/searchlib. At least as easy as w/ searchkit.
  - a singleton configuration registry with multiple "app configurations" that
    can inherit from each other
  - configuration should be serializable as JSON. This means registering
    components as named factories
  - named layouts should allow flexibility in how the search engine looks (can
    work as minimal "listing carousel" or maximal configuration)
  - use semantic-ui-react as an extra UI library
  - separate the search UI into clearly distinguishable abstract components
  - create reusable, configurable search widgets:
    - autocomplete searchbox
    - filterable searchbox
    - "selected filters"
    - facets
      - hierarchical
      - combo
      - daterange
      - facetlist
      - listfacet
      - rangeslider
    - pagination
    - results
      - table
      - listing
      - cards
    - details page for results
    - sorting
    - buttons
    - intro page
    - etc.
  - Start with react-searchui-views as component library
  - Don't impose certain indexing structure. Allow custom vocabularies, allow
    loading these vocabularies async. Provide vocabularies as i18n-aware vocabs
    in JSON?
