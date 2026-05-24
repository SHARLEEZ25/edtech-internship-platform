export const isDeadlinePassed = (deadlineDateString?: string | Date | null): boolean => {
    if (!deadlineDateString) return false;

    const deadline = new Date(deadlineDateString);
    const today = new Date();

    // Reset time to midnight for fair comparison - same as backend
    today.setHours(0, 0, 0, 0);
    deadline.setHours(23, 59, 59, 999);

    return today > deadline;
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

export const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};
