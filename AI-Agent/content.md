# Config API Structure Documentation

## Overview

This directory contains configuration files that define the complete structure and content for the web builder application. Each config file follows the same YAML structure but contains different content themes, making it easy to generate new websites for different industries.

## Available Config Files

| File | Theme | Description |
|------|-------|-------------|
| `config.yaml` | **FitLife Pro** | Fitness & Wellness platform |
| `config-ecommerce.yaml` | **ShopHub** | E-commerce & Online Shopping |
| `config-restaurant.yaml` | **TasteBite** | Food Delivery & Restaurant |
| `config-travel.yaml` | **WanderLux** | Travel & Tourism |
| `config-realestate.yaml` | **HomeFinder** | Real Estate & Property |
| `config-saas.yaml` | **CloudFlow** | SaaS & Software Platform |

## Configuration Structure

### 1. Site-Level Configuration

```yaml
site:
  name: string                    # Brand name
  description: string             # Site description
  theme:
    primary: string               # Primary color (hex)
    secondary: string             # Secondary color (hex)
    accent: string                # Accent color (hex)
  navigation:
    logo:
      text: string                # Logo text
    links: array                  # Navigation menu items
      - text: string              # Link text
        href: string              # Link URL
        children: array           # Optional dropdown items
    cta:
      text: string                # CTA button text
      href: string                # CTA button URL
  footer:
    logo:
      text: string                # Footer logo text
    tagline: string               # Footer tagline
    copyright: string             # Copyright text
    sections: array               # Footer link sections
      - title: string             # Section title
        links: array              # Section links
    social: array                 # Social media links
      - platform: string          # Platform name
        url: string               # Profile URL
```

### 2. Page Configuration

Each page is defined in the `pages` array with the following structure:

```yaml
pages:
  - slug: string                  # URL path (e.g., '/', '/blog')
    title: string                 # Page title
    description: string           # Page meta description
    sections: array               # Page sections (for home page)
    hero: object                  # Hero section (for other pages)
    # Additional page-specific fields
```

### 3. Section Types

#### Hero Section
```yaml
- type: 'hero'
  id: string
  props:
    layout: string                # Layout type (e.g., 'centered')
    title: string                 # Main heading
    subtitle: string              # Subheading
    buttons: array                # CTA buttons
      - text: string
        href: string
        variant: string           # 'primary' or 'outline'
    trustIndicators: array        # Trust badges
    background:
      gradient: string            # Tailwind gradient classes
    image: string                 # Hero image URL
```

#### Features Section
```yaml
- type: 'features'
  id: string
  props:
    title: string                 # Section title
    subtitle: string              # Section subtitle
    columns: number               # Grid columns (2 or 3)
    items: array                  # Feature items
      - id: string
        title: string
        description: string
        icon:
          value: string           # Emoji or icon
```

#### Stats Section
```yaml
- type: 'stats'
  id: string
  props:
    background: string            # Background color class
    items: array                  # Stat items
      - id: string
        value: string             # Stat value
        label: string             # Stat label
```

#### Testimonials Section
```yaml
- type: 'testimonials'
  id: string
  props:
    title: string                 # Section title
    subtitle: string              # Section subtitle
    trustBadge: string            # Trust indicator text
    items: array                  # Testimonial items
      - id: string
        content: string           # Testimonial text
        rating: number            # 1-5 rating
        author:
          name: string
          role: string
```

### 4. Blog Page Structure

```yaml
- slug: '/blog'
  title: string
  description: string
  hero:
    title: string
    subtitle: string
  categories: array               # Category filter options
  posts: array                    # Blog post items
    - id: number
      title: string
      excerpt: string
      category: string
      date: string
      image: string               # Post image URL
      readTime: string
  newsletter:
    title: string
    description: string
    placeholder: string
    buttonText: string
```

### 5. About Page Structure

```yaml
- slug: '/about'
  title: string
  description: string
  hero:
    title: string
    subtitle: string
  stats: array                    # Quick stats
    - value: string
      label: string
  mission:
    title: string
    description: string
    icon: string
    gradient: string
  vision:
    title: string
    description: string
    icon: string
    gradient: string
  values:
    title: string
    subtitle: string
    items: array
      - title: string
        description: string
        icon: string
  team:
    title: string
    subtitle: string
    members: array
      - name: string
        role: string
        image: string             # Team member photo URL
```

### 6. Docs Page Structure

```yaml
- slug: '/docs'
  title: string
  description: string
  hero:
    title: string
    subtitle: string
  guides: array                   # Documentation guides
    - title: string
      description: string
      icon: string
      topics: array               # Guide topics
```

