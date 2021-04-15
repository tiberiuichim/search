Technology: React
            react-search-ui
            react-search-ui-views
            EEA Search Monorepo

Monorepo
  - @eeacms/searchlib   - main library
  - @eeacms/searchlib-hierarchical-multifacet-x   - various addons
  - @eeacms/search-shell-react - Full-features standalone React app. Can do SSR
  - @eeacms/search-shell-classic - Shell around the main library to use in plain Plone
  - @eeacms/search-shell-component - web component variant
  - @eeacms/searchlib-editor - TTW builder of Search Engine configuration
  - storybook
  - yo/github templates

Distribution and package setup:

  - use React/babel/webpack setup
  - all packages can be distributed as compiled libraries
  - To use the shells, include two distributed libs: main library + shell dist,
    then use from plan JS
  - main library can be used directly from React

Principles:

  - it should be possible to easily build a search engine using the high-level
    components of @eeacms/searchlib. At least as easy as searchkit.
  - a singleton configuration registry with multiple "app configurations" that
    can inherit from each other
  - all configuration should be serializable as JSON. This means registering
    components as named factories
  - named layouts should allow flexibility in how the search engine looks (can
    work as minimal "listing carousel" or maximal configuration)
  - use semantic-ui-react as an extra UI library
  - use react-searchui-views as Search UI library
