# Rocket Adventure Game

A fun and engaging game where players control a rocket to navigate through different stages of the universe, avoiding obstacles and striving to reach deep space.

---

## Features

- **Stages**:
  - Earth Surface: Navigate through falling trees.
  - Sky: Dodge volcanic eruptions.
  - Outer Space: Avoid moving planets.
  - Deep Space: Escape fast-moving stars.
- **Realistic Physics**:
  - Gravity and thrust mechanics.
  - Deceleration in zero-gravity zones.
- **Dynamic Gameplay**:
  - Speed and difficulty adjust based on the stage.
  - Randomly spawning obstacles.
  - Collectable hearts for extra lives.
  - Stage transitions with visual effects.
- **Player Systems**:
  - Multiple character skins.
  - Life system with hearts.
  - Invincibility period after damage.
  - Progress tracking.
- **UI/UX Features**:
  - Interactive tutorial for new players.
  - Vertical progress bar.
  - Stage transition animations.
  - Score and speed display.
  - Pause and resume functionality.
  - Confirmation dialogs.
- **Explosions**:
  - Collide with obstacles to trigger an explosion effect.
  - Game pauses after collision; players can reset manually.

---

## Controls

- **Desktop**:
  - Use the mouse to click for thrust.
  - Press `ArrowLeft` or `A` to move left.
  - Press `ArrowRight` or `D` to move right.
  - Click the home icon to return to menu.
  - Click the reset icon to restart game.
- **Mobile**:
  - Tap the left or right edges of the screen to move horizontally.
  - Tap anywhere to apply thrust.
  - Use on-screen buttons for menu and reset.

---

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- Android Studio installed for building and running the Android app.
- Capacitor CLI installed globally:
  ```bash
  npm install -g @capacitor/cli
  ```

### Environment Setup

1. **Node.js Environment**:

   - Recommended Node.js version: 18.x or higher
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Android Development Environment**:

   - Install Android Studio
   - Install Android SDK (minimum API level as specified in `android/app/build.gradle`)
   - Set up environment variables:
     - `ANDROID_HOME`: path to Android SDK
     - `JAVA_HOME`: path to JDK
   - Accept Android SDK licenses:
     ```bash
     yes | sdkmanager --licenses
     ```

3. **IDE Setup**:
   - Recommended: Visual Studio Code
   - Useful extensions:
     - Angular Language Service
     - TypeScript and JavaScript support
     - Android iOS Emulator
     - Live Server

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/rocket-adventure-game.git
   ```
2. Navigate to the project directory:
   ```bash
   cd rocket-adventure-game
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

---

## Running the Game

### Development Server

1. Start the development server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to `http://localhost:4200`.

---

## Build for Android

To build and deploy the app for Android devices:

### Quick Build (One Command)

Run all three steps with a single command:

```bash
npm run build:android
```

This command will:

1. Build the production version (`ng build --configuration production`)
2. Copy the build to Capacitor (`npx cap copy`)
3. Open Android Studio (`npx cap open android`)

### Manual Steps:

If you prefer to run each step individually:

### Steps:

1. **Build the production version of the app:**

   ```bash
   ng build --configuration production
   ```

   This generates the production-ready web app in the `dist/` folder.

2. **Copy the build to Capacitor:**

   ```bash
   npx cap copy
   ```

3. **Open the Android project in Android Studio:**

   ```bash
   npx cap open android
   ```

4. **Build and Run the App**:
   - In Android Studio, click `Run` to install and run the app on an emulator or connected device.

### Version Management

The app's version information is managed in `android/app/build.gradle`:

```gradle
defaultConfig {
    applicationId "com.ardiland.flyinggame"
    versionCode 2        // Increment this for each Play Store release
    versionName "1.0.1"  // Update this to reflect the user-facing version
}
```

- `versionCode`: Must be incremented for each Play Store release
- `versionName`: Semantic version shown to users
- Each new release requires a higher `versionCode` than all previous releases

When updating the app:

1. Increment `versionCode` by at least 1
2. Update `versionName` to reflect the nature of changes
3. Rebuild the app using the build steps above

### Deploying to Play Store

Follow these steps to deploy your app to the Google Play Store's Internal Testing track:

1. **Sign the App Bundle (AAB)**:

   - In Android Studio, go to Build > Generate Signed Bundle/APK
   - Select Android App Bundle (AAB)
   - Create or select a keystore file
   - Fill in the keystore details and alias information
   - Select release build variant
   - Generate the signed bundle