### 7. Status/Tracking Page Structure

```yaml
- slug: '/status'
  title: string
  description: string
  hero:
    title: string
    subtitle: string
  searchPlaceholder: string
  searchButton: string
  recentTitle: string
  statuses: array                 # Status items
    - orderId: string
      customer: string
      location: string
      status: string
      estimatedArrival: string
      progress: number            # 0-100
```

### 8. API/Calculator Page Structure

```yaml
- slug: '/api'
  title: string
  description: string
  hero:
    title: string
    subtitle: string
  comingSoon:
    title: string
    description: string
    icon: string
    buttonText: string
    buttonHref: string
```

## How to Use This Config

### For Manual Content Updates

1. Choose the appropriate config file for your industry
2. Edit the YAML values to match your brand and content
3. Update colors in the `theme` section
4. Modify text content throughout the file
5. Replace image URLs with your own assets
6. Save and the application will automatically use the new config

### For AI-Generated Configs

When generating a new config file with AI, provide this structure and specify:

1. **Industry/Theme**: What type of business (e.g., "healthcare", "education", "finance")
2. **Brand Name**: The company/product name
3. **Color Scheme**: Primary and secondary colors (or let AI choose)
4. **Key Features**: Main features or services to highlight
5. **Target Audience**: Who the website is for

**Example Prompt:**
```
Create a config.yaml for a healthcare telemedicine platform called "HealthConnect" 
with a blue and green color scheme, targeting patients seeking remote medical consultations.
```

The AI will generate a complete config file following this exact structure with appropriate content.

## Field Types Reference

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text value | `"Welcome to our site"` |
| `number` | Numeric value | `3`, `100`, `4.5` |
| `array` | List of items | `['item1', 'item2']` |
| `object` | Nested structure | `{ key: value }` |
| `boolean` | True/false | `true`, `false` |

## Color Format

Colors should be specified in hex format:
- `#rgb` or `#rrggbb`
- Example: `#3b82f6` (blue), `#ef4444` (red)

You can also reference Tailwind CSS colors:
- `#3b82f6` = Blue 500
- `#ef4444` = Red 500
- `#10b981` = Emerald 500

## Image URLs

All image URLs should be:
- **Absolute URLs** (starting with `http://` or `https://`)
- **High quality** (recommended minimum 800px width)
- **Optimized** for web (use services like Unsplash with `auto=format&fit=crop&q=80`)

Example: `https://images.unsplash.com/photo-123456?auto=format&fit=crop&q=80&w=1000`

## Best Practices

### Content Writing
- **Titles**: Keep under 60 characters for SEO
- **Descriptions**: 120-160 characters for meta descriptions
- **Headings**: Clear, action-oriented, benefit-focused
- **CTAs**: Use action verbs (Start, Get, Join, Discover)

### Structure
- **Consistency**: All pages should follow the same pattern
- **IDs**: Use unique IDs for all items (f1, f2, s1, s2, etc.)
- **Sections**: Maintain the same section order across configs
- **Navigation**: Keep navigation structure consistent

### Images
- Use consistent aspect ratios within each section
- Prefer landscape orientation for hero images (16:9)
- Use square images for team members (1:1)
- Optimize images for web performance

### Colors
- Ensure sufficient contrast for accessibility
- Use primary color for main CTAs
- Use secondary color for accents and highlights
- Keep accent color for borders and subtle elements

## Validation Checklist

Before using a config file, verify:

- [ ] All required fields are present
- [ ] Color codes are valid hex values
- [ ] Image URLs are accessible
- [ ] All IDs are unique within their sections
- [ ] Navigation links point to valid sections/pages
- [ ] Text content is free of typos
- [ ] Brand name is consistent throughout
- [ ] Social media URLs are correct

## Common Customization Scenarios

### Changing Brand Colors
```yaml
theme:
  primary: '#YOUR_PRIMARY_COLOR'
  secondary: '#YOUR_SECONDARY_COLOR'
  accent: '#1e293b'
```

### Adding a New Feature
```yaml
items:
  - id: 'f7'  # Increment ID
    title: 'New Feature'
    description: 'Description of the new feature'
    icon:
      value: '🎯'
```

### Updating Navigation
```yaml
links:
  - text: 'New Page'
    href: '/new-page'
```

### Changing Hero CTA
```yaml
buttons:
  - text: 'Your CTA Text'
    href: '/your-link'
    variant: 'primary'
```

## Troubleshooting

### Config not loading?
- Check YAML syntax (indentation must be consistent)
- Verify file is saved as `.yaml` extension
- Ensure no special characters in string values

