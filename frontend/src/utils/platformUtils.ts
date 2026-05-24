export const getPlatformFromUrl = (url?: string, defaultMode: string = 'Virtual'): string => {
    if (!url) return defaultMode;

    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes('meet.google.com')) return 'Google Meet';
    if (lowerUrl.includes('zoom.us')) return 'Zoom';
    if (lowerUrl.includes('teams.microsoft.com')) return 'Microsoft Teams';
    if (lowerUrl.includes('webex.com')) return 'Webex';
    if (lowerUrl.includes('jitsi')) return 'Jitsi Meet';
    if (lowerUrl.includes('discord')) return 'Discord';
    if (lowerUrl.includes('slack')) return 'Slack Huddle';

    return defaultMode === 'ONLINE' ? 'Virtual Interview' : defaultMode;
};
