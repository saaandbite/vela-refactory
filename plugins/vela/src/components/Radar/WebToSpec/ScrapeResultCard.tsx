import { useState } from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    CardHeader, 
    Box, 
    Button, 
    Chip, 
    makeStyles, 
    Divider 
} from '@material-ui/core';
import { 
    Description, 
    Link as LinkIcon, 
    Visibility, 
    VisibilityOff 
} from '@material-ui/icons';

interface ScrapeResultCardProps {
    title: string;
    description: string;
    url: string;
    content: string;
}

const useStyles = makeStyles(theme => ({
    card: {
        marginTop: theme.spacing(3),
        backgroundColor: theme.palette.background.paper,
        border: `2px solid ${theme.palette.divider}`,
        borderRadius: theme.spacing(2),
        boxShadow: theme.palette.type === 'dark'
            ? '0 4px 12px rgba(0, 0, 0, 0.5)'
            : '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
    header: {
        backgroundColor: theme.palette.action.hover,
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    urlChip: {
        marginTop: theme.spacing(1),
        maxWidth: '100%',
        '& .MuiChip-label': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
    },
    contentBox: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        backgroundColor: theme.palette.action.hover,
        borderRadius: theme.spacing(1.5),
        border: `1px solid ${theme.palette.divider}`,
        maxHeight: 400,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
            width: 8,
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.action.selected,
            borderRadius: 4,
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.action.disabled,
            borderRadius: 4,
            '&:hover': {
                backgroundColor: theme.palette.text.secondary,
            },
        },
    },
    contentText: {
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        color: theme.palette.text.primary,
    },
    statsBox: {
        display: 'flex',
        gap: theme.spacing(2),
        marginTop: theme.spacing(2),
        padding: theme.spacing(1.5),
        backgroundColor: theme.palette.action.selected,
        borderRadius: theme.spacing(1),
    },
    statItem: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(0.5),
    },
    toggleButton: {
        marginTop: theme.spacing(2),
    },
}));

export const ScrapeResultCard = ({ title, description, url, content }: ScrapeResultCardProps) => {
    const classes = useStyles();
    const [showFullContent, setShowFullContent] = useState(false);
    
    const displayContent = showFullContent ? content : content.substring(0, 1000);
    const wordCount = content.split(/\s+/).length;
    const charCount = content.length;

    return (
        <Card className={classes.card} elevation={0}>
            <CardHeader
                className={classes.header}
                avatar={<Description color="primary" />}
                title={
                    <Typography variant="h6" style={{ fontWeight: 600 }}>
                        {title || 'No Title'}
                    </Typography>
                }
                subheader={
                    <Chip
                        icon={<LinkIcon />}
                        label={url}
                        size="small"
                        color="primary"
                        variant="outlined"
                        className={classes.urlChip}
                        onClick={() => window.open(url, '_blank')}
                        clickable
                    />
                }
            />
            <CardContent>
                {description && (
                    <>
                        <Typography variant="body1" color="textPrimary" paragraph style={{ fontWeight: 500 }}>
                            Description:
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph>
                            {description}
                        </Typography>
                        <Divider style={{ margin: '16px 0' }} />
                    </>
                )}

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" color="textPrimary" style={{ fontWeight: 500 }}>
                        Scraped Content:
                    </Typography>
                    <Button
                        size="small"
                        startIcon={showFullContent ? <VisibilityOff /> : <Visibility />}
                        onClick={() => setShowFullContent(!showFullContent)}
                        color="primary"
                    >
                        {showFullContent ? 'Show Less' : 'Show Full Content'}
                    </Button>
                </Box>

                <Box className={classes.statsBox}>
                    <Box className={classes.statItem}>
                        <Typography variant="caption" color="textSecondary">
                            Words:
                        </Typography>
                        <Typography variant="caption" style={{ fontWeight: 600 }}>
                            {wordCount.toLocaleString()}
                        </Typography>
                    </Box>
                    <Box className={classes.statItem}>
                        <Typography variant="caption" color="textSecondary">
                            Characters:
                        </Typography>
                        <Typography variant="caption" style={{ fontWeight: 600 }}>
                            {charCount.toLocaleString()}
                        </Typography>
                    </Box>
                </Box>

                <Box className={classes.contentBox}>
                    <Typography className={classes.contentText}>
                        {displayContent}
                        {!showFullContent && content.length > 1000 && '...'}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};