### Colors not applying?
- Verify hex color format (`#rrggbb`)
- Check that colors are in the `theme` section
- Ensure no typos in color codes

### Images not showing?
- Verify URLs are absolute (start with `https://`)
- Check that images are publicly accessible
- Ensure URLs don't have spaces or special characters

### Navigation not working?
- Verify `href` values match section IDs (with `#` prefix)
- Check that page slugs are correct
- Ensure links array is properly formatted

## Support

For questions or issues with config files:
1. Check this documentation first
2. Verify YAML syntax using an online validator
3. Compare with working example configs
4. Review the application logs for error messages

---

**Last Updated**: December 2024  
**Version**: 1.0.0


exp api jadi :

site:
  name: 'FitLife Pro'
  description: 'Your ultimate fitness and wellness companion'
  theme:
    primary: '#10b981' # Emerald 500
    secondary: '#3b82f6' # Blue 500
    accent: '#1e293b' # Slate 800
  navigation:
    logo:
      text: 'FitLife Pro'
    links:
      - text: 'Programs'
        href: '#features'
      - text: 'Results'
        href: '#stats'
      - text: 'Resources'
        href: '#'
        children:
          - text: 'Workout Plans'
            href: '/docs'
          - text: 'Success Stories'
            href: '/blog'
      - text: 'About'
        href: '/about'
    cta:
      text: 'Start Free Trial'
      href: '/signup'
  footer:
    logo:
      text: 'FitLife Pro'
    tagline: 'Transform your body and mind with personalized fitness programs designed by certified trainers.'
    copyright: ' 2025 FitLife Pro Wellness. All rights reserved.'
    sections:
      - title: 'Programs'
        links:
          - text: 'All Programs'
            href: '#features'
          - text: 'Popular Workouts'
            href: '#stats'
          - text: 'Free Challenges'
            href: '/security'
      - title: 'Company'
        links:
          - text: 'About Us'
            href: '/about'
          - text: 'Our Trainers'
            href: '/careers'
          - text: 'Contact'
            href: '/contact'
      - title: 'Resources'
        links:
          - text: 'Training Guides'
            href: '/docs'
          - text: 'Nutrition Tips'
            href: '/api'
          - text: 'Progress Tracker'
            href: '/status'
    social:
      - platform: 'youtube'
        url: 'https://youtube.com/fitlifepro'
      - platform: 'linkedin'
        url: 'https://linkedin.com/company/fitlifepro'
      - platform: 'twitter'
        url: 'https://twitter.com/fitlifepro'

