export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface ServiceStatusProps {
  health: any;
  schemas: any;
}

export interface GenerateSiteConfigProps {
  siteName: string;
  setSiteName: (value: string) => void;
  siteDescription: string;
  setSiteDescription: (value: string) => void;
  loading: boolean;
  onGenerate: () => void;
  onValidate: () => void;
  hasGeneratedResult: boolean;
}

export interface GeneratePageProps {
  pagePath: string;
  setPagePath: (value: string) => void;
  pageTitle: string;
  setPageTitle: (value: string) => void;
  loading: boolean;
  onGenerate: () => void;
}

export interface GenerateComponentProps {
  selectedComponentType: string;
  setSelectedComponentType: (value: string) => void;
  schemas: any;
  loading: boolean;
  onGenerate: () => void;
}

export interface ViewSchemaProps {
  selectedComponentType: string;
  setSelectedComponentType: (value: string) => void;
  schemas: any;
  loading: boolean;
  componentSchema: any;
  onLoadSchema: () => void;
}

export interface ExamplesProps {
  exampleType: string;
  setExampleType: (value: string) => void;
  loading: boolean;
  example: any;
  onLoadExample: () => void;
}
