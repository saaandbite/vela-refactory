import React from 'react';
import { Header, Page, Content, ContentHeader, SupportButton, TabbedLayout } from '@backstage/core-components';
import { UrlInput } from './WebToSpec/UrlInput';
import { AnalysisCharts } from './Dashboard/AnalysisCharts';
import { CSVAnalyzer } from './CSVAnalyzer';

export const RadarPage = () => {
    return (
        <Page themeId="tool">
            <Header title="VELA Radar" subtitle="Data Intelligence & Scraping Module">
                <SupportButton>Analyze external data for specs</SupportButton>
            </Header>
            <Content>
                <TabbedLayout>
                    <TabbedLayout.Route path="/" title="Web-to-Spec">
                        <div>
                            <ContentHeader title="Scrape Website">
                                <SupportButton>Enter a URL to extract spec context</SupportButton>
                            </ContentHeader>
                            <UrlInput />
                        </div>
                    </TabbedLayout.Route>
                    <TabbedLayout.Route path="/csv-analyzer" title="CSV Analyzer">
                        <CSVAnalyzer />
                    </TabbedLayout.Route>
                    <TabbedLayout.Route path="/dashboard" title="Data Dashboard">
                        <div>
                            <ContentHeader title="Data Analysis">
                                <SupportButton>Analysis Results</SupportButton>
                            </ContentHeader>
                            <AnalysisCharts />
                        </div>
                    </TabbedLayout.Route>
                </TabbedLayout>
            </Content>
        </Page>
    );
};