pages:
  - slug: '/'
    title: 'Home'
    description: 'FitLife Pro - Transform Your Body, Elevate Your Life'
    sections:
      - type: 'hero'
        id: 'hero'
        props:
          layout: 'centered'
          title: 'Transform Your Body in 90 Days'
          subtitle: 'Join 500,000+ members achieving their fitness goals with personalized workout plans, nutrition guidance, and expert coaching.'
          buttons:
            - text: 'Start Your Journey'
              href: '/signup'
              variant: 'primary'
            - text: 'View Programs'
              href: '#features'
              variant: 'outline'
          trustIndicators:
            - '500K+ Active Members'
            - '1,000+ Certified Trainers'
            - '24/7 Support'
          background:
            gradient: 'from-emerald-50 via-white to-blue-50'
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000'

      - type: 'features'
        id: 'features'
        props:
          title: 'Fitness Programs for Every Goal'
          subtitle: 'Choose the perfect program tailored to your fitness level and objectives.'
          columns: 3
          items:
            - id: 'f1'
              title: 'Weight Loss'
              description: 'Burn fat and shed pounds with high-intensity cardio and strength training.'
              icon:
                value: ' '
            - id: 'f2'
              title: 'Muscle Building'
              description: 'Build lean muscle mass with progressive resistance training programs.'
              icon:
                value: ' '
            - id: 'f3'
              title: 'Yoga & Flexibility'
              description: 'Improve flexibility, balance, and mental clarity with guided yoga sessions.'
              icon:
                value: '🧘'
            - id: 'f4'
              title: 'HIIT Training'
              description: 'Maximum results in minimum time with high-intensity interval workouts.'
              icon:
                value: '⚡'
            - id: 'f5'
              title: 'Nutrition Coaching'
              description: 'Personalized meal plans and nutrition guidance from certified dietitians.'
              icon:
                value: '🥗'
            - id: 'f6'
              title: 'Mindfulness & Recovery'
              description: 'Meditation, stretching, and recovery techniques for optimal performance.'
              icon:
                value: ' '

      - type: 'stats'
        id: 'stats'
        props:
          background: 'bg-emerald-900'
          items:
            - id: 's1'
              value: '500K+'
              label: 'Active Members'
            - id: 's2'
              value: '1000+'
              label: 'Certified Trainers'
            - id: 's3'
              value: '92%'
              label: 'Goal Achievement'
            - id: 's4'
              value: '4.9/5'
              label: 'Member Rating'

      - type: 'testimonials'
        id: 'testimonials'
        props:
          title: 'Real Results from Real People'
          subtitle: 'See how FitLife Pro transformed their lives.'
          trustBadge: 'Join 500,000 members transforming their bodies every day'
          items:
            - id: 't1'
              content: 'Lost 30 pounds in 12 weeks! The personalized workout plans and nutrition coaching made all the difference.'
              rating: 5
              author:
                name: 'Jessica Martinez'
                role: 'Weight Loss Champion'
            - id: 't2'
              content: 'Gained 15 pounds of muscle and feel stronger than ever. The trainers are incredibly knowledgeable and supportive.'
              rating: 5
              author:
                name: 'David Thompson'
                role: 'Muscle Building Success'
            - id: 't3'
              content: 'The flexibility and convenience of working out at home changed everything. Best fitness investment I ever made!'
              rating: 5
              author:
                name: 'Sarah Kim'
                role: 'Busy Professional'

  - slug: '/blog'
    title: 'Blog'
    description: 'Fitness tips, nutrition advice, and wellness insights'
    hero:
      title: 'FitLife Pro Blog'
      subtitle: 'Expert fitness tips, nutrition advice, and wellness insights to fuel your journey'
    categories:
      - 'All'
      - 'Workouts'
      - 'Nutrition'
      - 'Wellness'
      - 'Success Stories'
      - 'Training Tips'
    posts:
      - id: 1
        title: '10 Best Exercises for Building Muscle at Home'
        excerpt: 'Discover effective bodyweight and minimal equipment exercises to build strength and muscle mass.'
        category: 'Workouts'
        date: '15 Nov 2024'
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800'
        readTime: '6 min'
      - id: 2
        title: 'Complete Guide to Meal Prep for Weight Loss'
        excerpt: 'Learn how to prepare healthy, delicious meals that support your weight loss goals.'
        category: 'Nutrition'
        date: '10 Nov 2024'
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800'
        readTime: '8 min'
      - id: 3
        title: 'The Science of Recovery: Why Rest Days Matter'
        excerpt: 'Understanding the importance of rest and recovery for optimal fitness results.'
        category: 'Wellness'
        date: '5 Nov 2024'
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800'
        readTime: '5 min'
      - id: 4
        title: 'From Couch to 5K: A Beginner Running Guide'
        excerpt: 'Step-by-step program to help you start running and build endurance safely.'
        category: 'Training Tips'
        date: '1 Nov 2024'
        image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800'
        readTime: '7 min'
      - id: 5
        title: 'How I Lost 50 Pounds and Kept It Off'
        excerpt: 'One member shares their inspiring weight loss journey and maintenance strategies.'
        category: 'Success Stories'
        date: '28 Oct 2024'
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'
        readTime: '6 min'
      - id: 6
        title: 'Top 5 Supplements for Muscle Growth'
        excerpt: 'Evidence-based guide to the most effective supplements for building muscle mass.'
        category: 'Nutrition'
        date: '20 Oct 2024'
        image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=800'
        readTime: '5 min'
    newsletter:
      title: 'Get Fitness Tips Weekly'
      description: 'Subscribe to receive expert workout tips, nutrition advice, and exclusive offers'
      placeholder: 'Your Email'
      buttonText: 'Subscribe'

  - slug: '/about'
    title: 'About Us'
    description: 'Learn more about our mission and team'
    hero:
      title: 'About FitLife Pro'
      subtitle: 'Since 2015, FitLife Pro has been empowering people worldwide to achieve their fitness goals through science-backed programs, expert coaching, and a supportive community.'
    stats:
      - value: '9+'
        label: 'Years Experience'
      - value: '500K+'
        label: 'Members'
      - value: '1000+'
        label: 'Trainers'
      - value: '4.9/5'
        label: 'Member Rating'
    mission:
      title: 'Our Mission'
      description: 'To make world-class fitness training accessible to everyone, regardless of location, budget, or fitness level, through innovative technology and expert guidance.'
      icon: 'vision'
      gradient: 'from-emerald-600 to-emerald-700'
    vision:
      title: 'Our Vision'
      description: 'To become the global leader in digital fitness, helping millions achieve sustainable health transformations through personalized programs and cutting-edge science.'
      icon: 'mission'
      gradient: 'from-blue-600 to-blue-700'
    values:
      title: 'Our Values'
      subtitle: 'Core principles that drive everything we do'
      items:
        - title: 'Science-Based'
          description: 'All programs are backed by sports science research and proven methodologies.'
          icon: 'check'
        - title: 'Personalization'
          description: 'Every member gets customized plans tailored to their unique goals and abilities.'
          icon: 'lightning'
        - title: 'Community Support'
          description: 'Building a supportive community where members motivate and inspire each other.'
          icon: 'users'
        - title: 'Accessibility'
          description: 'Making professional fitness coaching affordable and accessible to everyone.'
          icon: 'globe'
    team:
      title: 'Our Leadership Team'
      subtitle: 'Led by fitness industry veterans and technology innovators'
      members:
        - name: 'Marcus Williams'
          role: 'CEO & Founder'
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'
        - name: 'Dr. Emily Chen'
          role: 'Chief Medical Officer'
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400'
        - name: 'James Rodriguez'
          role: 'Head of Training Programs'
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'
        - name: 'Lisa Anderson'
          role: 'Director of Nutrition'
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'

  - slug: '/docs'
    title: 'Documentation'
    description: 'Comprehensive fitness guides and resources'
    hero:
      title: 'Training Guides & Resources'
      subtitle: 'Comprehensive guides to help you choose the right fitness program and maximize results'
    guides:
      - title: 'Beginner Fitness Guide'
        description: 'Everything you need to know to start your fitness journey safely and effectively.'
        icon: 'code'
        topics:
          - 'Getting Started'
          - 'Basic Exercises'
          - 'Form & Technique'
      - title: 'Strength Training Guide'
        description: 'Complete roadmap from beginner lifter to advanced strength athlete.'
        icon: 'chart'
        topics:
          - 'Progressive Overload'
          - 'Program Design'
          - 'Advanced Techniques'
      - title: 'Nutrition Fundamentals'
        description: 'Master the basics of nutrition for optimal fitness results.'
        icon: 'palette'
        topics:
          - 'Macronutrients'
          - 'Meal Planning'
          - 'Supplements'
      - title: 'Cardio Training Guide'
        description: 'Improve cardiovascular fitness and endurance effectively.'
        icon: 'briefcase'
        topics:
          - 'HIIT Workouts'
          - 'Steady State Cardio'
          - 'Heart Rate Zones'
      - title: 'Recovery & Mobility'
        description: 'Essential recovery techniques for injury prevention and performance.'
        icon: 'rocket'
        topics:
          - 'Stretching Routines'
          - 'Foam Rolling'
          - 'Sleep Optimization'
      - title: 'Workout Equipment'
        description: 'Guide to choosing and using fitness equipment effectively.'
        icon: 'book'
        topics:
          - 'Home Gym Setup'
          - 'Equipment Reviews'
          - 'Maintenance Tips'

  - slug: '/status'
    title: 'Progress Tracker'
    description: 'Track your fitness journey'
    hero:
      title: 'Your Fitness Progress'
      subtitle: 'Monitor your workout progress and achievements in real-time'
    searchPlaceholder: 'Enter your Member ID or Email'
    searchButton: 'Track'
    recentTitle: 'Recent Activity'
    statuses:
      - orderId: 'FP-2024-001'
        customer: 'Michael Brown'
        location: 'Los Angeles, USA'
        status: 'In Progress'
        estimatedArrival: 'Goal by Jan 15'
        progress: 68
      - orderId: 'FP-2024-002'
        customer: 'Emma Wilson'
        location: 'Toronto, Canada'
        status: 'Starting'
        estimatedArrival: 'Start on Dec 12'
        progress: 25
      - orderId: 'FP-2024-003'
        customer: 'Ryan Garcia'
        location: 'Miami, USA'
        status: 'Completed'
        estimatedArrival: 'Goal Achieved'
        progress: 100

  - slug: '/api'
    title: 'Fitness Calculator'
    description: 'Calculate your personalized fitness metrics'
    hero:
      title: 'Fitness Metrics Calculator'
      subtitle: 'Calculate your BMI, calorie needs, and personalized fitness recommendations'
    comingSoon:
      title: 'Feature Coming Soon'
      description: 'Our advanced fitness calculator is under development. Soon you can calculate your BMI, daily calorie needs, and get personalized workout recommendations.'
      icon: 'calculator'
      buttonText: 'Contact Our Trainers'
      buttonHref: '/signup'