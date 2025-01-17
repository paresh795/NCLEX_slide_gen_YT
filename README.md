# NCLEX Slide Generator

A powerful Next.js application that transforms NCLEX-style questions into beautifully formatted presentation slides for YouTube educational content.

## Features

- **Smart Question Parsing**: Uses OpenAI's GPT-4 to intelligently parse raw NCLEX questions into structured data
- **Dual Slide Generation**: Creates two slides per question:
  - Question Slide: Displays the question and multiple choice options
  - Answer Slide: Shows the correct answer and detailed rationale
- **Rich Styling Controls**:
  - Font customization (family, size, color, formatting)
  - Layout positioning with intuitive controls
  - Background color selection
  - Style locking and propagation across slides
- **Professional Output**:
  - 16:9 aspect ratio optimized for YouTube
  - High-quality PNG exports
  - Batch generation of all slides
  - Downloadable as a ZIP file

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: React Hooks
- **AI Integration**: OpenAI GPT-4
- **Image Generation**: html2canvas
- **File Handling**: JSZip, FileSaver

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/paresh795/NCLEX_slide_gen_YT.git
   cd NCLEX_slide_gen_YT
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your-api-key-here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Input Questions**:
   - Paste your NCLEX-style questions into the text area
   - Click "Parse Questions" to process them

2. **Style Your Slides**:
   - Use the style controls to customize fonts, colors, and layouts
   - Preview changes in real-time
   - Lock styles when satisfied
   - Optionally propagate styles to all slides

3. **Generate Slides**:
   - Once all styles are locked, click "Generate All Slides"
   - Download the ZIP file containing all question and answer slides

## Project Structure

```
nclex_slide_gen/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── page.tsx           # Main application page
├── components/            # React components
├── lib/                   # Utility functions and types
├── public/               # Static assets
└── styles/               # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the GPT-4 API
- shadcn/ui for the beautiful component library
- The Next.js team for the amazing framework

## Contact

Paresh - [@paresh795](https://github.com/paresh795)

Project Link: [https://github.com/paresh795/NCLEX_slide_gen_YT](https://github.com/paresh795/NCLEX_slide_gen_YT)
