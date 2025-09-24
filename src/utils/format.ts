import {
    format,
    formatDistanceToNow,
    parseISO,
} from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatDate(
    date: string | Date,
    formatStr: string = 'yyyy-MM-dd'
): string {
    const dateObj =
        typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: ko });
}

export function formatRelativeTime(
    date: string | Date
): string {
    const dateObj =
        typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, {
        addSuffix: true,
        locale: ko,
    });
}

export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 6,
    }).format(price);
}

export function formatTokenCount(count: number): string {
    return new Intl.NumberFormat('ko-KR').format(count);
}

export function truncateText(
    text: string,
    maxLength: number
): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
