# Plant Identifier App

## Project Overview

The Plant Identifier App is a mobile application that allows users to identify plants using their device's camera or by uploading images from their gallery. The app uses AI technology to analyze images and provide detailed information about identified plants in multiple languages.

## Technologies Used

- React Native
- Expo
- Expo Router for navigation
- NativeWind for styling
- React Native Reanimated for animations
- React Native Gesture Handler for gesture-based interactions
- Zustand for state management
- Jest and React Native Testing Library for testing
- Google Gemini AI API for plant identification

## Project Structure

```
/plant-identifier
├── app/
│   ├── index.tsx
│   ├── history.tsx
│   ├── settings.tsx
│   └── _layout.tsx
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   └── PlantCard.tsx
│   └── home/
│       └── InfoSection.tsx
├── lib/
│   ├── api.ts
│   ├── storage.ts
│   └── helpers.ts
├── constants/
│   └── Colors.ts
├── types/
│   └── index.ts
├── __tests__/
├── assets/
└── ...
```

## State Management

The app uses Zustand for state management, providing a simple and efficient way to handle global state. Zustand is used for managing application-wide states such as user preferences, selected languages, and other shared data across components. For local component state, we utilize React's built-in state management with hooks (useState, useEffect).

## Key Components

- `PlantCard`: Displays information about an identified plant
- `InfoSection`: Provides instructions for using the app
- `HistoryItem`: Represents an item in the scan history list

## Setup and Installation

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for local testing)

### Installation Steps

1. Clone the repository:
   ```
   git clone https://github.com/sharqiyem/plant-identifier.git
   ```
2. Navigate to the project directory:
   ```
   cd plant-identifier
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```
4. Start the Expo development server:
   ```
   npx expo start
   ```

## Configuration

The app requires a Google Gemini API key for plant identification. Create a `.env` file in the root directory with the following content:

```
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual Google Gemini API key.

## Testing

Run tests using the following command:

```
npm test
```

or

```
yarn test
```

## Future Improvements

- Implement user accounts for cloud syncing of scan history
- Add offline mode for basic functionality without internet connection
- Integrate with a plant care guide API to provide care instructions for identified plants
- Implement social sharing features for identified plants
- Add augmented reality features for real-time plant identification

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
