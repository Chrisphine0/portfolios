### Personal Portfolio Website

A modern, responsive personal portfolio website built with Next.js and Tailwind CSS. This portfolio showcases professional work, skills, and contact information with smooth animations and interactive elements.

## ✨ Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI**: Clean, professional design with smooth animations
- **Interactive Elements**: Hover effects, parallax scrolling, and dynamic content
- **Dark Mode Support**: Automatic theme detection with dark/light mode
- **Portfolio Showcase**: Interactive project cards with detailed project pages
- **Animated Components**: Typewriter effect, progress bars, and scroll animations
- **Contact Form**: Fully functional contact form with validation
- **Performance Optimized**: Fast loading times and optimized assets
- **SEO Friendly**: Proper metadata and semantic HTML structure
- **Accessibility**: WCAG compliant with proper ARIA attributes


## 🚀 Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Lightweight icon library
- **Intersection Observer API**: For scroll-based animations
- **CSS Animations**: Custom keyframe animations for interactive elements


## 📦 Installation

1. Clone the repository:

```shellscript
git clone https://github.com/chrisphine0/personal-portfolio.git
cd personal-portfolio
```


2. Install dependencies:

```shellscript
npm install
# or
yarn install
# or
pnpm install
```


3. Run the development server:

```shellscript
npm run dev
# or
yarn dev
# or
pnpm dev
```



4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.


## 🛠️ Project Structure

```plaintext
├── app/                  # Next.js App Router
│   ├── page.tsx          # Home page
│   ├── about/            # About page
│   ├── contact/          # Contact page
│   ├── project/[id]/     # Dynamic project pages
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/           # Reusable components
│   ├── navigation.tsx    # Navigation bar
│   ├── footer.tsx        # Footer component
│   ├── portfolio-section.tsx # Portfolio grid
│   └── ui/               # UI components (shadcn)
├── lib/                  # Utility functions
│   └── github-api.ts     # GitHub API integration
├── public/               # Static assets
└── README.md             # Project documentation
```

## 🧩 Key Components

### Navigation

The navigation component features:

- Responsive design with mobile hamburger menu
- Active page highlighting
- Scroll-based styling changes
- Smooth transitions


```typescriptreact
// Example usage
import Navigation from "@/components/navigation"

export default function Layout({ children }) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
    </>
  )
}
```

### Portfolio Section

Displays projects in an interactive grid with:

- Loading skeleton animations
- Hover effects
- Category filtering
- Technology tags


### Project Detail Pages

Dynamic pages for each project featuring:

- Parallax hero images
- Technology progress bars
- Feature showcases
- Challenges and outcomes sections


### Contact Form

Interactive contact form with:

- Floating labels
- Real-time validation
- Success animations
- Error handling


## 🎨 Customization

### Personal Information

Edit your personal information in the respective components:

```typescriptreact
// Update in components/footer.tsx and other relevant files
const personalInfo = {
  name: "Your Name",
  email: "your.email@example.com",
  phone: "+1 (555) 123-4567",
  location: "Your City, Country",
  socialLinks: [
    { name: "GitHub", icon: Github, url: "https://github.com/yourusername" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/in/yourusername" },
    // Add more social links
  ]
}
```

### Projects

Update the project data in the portfolio section:

```typescriptreact
// Update in components/portfolio-section.tsx
const projects = [
  {
    id: 1,
    title: "Your Project Title",
    description: "Project description goes here",
    image: "/path/to/image.jpg",
    technologies: ["React", "Node.js", "MongoDB"],
    githubUrl: "https://github.com/yourusername/project",
    liveUrl: "https://project-demo.com",
    category: "Web Development",
  },
  // Add more projects
]
```

### Styling

The project uses Tailwind CSS for styling. Customize the theme in `tailwind.config.js`:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Your primary color palette
          50: '#f5f3ff',
          // ...
          900: '#4c1d95',
        },
        // Add more custom colors
      },
      // Add custom animations, fonts, etc.
    },
  },
  // ...
}
```

## 📤 Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app:

1. Push your code to a GitHub repository
2. Import your project to Vercel: [https://vercel.com/import](https://vercel.com/import)
3. Vercel will detect Next.js and set up the build configuration automatically
4. Your site will be deployed to a URL like `your-project.vercel.app`


### Other Hosting Options

- **Netlify**: Similar to Vercel, with automatic deployments from Git
- **AWS Amplify**: Managed hosting with additional backend capabilities
- **Traditional Hosting**: Export your app with `next build && next export` and deploy the static files


## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)
- Mobile browsers (iOS Safari, Chrome for Android)


## ⚡ Performance Optimization

This portfolio website implements several performance optimizations:

- **Image Optimization**: Using Next.js Image component for automatic optimization
- **Code Splitting**: Automatic code splitting by Next.js
- **Lazy Loading**: Components and images load as they enter the viewport
- **Minimal Dependencies**: Limited external libraries to reduce bundle size
- **CSS Optimization**: Using Tailwind's JIT mode for minimal CSS


## 🔍 SEO Considerations

- Proper semantic HTML structure
- Meta tags for better search engine visibility
- Responsive design for mobile-first indexing
- Fast loading times for better ranking
- Accessible content for improved user experience


## 🧪 Testing

Run the test suite with:

```shellscript
npm test
# or
yarn test
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE]

## 👏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Inspiration from various portfolio designs on [Dribbble](https://dribbble.com)


---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



---

Made with ❤️ by chrisphine0