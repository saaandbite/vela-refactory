import { Header, Page, Content, SupportButton, TabbedLayout } from '@backstage/core-components';
import { AnalysisCharts } from './Dashboard/AnalysisCharts';
import { CSVAnalyzer } from './CSVAnalyzer';
import { OpenSpecPage } from './OpenSpec';
import { WebContentAnalyzer } from './WebContentAnalyzer/WebContentAnalyzer';

export const RadarPage = () => {
    return (
        <Page themeId="tool">
            <Header title="VELA Radar" subtitle="Data Intelligence & Scraping Module">
                <SupportButton>Analyze external data for specs</SupportButton>
            </Header>
            <Content noPadding>
                <TabbedLayout>
                    <TabbedLayout.Route path="/" title="Web Content Analyzer">
                        <WebContentAnalyzer />
                    </TabbedLayout.Route>
                    <TabbedLayout.Route path="/csv-analyzer" title="CSV Analyzer">
                        <CSVAnalyzer />
                    </TabbedLayout.Route>
                    <TabbedLayout.Route path="/dashboard" title="Data Dashboard">
                        <AnalysisCharts />
                    </TabbedLayout.Route>
                    <TabbedLayout.Route path="/openspec" title="OpenSpec Generator">
                        <OpenSpecPage />
                    </TabbedLayout.Route>
                </TabbedLayout>
            </Content>
        </Page>
    );
};
