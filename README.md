# Mini Projects Hub

> 15 useful web applications in one place - built with plain HTML, CSS, and JavaScript

## What's This?

A collection of 15 mini web apps that you can use right in your browser. No installation needed, no frameworks, just simple code that works.

## Projects Included

| # | Project | What It Does |
|---|---------|--------------|
| 1 | Music Player | Play songs with shuffle, repeat, and volume controls |
| 2 | Calculator | Basic calculator that remembers your calculations |
| 3 | Todo List | Track tasks with checkboxes |
| 4 | Weather App | Get weather for any city or use your location |
| 5 | Form Validator | Check if form inputs are correct |
| 6 | Dropdown Menu | Select from dropdown options |
| 7 | Progress Bars | Linear and circular progress indicators |
| 8 | Product Page | Sample e-commerce with shopping cart |
| 9 | Crypto Tracker | Live Bitcoin, Ethereum prices |
| 10 | Quiz App | Answer questions and track score |
| 11 | Digital Clock | Current time and date |
| 12 | Text to Speech | Turn text into speech |
| 13 | QR Generator | Create QR codes from text or URLs |
| 14 | Password Generator | Generate secure random passwords |
| 15 | Welcome Page | Introduction to all projects |

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/mini-projects-hub.git

# Navigate to folder
cd mini-projects-hub

# Open index.html in your browser
# That's it!
```

Or just download the ZIP and open `index.html`

## Files

```
mini-projects-hub/
├── index.html    # Main page
├── styles.css    # All styling  
└── script.js     # All functionality
```

## Usage

1. Open `index.html` in your web browser
2. Click any project card to switch between apps
3. Everything runs locally in your browser

## Setup (Optional)

### Weather App
The app includes a working API key. To use your own:
1. Get free key from [openweathermap.org](https://openweathermap.org/api)
2. Click "Set API Key" in weather section
3. Enter your key

That's it.

## Features

✓ Works on desktop, tablet, and mobile  
✓ Saves data locally (todos, calculator history, cart)  
✓ Live weather and crypto data  
✓ Works offline after initial load (except weather/crypto)  
✓ Clean, simple design  

## Browser Compatibility

Works on Chrome, Firefox, Safari, and Edge.

**Note:** Text-to-speech works best on Chrome and Edge.

## Customization

### Add Your Own Music
Edit `script.js`:
```javascript
const teluguSongs = [
  { 
    title: "Your Song Name", 
    movie: "Album", 
    src: "path/to/your-song.mp3" 
  }
];
```

### Change Colors
Edit `styles.css` - look for gradient and color values.

## Common Issues

**Music won't play automatically?**  
Browsers block autoplay. Click the play button first.

**Weather not working?**  
Check internet connection or set your own API key.

**Text-to-speech has no voices?**  
Depends on your browser/OS. Chrome works best.

## Technologies Used

- HTML5
- CSS3 (Flexbox & Grid)
- Vanilla JavaScript (ES6+)
- localStorage API
- Fetch API
- Web Speech API
- Geolocation API

## APIs Used

- [OpenWeather](https://openweathermap.org/) - Weather data
- [CoinGecko](https://www.coingecko.com/) - Crypto prices
- [QR Server](https://goqr.me/) - QR code generation

## Contributing

Found a bug? Want to add a feature?

1. Fork this repo
2. Create a branch (`git checkout -b feature/cool-feature`)
3. Commit changes (`git commit -m 'Add cool feature'`)
4. Push to branch (`git push origin feature/cool-feature`)
5. Open a Pull Request

## License

MIT License - free to use and modify.

## Author

Built with vanilla JavaScript by a developer who likes to keep things simple.

---

**Star this repo** if you find it useful!# Mini Projects Hub - 15 Web Apps in One Page

A collection of 15 useful web applications built with plain HTML, CSS, and JavaScript. No frameworks, no build tools - just straightforward code that works.

## What's Inside

This project includes 15 different mini applications:

1. **Music Player** - Play songs with controls for shuffle, repeat, and volume
2. **Calculator** - Basic calculator with history that remembers your calculations
3. **Todo List** - Keep track of tasks with completion status
4. **Weather App** - Get current weather for any city or your location
5. **Form Validator** - Check if form inputs are valid in real-time
6. **Dropdown Menu** - Select options from dropdown lists
7. **Progress Bars** - Visual progress indicators (linear and circular)
8. **Product Page** - Sample e-commerce product with shopping cart
9. **Crypto Tracker** - Live cryptocurrency prices (Bitcoin, Ethereum, etc.)
10. **Quiz App** - Answer questions and track your score
11. **Digital Clock** - Shows current time and date
12. **Text to Speech** - Convert text to spoken words
13. **QR Code Generator** - Create QR codes from any text or URL
14. **Password Generator** - Create secure random passwords
15. **Welcome Page** - Introduction to all the projects

## How to Use

1. Download or clone this repository
2. Open `index.html` in your web browser
3. Click on any project card to switch between apps
4. That's it - everything runs in your browser

No installation or setup required.



Then just open `index.html` in your browser.

## Files

- `index.html` - The main page with all projects
- `styles.css` - All the styling
- `script.js` - All the functionality

## Weather Setup (Optional)

The weather app includes a working API key, but you can use your own:

1. Get a free key from [OpenWeather](https://openweathermap.org/api)
2. Click "Set API Key" in the weather section
3. Paste your key

## Features

- Works on desktop, tablet, and mobile
- Saves your data locally (calculator history, todos, shopping cart)
- Live weather and crypto data from real APIs
- No internet required after loading (except for weather and crypto)
- Clean, simple design

## Browser Support

Works best on:
- Chrome
- Firefox
- Safari
- Edge

Some features like text-to-speech work better on Chrome.

## Common Questions

**Why won't music play automatically?**
Browsers block autoplay. Just click the play button first.

**Why isn't the weather working?**
Check your internet connection and make sure you've set an API key if the default doesn't work.

**Can I use this for my project?**
Yes! It's free to use and modify.

## Customizing

Want to add your own songs? Edit this part in `script.js`:

```javascript
const teluguSongs = [
  { 
    title: "Your Song", 
    movie: "Album Name", 
    src: "path/to/song.mp3" 
  }
];
```

Want to change colors? Edit `styles.css` and look for the gradient and color values.

## Known Limitations

- Music files need to be accessible (use full URLs or local files)
- Weather API has usage limits on the free plan
- Text-to-speech voices depend on your browser and operating system
- QR codes need internet to generate

## Contributing

Found a bug? Have an improvement? Feel free to open an issue or submit a pull request.

## Credits

Built with vanilla JavaScript - no frameworks needed.

Uses these free APIs:
- OpenWeather for weather data
- CoinGecko for crypto prices  
- QR Server for QR code generation



---

Made by a developer who believes in keeping things simple.
