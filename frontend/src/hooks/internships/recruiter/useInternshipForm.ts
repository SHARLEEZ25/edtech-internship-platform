import { useState, useEffect } from 'react';
import { type InternshipFormData } from '@/components/internships/recruiter/InternshipFormVisuals';

interface UseInternshipFormProps {
    initialData?: Partial<InternshipFormData>;
    onSubmit: (data: InternshipFormData) => void;
}

export const useInternshipForm = ({ initialData, onSubmit }: UseInternshipFormProps) => {
    const [formData, setFormData] = useState<InternshipFormData>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        domain: initialData?.domain || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        internshipType: initialData?.internshipType || 'REMOTE',
        durationValue: initialData?.durationValue || 3,
        durationUnit: initialData?.durationUnit || 'MONTHS',
        stipendMin: initialData?.stipendMin || null,
        stipendMax: initialData?.stipendMax || null,
        openings: initialData?.openings || 1,
        applicationDeadline: initialData?.applicationDeadline || '',
        skills: initialData?.skills || '',
        requirements: initialData?.requirements || '',
        responsibilities: initialData?.responsibilities || '',
        status: initialData?.status || 'DRAFT',
    });

    // Update form data when initialData changes (important for Edit page)
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData
            }));
            if (initialData.stipendMin) setIsPaid(true);
        }
    }, [initialData]);

    const [isPaid, setIsPaid] = useState(!!initialData?.stipendMin);
    const [formError, setFormError] = useState<string | null>(null);

    // Custom Duration logic
    const isPresetDuration = (val: number, unit: string) => {
        return unit === 'MONTHS' && [1, 3, 6].includes(val);
    };

    const [isCustomDuration, setIsCustomDuration] = useState(() => {
        if (initialData?.durationValue && initialData?.durationUnit) {
            return !isPresetDuration(initialData.durationValue, initialData.durationUnit);
        }
        return false;
    });

    // Update isCustomDuration when initialData changes
    useEffect(() => {
        if (initialData?.durationValue && initialData?.durationUnit) {
            setIsCustomDuration(!isPresetDuration(initialData.durationValue, initialData.durationUnit));
        }
    }, [initialData]);

    useEffect(() => {
        console.log('Duration State Update:', {
            value: formData.durationValue,
            unit: formData.durationUnit,
            isCustom: isCustomDuration
        });
    }, [formData.durationValue, formData.durationUnit, isCustomDuration]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormError(null);
        const isNumberField = ['openings', 'durationValue', 'stipendMin', 'stipendMax'].includes(name);
        setFormData(prev => ({
            ...prev,
            [name]: isNumberField ? (value === '' ? null : parseInt(value)) : value
        }));
    };

    const handleTypeChange = (type: 'REMOTE' | 'ONSITE' | 'HYBRID') => {
        setFormData(prev => ({ ...prev, internshipType: type }));
    };

    const handleDurationChange = (value: number | 'CUSTOM') => {
        if (value === 'CUSTOM') {
            setIsCustomDuration(true);
        } else {
            setIsCustomDuration(false);
            setFormData(prev => ({ ...prev, durationValue: value, durationUnit: 'MONTHS' }));
        }
    };

    const handleCustomDurationValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        setFormData(prev => ({ ...prev, durationValue: value }));
    };

    const handleDurationUnitChange = (unit: 'MONTHS' | 'WEEKS') => {
        console.log('Setting duration unit to:', unit);
        setFormData(prev => ({
            ...prev,
            durationUnit: unit
        }));
    };

    const handleStatusSubmit = (status: 'DRAFT' | 'LIVE') => {
        setFormError(null);

        // Basic validation
        if (!formData.title || !formData.description || !formData.domain || !formData.applicationDeadline || !formData.openings) {
            setFormError('Please fill in all required fields (Title, Description, Domain, Openings, Deadline)');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (formData.internshipType !== 'REMOTE' && !formData.city) {
            setFormError('City is required for Onsite/Hybrid internships');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const selectedDate = new Date(formData.applicationDeadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            setFormError('Application deadline cannot be in the past');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        onSubmit({ ...formData, status });
    };

    return {
        formData,
        setFormData,
        isPaid,
        setIsPaid,
        formError,
        setFormError,
        handleChange,
        handleTypeChange,
        handleDurationChange,
        isCustomDuration,
        handleCustomDurationValueChange,
        handleDurationUnitChange,
        handleStatusSubmit
    };
};
