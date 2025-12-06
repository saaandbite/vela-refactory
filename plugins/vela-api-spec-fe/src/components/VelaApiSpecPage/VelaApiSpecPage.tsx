import React, { useState } from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import { Grid, Paper, Box } from '@material-ui/core';
import { ServiceStatus } from './ServiceStatus';
import { AIGeneratorTab } from './AIGeneratorTab';
import { ResultDisplay } from './ResultDisplay';
import { useApiSpecData, useApiOperations } from './hooks';

export const VelaApiSpecPage = () => {
  // API data and operations
  const { api, health, schemas, error, setError } = useApiSpecData();
  const {
    loading,
    generatedResult,
    validationResult,
    setValidationResult,
    aiGenerateSiteConfig,
    aiGeneratePage,
    aiGenerateComponent,
    aiGenerateFromPrompt,
  } = useApiOperations(api, setError);

  return (
    <Page themeId="tool">
      <Header
        title="Vela API Spec Generator"
        subtitle="Generate and validate API specifications for Dynamic Site Generator"
      />
      <Content>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ServiceStatus health={health} schemas={schemas} />
          </Grid>

          <Grid item xs={12}>
            <Paper>
              <Box p={3}>
                <AIGeneratorTab
                  loading={loading}
                  onGenerateSiteConfig={aiGenerateSiteConfig}
                  onGeneratePage={aiGeneratePage}
                  onGenerateComponent={aiGenerateComponent}
                  onGenerateFromPrompt={aiGenerateFromPrompt}
                  schemas={schemas}
                />
              </Box>
            </Paper>
          </Grid>

          <ResultDisplay
            error={error}
            onClearError={() => setError(null)}
            generatedResult={generatedResult}
            validationResult={validationResult}
            onClearValidation={() => setValidationResult(null)}
          />
        </Grid>
      </Content>
    </Page>
  );
};
