import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Plus } from 'lucide-react';
import { searchSkills } from '../../services/projectService';
import useDebounce from '../../hooks/useDebounce';

interface SkillSelectorProps {
    selectedSkills: string[];
    onSkillsChange: (skills: string[]) => void;
    placeholder?: string;
    error?: string;
}

const SkillSelector: React.FC<SkillSelectorProps> = ({
    selectedSkills,
    onSkillsChange,
    placeholder = "Search and add skills...",
    error
}) => {
    const [skillInput, setSkillInput] = useState('');
    const debouncedSkillInput = useDebounce(skillInput, 300);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Debounced search
    useEffect(() => {
        const fetchSkills = async () => {
            const trimmedInput = debouncedSkillInput.trim();
            if (trimmedInput.length >= 1) {
                setIsLoading(true);
                try {
                    const results = await searchSkills(trimmedInput);
                    setSuggestions(results.filter(s => !selectedSkills.includes(s)));
                    setShowSuggestions(true);
                } catch (err) {
                    console.error("Error searching skills:", err);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        fetchSkills();
    }, [debouncedSkillInput, selectedSkills]);

    // Handle clicks outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectSuggestion = (suggestion: string) => {
        if (!selectedSkills.includes(suggestion)) {
            onSkillsChange([...selectedSkills, suggestion]);
        }
        setSkillInput('');
        setShowSuggestions(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = skillInput.trim();
            if (val && !selectedSkills.includes(val)) {
                onSkillsChange([...selectedSkills, val]);
            }
            setSkillInput('');
            setShowSuggestions(false);
        }
    };

    const removeSkill = (skillToRemove: string) => {
        onSkillsChange(selectedSkills.filter(s => s !== skillToRemove));
    };

    return (
        <div className="space-y-4">
            <div className="relative" ref={dropdownRef}>
                <div className="relative">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${isLoading ? 'text-indigo-500' : 'text-slate-500'}`} />
                    <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => skillInput.trim().length >= 1 && setShowSuggestions(true)}
                        placeholder={placeholder}
                        className={`w-full pl-11 pr-12 py-4 bg-white/5 border ${error ? 'border-rose-500/50' : 'border-white/5'} rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-white text-sm placeholder:text-slate-600`}
                    />
                    {isLoading && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
                        </div>
                    )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-[#1a1a24] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                        <div className="max-h-60 overflow-y-auto py-2">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onMouseDown={(e) => {
                                        e.preventDefault(); // Prevent blur
                                        handleSelectSuggestion(suggestion);
                                    }}
                                    className="w-full px-6 py-3 text-left hover:bg-white/5 text-slate-300 hover:text-white transition-colors flex items-center justify-between group"
                                >
                                    <span className="text-sm font-medium">{suggestion}</span>
                                    <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                {error && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider mt-2 ml-1">{error}</p>}
            </div>

            {/* Selected Skills Tags */}
            <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill, index) => (
                    <div
                        key={index}
                        className="group flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl transition-all hover:border-indigo-500/40"
                    >
                        <span className="text-sm font-bold text-indigo-400">{skill}</span>
                        <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="p-0.5 hover:bg-indigo-500/20 rounded-md transition-colors"
                        >
                            <X className="h-3 w-3 text-indigo-400/50 group-hover:text-indigo-400" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillSelector;
