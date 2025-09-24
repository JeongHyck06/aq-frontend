import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown, Check } from 'lucide-react';
import { SelectOption } from '@/types';

interface SelectProps {
    options: SelectOption[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    helperText?: string;
    disabled?: boolean;
    className?: string;
    searchable?: boolean;
    multiple?: boolean;
}

const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = '선택하세요',
    label,
    error,
    helperText,
    disabled = false,
    className,
    searchable = false,
    multiple = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const selectRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredOptions = searchable
        ? options.filter((option) =>
              option.label
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
          )
        : options;

    const selectedOption = options.find(
        (option) => option.value === value
    );
    const selectedOptions =
        multiple && value
            ? options.filter((option) =>
                  value.split(',').includes(option.value)
              )
            : [];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                selectRef.current &&
                !selectRef.current.contains(
                    event.target as Node
                )
            ) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener(
            'mousedown',
            handleClickOutside
        );
        return () =>
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
    }, []);

    useEffect(() => {
        if (isOpen && searchable && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen, searchable]);

    const handleSelect = (optionValue: string) => {
        if (multiple) {
            const currentValues = value
                ? value.split(',')
                : [];
            const newValues = currentValues.includes(
                optionValue
            )
                ? currentValues.filter(
                      (v) => v !== optionValue
                  )
                : [...currentValues, optionValue];
            onChange(newValues.join(','));
        } else {
            onChange(optionValue);
            setIsOpen(false);
            setSearchTerm('');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            setIsOpen(false);
            setSearchTerm('');
        }
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                    {label}
                </label>
            )}

            <div ref={selectRef} className="relative">
                <button
                    type="button"
                    className={cn(
                        'relative w-full cursor-default rounded-lg border border-secondary-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm',
                        disabled &&
                            'bg-secondary-50 text-secondary-500 cursor-not-allowed',
                        error &&
                            'border-error-300 focus:border-error-500 focus:ring-error-500',
                        className
                    )}
                    onClick={() =>
                        !disabled && setIsOpen(!isOpen)
                    }
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                >
                    <span className="block truncate">
                        {multiple ? (
                            selectedOptions.length > 0 ? (
                                <span className="flex flex-wrap gap-1">
                                    {selectedOptions.map(
                                        (option) => (
                                            <span
                                                key={
                                                    option.value
                                                }
                                                className="inline-flex items-center px-2 py-1 rounded-md bg-primary-100 text-primary-800 text-xs"
                                            >
                                                {
                                                    option.label
                                                }
                                            </span>
                                        )
                                    )}
                                </span>
                            ) : (
                                <span className="text-secondary-500">
                                    {placeholder}
                                </span>
                            )
                        ) : selectedOption ? (
                            selectedOption.label
                        ) : (
                            <span className="text-secondary-500">
                                {placeholder}
                            </span>
                        )}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown
                            className={cn(
                                'h-5 w-5 text-secondary-400 transition-transform duration-200',
                                isOpen && 'rotate-180'
                            )}
                        />
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-strong ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {searchable && (
                            <div className="px-3 py-2 border-b border-secondary-200">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-md focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    placeholder="검색..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        )}

                        {filteredOptions.length === 0 ? (
                            <div className="relative cursor-default select-none py-2 pl-3 pr-9 text-secondary-500">
                                검색 결과가 없습니다
                            </div>
                        ) : (
                            filteredOptions.map(
                                (option) => {
                                    const isSelected =
                                        multiple
                                            ? value
                                                  ?.split(
                                                      ','
                                                  )
                                                  .includes(
                                                      option.value
                                                  ) || false
                                            : value ===
                                              option.value;

                                    return (
                                        <div
                                            key={
                                                option.value
                                            }
                                            className={cn(
                                                'relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-secondary-100',
                                                isSelected &&
                                                    'bg-primary-50 text-primary-900'
                                            )}
                                            onClick={() =>
                                                handleSelect(
                                                    option.value
                                                )
                                            }
                                        >
                                            <span
                                                className={cn(
                                                    'block truncate',
                                                    isSelected &&
                                                        'font-medium'
                                                )}
                                            >
                                                {
                                                    option.label
                                                }
                                            </span>
                                            {isSelected && (
                                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600">
                                                    <Check className="h-5 w-5" />
                                                </span>
                                            )}
                                        </div>
                                    );
                                }
                            )
                        )}
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-error-600">
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p className="mt-1 text-sm text-secondary-500">
                    {helperText}
                </p>
            )}
        </div>
    );
};

export { Select };
