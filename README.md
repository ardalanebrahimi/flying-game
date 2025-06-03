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

### Deploying to Play Store

Follow these steps to deploy your app to the Google Play Store's Internal Testing track:

1. **Sign the App Bundle (AAB)**:

   - In Android Studio, go to Build > Generate Signed Bundle/APK
   - Select Android App Bundle (AAB)
   - Create or select a keystore file
   - Fill in the keystore details and alias information
   - Select release build variant
   - Generate the signed bundle

2. **Create a Google Play Developer Account**:

   - Sign up at the Google Play Console
   - Pay the one-time registration fee ($25)

3. **Set Up Internal Testing**:

   - Create a new app in the Play Console
   - Go to Testing > Internal Testing
   - Create a new release
   - Upload the signed AAB file
   - Add release notes
   - Add testers (up to 100) via email or Google Groups
   - Submit for review

4. **Test the App**:
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

---

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
