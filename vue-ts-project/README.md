# Vue TypeScript Project

This project is a Vue.js application built with TypeScript, Vuex for state management, and Vuetify for UI components. It serves as a template for creating modern web applications using these technologies.

## Project Structure

```
vue-ts-project
├── public
│   ├── favicon.ico          # Favicon for the application
│   └── index.html           # Main HTML file
├── src
│   ├── assets               # Folder for static assets
│   │   └── logo.svg        # Logo image
│   ├── components           # Vue components
│   │   ├── HelloWorld.vue   # Component that displays a greeting message
│   │   └── BaseButton.vue   # Reusable button component
│   ├── views                # Application views
│   │   ├── HomeView.vue     # Home view component
│   │   └── AboutView.vue    # About view component
│   ├── store                # Vuex store
│   │   ├── index.ts         # Vuex store setup
│   │   └── modules          # Vuex modules
│   │       └── auth.ts      # Authentication module
│   ├── router               # Vue Router setup
│   │   └── index.ts         # Router configuration
│   ├── plugins              # Plugins
│   │   └── vuetify.ts       # Vuetify plugin initialization
│   ├── App.vue              # Root Vue component
│   ├── main.ts              # Entry point of the application
│   ├── shims-vue.d.ts       # TypeScript declarations for Vue files
│   └── vite-env.d.ts        # TypeScript declarations for Vite environment variables
├── .eslintrc.js             # ESLint configuration
├── .prettierrc.js           # Prettier configuration
├── .gitignore               # Git ignore file
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── package.json             # npm configuration
└── README.md                # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd vue-ts-project
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the development server:**
   ```
   npm run serve
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to see your application in action.

## Usage

- The application includes a home view and an about view, which can be navigated using the router.
- The `HelloWorld` component displays a greeting message, while the `BaseButton` component can be reused throughout the application.
- Vuex is set up to manage the application state, with an authentication module included for user management.

## Code Quality

This project is configured with ESLint and Prettier to ensure code quality and consistency. You can run the linter with:
```
npm run lint
```

And format the code with:
```
npm run format
```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.