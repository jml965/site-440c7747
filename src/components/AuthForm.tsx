import React, { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface FormField {
  name: string;
  label: string;
  type: string;
  value: string | boolean;
  placeholder?: string;
  required?: boolean;
  icon?: ReactNode;
  options?: string[];
}

interface AuthFormProps {
  title: string;
  fields: FormField[];
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  submitLabel: string;
  loading: boolean;
  error: string;
  icon: ReactNode;
  children?: ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  fields,
  onSubmit,
  onChange,
  submitLabel,
  loading,
  error,
  icon,
  children
}) => {
  const renderField = (field: FormField) => {
    const baseClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";
    const withIconClasses = field.icon ? "pr-12" : "";
    
    if (field.type === 'select') {
      return (
        <div key={field.name} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 mr-1">*</span>}
          </label>
          <div className="relative">
            {field.icon}
            <select
              name={field.name}
              value={field.value as string}
              onChange={onChange}
              required={field.required}
              className={`${baseClasses} ${withIconClasses} appearance-none bg-white`}
            >
              <option value="">اختر المدينة</option>
              {field.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={field.name}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
          {field.required && <span className="text-red-500 mr-1">*</span>}
        </label>
        <div className="relative">
          {field.icon}
          <input
            type={field.type}
            name={field.name}
            value={field.value as string}
            onChange={onChange}
            placeholder={field.placeholder}
            required={field.required}
            className={`${baseClasses} ${withIconClasses}`}
            dir="ltr"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {fields.map(renderField)}
          
          {children}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin ml-2" />
                جاري التحميل...
              </>
            ) : (
              <>
                {icon}
                <span className="mr-2">{submitLabel}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;