2. **Version Management**:

   - Each app release requires a unique and increasing `versionCode` in `android/app/build.gradle`
   - Increment `versionCode` by at least 1 for each new release
   - Update `versionName` to reflect the nature of changes (e.g., "1.0.1")
   - Version codes can never be reused - Play Store will reject uploads with duplicate version codes

3. **Create a Google Play Developer Account**:

   - Sign up at the Google Play Console
   - Pay the one-time registration fee ($25)

4. **Set Up Internal Testing**:

   - Create a new app in the Play Console
   - Go to Testing > Internal Testing
   - Create a new release
   - Upload the signed AAB file
   - Add release notes
   - Add testers (up to 100) via email or Google Groups
   - Submit for review

5. **Test the App**:
   - Testers will receive an email with an opt-in link
   - They can install the app from the Play Store
   - Monitor feedback and crashes in the Play Console

**Note**: Always test the app thoroughly before submitting to the Play Store. For local testing of AAB files, you can use bundletool to convert them to APKs, or preferably use the Internal App Sharing feature in the Play Store.

---

## Documentation

### Capacitor Documentation

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Configuration](https://capacitorjs.com/docs/android/configuration)

### Angular Documentation

- [Angular Docs](https://angular.io/docs)

---

## Development

### Testing

To run the tests:

```bash
npm test
```

The game includes:

- Unit tests for services and components
- Integration tests for game mechanics
- End-to-end tests for critical user paths

Key test files:

- `game.service.spec.ts`: Tests for core game logic
- `physics.service.spec.ts`: Tests for physics calculations
- `obstacle.service.spec.ts`: Tests for obstacle management
- `stage.service.spec.ts`: Tests for stage progression

### Code Structure

- **Components**:
  - `GameComponent`: Main gameplay logic and rendering.
  - `PlayerComponent`: Handles player character rendering and skin selection.
  - `ObstacleComponent`: Renders and manages obstacles.
  - `HeartComponent`: Manages collectible hearts and life system.
  - `HudComponent`: Displays game information (score, speed, lives).
  - `DotComponent`: Manages background particle effects.
  - `ExplosionComponent`: Handles collision effects.
  - `StageTransitionComponent`: Manages stage transition animations.
- **Services**:
  - `GameService`: Core game state and logic management.
  - `PhysicsService`: Handles physics calculations like gravity and thrust.
  - `ObstacleService`: Spawns and manages obstacles.
  - `StageService`: Manages game stages and progression.
  - `HeartService`: Controls heart spawning and collection.
  - `DotService`: Manages background particle system.
  - `LeaderboardService`: Handles score tracking and leaderboards.
  - `BackendService`: Manages server communication.

### Key Methods

- `applyGravity`: Applies gravity and deceleration to the rocket.
- `spawnObstacle`: Spawns obstacles based on the current stage.
- `checkCollisions`: Detects collisions between the rocket and obstacles.
- `startGameLoop`: Initializes and manages the main game loop.
- `updateGame`: Updates game state, physics, and visuals.
- `triggerExplosion`: Handles collision effects and life system.
- `saveScore`: Saves player scores to the leaderboard.
- `startCountdown`: Manages game start countdown.
- `transitBackgroundColor`: Handles stage transition effects.

### Customization

- **Adjust Stages**: Modify stage properties (e.g., gravity, max speed) in `StageService`.
- **Add Obstacles**: Extend `ObstacleService` to include new obstacle types.
- **Modify Physics**: Adjust physics parameters in `PhysicsService`.
- **Add Skins**: Add new character skins to the `/public/skins/` directory.

---

## Known Issues

- **Collision Detection**: Improvements may be needed for edge cases.
- **Performance**: Optimizations for a large number of dots and obstacles are ongoing.

## Troubleshooting

### Common Issues and Solutions

1. **Version Code Conflicts**:

   - Error: "Version code X has already been used"
   - Solution: Increment `versionCode` in `android/app/build.gradle`

2. **Build Failures**:

   - Clean the project: `cd android && ./gradlew clean`
   - Ensure all dependencies are installed: `npm install`
   - Check Android SDK version compatibility

3. **Android Studio Issues**:

   - Invalid Gradle JDK: File > Settings > Build > Gradle > Gradle JDK
   - Sync Failures: File > Sync Project with Gradle Files

4. **Runtime Errors**:
   - Clear browser cache for web testing
   - For Android: Clear app data and cache
   - Check console for detailed error messages

For additional support, check the issue tracker or create a new issue.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Inspired by space exploration and the challenges of rocket physics.
- Special thanks to contributors and testers for their feedback.

### **Highlights Added:**

1. Steps to **build for Android** with Capacitor.
2. Links to relevant Capacitor documentation.
3. Clear separation of production build and deployment instructions.
