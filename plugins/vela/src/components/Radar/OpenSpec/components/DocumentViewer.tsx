import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  IconButton,
  Tooltip,
  makeStyles,
} from '@material-ui/core';
import { Edit, Refresh } from '@material-ui/icons';
import { SpecDocuments } from '../types';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
  },
  tabsContainer: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  tabPanel: {
    padding: theme.spacing(3),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  actions: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  content: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.spacing(1),
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    maxHeight: 600,
    overflowY: 'auto',
  },
  emptyState: {
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

interface DocumentViewerProps {
  documents: Partial<SpecDocuments>;
  onEdit: (docType: string, content: string) => void;
  onRegenerate: (docType: string) => Promise<void>;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documents,
  onEdit,
  onRegenerate,
}) => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Requirements', key: 'requirements', content: documents.requirements },
    { label: 'Design', key: 'design', content: documents.design },
    { label: 'Tasks', key: 'tasks', content: documents.tasks },
  ];

  const hasAnyDocument = tabs.some(tab => tab.content);

  if (!hasAnyDocument) {
    return (
      <Box className={classes.container}>
        <Box className={classes.emptyState}>
          <Typography variant="h6" gutterBottom>
            No Documents Generated Yet
          </Typography>
          <Typography variant="body2">
            Extract content from a URL and generate specifications to see them here
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={classes.container}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        className={classes.tabsContainer}
        indicatorColor="primary"
        textColor="primary"
      >
        {tabs.map((tab, index) => (
          <Tab
            key={tab.key}
            label={tab.label}
            disabled={!tab.content}
            id={`doc-tab-${index}`}
          />
        ))}
      </Tabs>

      {tabs.map((tab, index) => (
        <TabPanel key={tab.key} value={activeTab} index={index}>
          {tab.content && (
            <Box className={classes.tabPanel}>
              <Box className={classes.header}>
                <Typography variant="h6">{tab.label}</Typography>
                <Box className={classes.actions}>
                  <Tooltip title="Edit document">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(tab.key, tab.content!)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Regenerate document">
                    <IconButton
                      size="small"
                      onClick={() => onRegenerate(tab.key)}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Box className={classes.content}>{tab.content}</Box>
            </Box>
          )}
        </TabPanel>
      ))}
    </Box>
  );
};
