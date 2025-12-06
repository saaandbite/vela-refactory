import React from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { useStyles } from './styles';

export interface AIGeneratorProps {
  loading: boolean;
  onGenerateSiteConfig: (params: any) => void;
  onGeneratePage: (params: any) => void;
  onGenerateComponent: (params: any) => void;
  onGenerateFromPrompt: (prompt: string) => void;
  schemas: any;
}

export function AIGeneratorTab({
  loading,
  onGenerateSiteConfig,
  onGeneratePage,
  onGenerateComponent,
  onGenerateFromPrompt,
  schemas,
}: AIGeneratorProps) {
  const classes = useStyles();

  const [mode, setMode] = React.useState<
    'site' | 'page' | 'component' | 'prompt'
  >('prompt');

  // Site config fields
  const [siteName, setSiteName] = React.useState('');
  const [siteDescription, setSiteDescription] = React.useState('');
  const [industry, setIndustry] = React.useState('');
  const [targetAudience, setTargetAudience] = React.useState('');
  const [style, setStyle] = React.useState('');

  // Page fields
  const [pagePath, setPagePath] = React.useState('');
  const [pageTitle, setPageTitle] = React.useState('');
  const [pageDescription, setPageDescription] = React.useState('');
  const [pagePurpose, setPagePurpose] = React.useState('');

  // Component fields
  const [componentType, setComponentType] = React.useState('hero');
  const [componentContext, setComponentContext] = React.useState('');
  const [componentContent, setComponentContent] = React.useState('');

  // Prompt field
  const [prompt, setPrompt] = React.useState('');

  const handleGenerate = () => {
    if (mode === 'site') {
      onGenerateSiteConfig({
        siteName,
        siteDescription,
        industry,
        targetAudience,
        style,
      });
    } else if (mode === 'page') {
      onGeneratePage({
        path: pagePath,
        title: pageTitle,
        description: pageDescription,
        purpose: pagePurpose,
      });
    } else if (mode === 'component') {
      onGenerateComponent({
        type: componentType,
        context: componentContext,
        content: componentContent,
      });
    } else if (mode === 'prompt') {
      onGenerateFromPrompt(prompt);
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        AI-Powered Generator 🤖
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Use AI to automatically generate site configurations, pages, and
        components from natural language descriptions.
      </Typography>

      <FormControl fullWidth className={classes.formControl}>
        <InputLabel>Generation Mode</InputLabel>
        <Select value={mode} onChange={e => setMode(e.target.value as any)}>
          <MenuItem value="prompt">💬 Natural Language Prompt</MenuItem>
          <MenuItem value="site">🌐 Complete Site Config</MenuItem>
          <MenuItem value="page">📄 Single Page</MenuItem>
          <MenuItem value="component">🧩 Single Component</MenuItem>
        </Select>
      </FormControl>

      <Box mt={3}>
        {mode === 'prompt' && (
          <>
            <Typography variant="subtitle2" gutterBottom>
              Describe what you want to build in natural language:
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={6}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Example: Create a modern SaaS landing page for a project management tool. Include a hero section with a demo CTA, features section highlighting collaboration tools, pricing tiers, customer testimonials, and a contact form."
              variant="outlined"
              className={classes.formControl}
            />
          </>
        )}

        {mode === 'site' && (
          <>
            <TextField
              label="Site Name *"
              fullWidth
              value={siteName}
              onChange={e => setSiteName(e.target.value)}
              className={classes.formControl}
              placeholder="My Awesome Startup"
            />
            <TextField
              label="Site Description *"
              fullWidth
              multiline
              minRows={2}
              value={siteDescription}
              onChange={e => setSiteDescription(e.target.value)}
              className={classes.formControl}
              placeholder="A revolutionary platform that helps teams collaborate better"
            />
            <TextField
              label="Industry (optional)"
              fullWidth
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              className={classes.formControl}
              placeholder="SaaS, E-commerce, Healthcare, etc."
            />
            <TextField
              label="Target Audience (optional)"
              fullWidth
              value={targetAudience}
              onChange={e => setTargetAudience(e.target.value)}
              className={classes.formControl}
              placeholder="Small businesses, Developers, Marketing teams, etc."
            />
            <TextField
              label="Style Preference (optional)"
              fullWidth
              value={style}
              onChange={e => setStyle(e.target.value)}
              className={classes.formControl}
              placeholder="Modern, Minimalist, Bold, Corporate, Creative, etc."
            />
          </>
        )}

        {mode === 'page' && (
          <>
            <TextField
              label="Page Path *"
              fullWidth
              value={pagePath}
              onChange={e => setPagePath(e.target.value)}
              className={classes.formControl}
              placeholder="/about"
            />
            <TextField
              label="Page Title *"
              fullWidth
              value={pageTitle}
              onChange={e => setPageTitle(e.target.value)}
              className={classes.formControl}
              placeholder="About Us"
            />
            <TextField
              label="Description (optional)"
              fullWidth
              multiline
              minRows={2}
              value={pageDescription}
              onChange={e => setPageDescription(e.target.value)}
              className={classes.formControl}
              placeholder="Learn more about our company and mission"
            />
            <TextField
              label="Purpose (optional)"
              fullWidth
              value={pagePurpose}
              onChange={e => setPagePurpose(e.target.value)}
              className={classes.formControl}
              placeholder="Showcase company history, team, and values"
            />
          </>
        )}

        {mode === 'component' && (
          <>
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel>Component Type</InputLabel>
              <Select
                value={componentType}
                onChange={e => setComponentType(e.target.value as string)}
              >
                {schemas &&
                  Object.keys(schemas).map(type => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              label="Context (optional)"
              fullWidth
              multiline
              minRows={2}
              value={componentContext}
              onChange={e => setComponentContext(e.target.value)}
              className={classes.formControl}
              placeholder="What is this component for? e.g., 'Homepage hero for a fitness app'"
            />
            <TextField
              label="Content Requirements (optional)"
              fullWidth
              multiline
              minRows={2}
              value={componentContent}
              onChange={e => setComponentContent(e.target.value)}
              className={classes.formControl}
              placeholder="Specific content you want. e.g., 'Include a tagline about health tracking and two CTAs'"
            />
          </>
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerate}
        disabled={
          loading ||
          (mode === 'prompt' && !prompt) ||
          (mode === 'site' && (!siteName || !siteDescription)) ||
          (mode === 'page' && (!pagePath || !pageTitle))
        }
        className={classes.button}
        size="large"
      >
        {loading ? '⚡ Generating with AI...' : '✨ Generate with AI'}
      </Button>

      {loading && (
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            🤖 AI is working on your request... This may take 10-30 seconds.
          </Typography>
        </Box>
      )}
    </>
  );
}
